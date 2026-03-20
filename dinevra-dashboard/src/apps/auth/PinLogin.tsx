import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowLeft, Clock } from 'lucide-react';

export default function PinLogin() {
  const [pin, setPin] = useState<string>('');
  const [isClockingIn, setIsClockingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    // Mock Verification
    setTimeout(() => {
      login('StaffMember');
      if (!isClockingIn) {
        navigate('/pos');
      } else {
        setPin('');
      }
    }, 400);
  };

  const dummyStaff = [
    { id: 1, name: 'JD', initials: 'JD', color: 'bg-indigo-100 text-indigo-700' },
    { id: 2, name: 'Sarah', initials: 'SM', color: 'bg-emerald-100 text-emerald-700' },
    { id: 3, name: 'Mike', initials: 'MT', color: 'bg-amber-100 text-amber-700' },
    { id: 4, name: 'Elena', initials: 'ER', color: 'bg-rose-100 text-rose-700' },
    { id: 5, name: 'Chris', initials: 'CH', color: 'bg-cyan-100 text-cyan-700' },
    { id: 6, name: 'Alex', initials: 'AL', color: 'bg-fuchsia-100 text-fuchsia-700' },
    { id: 7, name: 'Kim', initials: 'KK', color: 'bg-violet-100 text-violet-700' },
    { id: 8, name: 'Sam', initials: 'SS', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans text-gray-900 border-t-8 border-blue-600 select-none">
      <button onClick={() => navigate('/login')} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={24} />
      </button>

      {/* Staff Grid Profile Selection */}
      <div className="flex-[0.5] p-12 flex flex-col justify-center items-center border-r border-gray-200 bg-white">
        <h2 className="text-3xl font-black tracking-tight mb-12">Select Profile</h2>
        <div className="grid grid-cols-4 gap-6">
          {dummyStaff.map(staff => (
            <button key={staff.id} className="group flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl transition-transform group-hover:scale-105 group-active:scale-95 shadow-sm border border-gray-100 ${staff.color}`}>
                {staff.initials}
              </div>
              <span className="font-semibold text-gray-600">{staff.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PIN Keypad Section */}
      <div className="flex-[0.5] bg-gray-50 flex flex-col justify-center items-center p-12 relative">
        <div className="w-full max-w-sm flex flex-col items-center">
          <h3 className="text-xl font-bold text-gray-500 tracking-widest uppercase mb-8 text-center w-full">Enter PIN</h3>
          
          {/* 6-Dot PIN Indicator */}
          <div className="flex gap-4 mb-16 h-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div 
                key={idx} 
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > idx ? 'bg-blue-600 scale-110 shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>

          {/* Clock-In Logic Toggle */}
          <div className="mb-8 w-full">
            <button 
              onClick={() => setIsClockingIn(!isClockingIn)}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-sm ${
                isClockingIn 
                  ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-green-500/20' 
                  : 'bg-white text-gray-400 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <Clock size={20} className={isClockingIn ? 'animate-pulse' : ''} />
              {isClockingIn ? 'Clocking In...' : 'Tap here to Clock In'}
            </button>
          </div>

          {/* 3x4 Keypad */}
          <div className="grid grid-cols-3 gap-4 w-full px-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num)}
                className="h-20 bg-white border border-gray-200 rounded-2xl text-3xl font-bold text-gray-800 shadow-sm hover:border-blue-500 active:bg-blue-50 active:scale-95 transition-all"
              >
                {num}
              </button>
            ))}
            <div className="h-20" /> {/* Empty Slot */}
            <button 
              onClick={() => handleKeyPress('0')}
              className="h-20 bg-white border border-gray-200 rounded-2xl text-3xl font-bold text-gray-800 shadow-sm hover:border-blue-500 active:bg-blue-50 active:scale-95 transition-all"
            >
              0
            </button>
            <button 
              onClick={handleDelete}
              className="h-20 bg-transparent flex items-center justify-center rounded-2xl text-gray-400 hover:text-gray-900 active:scale-95 transition-all"
            >
              <ArrowLeft size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
