import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type FacilityType = 'RESTAURANT' | 'CAMPUS' | 'HEALTHCARE' | 'GYM' | 'CORPORATE';

interface AuthContextType {
  isAuthenticated: boolean;
  facilityType: FacilityType;
  setFacilityType: (type: FacilityType) => void;
  login: (email: string, token?: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dinevra_auth') === 'true';
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('dinevra_token');
  });

  const [facilityType, setFacilityTypeState] = useState<FacilityType>(() => {
    return (localStorage.getItem('dinevra_facility_type') as FacilityType) || 'RESTAURANT';
  });

  const setFacilityType = (t: FacilityType) => {
    setFacilityTypeState(t);
    localStorage.setItem('dinevra_facility_type', t);
  };

  const login = (email: string, jwtToken?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('dinevra_auth', 'true');
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('dinevra_token', jwtToken);
    }
    toast.success(`Welcome back, ${email}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('dinevra_auth');
    localStorage.removeItem('dinevra_token');
    toast.success('Successfully logged out.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, facilityType, setFacilityType, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
