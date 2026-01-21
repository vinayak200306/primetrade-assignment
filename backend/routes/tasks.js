import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['pending', 'completed'])
      .withMessage('Status must be either pending or completed'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { title, description, status, team, dueDate } = req.body;

      const task = await Task.create({
        title,
        description: description || '',
        status: status || 'pending',
        user: req.user._id,
        team: team || null,
        dueDate: dueDate || null,
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { search, status, from, to } = req.query;

    const query = {
      $or: [
        { user: req.user._id },           // personal tasks
        { team: { $exists: true, $ne: null } }, // team tasks
      ],
    };

    // 🔍 Search filter
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // ✅ Status filter
    if (status && ['pending', 'completed'].includes(status)) {
      query.status = status;
    }

    // 📅 Calendar date range filter
    if (from && to) {
      query.dueDate = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['pending', 'completed'])
      .withMessage('Status must be either pending or completed'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Authorization check
      if (
        task.user?.toString() !== req.user._id.toString() &&
        !task.team
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }

      const { title, description, status, dueDate } = req.body;
      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (dueDate !== undefined) updateData.dueDate = dueDate;

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Task updated successfully',
        task: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Authorization check
    if (
      task.user?.toString() !== req.user._id.toString() &&
      !task.team
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
