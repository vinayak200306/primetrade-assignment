import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const CreateTeamModal = ({ onClose, onCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/teams', { name: teamName });
      onCreated(); // refresh teams
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Create New Team
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. Frontend Team"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTeamModal;
