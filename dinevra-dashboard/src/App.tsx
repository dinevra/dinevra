import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './apps/admin/AdminLayout';
import Overview from './apps/admin/Overview';
import Kitchens from './apps/admin/Kitchens';
import Settings from './apps/admin/Settings';
import KdsView from './apps/kitchen/KdsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="kitchens" element={<Kitchens />} />
          <Route path="menu" element={<div className="p-8">Menu Builder</div>} />
          <Route path="devices" element={<div className="p-8">Devices & POS</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Kitchen Display System Route */}
        <Route path="/kds/:kitchen_id" element={<KdsView />} />
      </Routes>
    </Router>
  );
}

export default App;
