import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, loading, onEdit, onDelete, onUpdate }) => {
  const handleStatusChange = async (taskId, status) => {
    await onUpdate(taskId, { status });
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-24 rounded-2xl bg-white/60 backdrop-blur-md"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-white/20 p-14 text-center mt-6"
      >
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-slate-600">
          Create your first task to stay organized and productive.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="space-y-4 mt-6">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 28,
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              {/* LEFT */}
              <div className="flex-1">
                <motion.h3
                  layout
                  className={`text-lg font-semibold ${
                    task.status === 'completed'
                      ? 'line-through text-slate-400'
                      : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </motion.h3>

                {task.description && (
                  <p className="text-sm text-slate-600 mt-1">
                    {task.description}
                  </p>
                )}

                {task.dueDate && (
                  <p className="text-xs text-slate-500 mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task._id, e.target.value)
                  }
                  className="px-3 py-2 text-sm border rounded-lg bg-white font-semibold hover:bg-slate-50 transition"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => onEdit(task)}
                  className="px-4 py-2 text-sm border rounded-xl font-semibold hover:bg-slate-100 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(task._id)}
                  className="px-4 py-2 text-sm border border-red-200 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;
