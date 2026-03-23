import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './apps/auth/AuthContext';
import Login from './apps/auth/Login';
import Signup from './apps/auth/Signup';
import PinLogin from './apps/auth/PinLogin';
import ForgotPassword from './apps/auth/ForgotPassword';
import KitchenLogin from './apps/auth/KitchenLogin';
import AdminLayout from './apps/admin/AdminLayout';
import Overview from './apps/admin/Overview';
import Kitchens from './apps/admin/Kitchens';
import Settings from './apps/admin/Settings';
import AddLocation from './apps/admin/locations/AddLocation';
import AddKitchen from './apps/admin/kitchens/AddKitchen';
import KitchenConfigWrapper from './apps/admin/kitchens/KitchenConfigWrapper';
import PosLayout from './apps/pos/PosLayout';
import PosTerminal from './apps/pos/PosTerminal';
import KdsView from './apps/kitchen/KdsView';
import KitchenDashboard from './apps/kitchen/KitchenDashboard';
import UnderConstruction from './apps/shared/UnderConstruction';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
      <Routes>
        {/* Public Application Landing Page */}
        <Route path="/" element={<UnderConstruction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pin" element={<PinLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/kitchen" element={<KitchenLogin />} />
        
        {/* Admin Dashboard Routes - Protected */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="kitchens" element={<Kitchens />} />
          <Route path="locations/new" element={<AddLocation />} />
          <Route path="locations/:locationId/kitchens/new" element={<AddKitchen />} />
          <Route path="kitchens/:kitchenId/config" element={<KitchenConfigWrapper />} />
          <Route path="menu" element={<div className="p-8">Menu Builder</div>} />
          <Route path="devices" element={<div className="p-8">Devices & POS</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Web POS Route - Protected */}
        <Route 
          path="/pos" 
          element={
            <ProtectedRoute>
              <PosLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PosTerminal />} />
          <Route path="kitchen" element={<div className="p-8 font-bold text-gray-400">Kitchen Display UI module coming soon.</div>} />
          <Route path="orders" element={<div className="p-8 font-bold text-gray-400">Order History UI module coming soon.</div>} />
          <Route path="menu" element={<div className="p-8 font-bold text-gray-400">Menu Modifier UI module coming soon.</div>} />
        </Route>

        {/* Isolated Kitchen Operations Route - Protected */}
        <Route 
          path="/kitchen/dashboard" 
          element={
            <ProtectedRoute>
              <KitchenDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Kitchen Display System Route - Protected */}
        <Route 
          path="/kds/:kitchen_id" 
          element={
            <ProtectedRoute>
              <KdsView />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
