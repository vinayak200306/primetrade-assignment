import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      };

      if (task) {
        await onSubmit(task._id, payload);
        toast.success('Task updated successfully');
      } else {
        await onSubmit(payload);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save task'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-2xl shadow-md border border-slate-200 p-8"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-slate-200'
            }`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none"
            placeholder="Optional description"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border rounded-xl font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;
