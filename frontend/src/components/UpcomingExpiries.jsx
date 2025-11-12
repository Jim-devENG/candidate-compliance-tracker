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
    if (days <= 7) return 'text-red-600 bg-red-50';
    if (days <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Expiries (Next 30 Days)</h3>
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming expiries</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((cred) => {
            const days = getDaysUntil(cred.expiry_date);
            return (
              <div
                key={cred.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{cred.candidate_name}</p>
                  <p className="text-xs text-gray-500">{cred.credential_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">
                    {new Date(cred.expiry_date).toLocaleDateString()}
                  </p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getUrgencyColor(days)}`}>
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

