import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../data/apiService';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  role: 'admin' | 'client' | 'pro';
  professional_profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('investaqary_token');
      const savedUser = localStorage.getItem('investaqary_user');
      
      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await apiService.get('/user');
          if (response.success) {
            setUser(response.user);
            localStorage.setItem('investaqary_user', JSON.stringify(response.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth verification failed', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await apiService.post('/login', { email, password });
      
      if (response.success) {
        const userData = response.user;
        const token = response.access_token; // Fixed: using access_token from API
        
        setUser(userData);
        localStorage.setItem('investaqary_token', token);
        localStorage.setItem('investaqary_user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('investaqary_token');
    localStorage.removeItem('investaqary_user');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('investaqary_user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
