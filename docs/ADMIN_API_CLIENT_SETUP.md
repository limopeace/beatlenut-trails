# Admin API Client Setup Summary

This document summarizes the setup of the admin API client structure for the Beatlenuts-GR project.

## Overview

We have created a dedicated API client structure for admin operations, following the patterns outlined in the Admin Frontend Integration Plan.

## Changes Made

### 1. Created Admin-Specific API Client

**File:** `frontend/src/services/api/adminApiClient.ts`

- Created a dedicated API client for admin operations
- Includes request interceptors for JWT token management (using `admin_token` cookie)
- Includes response interceptors for error handling (401, 403, network errors)
- Provides helper functions for query string building and error message extraction
- Defines TypeScript interfaces for API responses

### 2. Created Dashboard Service

**File:** `frontend/src/services/api/dashboardService.ts`

- Implements all dashboard-related API calls
- Includes methods for:
  - Getting dashboard statistics
  - Getting seller statistics
  - Getting approval statistics
  - Getting content statistics
  - Getting revenue statistics
  - Getting recent activity
  - Getting monthly trends
  - Getting category statistics

### 3. Updated Existing Services

All admin-related services have been updated to use the new `adminApiClient`:

- `frontend/src/services/api/approvalsService.ts`
- `frontend/src/services/api/sellersService.ts`
- `frontend/src/services/api/authService.ts`

### 4. Updated Service Exports

**File:** `frontend/src/services/api/index.ts`

- Added exports for `adminApiClient` and `DashboardService`
- Updated the services object to include the new additions

## Service Architecture

The API client architecture now includes:

1. **Base API Clients:**
   - `apiClient` - General API client (from original apiClient.ts)
   - `adminApiClient` - Admin-specific API client
   - `esmApiClient` - ESM portal-specific API client

2. **Admin Services:**
   - `AuthService` - Admin authentication
   - `ApprovalsService` - Approval management
   - `SellersService` - Seller management
   - `DashboardService` - Dashboard statistics

3. **ESM Services:**
   - `EsmAuthService` - ESM authentication
   - `EsmProductService` - ESM product management
   - `EsmServiceService` - ESM service management

## Usage Example

```typescript
import { ApprovalsService, DashboardService } from '@/services/api';

// Get pending approvals
const pendingApprovals = await ApprovalsService.getPendingApprovals({}, 1, 10);

// Get dashboard statistics
const stats = await DashboardService.getDashboardStats();

// Approve a request
const result = await ApprovalsService.approveRequest(approvalId, 'Approved by admin');
```

## Next Steps

1. Update admin components to use these new services instead of mock data
2. Implement the `useAdminAuth` hook for authentication state management
3. Create the `AdminAuthContext` for sharing authentication state
4. Update admin pages to integrate with the API services
5. Add proper error handling and loading states

## Error Handling

The admin API client includes comprehensive error handling:

- **401 Unauthorized:** Clears auth tokens and redirects to login
- **403 Forbidden:** Logs insufficient permissions
- **Network Errors:** Logs network connectivity issues
- **Timeout Errors:** Logs timeout messages

All errors are logged in development mode for debugging purposes.

## Security Considerations

- JWT tokens are stored in secure cookies (`admin_token`)
- Tokens are automatically included in all requests via interceptors
- Tokens are cleared on 401 responses
- Redirects are handled to prevent unauthorized access

## Testing

When testing the admin API integration:

1. Ensure the backend server is running on the configured port
2. Check that JWT tokens are properly generated and stored
3. Verify that API endpoints match backend routes
4. Test error scenarios (unauthorized, network errors, etc.)
5. Confirm that interceptors are working correctly

This setup provides a robust foundation for integrating the admin frontend with the backend API endpoints.