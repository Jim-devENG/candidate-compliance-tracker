const StatusCard = ({ title, count, color, icon }) => {
  const colorClasses = {
    green: {
      bg: 'bg-emerald-500',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-lg shadow-emerald-500/30',
    },
    yellow: {
      bg: 'bg-amber-500',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-lg shadow-amber-500/30',
    },
    red: {
      bg: 'bg-rose-500',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-lg shadow-rose-500/30',
    },
    gray: {
      bg: 'bg-slate-500',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-lg shadow-slate-500/30',
    },
  };

  const iconComponents = {
    check: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    chart: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  };

  const iconElement = typeof icon === 'string' ? iconComponents[icon] || icon : icon;
  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className={`relative rounded-lg p-3 ${colors.bg} ${colors.shadow} hover:scale-105 transition-all duration-300 overflow-hidden`}>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold ${colors.text} opacity-90 mb-0.5`}>{title}</p>
          <p className={`text-2xl font-bold ${colors.text} tracking-tight`}>{count}</p>
        </div>
        <div className={`h-8 w-8 rounded-lg ${colors.iconBg} backdrop-blur-sm flex items-center justify-center shadow-lg`}>
          <div className={colors.text}>
            {iconElement}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30"></div>
    </div>
  );
};

export default StatusCard;

