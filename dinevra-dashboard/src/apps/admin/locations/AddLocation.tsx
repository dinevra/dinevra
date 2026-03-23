import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../shared/ui/PageHeader';
import DynamicForm, { FormField } from '../../../shared/ui/DynamicForm';
import { toast } from 'react-hot-toast';

export default function AddLocation() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fields: FormField[] = [
    { name: 'name', label: 'Location Name', type: 'text', required: true, placeholder: 'e.g. North Campus Dining' },
    { name: 'address_line1', label: 'Street Address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Skeleton implementation — waiting to wire up API layer
      await new Promise(r => setTimeout(r, 800));
      toast.success('Location created successfully');
      navigate('/admin/kitchens');
    } catch (e) {
      toast.error('Failed to create location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto h-full overflow-y-auto">
      <PageHeader 
        title="Create New Location" 
        description="Add a new physical location to your organization."
        breadcrumbs={[
          { label: 'Admin', onClick: () => navigate('/admin') },
          { label: 'Locations', onClick: () => navigate('/admin/kitchens') },
          { label: 'New Location' }
        ]}
      />
      <DynamicForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Location" />
    </div>
  );
}
