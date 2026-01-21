import { useEffect, useState } from 'react';
import api from '../utils/api';

const TeamSelector = ({ selectedTeam, setSelectedTeam }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/teams');
      setTeams(res.data.teams || []);
    } catch (err) {
      console.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Task Scope
      </label>

      <select
        value={selectedTeam || ''}
        onChange={(e) => setSelectedTeam(e.target.value || null)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-slate-900"
      >
        <option value="">Personal Task</option>

        {loading && <option>Loading teams...</option>}

        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            Team: {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;
