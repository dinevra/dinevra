import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, ChefHat, Settings, Clock, Users, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../../../shared/ui/PageHeader';
import { kitchensApi, Kitchen } from '../../../features/kitchens/kitchensApi';
import { toast } from 'react-hot-toast';

export default function KitchenDetails() {
  const { kitchenId } = useParams<{ kitchenId: string }>();
  const navigate = useNavigate();
  const [kitchen, setKitchen] = useState<Kitchen | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (kitchenId) fetchKitchen();
  }, [kitchenId]);

  const fetchKitchen = async () => {
    try {
      const data = await kitchensApi.getById(kitchenId!);
      setKitchen(data);
    } catch (e) {
      toast.error('Failed to load kitchen details');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading kitchen details...</div>;
  if (!kitchen) return null;

  const StatusBadge = ({ active, label }: { active: boolean, label: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
      active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}>
      {active ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <PageHeader 
          title={kitchen.name} 
          description={`${kitchen.type || 'Standard Kitchen'} • ${kitchen.status}`}
          breadcrumbs={[
            { label: 'Admin', onClick: () => navigate('/admin') },
            { label: 'Kitchens', onClick: () => navigate(-1) },
            { label: kitchen.name }
          ]}
        />
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/admin/kitchens/${kitchen.id}/edit`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
          >
            <Edit2 size={16} />
            Edit Kitchen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Operational Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-gray-400 mb-2"><Users size={18} /></div>
              <div className="text-2xl font-bold text-gray-900">{kitchen.capacity_per_slot || 0}</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity / Slot</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-gray-400 mb-2"><Clock size={18} /></div>
              <div className="text-2xl font-bold text-gray-900">{kitchen.avg_prep_time_mins || 15}m</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Prep Time</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-gray-400 mb-2"><Settings size={18} /></div>
              <div className="text-2xl font-bold text-gray-900">{kitchen.max_concurrent_orders || 10}</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Max Load</div>
            </div>
          </div>

          {/* Configuration Matrix */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50">
              <h4 className="text-sm font-bold text-gray-900">Service & Visibility Matrix</h4>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatusBadge active={kitchen.supports_pickup} label="Pickup" />
              <StatusBadge active={kitchen.supports_delivery} label="Delivery" />
              <StatusBadge active={kitchen.supports_dine_in} label="Dine-In" />
              <StatusBadge active={kitchen.supports_scheduled_orders} label="Scheduled" />
              <StatusBadge active={kitchen.supports_instant_orders} label="Instant" />
              <StatusBadge active={kitchen.visible_to_customers} label="Public" />
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
            <div className="p-6 border-b border-gray-50">
              <h4 className="text-sm font-bold text-gray-900">Access Control</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Kitchen Login Enabled</span>
                <span className={`text-xs font-bold ${kitchen.kitchen_login_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {kitchen.kitchen_login_enabled ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Require PIN for Access</span>
                <span className={`text-xs font-bold ${kitchen.require_pin_login ? 'text-indigo-600' : 'text-gray-400'}`}>
                   {kitchen.require_pin_login ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Device Restrictions</span>
                <span className={`text-xs font-bold ${kitchen.device_restriction_enabled ? 'text-indigo-600' : 'text-gray-400'}`}>
                   {kitchen.device_restriction_enabled ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <ChefHat size={32} className="text-indigo-300 mb-6" />
            <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">Kitchen System Mode</h4>
            <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
              Operational unit is currently in <strong>{kitchen.status}</strong> mode.
            </p>
            <button 
              onClick={() => navigate(`/admin/kitchens/${kitchen.id}/config`)}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition border border-white/10 backdrop-blur-sm"
            >
              Open Kitchen Config
            </button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meta Information</h4>
             <div className="space-y-3 font-mono text-[10px] text-gray-500 uppercase">
               <div>ID: {kitchen.id}</div>
               <div>LOC_ID: {kitchen.location_id}</div>
               <div>CODE: {kitchen.code || 'N/A'}</div>
               <div>PRIORITY: {kitchen.priority}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
