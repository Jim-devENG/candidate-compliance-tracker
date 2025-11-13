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
    check: <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />,
    warning: <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />,
    error: <XCircle className="w-4 h-4 text-white" strokeWidth={2.5} />,
    chart: <BarChart3 className="w-4 h-4 text-white" strokeWidth={2.5} />,
  };

  const iconElement = typeof icon === 'string' ? iconComponents[icon] || icon : icon;
  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <div className={`relative rounded-2xl p-5 ${colors.bg} ${colors.shadow} hover:scale-[1.02] transition-all duration-200 overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold ${colors.text} opacity-95 mb-1.5 uppercase tracking-wide`}>{title}</p>
          <p className={`text-3xl font-bold ${colors.text} tracking-tight`}>{count}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl ${colors.iconBg} backdrop-blur-sm flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-200`}>
          <div className={colors.text}>
            {iconElement}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl"></div>
    </div>
  );
};

export default StatusCard;

