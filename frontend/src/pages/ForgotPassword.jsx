import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../config/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/forgot-password', { email });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-goodwill-light via-goodwill-light to-goodwill-light/80 flex items-center justify-center p-4">
      <div className="bg-goodwill-light rounded-2xl shadow-large w-full max-w-md p-8 border border-goodwill-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-goodwill-dark mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-goodwill-primary font-semibold mb-2">Compliance Tracker</p>
          <p className="text-goodwill-text-muted">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-goodwill-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-goodwill-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-goodwill-dark mb-2">Check your email</h2>
            <p className="text-goodwill-text-muted mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-goodwill-text-muted">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-4 bg-goodwill-secondary/10 border-l-4 border-goodwill-secondary text-goodwill-dark rounded-xl text-sm font-medium shadow-soft flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-goodwill-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-goodwill-dark mb-1">Error</p>
                  <p className="text-goodwill-text">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-goodwill-dark mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-goodwill-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark placeholder:text-goodwill-text-muted shadow-soft"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-goodwill-primary to-goodwill-primary/90 hover:from-goodwill-primary/90 hover:to-goodwill-primary text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-large transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" strokeWidth={2.5} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-goodwill-primary hover:text-goodwill-secondary text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

