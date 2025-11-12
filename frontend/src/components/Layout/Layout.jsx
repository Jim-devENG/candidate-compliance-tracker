import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, onAddClick }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onAddClick={onAddClick} />
        <main className="flex-1 px-6 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

