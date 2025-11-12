import { useState } from 'react';

const StatusTag = ({ status, expiryDate }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: 'bg-emerald-500 text-white border-emerald-300 shadow-sm shadow-emerald-500/30',
        label: 'Active',
      },
      expiring_soon: {
        color: 'bg-amber-500 text-white border-amber-300 shadow-sm shadow-amber-500/30',
        label: 'Expiring Soon',
      },
      expired: {
        color: 'bg-rose-500 text-white border-rose-300 shadow-sm shadow-rose-500/30',
        label: 'Expired',
      },
      pending: {
        color: 'bg-slate-500 text-white border-slate-300 shadow-sm shadow-slate-500/30',
        label: 'Pending',
      },
    };
    return configs[status] || configs.pending;
  };

  const getDaysUntilExpiry = () => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const config = getStatusConfig(status);
  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <div className="relative inline-block">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {config.label}
      </span>
      {showTooltip && expiryDate && daysUntilExpiry !== null && (
        <div className="absolute z-10 px-3 py-2 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
          {daysUntilExpiry > 0
            ? `Expiring in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`
            : daysUntilExpiry === 0
            ? 'Expires today'
            : `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago`}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default StatusTag;

