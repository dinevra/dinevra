import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../../shared/ui/PageHeader';
import TabsLayout, { TabItem } from '../../../shared/ui/TabsLayout';
import { 
  Settings2, Clock, Utensils, Zap, MessageSquare, Shield, Settings 
} from 'lucide-react';

// Stub components for the 7 tabs
const OverviewTab = () => <div className="text-gray-600 p-4">Kitchen Overview & Status Metrics</div>;
const TimingsTab = () => <div className="text-gray-600 p-4">Manage Day-wise Kitchen Timings (e.g., Breakfast, Lunch)</div>;
const MenusTab = () => <div className="text-gray-600 p-4">Assign Active Menus to this specific Kitchen</div>;
const ServicesTab = () => <div className="text-gray-600 p-4">Configure Delivery, Pickup, or Dine-in toggles</div>;
const CartMessageTab = () => <div className="text-gray-600 p-4">Update the customer-facing Cart Disclaimer Message</div>;
const CommonConfigTab = () => <div className="text-gray-600 p-4">Base common rules (Taxes, Surcharges, Preparation Time)</div>;
const StaffAccessTab = () => <div className="text-gray-600 p-4">Grant or Revoke Kitchen Staff / Manager access</div>;

export default function KitchenConfigWrapper() {
  const { kitchenId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: <Settings2 /> },
    { id: 'timings', label: 'Kitchen Timings', icon: <Clock /> },
    { id: 'menus', label: 'Menus', icon: <Utensils /> },
    { id: 'services', label: 'Services', icon: <Zap /> },
    { id: 'cart-message', label: 'Cart Message', icon: <MessageSquare /> },
    { id: 'common', label: 'Common Config', icon: <Settings /> },
    { id: 'staff', label: 'Staff Access', icon: <Shield /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'timings': return <TimingsTab />;
      case 'menus': return <MenusTab />;
      case 'services': return <ServicesTab />;
      case 'cart-message': return <CartMessageTab />;
      case 'common': return <CommonConfigTab />;
      case 'staff': return <StaffAccessTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-7xl mx-auto">
      <PageHeader 
        title="Kitchen Configuration"
        description={`Managing operational capabilities for Kitchen ID: ${kitchenId}`}
        breadcrumbs={[
          { label: 'Admin', onClick: () => navigate('/admin') },
          { label: 'Kitchens', onClick: () => navigate('/admin/kitchens') },
          { label: 'Configuration' }
        ]}
      />
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 mt-4 overflow-hidden">
        <TabsLayout 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab}
        >
          {renderTabContent()}
        </TabsLayout>
      </div>
    </div>
  );
}
