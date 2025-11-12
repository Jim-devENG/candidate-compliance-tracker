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
      icon: '📈',
      color: 'bg-blue-500',
    },
    {
      label: 'Renewals Needed',
      value: renewalsNeeded,
      icon: '🔄',
      color: 'bg-orange-500',
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate}%`,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      label: 'Expiring Next Week',
      value: expiringNextWeek,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-2.5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center text-base`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

