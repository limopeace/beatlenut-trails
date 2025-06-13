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
 * @param credentials Login credentials (email, password)
 * @returns Login response with user and token
 */
export const adminLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await adminApiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed';
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
    const response = await adminApiClient.get<{ user: AdminUser }>('/auth/admin/verify');
    return response.data.user;
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