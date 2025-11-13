import { List, CheckCircle2, AlertTriangle, XCircle, Calendar, CalendarDays } from 'lucide-react';

const QuickFilters = ({ onFilterChange, activeFilter }) => {
  const filters = [
    { label: 'All', value: 'all', icon: <List className="w-4 h-4 text-current" strokeWidth={2} /> },
    { label: 'Active', value: 'active', icon: <CheckCircle2 className="w-4 h-4 text-current" strokeWidth={2} /> },
    { label: 'Expiring Soon', value: 'expiring_soon', icon: <AlertTriangle className="w-4 h-4 text-current" strokeWidth={2} /> },
    { label: 'Expired', value: 'expired', icon: <XCircle className="w-4 h-4 text-current" strokeWidth={2} /> },
    { label: 'This Week', value: 'this_week', icon: <Calendar className="w-4 h-4 text-current" strokeWidth={2} /> },
    { label: 'This Month', value: 'this_month', icon: <CalendarDays className="w-4 h-4 text-current" strokeWidth={2} /> },
  ];

  return (
    <div className="bg-goodwill-light rounded-2xl p-5 shadow-soft border border-goodwill-border mb-6">
      <h3 className="text-sm font-bold text-goodwill-dark mb-4 uppercase tracking-wide">Quick Filters</h3>
      <div className="flex flex-wrap gap-2.5">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeFilter === filter.value
                ? 'bg-goodwill-primary text-white shadow-medium shadow-goodwill-primary/25 transform scale-[1.02]'
                : 'bg-goodwill-light text-goodwill-dark hover:bg-goodwill-primary/10 hover:text-goodwill-primary border border-goodwill-border'
            }`}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;

