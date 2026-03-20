import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email || 'Manager');
      navigate('/admin');
    }, 1000);
  };

  const dummyStaff = [
    { id: 1, name: 'JD', initials: 'JD', color: 'bg-indigo-100 text-indigo-700' },
    { id: 2, name: 'Sarah', initials: 'SM', color: 'bg-emerald-100 text-emerald-700' },
    { id: 3, name: 'Mike', initials: 'MT', color: 'bg-amber-100 text-amber-700' },
    { id: 4, name: 'Elena', initials: 'ER', color: 'bg-rose-100 text-rose-700' },
  ];

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      {/* LEFT PANE: 60% Branding */}
      <div className="hidden lg:flex flex-col flex-[0.6] bg-gradient-to-br from-blue-600 to-blue-900 p-12 relative overflow-hidden">
        {/* Abstract Graphic Rings */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] border-[40px] border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-0 w-[800px] h-[800px] border-[2px] border-white/30 rounded-full" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-blue-600 text-2xl font-black tracking-tighter">D</span>
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Dinevra</span>
        </div>

        <div className="relative z-10 mt-auto pb-12">
          <h1 className="text-5xl font-black text-white leading-[1.1] max-w-lg tracking-tighter">
            Smart Dining <br/> Operating System
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-md font-medium">
            Streamline your front-of-house, kitchen, and analytics into one beautiful platform.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: 40% Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 relative bg-white overflow-y-auto">
        <div className="absolute top-8 right-8 text-sm font-medium text-gray-500">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold ml-1">Sign up</Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500 mb-8 font-medium">Please enter your details to sign in.</p>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm font-medium transition-colors"
                placeholder="admin@restaurant.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm font-medium transition-colors"
                placeholder="••••••••"
              />
              <div className="mt-2 flex justify-end">
                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Staff Login */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Staff Quick Login</h3>
            <div className="flex items-center gap-4">
              {dummyStaff.map(staff => (
                <button 
                  key={staff.id}
                  onClick={() => navigate('/pin')}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110 group-active:scale-95 shadow-sm border border-white ${staff.color}`}>
                    {staff.initials}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{staff.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
