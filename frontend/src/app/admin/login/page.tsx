'use client';

import React from 'react';

const SimpleAdminLogin = () => {
  const handleLogin = () => {
    localStorage.setItem('admin_token', 'demo_token_123');
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login - Simple Test
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              id="email"
              type="email" 
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email"
              defaultValue="admin@beatlenut.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              id="password"
              type="password" 
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              defaultValue="admin123"
            />
          </div>
          <div>
            <button 
              type="button"
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign in (Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;