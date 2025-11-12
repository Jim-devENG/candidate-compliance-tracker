import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onAddClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Credentials Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            {user && (
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 px-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {user.role}
                </span>
                <span className="text-gray-500">Welcome,</span> <span className="text-gray-700 font-medium">{user.name}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Credential</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

