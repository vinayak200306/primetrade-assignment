import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

const router = express.Router();

// All routes protected
router.use(protect);

// -------------------- CREATE TEAM --------------------
router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Team name is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const team = await Team.create({
        name: req.body.name,
        owner: req.user._id,
        members: [req.user._id],
      });

      res.status(201).json({ success: true, team });
    } catch (err) {
      next(err);
    }
  }
);

// -------------------- GET MY TEAMS --------------------
router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate(
      'members',
      'name email'
    );
    res.json({ success: true, teams });
  } catch (err) {
    next(err);
  }
});

// -------------------- ADD MEMBER BY EMAIL --------------------
router.post(
  '/:id/add-member',
  [body('email').isEmail().withMessage('Valid email required')],
  async (req, res, next) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }

      // Only owner can add members
      if (team.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (team.members.includes(user._id)) {
        return res
          .status(400)
          .json({ success: false, message: 'User already in team' });
      }

      team.members.push(user._id);
      await team.save();

      res.json({ success: true, message: 'Member added successfully' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
