import { Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { LogOut } from 'lucide-react';

export default function PosLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'POS', href: '/pos' },
    { name: 'Kitchen', href: '/pos/kitchen' },
    { name: 'Orders', href: '/pos/orders' },
    { name: 'Menu', href: '/pos/menu' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* POS Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="font-black text-white text-lg tracking-tighter">D</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Restaurant POS</span>
          </div>

          {/* Center Navigation */}
          <nav className="flex gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-6 border-l border-gray-200 pl-6 h-8">
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-600">
            <span>Table: <span className="text-gray-900">Walk-in</span></span>
            <span className="text-gray-300">|</span>
            <span>Server: <span className="text-gray-900">John D.</span></span>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors active:scale-95"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
