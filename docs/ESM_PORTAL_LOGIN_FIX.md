# ESM Portal Login & Admin Access Issues

This document outlines the current issues with the ESM Portal login, registration, and admin panel access, along with the recommended fixes.

## Current Issues

1. **Missing Login Page**: 
   - While a `RegistrationForm.tsx` component exists, there's no dedicated login page under `/esm-portal/login`.
   - The `LoginForm.tsx` component exists but isn't connected to any route.

2. **Registration Form Not Connected to Backend**:
   - The registration form at `/esm-portal/register/page.tsx` doesn't use the `RegistrationForm.tsx` component.
   - Instead, it contains a static form without actual functionality.

3. **Admin Panel Authentication**:
   - The admin panel uses a simple localStorage-based authentication system.
   - Hardcoded credentials are used (admin@beatlenuttrails.com / admin123).
   - There's no proper connection to the backend authentication system.

4. **Missing API Routes**:
   - The authentication forms are trying to connect to API endpoints that may not be properly set up:
     - `/api/esm/sellers/login`
     - `/api/esm/sellers/register`

## Recommended Fixes

### 1. Create ESM Portal Login Page

Create a login page at `/frontend/src/app/esm-portal/login/page.tsx`:

```tsx
import React from 'react';
import LoginForm from '@/components/marketplace/auth/LoginForm';

export default function ESMLoginPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Seller Login
            </h1>
            <p className="text-xl mb-0">
              Access your ESM marketplace account
            </p>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <LoginForm 
              onSuccess={(token, user) => {
                // Any additional logic needed after successful login
                console.log('Login successful', user);
              }} 
            />
            
            {/* Additional Information */}
            <div className="mt-8 bg-light-grey rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">New to our Marketplace?</h3>
              <p className="text-gray-700 mb-4">
                If you're an Ex-Serviceman looking to sell your products or services, join our growing community of veteran entrepreneurs.
              </p>
              <a 
                href="/esm-portal/register" 
                className="inline-block bg-deep-forest-green text-white py-2 px-4 rounded hover:bg-opacity-90 transition-all"
              >
                Register as a Seller
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### 2. Update ESM Registration Page

Replace the content of `/frontend/src/app/esm-portal/register/page.tsx` to use the `RegistrationForm` component:

```tsx
import React from 'react';
import RegistrationForm from '@/components/marketplace/auth/RegistrationForm';

export default function ESMRegistrationPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 mt-12 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ex-Servicemen Registration
            </h1>
            <p className="text-xl mb-0">
              Join our growing community of veteran entrepreneurs and service providers
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

### 3. Create Registration Success Page

Create a success page that the registration form redirects to:

