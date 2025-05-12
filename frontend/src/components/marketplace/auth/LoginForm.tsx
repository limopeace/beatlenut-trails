'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSuccess?: (token: string, user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Call API endpoint
      const response = await fetch('/api/esm/sellers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user info in localStorage or cookies
      if (formData.rememberMe) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('auth_token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.token, data.user);
      }
      
      // Navigate to dashboard
      router.push('/esm-portal/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-deep-forest-green mb-6">Seller Login</h2>
      
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-dark-grey font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your email address"
          />
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="block text-dark-grey font-medium">
              Password
            </label>
            <Link href="/esm-portal/forgot-password" className="text-sm text-sunrise-orange hover:underline">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your password"
          />
          {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
        </div>
        
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-sunrise-orange border-gray-300 rounded focus:ring-sunrise-orange"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-dark-grey">
            Remember me
          </label>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full py-3"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-dark-grey">
          Don't have an account?{' '}
          <Link href="/esm-portal/register" className="text-sunrise-orange hover:underline font-medium">
            Register as a Seller
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;