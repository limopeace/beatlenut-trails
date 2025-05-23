# Admin Frontend Integration Plan

This document outlines the plan for integrating the existing admin frontend with the newly implemented backend API endpoints.

## Overview

The admin frontend currently uses mock data for various functionalities, including seller management, approvals processing, and content management. We need to replace these mock data sources with actual API calls to the backend endpoints we've implemented.

## Integration Components

### 1. Authentication Integration

#### Current State:
- Admin login page uses hardcoded credentials
- No JWT token management
- No session persistence

#### Implementation Plan:
1. **Create Admin Authentication Hook**
   - Create `useAdminAuth.ts` hook to manage admin authentication state
   - Implement login, logout, and token refresh functionality
   - Store JWT token in secure cookies or localStorage

2. **Update Login Page**
   - Replace hardcoded login with API call to `/api/auth/login`
   - Add error handling for invalid credentials
   - Implement redirect to dashboard on successful login

3. **Create Auth Provider**
   - Implement `AdminAuthProvider` component
   - Add context to share authentication state
   - Create protected route wrapper for admin pages

### 2. Approvals Management Integration

#### Current State:
- Uses `MOCK_APPROVALS` array for data
- Local state management for approval actions
- No persistence of approval decisions

#### Implementation Plan:
1. **Create Approvals API Service**
   - Create `approvalsService.ts` with methods:
     - `getApprovals(filters, page, limit)`
     - `getApprovalById(id)`
     - `approveRequest(id, notes)`
     - `rejectRequest(id, reason, notes)`
     - `processBatchApprovals(approvals)`
     - `getApprovalStats()`

2. **Update Approvals Page**
   - Replace `useState(MOCK_APPROVALS)` with `useEffect` to fetch from API
   - Update approval and rejection handlers to call API
   - Implement proper loading states
   - Add error handling for API failures

3. **Implement Batch Processing**
   - Add batch selection UI for multiple approvals
   - Create batch submission workflow
   - Show batch results summary

### 3. Seller Management Integration

#### Current State:
- Uses `MOCK_SELLERS` array for data
- Local state management for seller actions
- No real verification workflow

#### Implementation Plan:
1. **Create Seller Management API Service**
   - Create `sellerService.ts` with methods:
     - `getSellers(filters, page, limit)`
     - `getSellerById(id)`
     - `updateSellerVerification(id, data)`
     - `getSellerStats()`

2. **Update Sellers List Page**
   - Replace mock data with API fetching
   - Add pagination with API integration
   - Implement filtering with API parameters

3. **Update Seller Detail Page**
   - Fetch seller data from API
   - Connect document verification UI to API
   - Update approval/rejection buttons to use API

### 4. Dashboard Statistics Integration

#### Current State:
- Static numbers for statistics
- No real-time data
- No filtering options

#### Implementation Plan:
1. **Create Dashboard API Service**
   - Create `dashboardService.ts` with methods:
     - `getDashboardStats()`
     - `getSellerStats()`
     - `getApprovalStats()`
     - `getContentStats()`

2. **Update Dashboard Page**
   - Replace static numbers with API data
   - Add loading states for statistics
   - Implement refresh functionality
   - Add date range filtering

### 5. Shared Components

#### Implementation Plan:
1. **API Client**
   - Create base API client with Axios
   - Add request/response interceptors
   - Implement token management
   - Add error handling

2. **Loading Component**
   - Create consistent loading UI
   - Implement skeleton loaders for content
   - Add loading indicators for actions

3. **Error Handling**
   - Create error boundary components
   - Implement toast notifications for errors
   - Add retry functionality for failed requests

## Implementation Approach

### Phase 1: Foundation

1. **API Client Setup**
   - Create base API configuration
   - Implement authorization header management
   - Add environment-based URL configuration

2. **Authentication**
   - Implement login flow with JWT
   - Create protected routes
   - Add session persistence

### Phase 2: Core Features

1. **Approvals Integration**
   - Connect approvals listing
   - Implement approval/rejection actions
   - Add filtering and pagination

2. **Seller Management**
   - Connect seller listing
   - Implement seller detail view
   - Add verification workflow

### Phase 3: Advanced Features

