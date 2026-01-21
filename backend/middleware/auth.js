import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Team from '../models/Team.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
        success: false,
        message: 'User not found',
        });
      }

// Fetch teams user belongs to
      const teams = await Team.find({ members: user._id }).select('_id');

      req.user = user;
      req.userTeams = teams.map(team => team._id);


      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    next(error);
  }
};

