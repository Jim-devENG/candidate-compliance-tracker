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
    <div className="bg-goodwill-light rounded-2xl p-6 shadow-soft border border-goodwill-border">
      <h3 className="text-lg font-bold text-goodwill-dark mb-5">Upcoming Expiries (Next 30 Days)</h3>
      {upcoming.length === 0 ? (
        <p className="text-sm text-goodwill-text-muted">No upcoming expiries</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((cred) => {
            const days = getDaysUntil(cred.expiry_date);
            return (
              <div
                key={cred.id}
                className="flex items-center justify-between p-4 rounded-xl border border-goodwill-border hover:bg-goodwill-light/50 transition-all duration-200 hover:border-goodwill-primary/30"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-goodwill-dark">{cred.candidate_name}</p>
                  <p className="text-xs text-goodwill-text-muted mt-0.5">{cred.credential_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-goodwill-text-muted mb-1">
                    {new Date(cred.expiry_date).toLocaleDateString()}
                  </p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getUrgencyColor(days)}`}>
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