```tsx
// frontend/src/app/esm-portal/register/success/page.tsx
import React from 'react';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Registration Successful
            </h1>
            <p className="text-xl mb-0">
              Thank you for registering with Beatlenut Trails ESM Marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Complete!</h2>
              
              <p className="text-gray-600 mb-8">
                Your application has been submitted successfully and is now under review. We'll verify your ex-servicemen 
                status and contact you via email within 1-2 business days. Once verified, you'll be able to start 
                listing your products and services on our marketplace.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/esm-portal" className="bg-deep-forest-green text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-all">
                  Return to ESM Portal
                </Link>
                <Link href="/" className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-all">
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### 4. Create Dashboard Page for Logged In Sellers

```tsx
// frontend/src/app/esm-portal/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faShoppingCart, 
  faCog, 
  faChartLine, 
  faPlus,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sellerData, setSellerData] = useState<any>(null);
  
  useEffect(() => {
    // Check if seller is logged in
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!token || !user) {
      // Redirect to login if not authenticated
      router.push('/esm-portal/login');
      return;
    }
    
    // For demo purposes, use the stored user data
    // In a real app, you would fetch the latest data from the API
    try {
      setSellerData(JSON.parse(user));
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // If there's an error, logout and redirect
      handleLogout();
    }
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    router.push('/esm-portal/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deep-forest-green"></div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Seller Dashboard
              </h1>
              <p className="text-pale-straw mb-0">
                Welcome back, {sellerData?.fullName || 'Seller'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleLogout}
                className="flex items-center bg-transparent border border-pale-straw text-pale-straw px-4 py-2 rounded hover:bg-pale-straw/10 transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-10 bg-gray-50">
        <div className="container-custom">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faBox} className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Listings</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faChartLine} className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">₹0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faCog} className="text-amber-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Status</p>
                  <p className="text-md font-bold">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      Pending Verification
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Add New Listing</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Create a new product or service listing to showcase your offerings.
              </p>
              <button className="flex items-center justify-center bg-deep-forest-green text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Listing
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Manage Orders</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                View and manage customer orders and inquiries for your products.
              </p>
              <button className="flex items-center justify-center bg-deep-forest-green text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                View Orders
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Account Settings</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Update your profile information, business details, and preferences.
              </p>
              <button className="flex items-center justify-center bg-deep-forest-green text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Settings
              </button>
            </div>
          </div>
          
          {/* Getting Started Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold mb-4">Getting Started Guide</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-deep-forest-green text-white flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">Complete Verification</p>
                  <p className="text-gray-600">
                    Your account is currently pending verification. We'll notify you via email once your account is approved.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">Set Up Your Profile</p>
                  <p className="text-gray-600">
                    Complete your seller profile with detailed information about your business and expertise.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">Create Your First Listing</p>
                  <p className="text-gray-600">
                    Add detailed descriptions, high-quality images, and competitive pricing for your products or services.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium mb-1">Manage Orders and Grow Your Business</p>
                  <p className="text-gray-600">
                    Respond promptly to customer inquiries, fulfill orders efficiently, and build your reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="bg-light-grey p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Our support team is here to assist you with any questions or concerns.
            </p>
            <a 
              href="/esm-portal/support" 
              className="inline-block bg-deep-forest-green text-white py-2 px-4 rounded hover:bg-opacity-90 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
```

### 5. Connection to Backend

For the login and registration functionality to work properly, the backend API endpoints need to be implemented. Here's what needs to be done:

1. Ensure the following API routes are properly set up:
   - POST `/api/esm/sellers/register` - For seller registration
   - POST `/api/esm/sellers/login` - For seller login

2. Implement proper authentication middleware to protect routes that require authentication.

3. Create the following additional API routes for the seller dashboard:
   - GET `/api/esm/sellers/profile` - Get the current seller's profile
   - GET `/api/esm/products/seller` - Get products for the current seller
   - POST `/api/esm/products` - Create a new product listing

### 6. Admin Panel Authentication

To properly connect the admin panel to the backend authentication system:

1. Replace hardcoded credentials with an actual API call to the backend:

```javascript
// In AdminLoginPage:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // Validation
  if (!email || !password) {
    setError('Please enter both email and password');
    setLoading(false);
    return;
  }

  try {
    // Call API endpoint
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    localStorage.setItem('adminAuthenticated', 'true');
    
    // Redirect to admin dashboard
    router.push('/admin');
  } catch (err: any) {
    setError(err.message || 'An error occurred during login. Please try again.');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
  }
};
```

2. Update the AdminLayout component to check authentication with the backend:

```javascript
useEffect(() => {
  // Check if user is authenticated with backend
  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }
    
    try {
      // Verify token with the backend
      const response = await fetch('/api/admin/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      setAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAuthenticated');
      
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      
      setAuthenticated(false);
    }
  };
  
  checkAuth();
}, [pathname, router]);
```

## Implementation Timeline

1. **Phase 1**: Create missing login page and connect the registration page to the RegistrationForm component.
2. **Phase 2**: Create the success page and dashboard page for logged-in sellers.
3. **Phase 3**: Implement the backend API endpoints for authentication and data retrieval.
4. **Phase 4**: Update the admin panel authentication to connect to the backend.

## Conclusion

The current issues with the ESM portal and admin panel are primarily related to missing pages and incomplete integration with the backend. By implementing the suggested solutions, users will be able to register, log in, and access the appropriate dashboard based on their role.