'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AuthService } from '../services/api/authService';

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
        // Check for demo/localStorage token first
        const demoToken = localStorage.getItem('admin_token');
        const demoUserData = localStorage.getItem('admin_user');
        
        if (demoToken && demoUserData) {
          try {
            const userData = JSON.parse(demoUserData);
            setUser(userData);
            setLoading(false);
            return;
          } catch (err) {
            console.error('Demo user data parsing failed:', err);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
          }
        }
        
        // Check cookie token for real auth
        const token = Cookies.get('admin_token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          // Verify token with backend
          const userData = await AuthService.verifyToken();
          
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
      const { token, user } = await AuthService.adminLogin(email, password);
      
      if (token && user) {
        // Store token in both cookie and localStorage for consistency
        Cookies.set('admin_token', token, { 
          expires: 1, // 1 day
          sameSite: 'strict' 
        });
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        
        setUser(user);
        return { success: true };
      } else {
        setError('Login failed. Please check your credentials.');
        return { success: false, message: 'Login failed' };
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    // Clear both cookie and localStorage data
    Cookies.remove('admin_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
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