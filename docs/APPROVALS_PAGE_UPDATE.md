# Approvals Page API Integration Update

This document describes the changes made to connect the Admin Approvals page with the backend API.

## Overview

The Approvals page has been updated to use real API calls instead of mock data, providing full integration with the backend approval system.

## Key Changes

### 1. Removed Mock Data
- Removed the hardcoded `MOCK_APPROVALS` array
- Replaced with dynamic data fetching from the backend API

### 2. API Integration
- Imported `ApprovalsService` from `/services/api/approvalsService`
- Used proper TypeScript types from the service (`Approval` interface)

### 3. Data Fetching
- Implemented proper API calls in `useEffect` hooks
- Added proper loading states and error handling
- Fetches both approval list and statistics

### 4. Data Structure Mapping
Updated component to handle API response structure:
- `details` → `itemDetails`
- `details.name || details.sellerName` → `approval.requesterName`
- `details.businessName` → `approval.requesterBusinessName || details.businessName`
- `details.profileImg` → `details.profileImg || approval.requesterProfileImage`

### 5. Action Handlers
- `handleApprove`: Now calls `ApprovalsService.approveRequest()`
- `handleReject`: Now calls `ApprovalsService.rejectRequest()` with a reason
- Both handlers properly update local state and refresh statistics

### 6. Search Optimization
- Added search term debouncing (500ms delay) to reduce API calls
- Prevents excessive requests while user is typing

### 7. UI Updates
- Properly displays API data in both mobile and desktop views
- Shows real-time statistics from the backend
- Handles pagination correctly with API responses

## API Endpoints Used

1. `GET /api/approvals` - Fetches pending approvals with filters
2. `POST /api/approvals/:id/approve` - Approves a request
3. `POST /api/approvals/:id/reject` - Rejects a request with reason
4. `GET /api/approvals/stats` - Gets approval statistics

## Error Handling

- Displays user-friendly error messages when API calls fail
- Maintains loading states during API operations
- Gracefully handles empty results

## Filter Support

- Type filter: Supports filtering by approval type
- Search: Supports searching by name or business
- Both filters work together with proper debouncing

## Next Steps

1. Add a proper modal for rejection reasons instead of `prompt()`
2. Implement batch approval operations
3. Add toast notifications for successful actions
4. Consider adding real-time updates using WebSockets