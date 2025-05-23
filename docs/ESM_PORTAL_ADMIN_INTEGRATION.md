# ESM Portal and Admin Panel Integration Guide

## Overview

This document details the complete integration between the ESM (Ex-Servicemen) Portal and the Admin Panel, ensuring seamless management and oversight of the marketplace.

## Architecture

```
┌─────────────────────┐
│   Admin Panel       │
│  /admin/*           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│   Admin API         │────▶│   ESM Portal API    │
│  /api/admin/*       │     │  /api/esm-*         │
└─────────────────────┘     └─────────────────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
               ┌─────────────────────┐
               │    MongoDB          │
               │   Database          │
               └─────────────────────┘
```

## Admin Panel Features for ESM Management

### 1. Seller Management (`/admin/sellers`)

**Features:**
- View all registered ESM sellers
- Approve/reject seller applications
- Monitor seller activity
- Suspend/activate seller accounts
- View seller analytics

**Implementation:**
```typescript
// frontend/src/app/admin/sellers/page.tsx
- List view with filters (approved, pending, rejected)
- Quick actions (approve, reject, suspend)
- Detailed seller profile view
- Sales analytics per seller
```

### 2. Approval Workflow (`/admin/approvals`)

**Features:**
- Review pending seller registrations
- Verify ex-servicemen documentation
- Approve/reject products and services
- Bulk approval actions

**Implementation:**
```typescript
// frontend/src/app/admin/approvals/page.tsx
- Tabbed interface (Sellers, Products, Services)
- Document viewer for verification
- Approval history tracking
- Email notifications on status change
```

### 3. Messaging System (`/admin/messages`)

**Features:**
- Monitor buyer-seller communications
- Resolve disputes
- Send system notifications
- Message analytics

**Implementation:**
```typescript
// frontend/src/app/admin/messages/page.tsx
- Conversation list with filters
- Message thread viewer
- Quick response templates
- Flagged message alerts
```

### 4. Analytics Dashboard (`/admin/dashboard`)

**Features:**
- ESM Portal statistics
- Sales metrics
- User engagement data
- Performance reports

**Implementation:**
```typescript
// frontend/src/app/admin/dashboard/page.tsx
- Real-time metrics
- Chart visualizations
- Export functionality
- Custom date ranges
```

## API Integration Points

### Admin-Specific Endpoints

```javascript
// Backend routes for admin ESM management
router.get('/api/admin/esm/sellers', authenticateAdmin, getEsmSellers);
router.put('/api/admin/esm/sellers/:id/approve', authenticateAdmin, approveEsmSeller);
router.put('/api/admin/esm/sellers/:id/suspend', authenticateAdmin, suspendEsmSeller);
router.get('/api/admin/esm/products', authenticateAdmin, getEsmProducts);
router.put('/api/admin/esm/products/:id/approve', authenticateAdmin, approveEsmProduct);
router.get('/api/admin/esm/analytics', authenticateAdmin, getEsmAnalytics);
```

### Middleware Implementation

```javascript
// src/middleware/adminAuth.js
const authenticateAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }
    next();
  } catch (error) {
    next(error);
  }
};
```

## Data Models

### Enhanced User Model for ESM Integration

```javascript
// src/models/mongoose/userModel.js
const UserSchema = new mongoose.Schema({
  // ... existing fields
  esmProfile: {
    verified: { type: Boolean, default: false },
    verificationDocuments: [{
      type: String,
      url: String,
      uploadedAt: Date
    }],
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rejectionReason: String,
    suspendedAt: Date,
    suspensionReason: String
  }
});
```

### Approval Model

```javascript
// src/models/mongoose/approvalModel.js
const ApprovalSchema = new mongoose.Schema({
  type: { type: String, enum: ['seller', 'product', 'service'] },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'] },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  comments: String,
  documents: [String]
});
```

## Frontend Components

### Admin ESM Header

```typescript
// frontend/src/components/admin/ESMAdminHeader.tsx
export function ESMAdminHeader() {
  return (
    <div className="bg-white shadow-md p-4">
      <h1 className="text-2xl font-bold">ESM Portal Administration</h1>
      <div className="flex gap-4 mt-4">
        <Link href="/admin/esm/sellers">Sellers</Link>
        <Link href="/admin/esm/approvals">Approvals</Link>
        <Link href="/admin/esm/products">Products</Link>
        <Link href="/admin/esm/analytics">Analytics</Link>
      </div>
    </div>
  );
}
```

### Approval Card Component

```typescript
// frontend/src/components/admin/ApprovalCard.tsx
export function ApprovalCard({ item, type, onApprove, onReject }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{item.name}</h3>
      <p className="text-gray-600">{item.description}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onApprove(item.id)} 
                className="bg-green-500 text-white px-4 py-2 rounded">
          Approve
        </button>
        <button onClick={() => onReject(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded">
          Reject
        </button>
      </div>
    </div>
  );
}
```

## Workflow Processes

### Seller Registration Approval

1. **Registration Submission**
   - Seller completes registration form
   - Uploads verification documents
   - Submits for approval

2. **Admin Review**
   - Admin receives notification
   - Reviews seller information
   - Verifies documents
   - Approves or rejects with reason

3. **Post-Approval**
   - Seller receives email notification
   - Access to seller dashboard enabled
   - Can start listing products/services

### Product/Service Approval

1. **Listing Creation**
   - Seller creates product/service listing
   - Uploads images and details
   - Submits for approval

2. **Admin Review**
   - Admin reviews listing content
   - Checks for compliance
   - Approves or requests changes

3. **Publishing**
   - Approved listings go live
   - Visible to buyers immediately
   - Analytics tracking begins

## Security Considerations

### Role-Based Access Control

```javascript
// Middleware for ESM admin access
const esmAdminAccess = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
```

### Audit Trail

```javascript
// Log all admin actions
const auditLog = async (action, adminId, targetId, details) => {
  await AuditLog.create({
    action,
    adminId,
    targetId,
    details,
    timestamp: new Date()
  });
};
```

## Testing and Monitoring

### Test Scenarios

1. **Seller Approval Flow**
   - Test registration submission
   - Test document upload
   - Test approval/rejection
   - Test email notifications

2. **Product Management**
   - Test product creation
   - Test approval workflow
   - Test listing visibility
   - Test analytics tracking

### Monitoring Dashboard

```typescript
// Admin monitoring metrics
- Active sellers count
- Pending approvals
- Daily transactions
- Revenue statistics
- System health status
```

## Deployment Considerations

### Environment Variables

```env
# Admin specific configurations
ADMIN_EMAIL_NOTIFICATIONS=true
APPROVAL_NOTIFICATION_EMAIL=admin@beatlenuts.com
ESM_APPROVAL_TIMEOUT_DAYS=7
```

### Database Indexes

```javascript
// Optimize for admin queries
approvalSchema.index({ status: 1, type: 1, createdAt: -1 });
userSchema.index({ 'esmProfile.verified': 1, role: 1 });
```

## Conclusion

The ESM Portal and Admin Panel integration provides comprehensive management capabilities for the Ex-Servicemen marketplace. With proper role-based access, approval workflows, and monitoring tools, administrators can effectively oversee the platform while maintaining security and quality standards.