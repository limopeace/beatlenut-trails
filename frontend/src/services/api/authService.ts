import { adminApiClient } from './adminApiClient';

/**
 * AuthService provides authentication-related API functions
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  user: AdminUser;
  token: string;
  message: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface VerifyResponse {
  valid: boolean;
  user?: AdminUser;
}

/**
 * Admin login with email and password
 * 
 * IMPORTANT: This function connects to the real backend API at /api/auth/login
 * 
 * Backend API Details:
 * - Endpoint: POST /api/auth/login
 * - Expects: { email: string, password: string }
 * - Returns: { success: boolean, data: { user, token }, message }
 * 
 * Authentication Flow:
 * 1. Validates credentials against database
 * 2. Generates JWT token for authenticated user
 * 3. Returns user data and token for frontend storage
 * 
 * Default Admin Credentials:
 * - Email: admin@beatlenut.com
 * - Password: admin123
 * - These are created by src/scripts/createDefaultAdmin.js
 * 
 * Error Handling:
 * - 401: Invalid credentials
 * - 500: Server error
 * - Network errors are caught and re-thrown with user-friendly messages
 * 
 * @param email Admin email address
 * @param password Admin password
 * @returns Promise<LoginResponse> Login response with user and token
 */
export const adminLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await adminApiClient.post('/auth/login', { email, password });
    
    // Handle the backend response format: { success: true, data: { user, token }, message }
    if (response.data.success && response.data.data) {
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        message: response.data.message
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    const errorStatus = error.response?.status;
    throw { message: errorMessage, status: errorStatus } as AuthError;
  }
};

/**
 * Verify the current token
 * @returns User data if token is valid, null otherwise
 */
export const verifyToken = async (): Promise<AdminUser | null> => {
  try {
    const response = await adminApiClient.get('/auth/admin/verify');
    
    // Handle the backend response format: { success: true, user: {...}, message }
    if (response.data.success && response.data.user) {
      return {
        id: response.data.user.id || response.data.user._id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Logout the current user
 * This is a client-side function as JWT is stateless
 */
export const logout = (): void => {
  // Using cookies for the admin portal, not localStorage
  // The cleanup is handled by the interceptor
  
  // If you have a server-side logout endpoint (e.g., for token blacklisting),
  // you could call it here:
  // await adminApiClient.post('/auth/logout');
};

export const AuthService = {
  adminLogin,
  verifyToken,
  logout
};

export default AuthService;