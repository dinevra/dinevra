import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../shared/ui/PageHeader';
import DynamicForm, { FormField } from '../../../shared/ui/DynamicForm';
import { toast } from 'react-hot-toast';

export default function AddKitchen() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const fields: FormField[] = [
    { name: 'name', label: 'Kitchen Name', type: 'text', required: true, placeholder: 'e.g. Main Grill Station' },
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Skeleton implementation
      await new Promise(r => setTimeout(r, 600));
      toast.success('Kitchen created successfully');
      navigate('/admin/kitchens');
    } catch (e) {
      toast.error('Failed to create kitchen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto h-full overflow-y-auto">
      <PageHeader 
        title="Create New Kitchen" 
        description="Add a deeply isolated kitchen operation directly within this location."
        breadcrumbs={[
          { label: 'Admin', onClick: () => navigate('/admin') },
          { label: 'Locations', onClick: () => navigate('/admin/kitchens') },
          { label: 'New Kitchen' }
        ]}
      />
      
      <div className="mb-6 px-4 py-3 bg-indigo-50 text-indigo-800 rounded-lg text-sm border border-indigo-100 flex items-center">
        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Creating kitchen under existing Location ID: <strong>{locationId}</strong></span>
      </div>

      <DynamicForm fields={fields} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Deploy Kitchen" />
    </div>
  );
}
