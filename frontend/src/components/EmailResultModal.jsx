import { useEffect } from 'react';
import { Check, X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const EmailResultModal = ({ isOpen, onClose, result }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const isSuccess = result.success;
  const isError = !result.success;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div className="bg-goodwill-light rounded-lg shadow-2xl max-w-sm w-full mx-auto">
          <div className={`relative overflow-hidden rounded-t-lg ${
            isSuccess ? 'bg-gradient-to-r from-goodwill-primary to-goodwill-primary/80' : 'bg-gradient-to-r from-goodwill-secondary to-goodwill-secondary/80'
          }`}>
            <div className="px-3 pt-2.5 pb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {isSuccess ? 'Email Sent!' : 'Email Failed'}
                  </h2>
                  <p className="text-white/90 text-xs mt-0.5">
                    {isSuccess ? 'Emails have been sent' : 'Error sending emails'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="p-3">
            {isSuccess ? (
              <div className="space-y-2">
                <div className="bg-goodwill-primary/10 border border-goodwill-primary/30 rounded-lg p-2">
                  <p className="text-goodwill-dark font-semibold text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-goodwill-primary" strokeWidth={2.5} />
                    {result.message || 'Emails sent successfully!'}
                  </p>
                  {result.total_sent !== undefined && (
                    <p className="text-goodwill-text text-xs">
                      Sent: <span className="font-bold">{result.total_sent}</span>
                    </p>
                  )}
                  {result.credentials_count !== undefined && (
                    <p className="text-goodwill-text text-xs mt-0.5">
                      Credentials: <span className="font-bold">{result.credentials_count}</span>
                    </p>
                  )}
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="bg-goodwill-secondary/10 border border-goodwill-secondary/30 rounded-lg p-2">
                    <p className="text-goodwill-dark font-semibold text-xs mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-goodwill-secondary" strokeWidth={2.5} />
                      Errors:
                    </p>
                    <ul className="list-disc list-inside text-goodwill-text text-xs space-y-0.5">
                      {result.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-goodwill-secondary/10 border border-goodwill-secondary/30 rounded-lg p-2">
                <p className="text-goodwill-dark font-semibold text-sm mb-1 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-goodwill-secondary" strokeWidth={2.5} />
                  {result.message || 'Failed to send emails'}
                </p>
                {result.error && (
                  <p className="text-goodwill-text text-xs">{result.error}</p>
                )}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-1.5 text-sm rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                  isSuccess
                    ? 'bg-goodwill-primary hover:bg-goodwill-primary/90 text-white'
                    : 'bg-goodwill-secondary hover:bg-goodwill-secondary/90 text-white'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailResultModal;

