import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const NotificationBanner = ({ expiringSoonCount, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || expiringSoonCount === 0) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="bg-goodwill-secondary/10 border-l-4 border-goodwill-secondary p-5 mb-6 rounded-r-xl shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-goodwill-secondary" strokeWidth={2.5} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-bold text-goodwill-dark">
              <span className="font-extrabold text-goodwill-secondary">{expiringSoonCount}</span>{' '}
              {expiringSoonCount === 1
                ? 'credential is expiring soon'
                : 'credentials are expiring soon'}
              {' '}
              (within 30 days)
            </p>
            <p className="text-xs text-goodwill-text mt-1.5 font-medium">
              Please review and take necessary action to renew these credentials.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 text-goodwill-secondary hover:text-goodwill-secondary/80 transition-colors p-1 rounded-lg hover:bg-goodwill-secondary/10"
          aria-label="Dismiss notification"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;

