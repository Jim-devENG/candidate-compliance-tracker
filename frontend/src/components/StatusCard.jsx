import { CheckCircle2, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';

const StatusCard = ({ title, count, color, icon }) => {
  const colorClasses = {
    green: {
      bg: 'bg-goodwill-primary',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-medium shadow-goodwill-primary/25',
    },
    yellow: {
      bg: 'bg-goodwill-secondary',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-medium shadow-goodwill-secondary/25',
    },
    red: {
      bg: 'bg-goodwill-secondary',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-medium shadow-goodwill-secondary/25',
    },
    gray: {
      bg: 'bg-gray-500',
      text: 'text-white',
      iconBg: 'bg-white/20',
      shadow: 'shadow-medium shadow-gray-500/25',
    },
  };

  const iconComponents = {
    check: <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
    error: <XCircle className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
    chart: <BarChart3 className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
  };

  const iconElement = typeof icon === 'string' ? iconComponents[icon] || icon : icon;
  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className={`relative rounded-lg p-3 ${colors.bg} ${colors.shadow} transition-all duration-200 overflow-hidden group cursor-pointer`}>
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${colors.text} opacity-90 mb-1 uppercase tracking-wide`}>{title}</p>
          <p className={`text-2xl font-bold ${colors.text} tracking-tight animate-count-up`}>{count}</p>
        </div>
        <div className={`h-8 w-8 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <div className={colors.text}>
            {iconElement}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;

