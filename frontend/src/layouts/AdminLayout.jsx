import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { path: '/admin/fees', label: 'Fees Management', icon: '💰' },
    { path: '/admin/income', label: 'Income', icon: '📈' },
    { path: '/admin/expense', label: 'Expense', icon: '📉' },
    { path: '/admin/attendance', label: 'Attendance', icon: '✅' },
    { path: '/admin/notices', label: 'Notices', icon: '📢' },
    { path: '/admin/classes', label: 'Classes', icon: '🏫' },
    { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/admin/slider', label: 'Hero Slider', icon: '🎬' },
    { path: '/admin/admissions', label: 'Admissions', icon: '📋' },
    { path: '/admin/contact', label: 'Contact', icon: '📞' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const logoUrl = "http://localhost:5000/uploads/LOGO2.png";
  const schoolName = "OPVP KOLHAMPUR PUBLIC SCHOOL";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="School Logo" className="w-10 h-10 rounded-lg object-cover bg-white" />
          <h1 className="text-lg font-bold">{schoolName}</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl p-2">
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
          {/* Logo Section */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="School Logo" className="w-14 h-14 rounded-xl object-cover bg-white shadow-lg" />
              <div>
                <h1 className="text-lg font-bold text-white">{schoolName}</h1>
                <p className="text-sm text-white/80">Admin Panel</p>
              </div>
            </div>
          </div>
          
          {/* Back to Website */}
          <div className="p-4 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
              <span>🌐</span>
              <span>View Website</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-lg shadow-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-t dark:border-gray-600">
            <div className="flex items-center gap-3 mb-3 p-2 bg-white dark:bg-gray-600 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg shadow-red-200 flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8 w-full lg:w-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
