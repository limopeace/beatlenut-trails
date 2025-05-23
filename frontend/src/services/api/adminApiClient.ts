import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

/**
 * Admin API client configuration
 * Creates an axios instance specifically for admin panel operations
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create admin-specific API client
export const adminApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Admin request interceptor for adding JWT token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Admin API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => {
    // Log successful response for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Admin API] Response from ${response.config.url}:`, response.data);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      // Clear admin authentication data
      Cookies.remove('admin_token');
      Cookies.remove('admin_name');
      Cookies.remove('admin_role');
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (error.response && error.response.status === 403) {
      console.error('[Admin API] Insufficient permissions for this action');
      // You could show a toast notification here
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('[Admin API] Network error - please check your connection');
      // You could show a toast notification here
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('[Admin API] Request timeout - please try again');
      // You could show a toast notification here
    }
    
    // Log error for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Admin API] Error from ${error.config?.url}:`, error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Error response type
export interface AdminApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

// Generic API response type
export interface AdminApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination response type
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Helper function for building query strings
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  return queryParams.toString();
};

// Helper function for extracting error messages
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : 'An error occurred';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export default adminApiClient;