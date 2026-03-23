import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../shared/ui/PageHeader';
import SectionedForm, { FormSection } from '../../../shared/ui/SectionedForm';
import { locationsApi, Location } from '../../../features/locations/locationsApi';
import { toast } from 'react-hot-toast';

export default function EditLocation() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (locationId) fetchLocation();
  }, [locationId]);

  const fetchLocation = async () => {
    try {
      const data = await locationsApi.getById(locationId!);
      setLocation(data);
    } catch (e) {
      toast.error('Failed to load location');
      navigate('/admin/locations');
    } finally {
      setIsLoading(false);
    }
  };

  const sections: FormSection[] = [
    {
      title: '1. Basic Information',
      fields: [
        { name: 'name', label: 'Location Name', type: 'text', required: true },
        { name: 'code', label: 'Location Code', type: 'text', required: true },
        { name: 'type', label: 'Location Type', type: 'select', options: [
          { label: 'Restaurant', value: 'RESTAURANT' },
          { label: 'Campus Dining', value: 'CAMPUS' },
          { label: 'Healthcare Facility', value: 'HEALTHCARE' },
          { label: 'Gym/Service Point', value: 'GYM' },
          { label: 'Corporate Hub', value: 'CORPORATE' },
        ]},
        { name: 'status', label: 'Status', type: 'select', options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]},
      ]
    },
    {
      title: '2. Address & Geography',
      fields: [
        { name: 'address_line1', label: 'Address Line 1', type: 'text', required: true },
        { name: 'address_line2', label: 'Address Line 2', type: 'text' },
        { name: 'landmark', label: 'Landmark', type: 'text' },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'state', label: 'State / Province', type: 'text' },
        { name: 'postal_code', label: 'Postal Code', type: 'text' },
        { name: 'country', label: 'Country', type: 'text', required: true },
        { name: 'latitude', label: 'Latitude', type: 'number' },
        { name: 'longitude', label: 'Longitude', type: 'number' },
      ]
    },
    {
      title: '3. Regional & Localization',
      fields: [
        { name: 'timezone', label: 'Timezone', type: 'select', options: [
          { label: 'UTC', value: 'UTC' },
          { label: 'America/New_York', value: 'America/New_York' },
          { label: 'Europe/London', value: 'Europe/London' },
          { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
        ]},
        { name: 'currency', label: 'Primary Currency', type: 'text' },
        { name: 'date_format', label: 'Date Format', type: 'select', options: [
          { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
          { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
          { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        ]},
        { name: 'time_format', label: 'Time Format', type: 'select', options: [
          { label: '12-hour (AM/PM)', value: '12h' },
          { label: '24-hour', value: '24h' },
        ]},
        { name: 'week_start_day', label: 'Week Starts On', type: 'select', options: [
          { label: 'Sunday', value: '0' },
          { label: 'Monday', value: '1' },
        ]},
      ]
    },
    {
      title: '4. Contact Details',
      fields: [
        { name: 'contact_name', label: 'Contact Person', type: 'text' },
        { name: 'contact_email', label: 'Contact Email', type: 'email' },
        { name: 'contact_phone', label: 'Contact Phone', type: 'text' },
        { name: 'opening_date', label: 'Opening Date', type: 'date' },
      ]
    },
    {
      title: '5. Operational Settings',
      fields: [
        { name: 'supports_pickup', label: 'Pickup', type: 'checkbox' },
        { name: 'supports_delivery', label: 'Delivery', type: 'checkbox' },
        { name: 'supports_dine_in', label: 'Dine-In', type: 'checkbox' },
        { name: 'supports_pre_order', label: 'Pre-Order', type: 'checkbox' },
        { name: 'supports_same_day_ordering', label: 'Same-Day Ordering', type: 'checkbox' },
        { name: 'tax_region', label: 'Tax Region', type: 'text' },
      ]
    }
  ];

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        week_start_day: formData.week_start_day ? parseInt(formData.week_start_day) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };
      await locationsApi.update(locationId!, payload);
      toast.success('Location updated successfully');
      navigate(`/admin/locations/${locationId}`);
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to update location');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const initialData = {
    ...location,
    opening_date: location?.opening_date ? new Date(location.opening_date).toISOString().split('T')[0] : '',
    week_start_day: location?.week_start_day?.toString(),
    latitude: location?.latitude?.toString(),
    longitude: location?.longitude?.toString(),
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <PageHeader 
        title={`Edit ${location?.name}`} 
        description="Update the operational and regional settings for this location."
        breadcrumbs={[
          { label: 'Admin', onClick: () => navigate('/admin') },
          { label: 'Locations', onClick: () => navigate('/admin/locations') },
          { label: location?.name || '...', onClick: () => navigate(`/admin/locations/${location?.id}`) },
          { label: 'Edit' }
        ]}
      />
      <div className="mt-8">
        <SectionedForm 
          sections={sections} 
          initialData={initialData}
          onSubmit={handleSubmit} 
          isLoading={isSaving} 
          submitLabel="Update Location"
          onCancel={() => navigate(`/admin/locations/${locationId}`)}
        />
      </div>
    </div>
  );
}
