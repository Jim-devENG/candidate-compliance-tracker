const UpcomingExpiries = ({ credentials }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const upcoming = credentials
    .filter(cred => {
      if (!cred.expiry_date) return false;
      const expiry = new Date(cred.expiry_date);
      expiry.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30;
    })
    .sort((a, b) => {
      const dateA = new Date(a.expiry_date);
      const dateB = new Date(b.expiry_date);
      return dateA - dateB;
    })
    .slice(0, 5); // Top 5 upcoming

  const getDaysUntil = (expiryDate) => {
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getUrgencyColor = (days) => {
    if (days <= 7) return 'text-white bg-goodwill-secondary border-goodwill-secondary/30';
    if (days <= 14) return 'text-white bg-goodwill-secondary/80 border-goodwill-secondary/20';
    return 'text-goodwill-secondary bg-goodwill-secondary/10 border-goodwill-secondary/30';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-goodwill-border/50 transition-all duration-200">
      <h3 className="text-sm font-semibold text-goodwill-dark mb-3 animate-fade-in-down">Upcoming Expiries</h3>
      {upcoming.length === 0 ? (
        <p className="text-xs text-goodwill-text-muted animate-fade-in">No upcoming expiries</p>
      ) : (
        <div className="space-y-2 stagger-children">
          {upcoming.map((cred, index) => {
            const days = getDaysUntil(cred.expiry_date);
            return (
              <div
                key={cred.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-goodwill-border/30 hover:bg-goodwill-light/50 transition-all duration-200 cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1">
                  <p className="text-xs font-medium text-goodwill-dark">{cred.candidate_name}</p>
                  <p className="text-xs text-goodwill-text-muted mt-0.5">{cred.credential_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-goodwill-text-muted mb-1">
                    {new Date(cred.expiry_date).toLocaleDateString()}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getUrgencyColor(days)}`}>
                    {days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingExpiries;

