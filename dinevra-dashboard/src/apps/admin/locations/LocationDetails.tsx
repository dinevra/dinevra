import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Globe, Clock, Phone, Mail, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import PageHeader from '../../../shared/ui/PageHeader';
import { locationsApi, Location } from '../../../features/locations/locationsApi';
import { toast } from 'react-hot-toast';
import { kitchensApi, Kitchen } from '../../../features/kitchens/kitchensApi';
import KitchenCard from '../kitchens/KitchenCard';

export default function LocationDetails() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'kitchens'>('overview');

  useEffect(() => {
    if (locationId) {
      fetchData();
    }
  }, [locationId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [locData, kitchensData] = await Promise.all([
        locationsApi.getById(locationId!),
        kitchensApi.listByLocation(locationId!)
      ]);
      setLocation(locData);
      setKitchens(kitchensData.kitchens);
    } catch (e) {
      toast.error('Failed to load data');
      navigate('/admin/locations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading details...</div>;
  if (!location) return null;

  const SupportBadge = ({ active, label }: { active: boolean, label: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
      active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}>
      {active ? <CheckCircle size={14} /> : <XCircle size={14} />}
      <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <PageHeader 
          title={location.name} 
          description={`${location.type} • ${location.city}, ${location.country}`}
          breadcrumbs={[
            { label: 'Admin', onClick: () => navigate('/admin') },
            { label: 'Locations', onClick: () => navigate('/admin/locations') },
            { label: location.name }
          ]}
        />
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/admin/locations/${location?.id}/edit`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
          >
            <Edit2 size={16} />
            Edit Location
          </button>
          <button 
            onClick={() => navigate(`/admin/locations/${location?.id}/kitchens/new`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95"
          >
            + Add Kitchen
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('kitchens')}
          className={`px-8 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'kitchens' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Kitchens
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'kitchens' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {kitchens.length}
          </span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Left Column: Stats & Meta */}
          <div className="lg:col-span-2 space-y-8">
            {/* Support Grid */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Service Support Matrix</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SupportBadge active={location.supports_pickup} label="Pickup" />
                <SupportBadge active={location.supports_delivery} label="Delivery" />
                <SupportBadge active={location.supports_dine_in} label="Dine-In" />
                <SupportBadge active={location.supports_pre_order} label="Pre-Order" />
                <SupportBadge active={location.supports_same_day_ordering} label="Same-Day" />
              </div>
            </div>

            {/* Details Sections */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-50">
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Address Information</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 text-sm text-gray-700">
                      <MapPin size={18} className="text-indigo-400 shrink-0" />
                      <span>
                        {location.address_line1}<br />
                        {location.address_line2 && <>{location.address_line2}<br /></>}
                        {location.city}, {location.state && `${location.state}, `}{location.postal_code}<br />
                        {location.country}
                      </span>
                    </div>
                    {location.landmark && (
                      <div className="text-sm text-gray-500 italic pl-7">Near {location.landmark}</div>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-4 bg-gray-50/30">
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Regional Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock size={16} className="text-indigo-400" />
                      <span>{location.timezone || 'Not set'} • {location.time_format || '24h'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Globe size={16} className="text-indigo-400" />
                      <span>{location.currency || 'USD'} • {location.languages?.join(', ') || 'English'}</span>
                    </div>
                    <div className="text-xs text-gray-500 pl-7">Week starts on: {['Sunday','Monday'][location.week_start_day || 0]}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Contact Personnel</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone size={16} className="text-indigo-400" />
                      <span>{location.contact_phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Mail size={16} className="text-indigo-400" />
                      <span>{location.contact_email || 'No email'}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 border-l-2 border-indigo-500 pl-3">
                      {location.contact_name || 'Manager N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase">System Meta</h4>
                  <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-gray-400">
                    <div>CODE: {location.code}</div>
                    <div>STATUS: {location.status.toUpperCase()}</div>
                    <div>LAT: {location.latitude?.toFixed(4) || 'N/A'}</div>
                    <div>LNG: {location.longitude?.toFixed(4) || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Operational Status</h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Currently {location.status === 'active' ? 'Live' : 'Maintenance'}</span>
                <div className={`w-3 h-3 rounded-full ${location.status === 'active' ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
              </div>
              <button 
                onClick={() => toast.success('Status toggling coming soon!')}
                className="w-full mt-6 py-3 bg-indigo-800 hover:bg-indigo-700 rounded-xl text-sm font-bold transition border border-indigo-700"
              >
                {location.status === 'active' ? 'Deactivate Location' : 'Activate Location'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 capitalize mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate(`/admin/locations/${location.id}/kitchens/new`)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition"
                >
                  + Add Kitchen to {location.name}
                </button>
                <button 
                  onClick={() => toast.success('Staff management coming soon!')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition"
                >
                  Manage Local Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Registered Kitchens</h3>
            <p className="text-sm text-gray-500">{kitchens.length} operational units found</p>
          </div>

          {kitchens.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ChefHat size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">No kitchens yet</h4>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">
                Every location needs at least one kitchen to process orders and manage inventory.
              </p>
              <button 
                onClick={() => navigate(`/admin/locations/${location.id}/kitchens/new`)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
              >
                Deploy First Kitchen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchens.map(kitchen => (
                <KitchenCard 
                  key={kitchen.id} 
                  kitchen={kitchen} 
                  onClick={(id) => navigate(`/admin/kitchens/${id}/config`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
