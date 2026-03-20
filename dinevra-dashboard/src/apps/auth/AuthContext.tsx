import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type Sector = 'RESTAURANT' | 'CAMPUS' | 'HEALTHCARE' | 'GYM' | 'CORPORATE';

interface AuthContextType {
  isAuthenticated: boolean;
  sector: Sector;
  setSector: (sector: Sector) => void;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check local storage so the mock login persists across refreshes
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dinevra_auth') === 'true';
  });

  const [sector, setSectorState] = useState<Sector>(() => {
    return (localStorage.getItem('dinevra_sector') as Sector) || 'RESTAURANT';
  });

  const setSector = (s: Sector) => {
    setSectorState(s);
    localStorage.setItem('dinevra_sector', s);
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('dinevra_auth', 'true');
    toast.success(`Welcome back, ${email}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dinevra_auth');
    toast.success('Successfully logged out.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, sector, setSector, login, logout }}>
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
