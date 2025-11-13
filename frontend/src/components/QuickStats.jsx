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
      icon: <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />,
      color: 'bg-goodwill-primary',
    },
    {
      label: 'Renewals Needed',
      value: renewalsNeeded,
      icon: <RefreshCw className="w-5 h-5 text-white" strokeWidth={2.5} />,
      color: 'bg-goodwill-secondary',
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate}%`,
      icon: <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />,
      color: 'bg-goodwill-primary',
    },
    {
      label: 'Expiring Next Week',
      value: expiringNextWeek,
      icon: <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />,
      color: 'bg-goodwill-secondary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-goodwill-light rounded-2xl p-4 shadow-soft border border-goodwill-border hover:shadow-medium transition-all duration-200 hover:border-goodwill-primary/20 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-goodwill-text-muted mb-1.5 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-goodwill-dark">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-11 h-11 rounded-xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-200`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

