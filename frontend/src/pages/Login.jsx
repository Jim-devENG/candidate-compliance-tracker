import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('recruiter');
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (isRegister) {
      if (password !== passwordConfirmation) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }
    
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await register(name, email, password, passwordConfirmation, role, avatar);
      } else {
        result = await login(email, password, rememberMe);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        // Format error message for better UX
        let errorMessage = result.error || 'Authentication failed';
        if (typeof errorMessage === 'object') {
          // Handle validation errors from backend
          const errors = Object.values(errorMessage).flat();
          errorMessage = errors.join(', ');
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-goodwill-light via-goodwill-light to-goodwill-light/80 flex items-center justify-center p-4">
      <div className="bg-goodwill-light rounded-2xl shadow-large w-full max-w-md p-8 border border-goodwill-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-goodwill-dark mb-2">
            Goodwill Staffing
          </h1>
          <p className="text-sm text-goodwill-primary font-semibold mb-2">Compliance Tracker</p>
          <p className="text-goodwill-text-muted">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-goodwill-secondary/10 border-l-4 border-goodwill-secondary text-goodwill-dark rounded-xl text-sm font-medium shadow-soft flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-goodwill-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-goodwill-dark mb-1">Error</p>
              <p className="text-goodwill-text">{typeof error === 'object' ? JSON.stringify(error) : error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-semibold text-goodwill-dark mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-goodwill-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark placeholder:text-goodwill-text-muted shadow-soft"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-goodwill-dark mb-1.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-goodwill-primary" />
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark shadow-soft"
                >
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-goodwill-dark mb-1.5">
                  Profile Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-goodwill-primary file:to-goodwill-primary/90 file:text-white hover:file:from-goodwill-primary/90 hover:file:to-goodwill-primary file:transition-all file:duration-200 file:cursor-pointer file:shadow-md hover:file:shadow-lg shadow-soft"
                />
              </div>
            </>
          )}

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

          <div>
            <label className="block text-sm font-semibold text-goodwill-dark mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-goodwill-primary" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 pr-12 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark placeholder:text-goodwill-text-muted shadow-soft"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-goodwill-text-muted hover:text-goodwill-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            </div>
            {!isRegister && (
              <p className="mt-1 text-xs text-goodwill-text-muted">
                Must be at least 8 characters
              </p>
            )}
          </div>

          {!isRegister && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-goodwill-primary border-goodwill-border rounded focus:ring-goodwill-primary focus:ring-2"
                />
                <span className="text-sm text-goodwill-text-muted">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-goodwill-primary hover:text-goodwill-secondary font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-goodwill-dark mb-1.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-goodwill-primary" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 border border-goodwill-border rounded-xl bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary transition-all text-goodwill-dark placeholder:text-goodwill-text-muted shadow-soft"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-goodwill-text-muted hover:text-goodwill-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
                  )}
                </button>
              </div>
              {passwordConfirmation && password !== passwordConfirmation && (
                <p className="mt-1 text-xs text-goodwill-secondary">
                  Passwords do not match
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (isRegister && password !== passwordConfirmation)}
            className="w-full bg-gradient-to-r from-goodwill-primary to-goodwill-primary/90 hover:from-goodwill-primary/90 hover:to-goodwill-primary text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-large transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : isRegister ? (
              <>
                <User className="w-5 h-5" strokeWidth={2.5} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" strokeWidth={2.5} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-goodwill-primary hover:text-goodwill-secondary text-sm font-semibold transition-colors"
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;


