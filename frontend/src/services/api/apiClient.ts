import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

/**
 * Base API client configuration
 * Creates axios instances with common configuration for all API requests
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Admin portal API client
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ESM portal API client
export const esmApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Admin portal request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin portal response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('admin_token');
      Cookies.remove('admin_name');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    if (error.response && error.response.status === 403) {
      console.error('Insufficient permissions for this action');
    }
    
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// ESM portal request interceptor
esmApiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('esm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ESM portal response interceptor
esmApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('esm_token');
      Cookies.remove('esm_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/esm-portal/login')) {
        window.location.href = '/esm-portal/login';
      }
    }
    
    if (error.response && error.response.status === 403) {
      const user = Cookies.get('esm_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.role === 'buyer' && error.config?.url?.includes('/seller')) {
            window.location.href = '/esm-portal/buyer-profile';
          } else if (userData.role === 'seller' && error.config?.url?.includes('/buyer')) {
            window.location.href = '/esm-portal/seller-profile';
          }
        } catch (e) {
          console.error('Error parsing user data');
        }
      }
    }
    
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// Error response type
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export default apiClient;