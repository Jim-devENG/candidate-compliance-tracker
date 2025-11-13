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
    <div className="bg-goodwill-light rounded-2xl p-6 shadow-soft border border-goodwill-border">
      <h3 className="text-lg font-bold text-goodwill-dark mb-5">Status Distribution</h3>
      <div className="space-y-5">
        {statusData.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const barWidth = (item.count / maxCount) * 100;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-sm font-semibold ${item.textColor}`}>{item.label}</span>
                <span className={`text-sm font-bold ${item.textColor}`}>{item.count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-goodwill-light rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${barWidth}%` }}
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