1. **Batch Operations**
   - Implement batch approval selection
   - Add batch processing UI
   - Create results summary

2. **Dashboard**
   - Connect statistics components
   - Add charts and visualizations
   - Implement date filtering

## File Structure

```
frontend/
└── src/
    ├── services/
    │   ├── api/
    │   │   ├── apiClient.ts
    │   │   ├── authService.ts
    │   │   ├── approvalsService.ts
    │   │   ├── sellersService.ts
    │   │   └── dashboardService.ts
    │   └── index.ts
    ├── hooks/
    │   ├── useAdminAuth.ts
    │   ├── usePagination.ts
    │   ├── useApprovals.ts
    │   └── useSellers.ts
    ├── context/
    │   └── AdminAuthContext.tsx
    ├── components/
    │   ├── admin/
    │   │   ├── ApprovalsList.tsx
    │   │   ├── SellersList.tsx
    │   │   ├── DashboardStats.tsx
    │   │   └── common/
    │   │       ├── LoadingState.tsx
    │   │       ├── ErrorState.tsx
    │   │       └── AdminProtectedRoute.tsx
    └── app/
        └── admin/
            ├── layout.tsx (add auth protection)
            ├── approvals/
            ├── sellers/
            └── dashboard/
```

## API Endpoints to Use

### Authentication
- `POST /api/auth/login`

### Approvals
- `GET /api/approvals?status=pending&type=seller_registration&page=1&limit=10`
- `GET /api/approvals/:id`
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`
- `PATCH /api/approvals/:id/document/:documentId`
- `POST /api/admin/approvals/batch`
- `GET /api/approvals/stats`

### Sellers
- `GET /api/admin/sellers?status=pending&page=1&limit=10`
- `GET /api/esm/sellers/:id`
- `PUT /api/admin/sellers/:id/verification`

### Dashboard
- `GET /api/admin/dashboard`

## Implementation Details

### API Client Configuration

```typescript
// apiClient.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
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
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Authentication Hook

```typescript
// useAdminAuth.ts
import { useState, useEffect } from 'react';
import apiClient from '../services/api/apiClient';

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists and verify it
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await apiClient.get('/auth/verify');
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('adminToken');
      setError(err);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('adminToken', token);
      setUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return { user, loading, error, login, logout, isAuthenticated: !!user };
};
```

### Approvals Service

```typescript
// approvalsService.ts
import apiClient from './apiClient';

export const getApprovals = async (filters = {}, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const response = await apiClient.get(`/approvals?${queryParams.toString()}`);
  return response.data;
};

export const getApprovalById = async (id) => {
  const response = await apiClient.get(`/approvals/${id}`);
  return response.data.approval;
};

export const approveRequest = async (id, notes = '') => {
  const response = await apiClient.post(`/approvals/${id}/approve`, { notes });
  return response.data;
};

export const rejectRequest = async (id, reason, notes = '') => {
  const response = await apiClient.post(`/approvals/${id}/reject`, { reason, notes });
  return response.data;
};

export const processBatchApprovals = async (approvals) => {
  const response = await apiClient.post('/admin/approvals/batch', { approvals });
  return response.data;
};

export const getApprovalStats = async () => {
  const response = await apiClient.get('/approvals/stats');
  return response.data.stats;
};
```

## Testing Strategy

1. **Unit Testing**
   - Test API services in isolation with mocked responses
   - Verify proper parameter handling
   - Test error handling

2. **Integration Testing**
   - Test authentication flow
   - Verify API client configuration
   - Test interceptors

3. **End-to-End Testing**
   - Test full approval workflow
   - Verify seller verification process
   - Test batch operations

## Conclusion

This integration plan provides a structured approach to connecting the admin frontend with the backend API. By following this plan, we'll replace all mock data with real API calls, ensuring that the admin interface is fully functional and properly connected to the backend services.

The implementation will be done in phases, starting with the foundational authentication system, followed by core features like approvals and seller management, and finally advanced features like batch operations and dashboard statistics.

Once completed, the admin interface will provide a robust tool for managing the ESM Marketplace, with full approval workflows, seller verification capabilities, and comprehensive statistics.