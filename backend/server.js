import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/tasks.js';
import teamRoutes from './routes/teams.js';

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not set in environment variables');
  console.error('Please create a .env file in the backend directory with JWT_SECRET');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- ROUTES --------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes); // ✅ IMPORTANT FIX

// -------------------- HEALTH CHECK --------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// -------------------- 404 HANDLER --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primetrade')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
