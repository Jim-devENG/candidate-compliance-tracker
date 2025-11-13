const StatusChart = ({ credentials }) => {
  const statusCounts = credentials.reduce(
    (acc, cred) => {
      acc[cred.status] = (acc[cred.status] || 0) + 1;
      return acc;
    },
    { active: 0, expiring_soon: 0, expired: 0, pending: 0 }
  );

  const total = credentials.length || 1;
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  const statusData = [
    { label: 'Active', count: statusCounts.active, color: 'bg-green-500', textColor: 'text-green-600' },
    { label: 'Expiring Soon', count: statusCounts.expiring_soon, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { label: 'Expired', count: statusCounts.expired, color: 'bg-red-500', textColor: 'text-red-600' },
    { label: 'Pending', count: statusCounts.pending, color: 'bg-blue-500', textColor: 'text-blue-600' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-goodwill-border/50 transition-all duration-200">
      <h3 className="text-sm font-semibold text-goodwill-dark mb-3 animate-fade-in-down">Status Distribution</h3>
      <div className="space-y-3 stagger-children">
        {statusData.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const barWidth = (item.count / maxCount) * 100;
          
          return (
            <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-medium ${item.textColor}`}>{item.label}</span>
                <span className={`text-xs font-semibold ${item.textColor} animate-count-up`}>{item.count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-goodwill-light rounded-full h-2 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${barWidth}%`, animationDelay: `${index * 0.15}s` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusChart;

