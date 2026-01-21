import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import SearchAndFilter from '../components/SearchAndFilter';
import CalendarView from '../components/CalendarView';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [activeTab, setActiveTab] = useState('tasks');

  /* =======================
     FETCH TASKS
  ======================= */
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [searchQuery, statusFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/api/tasks', { params });
      setTasks(res.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     CREATE
  ======================= */
  const handleCreateTask = async (taskData) => {
    const res = await api.post('/api/tasks', taskData);
    setTasks(prev => [res.data.task, ...prev]);
    setShowTaskForm(false);
    
  };

  /* =======================
     EDIT
  ======================= */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  /* =======================
     UPDATE
  ======================= */
  const handleUpdateTask = async (taskId, taskData) => {
    const res = await api.put(`/api/tasks/${taskId}`, taskData);
    setTasks(prev =>
      prev.map(t => (t._id === taskId ? res.data.task : t))
    );
    setEditingTask(null);
    setShowTaskForm(false);
    
  };

  /* =======================
     DELETE WITH UNDO
  ======================= */
  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t._id === taskId);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t._id !== taskId));
    let undone = false;

    toast.custom(
  (t) => (
    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg">
      <span className="text-sm">Task deleted</span>

      <button
        onClick={() => {
          undone = true;
          setTasks((prev) => [taskToDelete, ...prev]);
          toast.dismiss(t.id);
          toast.success('Task restored');
        }}
        className="text-sm font-semibold underline underline-offset-2 hover:text-slate-300"
      >
        UNDO
      </button>
    </div>
  ),
  { duration: 5000 }
);


    setTimeout(async () => {
      if (!undone) {
        try {
          await api.delete(`/api/tasks/${taskId}`);
        } catch {
          toast.error('Delete failed');
          setTasks(prev => [taskToDelete, ...prev]);
        }
      }
    }, 5000);
  };

  return (
    <div className="relative min-h-screen bg-slate-100">

      {/* ===== Subtle light ambient glow ===== */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-[-30%] left-[-30%] w-[700px] h-[700px] bg-slate-300/40 rounded-full blur-[180px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-30%] right-[-30%] w-[700px] h-[700px] bg-slate-200/40 rounded-full blur-[180px]"
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ===== Header (WHITE) ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              PrimeTrade TODO
            </h1>
            <p className="text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg font-semibold
                       border border-slate-300 text-slate-700
                       hover:bg-slate-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['tasks', 'calendar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border hover:bg-slate-100'
              }`}
            >
              {tab === 'tasks' ? 'Tasks' : 'Calendar'}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          {activeTab === 'tasks' && (
            <>
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <div className="my-6">
                {!showTaskForm && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                  >
                    + New Task
                  </button>
                )}
              </div>

              {showTaskForm && (
                <TaskForm
                  task={editingTask}
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                />
              )}

              <TaskList
                tasks={tasks}
                loading={loading}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            </>
          )}

          {activeTab === 'calendar' && <CalendarView tasks={tasks} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
