const CredentialsByType = ({ credentials }) => {
  const typeCounts = credentials.reduce((acc, cred) => {
    const type = cred.credential_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const sortedTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Credential Types</h3>
      {sortedTypes.length === 0 ? (
        <p className="text-sm text-gray-500">No credentials yet</p>
      ) : (
        <div className="space-y-3">
          {sortedTypes.map(([type, count], index) => (
            <div key={type} className="flex items-center gap-3">
              <div className={`${colors[index % colors.length]} w-3 h-3 rounded-full`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(count / credentials.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialsByType;

