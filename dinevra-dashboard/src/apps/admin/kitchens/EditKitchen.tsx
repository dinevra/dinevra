import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../shared/ui/PageHeader';
import { kitchensApi, Kitchen, UpdateKitchenRequest } from '../../../features/kitchens/kitchensApi';
import { toast } from 'react-hot-toast';
import { Store, ChefHat, Settings, Eye, Users, Trash2 } from 'lucide-react';

export default function EditKitchen() {
  const navigate = useNavigate();
  const { kitchenId } = useParams<{ kitchenId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Kitchen>>({});

  useEffect(() => {
    if (kitchenId) fetchKitchen();
  }, [kitchenId]);

  const fetchKitchen = async () => {
    try {
      const data = await kitchensApi.getById(kitchenId!);
      setFormData(data);
    } catch (e) {
      toast.error('Failed to load kitchen details');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    else if (type === 'number') val = value ? parseInt(value, 10) : 0;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenId) return;
    
    setIsSaving(true);
    try {
      const updateData: UpdateKitchenRequest = { ...formData };
      delete (updateData as any).id;
      delete (updateData as any).location_id;
      delete (updateData as any).created_at;
      delete (updateData as any).updated_at;

      await kitchensApi.update(kitchenId, updateData);
      toast.success('Kitchen updated successfully');
      navigate(-1);
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to update kitchen');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate this kitchen?')) return;
    
    try {
      await kitchensApi.delete(kitchenId!);
      toast.success('Kitchen deactivated');
      navigate(-1);
    } catch (e) {
      toast.error('Failed to deactivate kitchen');
    }
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
          <Icon size={18} />
        </div>
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-8 space-y-6">
        {children}
      </div>
    </div>
  );

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading kitchen details...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 h-full overflow-y-auto pb-24">
      <div className="flex justify-between items-start">
        <PageHeader 
          title={`Edit ${formData.name}`} 
          description="Update operational constraints and service availability."
          breadcrumbs={[
            { label: 'Admin', onClick: () => navigate('/admin') },
            { label: 'Kitchens', onClick: () => navigate(-1) },
            { label: 'Edit' }
          ]}
        />
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition active:scale-95"
        >
          <Trash2 size={16} />
          Deactivate
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Details */}
          <Section title="Basic Identification" icon={Store}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kitchen Name *</label>
                <input 
                  type="text" name="name" required
                  value={formData.name || ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Internal Code</label>
                  <input 
                    type="text" name="code"
                    value={formData.code || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <input 
                    type="text" name="display_name"
                    value={formData.display_name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Production Settings */}
          <Section title="Production Constraints" icon={ChefHat}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Capacity / Slot</label>
                <input 
                  type="number" name="capacity_per_slot"
                  value={formData.capacity_per_slot || 0}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Avg Prep Time (m)</label>
                <input 
                  type="number" name="avg_prep_time_mins"
                  value={formData.avg_prep_time_mins || 0}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Buffer Time (m)</label>
                <input 
                  type="number" name="buffer_time_mins"
                  value={formData.buffer_time_mins || 0}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Concurrent</label>
                <input 
                  type="number" name="max_concurrent_orders"
                  value={formData.max_concurrent_orders || 0}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>
          </Section>

          {/* Service Availability */}
          <Section title="Service Channels" icon={Settings}>
            <div className="space-y-4">
              {[
                { id: 'supports_pickup', label: 'Pickup Orders' },
                { id: 'supports_delivery', label: 'Delivery Integration' },
                { id: 'supports_dine_in', label: 'Dine-In Support' },
                { id: 'supports_scheduled_orders', label: 'Scheduled Orders' },
                { id: 'supports_instant_orders', label: 'Instant ASAP Orders' },
              ].map(item => (
                <label key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <input 
                    type="checkbox" name={item.id}
                    checked={(formData as any)[item.id] || false}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={handleChange}
                  />
                </label>
              ))}
            </div>
          </Section>

          {/* Access & Visibility */}
          <Section title="Access & Visibility" icon={Eye}>
            <div className="space-y-4">
              {[
                { id: 'visible_to_customers', label: 'Visible to Customers' },
                { id: 'internal_only', label: 'Internal Staff Only' },
                { id: 'kitchen_login_enabled', label: 'Direct Kitchen Login' },
                { id: 'require_pin_login', label: 'Require PIN for Access' },
                { id: 'device_restriction_enabled', label: 'Lock to specific Devices' },
              ].map(item => (
                <label key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <input 
                    type="checkbox" name={item.id}
                    checked={(formData as any)[item.id] || false}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={handleChange}
                  />
                </label>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex justify-end gap-4">
           <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="px-12 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-95"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
