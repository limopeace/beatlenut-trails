'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AuthService } from '../services/api/authService';

// Initialize the auth service
const authService = new AuthService();

// Define types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAdminAuth = () => useContext(AdminAuthContext);

// Provider component
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('admin_token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          // Verify token with backend
          const userData = await authService.verifyToken();
          
          if (userData) {
            setUser(userData);
          } else {
            // Invalid token, clear it
            Cookies.remove('admin_token');
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          Cookies.remove('admin_token');
          setError('Your session has expired. Please log in again.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const { token, user } = await authService.adminLogin(email, password);
      
      if (token && user) {
        // Store token in cookie (use secure and httpOnly in production)
        Cookies.set('admin_token', token, { 
          expires: 1, // 1 day
          sameSite: 'strict' 
        });
        
        setUser(user);
        return { success: true };
      } else {
        setError('Login failed. Please check your credentials.');
        return { success: false, message: 'Login failed' };
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    Cookies.remove('admin_token');
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};