import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/ui/PageHeader';
import ToggleSwitch from '../../shared/ui/ToggleSwitch';
import { Activity, ShoppingBag, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleStatus = (val: boolean) => {
    // Calling PUT /api/v1/kitchens/:id/status
    setIsOpen(val);
    if (val) {
      toast.success('Kitchen is now actively OPEN to incoming orders', { icon: '🟢' });
    } else {
      toast('Kitchen is currently CLOSED', { icon: '🔴' });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restricted Kitchen Interface</h1>
          <p className="text-gray-500">Managing operations for: Main Campus Grill</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Live Status</span>
            <span className={`text-sm font-bold ${isOpen ? 'text-green-600' : 'text-gray-600'}`}>
              {isOpen ? 'ACCEPTING ORDERS' : 'PAUSED'}
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <ToggleSwitch 
            checked={isOpen} 
            onChange={handleToggleStatus} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Items</p>
            <p className="text-2xl font-bold text-gray-900">42</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg Prep Time</p>
            <p className="text-2xl font-bold text-gray-900">14m</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Capacity Match</p>
            <p className="text-2xl font-bold text-gray-900">85%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8">
        <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Zone</h3>
        <p className="text-gray-500 max-w-md">
          This portal strictly manages single-kitchen operations. Any hierarchical or global architecture configurations require full Administrative Dashboard access.
        </p>
        <button 
          onClick={() => navigate('/kds/11111111-1111-1111-1111-111111111111')}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Launch Kitchen Display (KDS)
        </button>
      </div>
    </div>
  );
}
