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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-goodwill-border/50 transition-all duration-200">
      <h3 className="text-sm font-semibold text-goodwill-dark mb-3 animate-fade-in-down">Top Credential Types</h3>
      {sortedTypes.length === 0 ? (
        <p className="text-xs text-goodwill-text-muted animate-fade-in">No credentials yet</p>
      ) : (
        <div className="space-y-2.5 stagger-children">
          {sortedTypes.map(([type, count], index) => {
            const colorScheme = colors[index % colors.length];
            return (
              <div 
                key={type} 
                className="flex items-center gap-2 group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${colorScheme.bg} w-2 h-2 rounded-full`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${colorScheme.text}`}>{type}</span>
                    <span className={`text-xs font-semibold ${colorScheme.text} animate-count-up`}>{count}</span>
                  </div>
                  <div className="w-full bg-goodwill-light rounded-full h-1.5">
                    <div
                      className={`${colorScheme.bg} h-1.5 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${(count / credentials.length) * 100}%`, animationDelay: `${index * 0.15}s` }}
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

