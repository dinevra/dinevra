import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { FormField } from '../../shared/ui/DynamicForm';
import { Store, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function KitchenLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fields: FormField[] = [
    { name: 'kitchen_id', label: 'Kitchen UUID', type: 'text', placeholder: 'e.g. 123e4567-e89b-12d3...', required: true },
    { name: 'email', label: 'Staff Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  const handleLogin = async (data: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Stubbing the isolated /auth/kitchen-login endpoint
      await new Promise(r => setTimeout(r, 800));
      toast.success('Kitchen access authenticated');
      navigate('/kitchen/dashboard');
    } catch (err) {
      toast.error('Invalid credentials or unauthorized');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Kitchen Portal Auth
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your restricted daily operational dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <DynamicForm 
          fields={fields} 
          submitLabel="Launch Operations" 
          onSubmit={handleLogin} 
          isLoading={isLoading} 
        />
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center w-full"
          >
            Admin Sign-in instead <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
