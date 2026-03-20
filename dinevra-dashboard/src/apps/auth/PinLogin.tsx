import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowLeft, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PinLogin() {
  const [pin, setPin] = useState<string>('');
  const [isClockingIn, setIsClockingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the selected staff from the navigation state
  const selectedStaff = location.state?.staff || { 
    id: 0, 
    name: 'Staff Member', 
    initials: '??', 
    color: 'bg-gray-100 text-gray-500' 
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const verifyPin = (submittedPin: string) => {
    // Mock Verification logic
    if (submittedPin === selectedStaff.pin) {
      setTimeout(() => {
        if (isClockingIn) {
          toast.success(`${selectedStaff.name} clocked in successfully!`);
          setPin('');
        } else {
          login(selectedStaff.name);
          navigate('/admin');
        }
      }, 400);
    } else {
      setTimeout(() => {
        toast.error('Invalid PIN. Please try again.');
        setPin('');
      }, 200);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden select-none">
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
            Secure Access <br/> for your Team
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-md font-medium">
            Fast, secure PIN entry for frontline staff members to access their specific tools.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: 40% PIN Keypad */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 relative bg-white overflow-y-auto">
        <button onClick={() => navigate('/login')} className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 font-semibold text-sm">
          <ArrowLeft size={20} />
          Back to Login
        </button>

        <div className="w-full max-w-sm mx-auto flex flex-col items-center">
          {/* Selected User Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center font-bold text-4xl mb-6 shadow-xl border-4 border-white ${selectedStaff.color}`}>
              {selectedStaff.initials}
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {selectedStaff.name}</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide uppercase">Enter your security PIN</p>
          </div>
          
          {/* 6-Dot PIN Indicator */}
          <div className="flex gap-4 mb-12 h-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  pin.length > idx ? 'bg-blue-600 scale-125 shadow-[0_0_15px_rgba(37,99,235,0.6)]' : 'bg-gray-200'
                }`} 
              />
            ))}
          </div>

          {/* Clock-In Logic Toggle */}
          <div className="mb-10 w-full px-4">
            <button 
              onClick={() => setIsClockingIn(!isClockingIn)}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-sm ${
                isClockingIn 
                  ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-green-500/10' 
                  : 'bg-gray-50 text-gray-400 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <Clock size={16} className={isClockingIn ? 'animate-pulse' : ''} />
              {isClockingIn ? 'Clocking In...' : 'Register as Clocked In'}
            </button>
          </div>

          {/* 3x4 Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full px-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num)}
                className="h-20 bg-gray-50 border border-transparent rounded-2xl text-3xl font-bold text-gray-800 transition-all hover:bg-white hover:border-blue-200 hover:shadow-md active:scale-95 active:bg-blue-50"
              >
                {num}
              </button>
            ))}
            <div className="h-20" /> {/* Empty Slot */}
            <button 
              onClick={() => handleKeyPress('0')}
              className="h-20 bg-gray-50 border border-transparent rounded-2xl text-3xl font-bold text-gray-800 transition-all hover:bg-white hover:border-blue-200 hover:shadow-md active:scale-95 active:bg-blue-50"
            >
              0
            </button>
            <button 
              onClick={handleDelete}
              className="h-20 bg-transparent flex items-center justify-center rounded-2xl text-gray-400 hover:text-red-500 active:scale-95 transition-all"
            >
              <ArrowLeft size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
