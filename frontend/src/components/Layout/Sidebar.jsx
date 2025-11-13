import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5 text-current" strokeWidth={2} />,
    },
  ];

  return (
    <div className="w-64 min-h-screen border-r border-blue-700/30 shadow-large" style={{ background: 'linear-gradient(to bottom, #02646f, #02646f, #015a64)' }}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm shadow-medium flex items-center justify-center border border-white/30">
            <LayoutDashboard className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Goodwill Staffing</h1>
            <p className="text-white/80 text-xs mt-0.5 font-medium">Compliance Tracker</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-medium shadow-white/20 border border-white/30' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

