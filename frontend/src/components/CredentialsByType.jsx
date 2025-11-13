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
    { bg: 'bg-blue-500', text: 'text-blue-600' },
    { bg: 'bg-purple-500', text: 'text-purple-600' },
    { bg: 'bg-indigo-500', text: 'text-indigo-600' },
    { bg: 'bg-teal-500', text: 'text-teal-600' },
    { bg: 'bg-cyan-500', text: 'text-cyan-600' },
  ];

  return (
    <div className="bg-goodwill-light rounded-2xl p-6 shadow-soft border border-goodwill-border">
      <h3 className="text-lg font-bold text-goodwill-dark mb-5">Top Credential Types</h3>
      {sortedTypes.length === 0 ? (
        <p className="text-sm text-goodwill-text-muted">No credentials yet</p>
      ) : (
        <div className="space-y-4">
          {sortedTypes.map(([type, count], index) => {
            const colorScheme = colors[index % colors.length];
            return (
              <div key={type} className="flex items-center gap-3">
                <div className={`${colorScheme.bg} w-3 h-3 rounded-full shadow-sm`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${colorScheme.text}`}>{type}</span>
                    <span className={`text-sm font-bold ${colorScheme.text}`}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                    <div
                      className={`${colorScheme.bg} h-2 rounded-full transition-all duration-500 shadow-sm`}
                      style={{ width: `${(count / credentials.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CredentialsByType;

