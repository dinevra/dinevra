import { toast } from 'react-hot-toast';

export default function Settings() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Organization Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage global preferences and Stripe API keys.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment Processing</h3>
          <p className="text-sm text-gray-500">Connect to Stripe to process payments via BBPOS native terminals.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stripe Secret Key</label>
            <input 
              type="password" 
              defaultValue="sk_test_1234567890abcdef"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Webhook Secret</label>
            <input 
              type="password" 
              defaultValue="whsec_abcdef1234567890"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readOnly
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => toast.success('Payment Settings Saved Successfully!')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
