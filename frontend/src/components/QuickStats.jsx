import { TrendingUp, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

const QuickStats = ({ credentials }) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Credentials added this month
  const addedThisMonth = credentials.filter(cred => {
    if (!cred.created_at) return false;
    const created = new Date(cred.created_at);
    return created >= startOfMonth;
  }).length;

  // Renewals needed this month
  const renewalsNeeded = credentials.filter(cred => {
    if (!cred.expiry_date) return false;
    const expiry = new Date(cred.expiry_date);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return expiry >= now && expiry <= endOfMonth;
  }).length;

  // Compliance rate (active / total)
  const total = credentials.length;
  const active = credentials.filter(c => c.status === 'active').length;
  const complianceRate = total > 0 ? Math.round((active / total) * 100) : 0;

  // Credentials expiring in next 7 days
  const expiringNextWeek = credentials.filter(cred => {
    if (!cred.expiry_date) return false;
    const expiry = new Date(cred.expiry_date);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return expiry >= now && expiry <= nextWeek;
  }).length;

  const stats = [
    {
      label: 'Added This Month',
      value: addedThisMonth,
      icon: <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
      color: 'bg-goodwill-primary',
    },
    {
      label: 'Renewals Needed',
      value: renewalsNeeded,
      icon: <RefreshCw className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
      color: 'bg-goodwill-secondary',
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate}%`,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
      color: 'bg-goodwill-primary',
    },
    {
      label: 'Expiring Next Week',
      value: expiringNextWeek,
      icon: <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2} />,
      color: 'bg-goodwill-secondary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 stagger-children">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-3 shadow-sm border border-goodwill-border/50 hover:border-goodwill-primary/30 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-goodwill-text-muted mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-goodwill-dark animate-count-up">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

