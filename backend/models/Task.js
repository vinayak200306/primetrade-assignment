import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

// 👥 Team task (optional)
    

// 📅 Calendar support
    dueDate: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Task', taskSchema);

