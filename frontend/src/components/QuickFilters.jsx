const QuickFilters = ({ onFilterChange, activeFilter }) => {
  const filters = [
    { label: 'All', value: 'all', icon: '📋' },
    { label: 'Active', value: 'active', icon: '✅' },
    { label: 'Expiring Soon', value: 'expiring_soon', icon: '⚠️' },
    { label: 'Expired', value: 'expired', icon: '❌' },
    { label: 'This Week', value: 'this_week', icon: '📅' },
    { label: 'This Month', value: 'this_month', icon: '🗓️' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Filters</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;

