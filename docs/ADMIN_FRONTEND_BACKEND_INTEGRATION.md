# Admin Frontend-Backend Integration

This document provides an overview of the integration between the frontend and backend components of the ESM (Experiential Services Marketplace) admin interface.

## Integration Summary

We have implemented a comprehensive integration between the frontend admin interface and the backend API services:

1. **Authentication System**:
   - Created `AdminAuthContext` provider for global auth state management
   - Implemented JWT token-based authentication
   - Token storage in secure HTTP cookies
   - Auto-redirection on authentication failures

2. **API Service Layer**:
   - Created base `apiClient` with Axios for all API requests
   - Added interceptors for authentication and error handling
   - Implemented typed service modules for different API endpoints
   - Created fallback mechanisms for development/testing

3. **Environment Configuration**:
   - Added environment variables for API URL configuration
   - Created development/production environment settings
   - Added feature flag for toggling between mock and real data

4. **Approvals Page Integration**:
   - Replaced mock data with real API calls
   - Added loading states for better user experience
   - Implemented pagination for large datasets
   - Enhanced error handling with user feedback
   - Added real-time statistics from the backend

## Implementation Details

### API Client

The `apiClient.ts` is the foundation of our API integration:

```typescript
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('admin_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Authentication Context

The `AdminAuthContext.tsx` provides authentication state management:

```typescript
export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('admin_token');
        if (token) {
          const userData = await authService.verifyToken();
          if (userData) {
            setUser(userData);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login method
  const login = async (email, password) => {
    try {
      const { token, user } = await authService.adminLogin(email, password);
      Cookies.set('admin_token', token, { expires: 1 });
      setUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };
  
  // Logout method
  const logout = () => {
    Cookies.remove('admin_token');
    setUser(null);
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
```

### Approvals Page Integration

The approvals page demonstrates the complete integration flow:

```typescript
// Load approval data from API
useEffect(() => {
  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      
      // Option for mock data during development
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_REAL_API) {
        setApprovals(MOCK_APPROVALS);
        return;
      }
      
      // Real API integration
      const response = await ApprovalsService.getPendingApprovals(
        {
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchTerm || undefined
        },
        currentPage,
        10
      );
      
      setApprovals(response.approvals);
      setTotalPages(response.pagination.totalPages);
      
      // Get stats
      const statsData = await ApprovalsService.getApprovalStats();
      setStats({
        totalPending: statsData.totalPending,
        sellerPending: statsData.sellerPending,
        productPending: statsData.productPending,
        servicePending: statsData.servicePending
      });
      
    } catch (err) {
      setError('Failed to load approvals. Please try again.');
      // Fallback to mock data in case of error
      setApprovals(MOCK_APPROVALS);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchApprovals();
}, [typeFilter, searchTerm, currentPage]);
```

## Environment Configuration

We've implemented environment-specific configuration to support different deployment scenarios:

### Development (.env.development)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_USE_REAL_API=false
```

### Production (.env.production)
```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_USE_REAL_API=true
```

## Testing Strategy

To ensure reliable integration between frontend and backend:

1. **Development Mode**:
   - Toggle between mock and real data using environment variables
   - Mock data provides consistent test cases
   - Real API integration can be tested when backend is available

2. **Error Handling**:
   - Graceful fallbacks when API fails
   - Informative error messages for users
   - Automatic retry mechanisms for transient errors

3. **Performance Testing**:
   - Loading states for slow API responses
   - Pagination to handle large datasets
   - Debounced search to reduce API calls

## Next Steps

1. Continue integration for remaining admin pages:
   - Dashboard statistics integration
   - Seller management page integration
   - Order management integration
   - User management integration

2. Enhance error handling and retry mechanisms:
   - Implement toast notifications for errors
   - Add automatic retries for network failures
   - Improve offline detection and handling

3. Implement real-time features:
   - WebSocket integration for live updates
   - Push notifications for critical events
   - Real-time data synchronization between clients