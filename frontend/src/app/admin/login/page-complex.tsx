'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    
    console.log('Login attempt:', { email, password });
    
    if (email === 'admin@beatlenut.com' && password === 'admin123') {
      console.log('Demo login successful');
      localStorage.setItem('admin_token', 'demo_token_123');
      localStorage.setItem('admin_user', JSON.stringify({
        id: 'admin_1',
        email: 'admin@beatlenut.com',
        name: 'Admin User',
        role: 'admin'
      }));
      router.push('/admin/dashboard');
    } else {
      alert('Invalid credentials. Use: admin@beatlenut.com / admin123');
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                defaultValue="admin@beatlenut.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                defaultValue="admin123"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
          
          <div className="text-sm text-center">
            <span className="text-gray-600">Demo Access:</span>
            <div className="mt-1 text-gray-500">
              Email: admin@beatlenut.com<br />
              Password: admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;