import { List, CheckCircle2, AlertTriangle, XCircle, Calendar, CalendarDays } from 'lucide-react';

const QuickFilters = ({ onFilterChange, activeFilter }) => {
  const filters = [
    { label: 'All', value: 'all', icon: <List className="w-3 h-3 text-current" strokeWidth={2} /> },
    { label: 'Active', value: 'active', icon: <CheckCircle2 className="w-3 h-3 text-current" strokeWidth={2} /> },
    { label: 'Expiring Soon', value: 'expiring_soon', icon: <AlertTriangle className="w-3 h-3 text-current" strokeWidth={2} /> },
    { label: 'Expired', value: 'expired', icon: <XCircle className="w-3 h-3 text-current" strokeWidth={2} /> },
    { label: 'This Week', value: 'this_week', icon: <Calendar className="w-3 h-3 text-current" strokeWidth={2} /> },
    { label: 'This Month', value: 'this_month', icon: <CalendarDays className="w-3 h-3 text-current" strokeWidth={2} /> },
  ];

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-goodwill-border/50 transition-all duration-200">
      <h3 className="text-xs font-semibold text-goodwill-dark mb-2.5 uppercase tracking-wide animate-fade-in-down">Quick Filters</h3>
      <div className="flex flex-wrap gap-2 stagger-children">
        {filters.map((filter, index) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-200 animate-fade-in-up ${
              activeFilter === filter.value
                ? 'bg-goodwill-primary text-white'
                : 'bg-goodwill-light text-goodwill-dark hover:bg-goodwill-primary/10 hover:text-goodwill-primary border border-goodwill-border/50'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
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

