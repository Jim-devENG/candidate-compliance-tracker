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
    { label: 'Active', count: statusCounts.active, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: 'Expiring Soon', count: statusCounts.expiring_soon, color: 'bg-amber-500', textColor: 'text-amber-700' },
    { label: 'Expired', count: statusCounts.expired, color: 'bg-rose-500', textColor: 'text-rose-700' },
    { label: 'Pending', count: statusCounts.pending, color: 'bg-slate-500', textColor: 'text-slate-700' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
      <div className="space-y-4">
        {statusData.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const barWidth = (item.count / maxCount) * 100;
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
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

