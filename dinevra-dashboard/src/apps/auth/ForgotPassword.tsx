import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Recovery link sent to your email!');
    }, 1200);
  };

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
            Recover <br/> your Access
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-md font-medium">
            Don't worry, even the best of us forget things. We'll get you back into your dashboard in no time.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: 40% Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 relative bg-white overflow-y-auto pt-20 pb-12">
        <button 
          onClick={() => navigate('/login')} 
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 font-semibold text-sm"
        >
          <ArrowLeft size={20} />
          Back to Login
        </button>

        <div className="w-full max-w-sm mx-auto">
          {!isSubmitted ? (
            <>
              <div className="mb-10">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="text-blue-600" size={28} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Reset password</h2>
                <p className="mt-3 text-lg text-gray-500 font-medium leading-relaxed">
                  Enter your email address and we'll send you a secure link to reset it.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 font-medium transition-all"
                    placeholder="admin@organization.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-blue-600/10 text-base font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Send Recovery Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-sm">
                <CheckCircle2 className="text-green-600" size={40} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">Check your inbox</h2>
              <div className="text-lg text-gray-500 font-medium leading-relaxed space-y-4">
                <p>We've sent a secure recovery link to <span className="text-gray-900 font-bold underline decoration-blue-500/30 underline-offset-4">{email}</span>.</p>
                <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-8">
                  Check your spam folder if you don't see it within 5 minutes.
                </p>
              </div>
              
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-12 text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2 mx-auto transition-all"
              >
                Tried another email? <span className="underline">Change email</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
