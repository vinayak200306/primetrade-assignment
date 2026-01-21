const SearchAndFilter = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/50 p-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-2.5">
            Search Tasks
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50"
            />
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2.5">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;

