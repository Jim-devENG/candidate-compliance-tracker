import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, User, LogOut } from 'lucide-react';

const Topbar = ({ onAddClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Force re-render when user data changes by using a more specific key
  const avatarKey = user ? `avatar-${user.id}-${user.name}-${user.updated_at || Date.now()}` : 'avatar-none';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="backdrop-blur-md bg-goodwill-light/95 border-b border-goodwill-border shadow-soft">
      <div className="px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-goodwill-dark tracking-tight">Candidate Compliance Tracker</h2>
          <p className="text-sm text-goodwill-text-muted mt-1.5">
            {user && (
              <span className="inline-flex items-center gap-2.5">
                <span className="inline-flex h-6 px-2.5 rounded-full text-xs font-semibold bg-goodwill-primary/10 text-goodwill-primary border border-goodwill-primary/20">
                  {user.role}
                </span>
                <span className="text-goodwill-text-muted">Welcome,</span> <span className="text-goodwill-dark font-semibold">{user.name}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-goodwill-primary text-white font-semibold shadow-medium hover:shadow-large hover:bg-goodwill-primary/90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span>Add Credential</span>
            </button>
          )}
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-goodwill-border text-goodwill-dark hover:bg-goodwill-light transition-all duration-200 hover:border-goodwill-primary/30"
            title="View Profile"
          >
            {user?.avatar_url ? (
              <img
                key={avatarKey}
                src={(() => {
                  // Backend now returns full URLs (production-ready), use it directly
                  // The backend automatically uses the request's host (network IP for mobile access)
                  let avatarUrl = user.avatar_url;
                  
                  // Only add fallback if URL doesn't start with http/https/data
                  if (!avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
                    // Fallback: If it's a relative URL, prepend the API base URL
                    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
                    const baseUrl = apiBase.replace('/api', '');
                    avatarUrl = avatarUrl.startsWith('/') 
                      ? `${baseUrl}${avatarUrl}`
                      : `${baseUrl}/${avatarUrl}`;
                  }
                  
                  console.log('Topbar avatar URL:', avatarUrl);
                  return avatarUrl;
                })()}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-goodwill-border"
                style={{ display: 'block' }}
                onError={(e) => {
                  console.error('Topbar avatar failed to load:', user.avatar_url);
                  console.error('Attempted URL:', e.target.src);
                  e.target.style.display = 'none';
                }}
                onLoad={(e) => {
                  e.target.style.display = 'block';
                  console.log('Topbar avatar loaded successfully:', e.target.src);
                }}
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-goodwill-primary to-goodwill-secondary flex items-center justify-center ring-2 ring-goodwill-border">
                <User className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
            <span className="hidden sm:inline font-medium">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-goodwill-border text-goodwill-dark hover:bg-goodwill-light transition-all duration-200 hover:border-goodwill-primary/30"
          >
            <LogOut className="w-4 h-4 text-goodwill-dark" strokeWidth={2} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

