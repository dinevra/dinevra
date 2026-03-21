import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const [organization, setOrganization] = useState('');
  const [sector, setSector] = useState('RESTAURANT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the Terms of Service.');
      return;
    }
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_name: organization,
          facility_type: sector,
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('dinevra_facility_type', sector);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch {
      toast.error('Unable to connect to the server. Is the backend running?');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      {/* LEFT PANE: 60% Branding */}
      <div className="hidden lg:flex flex-col flex-[0.6] bg-gradient-to-br from-blue-600 to-blue-900 p-12 relative overflow-hidden">
        <div className="absolute top-[10%] left-[-20%] w-[120%] h-[120%] pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] border-[40px] border-white/20 rounded-full" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-blue-600 text-2xl font-black tracking-tighter">D</span>
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Dinevra</span>
        </div>

        <div className="relative z-10 mt-auto pb-12">
          <h1 className="text-5xl font-black text-white leading-[1.1] max-w-lg tracking-tighter">
            Build your <br/> global operation.
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-md font-medium">
            Join thousands of organizations running their entire operations seamlessly.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: 40% Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 relative bg-white overflow-y-auto pt-20 pb-12">

        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 mb-8 font-medium">Get started with a 14-day free trial.</p>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Name</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facility Type</label>
              <select
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors appearance-none"
              >
                <option value="RESTAURANT">Restaurant</option>
                <option value="CAMPUS">Campus Dining</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="GYM">Gym &amp; Fitness</option>
                <option value="CORPORATE">Corporate Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Administrator Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Administrator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors"
                placeholder="admin@organization.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm font-medium transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all active:scale-[0.98] mt-6"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="mt-6 text-center text-sm font-medium text-gray-500">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">Back to Login</Link>
            </div>

            {/* Legal Agreement */}
            <div className="pt-4 flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-tight cursor-pointer">
                I agree to the Dinevra{' '}
                <a href="#" className="text-blue-600 underline font-semibold hover:text-blue-800">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 underline font-semibold hover:text-blue-800">Privacy Policy</a>.
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
