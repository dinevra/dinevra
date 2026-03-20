import { useNavigate } from 'react-router-dom';

export default function Kitchens() {
  const navigate = useNavigate();
  
  // Dummy kitchens
  const kitchens = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Main Campus Grill', status: 'online', active_orders: 12 },
    { id: '22222222-2222-2222-2222-222222222222', name: 'North Residence Cafe', status: 'online', active_orders: 5 },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Staff Coffee Shop', status: 'offline', active_orders: 0 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Kitchens Management</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and launch your active kitchen display systems.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchens.map((kitchen) => (
          <div key={kitchen.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{kitchen.name}</h3>
              <div className={`w-3 h-3 rounded-full mt-1.5 ${kitchen.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
            </div>
            
            <p className="text-sm text-gray-500 mb-6 font-mono break-all">{kitchen.id}</p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{kitchen.active_orders} Active Orders</span>
              
              <button 
                onClick={() => navigate(`/kds/${kitchen.id}`)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
              >
                Launch KDS ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
