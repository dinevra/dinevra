import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './apps/auth/AuthContext';
import Login from './apps/auth/Login';
import ForgotPassword from './apps/auth/ForgotPassword';
import AdminLayout from './apps/admin/AdminLayout';
import Overview from './apps/admin/Overview';
import Kitchens from './apps/admin/Kitchens';
import Settings from './apps/admin/Settings';
import KdsView from './apps/kitchen/KdsView';
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
      <Router>
      <Routes>
        {/* Public Application Landing Page */}
        <Route path="/" element={<UnderConstruction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
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
          <Route path="menu" element={<div className="p-8">Menu Builder</div>} />
          <Route path="devices" element={<div className="p-8">Devices & POS</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>

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
