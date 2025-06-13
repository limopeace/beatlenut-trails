import { useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UseAdminAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

/**
 * Custom hook for handling admin authentication
 * Manages login, logout, and authentication state
 */
export const useAdminAuth = (): UseAdminAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await AuthService.verifyToken();
        if (user) {
          setUser(user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Log in with email and password
   * @param email User email
   * @param password User password
   * @returns Result with success status and optional error message
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.adminLogin(email, password);
      const { user, token } = response;

      // Check if user has admin role
      if (user.role !== 'admin') {
        setError('Insufficient permissions for admin access');
        setLoading(false);
        return { success: false, message: 'Insufficient permissions for admin access' };
      }

      // Save token and user info
      localStorage.setItem('adminToken', token);
      setUser(user);
      
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Log out the current user
   */
  const logout = (): void => {
    AuthService.logout();
    setUser(null);
    router.push('/admin/login');
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};

export default useAdminAuth;