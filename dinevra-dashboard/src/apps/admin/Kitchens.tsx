import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Kitchens() {
  const navigate = useNavigate();
  const { sector } = useAuth();
  
  const labels = {
    RESTAURANT: { title: 'Kitchens Management', subTitle: 'Monitor and launch your active kitchen display systems.', action: 'New Kitchen', monitor: 'Launch KDS' },
    CAMPUS: { title: 'Dining Units Management', subTitle: 'Monitor and launch your active service units.', action: 'New Unit', monitor: 'Launch Monitor' },
    HEALTHCARE: { title: 'Facility Units', subTitle: 'Monitor patient service pantries and preparation areas.', action: 'New Facility Area', monitor: 'Open Monitor' },
    GYM: { title: 'Service Points', subTitle: 'Manage your juice bars and pro-shop service terminals.', action: 'New Service Point', monitor: 'Launch Display' },
    CORPORATE: { title: 'Refreshment Hubs', subTitle: 'Monitor office cafeterias and self-service hubs.', action: 'New Hub', monitor: 'Open Refreshment Hub' },
  };

  const s = labels[sector] || labels.RESTAURANT;

  // Dummy units (mapping from 'kitchens' in dummy data)
  const units = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Main Campus Grill', status: 'online', active_orders: 12 },
    { id: '22222222-2222-2222-2222-222222222222', name: 'North Residence Cafe', status: 'online', active_orders: 5 },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Staff Coffee Shop', status: 'offline', active_orders: 0 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{s.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{s.subTitle}</p>
        </div>
        <button 
          onClick={() => toast.success('Deployment wizard opening soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm active:scale-95"
        >
          <Plus size={16} />
          {s.action}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{unit.name}</h3>
              <div className={`w-3 h-3 rounded-full mt-1.5 ${unit.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
            </div>
            
            <p className="text-sm text-gray-500 mb-6 font-mono break-all">{unit.id}</p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{unit.active_orders} Active Items</span>
              
              <button 
                onClick={() => navigate(`/kds/${unit.id}`)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
              >
                {s.monitor} ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
