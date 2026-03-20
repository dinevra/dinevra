import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Store, TabletSmartphone, Users, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { name: 'Overview', href: '/admin' },
  { name: 'Locations & Kitchens', href: '/admin/kitchens' },
  { name: 'Menu Builder', href: '/admin/menu' },
  { name: 'POS Devices', href: '/admin/devices' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (actionName: string) => {
    setIsDropdownOpen(false);
    toast.success(`${actionName} module opening soon!`);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'text-sm font-medium' }} />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Dinevra Admin
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 leading-tight">Manager</span>
                <span className="text-xs text-gray-500">Admin Role</span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            {navItems.find(i => i.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition active:scale-95"
            >
              <Plus size={16} />
              New Action
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                <button 
                  onClick={() => handleAction('Create Menu Item')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Store size={16} className="text-indigo-500" />
                  New Menu Item
                </button>
                <button 
                  onClick={() => handleAction('Provision POS Device')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <TabletSmartphone size={16} className="text-blue-500" />
                  Add POS Device
                </button>
                <button 
                  onClick={() => handleAction('Invite Employee')}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-100 mt-1 pt-2"
                >
                  <Users size={16} className="text-green-500" />
                  Invite Employee
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-gray-50 z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
