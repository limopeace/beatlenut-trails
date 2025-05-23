import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EsmAuthService, EsmUser } from '@/services/api/esmAuthService';
import Cookies from 'js-cookie';

interface UseEsmAuthReturn {
  user: EsmUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<EsmUser>) => Promise<void>;
  checkAuth: () => Promise<void>;
  error: string | null;
}

export function useEsmAuth(): UseEsmAuthReturn {
  const [user, setUser] = useState<EsmUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    setLoading(true);
    try {
      // First check if we have a stored user
      const storedUser = EsmAuthService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      
      // Then verify with the server if we have a token
      if (EsmAuthService.isAuthenticated()) {
        const currentUser = await EsmAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Update stored user info
          Cookies.set('esm_user', JSON.stringify(currentUser), { expires: 7 });
        } else {
          // Token is invalid, clear everything
          setUser(null);
          Cookies.remove('esm_token');
          Cookies.remove('esm_user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const response = await EsmAuthService.login({ email, password });
      setUser(response.user);
      
      // Redirect based on user role
      if (response.user.role === 'seller') {
        router.push('/esm-portal/dashboard');
      } else {
        router.push('/esm-portal/buyer-profile');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (data: any) => {
    setError(null);
    setLoading(true);
    try {
      const response = await EsmAuthService.register(data);
      setUser(response.user);
      
      // Redirect to success page
      router.push('/esm-portal/register/success');
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await EsmAuthService.logout();
      setUser(null);
      router.push('/esm-portal/login');
    } catch (error: any) {
      setError(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<EsmUser>) => {
    setError(null);
    setLoading(true);
    try {
      const updatedUser = await EsmAuthService.updateProfile(data);
      setUser(updatedUser);
    } catch (error: any) {
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    error
  };
}

// Hook for requiring authentication
export function useRequireEsmAuth(redirectTo = '/esm-portal/login') {
  const { user, loading, isAuthenticated } = useEsmAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, redirectTo, router]);
  
  return { user, loading, isAuthenticated };
}

// Hook for requiring specific roles
export function useRequireEsmRole(requiredRole: 'seller' | 'buyer', redirectTo = '/esm-portal/dashboard') {
  const { user, loading, isAuthenticated } = useEsmAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/esm-portal/login');
      } else if (user && user.role !== requiredRole) {
        router.push(redirectTo);
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, redirectTo, router]);
  
  return { user, loading, isAuthenticated, hasRole: user?.role === requiredRole };
}