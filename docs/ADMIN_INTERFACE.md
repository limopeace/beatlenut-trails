# Admin Interface Documentation

This document provides an overview of the ESM (Experiential Services Marketplace) admin interface, designed to manage marketplace operations, including seller approvals, conversation monitoring, and content moderation.

## Overview

The admin interface follows a responsive design approach, ensuring full functionality across desktop, tablet, and mobile devices. Key features include:

- Seller management and approval workflows
- Conversation monitoring between buyers and sellers
- Approval management for various marketplace entities
- Account and notification settings

## Key Components

### 1. Dashboard

The main admin dashboard (`/admin/page.tsx`) provides an overview of:

- Content management sections
- Booking and order tracking
- System settings and user management
- Quick access to high-priority items

### 2. Seller Management

Located at `/admin/sellers/page.tsx`, this interface allows administrators to:

- View a list of all marketplace sellers
- Filter sellers by status (approved, pending, rejected)
- Search sellers by name, business name, or location
- Approve or reject pending seller applications
- View detailed information about each seller

Each seller detail page (`/admin/sellers/[id]/page.tsx`) provides:

- Comprehensive seller information
- Document verification workflows
- Service and product listings
- Approval/rejection functionality

### 3. Approvals System

The approvals page (`/admin/approvals/page.tsx`) centralizes all pending marketplace approvals:

- Seller registration approvals
- Product listing approvals
- Document verification requests
- Filtering by approval type and search functionality

### 4. Conversation Monitoring

The messaging interface (`/admin/messages/page.tsx`) enables:

- Monitoring conversations between buyers and sellers
- Flagging problematic conversations
- Directly intervening in conversations when necessary
- Archiving or removing inappropriate content

### 5. Account Management

Admin account settings (`/admin/account/page.tsx`) provide:

- Profile management
- Security settings including password changes
- Notification preferences

## Responsive Design

The admin interface is built with a mobile-first approach, implementing:

- Responsive layouts that adapt to screen size
- Touch-friendly interface elements for mobile users
- Bottom navigation bar (`MobileAdminNav.tsx`) for mobile devices
- Optimized tables that convert to card views on smaller screens
- Contextual back buttons and navigation for mobile sessions

## Authentication

Admin authentication is managed through:

- Login page with secure authentication
- Session management via cookies
- Protection of all admin routes requiring authentication
- Automatic redirection to login page when not authenticated

## Workflow Examples

### Seller Approval Workflow

1. New seller registers through the marketplace
2. Admin receives notification in the approvals dashboard
3. Admin reviews seller information and documents
4. Admin either approves or rejects the application
5. Seller receives notification of decision

### Conversation Monitoring

1. Admin can view all marketplace conversations from the messages interface
2. Conversations can be filtered by status (flagged, active, etc.)
3. Admin can intervene in conversations if necessary
4. Inappropriate content can be flagged or removed

## Technical Implementation

- Built using Next.js App Router architecture
- Responsive design using Tailwind CSS
- State management with React hooks
- Authentication handled via cookies
- Mobile-specific components for optimal user experience

## Future Enhancements

Planned improvements to the admin interface include:

- Enhanced analytics dashboard
- Batch approval workflows for high-volume periods
- Integrated audit logging for admin actions
- Advanced filtering for larger datasets
- Customizable admin permissions by role