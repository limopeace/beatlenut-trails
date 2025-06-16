import { esmApiClient, ApiResponse } from './apiClient';
import Cookies from 'js-cookie';

export interface EsmUser {
  _id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  phoneNumber?: string;
  profilePicture?: string;
  businessName?: string;
  businessDescription?: string;
  approved?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'seller' | 'buyer';
  phoneNumber?: string;
  businessName?: string;
  businessDescription?: string;
}

export interface AuthResponse {
  token: string;
  user: EsmUser;
}

class EsmAuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await esmApiClient.post<ApiResponse<AuthResponse>>('/auth/esm-login', data);
      
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
      const response = await esmApiClient.post<ApiResponse<AuthResponse>>('/auth/esm-register', data);
      
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
      await esmApiClient.post('/auth/esm-logout');
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
      const response = await esmApiClient.get<ApiResponse<EsmUser>>('/auth/esm-me');
      
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
      const response = await esmApiClient.put<ApiResponse<EsmUser>>('/auth/esm-profile', data);
      
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