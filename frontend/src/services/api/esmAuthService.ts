import { esmApiClient, ApiResponse } from './apiClient';
import Cookies from 'js-cookie';

export interface EsmUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceBranch: string;
  rank: string;
  serviceNumber: string;
  serviceYears: {
    from: number;
    to: number;
  };
  businessName?: string;
  sellerType: {
    products: boolean;
    services: boolean;
  };
  category: string;
  description: string;
  isVerified: boolean;
  status: string;
  profileImage?: string;
  logoImage?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  serviceBranch: string;
  rank: string;
  serviceNumber: string;
  serviceYears: {
    from: number;
    to: number;
  };
  businessName?: string;
  sellerType: {
    products: boolean;
    services: boolean;
  };
  category: string;
  description: string;
}

export interface AuthResponse {
  token: string;
  user: EsmUser;
}

class EsmAuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await esmApiClient.post<ApiResponse<AuthResponse>>('/esm/sellers/login', data);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store auth data in cookies
        Cookies.set('esm_token', token, { expires: 7 });
        Cookies.set('esm_user', JSON.stringify(user), { expires: 7 });
        
        return { token, user };
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
  
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await esmApiClient.post<ApiResponse<AuthResponse>>('/esm/sellers/register', data);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store auth data in cookies
        Cookies.set('esm_token', token, { expires: 7 });
        Cookies.set('esm_user', JSON.stringify(user), { expires: 7 });
        
        return { token, user };
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
  
  async logout(): Promise<void> {
    try {
      // For now, just client-side logout since there's no specific logout endpoint
      // The backend routes don't have a logout endpoint for ESM sellers
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('esm_token');
      Cookies.remove('esm_user');
      window.location.href = '/esm-portal/login';
    }
  }
  
  async getCurrentUser(): Promise<EsmUser | null> {
    try {
      const response = await esmApiClient.get<ApiResponse<EsmUser>>('/esm/sellers/profile');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  
  async updateProfile(data: Partial<EsmUser>): Promise<EsmUser> {
    try {
      const response = await esmApiClient.put<ApiResponse<EsmUser>>('/esm/sellers/profile', data);
      
      if (response.data.success && response.data.data) {
        // Update stored user data
        Cookies.set('esm_user', JSON.stringify(response.data.data), { expires: 7 });
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Profile update failed');
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }
  
  isAuthenticated(): boolean {
    return !!Cookies.get('esm_token');
  }
  
  getStoredUser(): EsmUser | null {
    const userStr = Cookies.get('esm_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return Cookies.get('esm_token') || null;
  }
}

export default new EsmAuthService();