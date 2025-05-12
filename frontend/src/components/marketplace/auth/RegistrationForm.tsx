'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

type FormStep = 'personal' | 'military' | 'business' | 'verification';

interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
  serviceBranch: string;
  rank: string;
  serviceNumber: string;
  serviceYearsFrom: string;
  serviceYearsTo: string;
  businessName: string;
  sellerTypeProducts: boolean;
  sellerTypeServices: boolean;
  category: string;
  description: string;
  agreeTerms: boolean;
}

const initialFormData: RegistrationFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  location: '',
  serviceBranch: '',
  rank: '',
  serviceNumber: '',
  serviceYearsFrom: '',
  serviceYearsTo: '',
  businessName: '',
  sellerTypeProducts: false,
  sellerTypeServices: false,
  category: '',
  description: '',
  agreeTerms: false,
};

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'personal') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      
      if (!formData.location) {
        newErrors.location = 'Location is required';
      }
    }
    
    if (step === 'military') {
      if (!formData.serviceBranch) {
        newErrors.serviceBranch = 'Service branch is required';
      }
      
      if (!formData.rank) {
        newErrors.rank = 'Rank is required';
      }
      
      if (!formData.serviceNumber) {
        newErrors.serviceNumber = 'Service number is required';
      }
      
      if (!formData.serviceYearsFrom) {
        newErrors.serviceYearsFrom = 'Service start year is required';
      }
      
      if (!formData.serviceYearsTo) {
        newErrors.serviceYearsTo = 'Service end year is required';
      } else if (parseInt(formData.serviceYearsTo) <= parseInt(formData.serviceYearsFrom)) {
        newErrors.serviceYearsTo = 'Service end year must be after start year';
      }
    }
    
    if (step === 'business') {
      if (!formData.businessName) {
        newErrors.businessName = 'Business name is required';
      }
      
      if (!formData.sellerTypeProducts && !formData.sellerTypeServices) {
        newErrors.sellerTypeProducts = 'Select at least one offering type';
      }
      
      if (!formData.category) {
        newErrors.category = 'Category is required';
      }
      
      if (!formData.description) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 50) {
        newErrors.description = 'Description should be at least 50 characters';
      }
    }
    
    if (step === 'verification') {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'personal' && validateStep('personal')) {
      setCurrentStep('military');
    } else if (currentStep === 'military' && validateStep('military')) {
      setCurrentStep('business');
    } else if (currentStep === 'business' && validateStep('business')) {
      setCurrentStep('verification');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'military') {
      setCurrentStep('personal');
    } else if (currentStep === 'business') {
      setCurrentStep('military');
    } else if (currentStep === 'verification') {
      setCurrentStep('business');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep('verification')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format data for API
      const apiData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        serviceBranch: formData.serviceBranch,
        rank: formData.rank,
        serviceNumber: formData.serviceNumber,
        serviceYears: {
          from: parseInt(formData.serviceYearsFrom),
          to: parseInt(formData.serviceYearsTo)
        },
        businessName: formData.businessName,
        sellerType: {
          products: formData.sellerTypeProducts,
          services: formData.sellerTypeServices
        },
        category: formData.category,
        description: formData.description
      };
      
      // Call API endpoint
      const response = await fetch('/api/esm/sellers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setIsSuccess(true);
      // Navigate to success page after 2 seconds
      setTimeout(() => {
        router.push('/esm-portal/register/success');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <>
            <h3 className="text-xl font-bold text-deep-forest-green mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-dark-grey font-medium mb-2">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-dark-grey font-medium mb-2">
                  Email Address*
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-dark-grey font-medium mb-2">
                    Password*
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                  />
                  {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-dark-grey font-medium mb-2">
                    Confirm Password*
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-dark-grey font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your contact number"
                />
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-dark-grey font-medium mb-2">
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, State"
                />
                {errors.location && <p className="mt-1 text-red-500 text-sm">{errors.location}</p>}
              </div>
            </div>
          </>
        );
        
      case 'military':
        return (
          <>
            <h3 className="text-xl font-bold text-deep-forest-green mb-4">Military Service Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="serviceBranch" className="block text-dark-grey font-medium mb-2">
                  Service Branch*
                </label>
                <select
                  id="serviceBranch"
                  name="serviceBranch"
                  value={formData.serviceBranch}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.serviceBranch ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Service Branch</option>
                  <option value="army">Army</option>
                  <option value="navy">Navy</option>
                  <option value="airforce">Air Force</option>
                  <option value="coast-guard">Coast Guard</option>
                  <option value="other">Other</option>
                </select>
                {errors.serviceBranch && <p className="mt-1 text-red-500 text-sm">{errors.serviceBranch}</p>}
              </div>
              
              <div>
                <label htmlFor="rank" className="block text-dark-grey font-medium mb-2">
                  Rank*
                </label>
                <input
                  type="text"
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.rank ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your military rank"
                />
                {errors.rank && <p className="mt-1 text-red-500 text-sm">{errors.rank}</p>}
              </div>
              
              <div>
                <label htmlFor="serviceNumber" className="block text-dark-grey font-medium mb-2">
                  Service Number*
                </label>
                <input
                  type="text"
                  id="serviceNumber"
                  name="serviceNumber"
                  value={formData.serviceNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.serviceNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your military service number"
                />
                {errors.serviceNumber && <p className="mt-1 text-red-500 text-sm">{errors.serviceNumber}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="serviceYearsFrom" className="block text-dark-grey font-medium mb-2">
                    Service Start Year*
                  </label>
                  <input
                    type="number"
                    id="serviceYearsFrom"
                    name="serviceYearsFrom"
                    value={formData.serviceYearsFrom}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                      errors.serviceYearsFrom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Year"
                  />
                  {errors.serviceYearsFrom && <p className="mt-1 text-red-500 text-sm">{errors.serviceYearsFrom}</p>}
                </div>
                
                <div>
                  <label htmlFor="serviceYearsTo" className="block text-dark-grey font-medium mb-2">
                    Service End Year*
                  </label>
                  <input
                    type="number"
                    id="serviceYearsTo"
                    name="serviceYearsTo"
                    value={formData.serviceYearsTo}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                      errors.serviceYearsTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Year"
                  />
                  {errors.serviceYearsTo && <p className="mt-1 text-red-500 text-sm">{errors.serviceYearsTo}</p>}
                </div>
              </div>
            </div>
          </>
        );
        
      case 'business':
        return (
          <>
            <h3 className="text-xl font-bold text-deep-forest-green mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-dark-grey font-medium mb-2">
                  Business Name*
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your business name"
                />
                {errors.businessName && <p className="mt-1 text-red-500 text-sm">{errors.businessName}</p>}
              </div>
              
              <div>
                <label className="block text-dark-grey font-medium mb-2">
                  What are you offering?*
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sellerTypeProducts"
                      name="sellerTypeProducts"
                      checked={formData.sellerTypeProducts}
                      onChange={handleChange}
                      className="h-5 w-5 text-sunrise-orange rounded focus:ring-sunrise-orange"
                    />
                    <label htmlFor="sellerTypeProducts" className="ml-2 block text-dark-grey">
                      Products
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sellerTypeServices"
                      name="sellerTypeServices"
                      checked={formData.sellerTypeServices}
                      onChange={handleChange}
                      className="h-5 w-5 text-sunrise-orange rounded focus:ring-sunrise-orange"
                    />
                    <label htmlFor="sellerTypeServices" className="ml-2 block text-dark-grey">
                      Services
                    </label>
                  </div>
                </div>
                {errors.sellerTypeProducts && <p className="mt-1 text-red-500 text-sm">{errors.sellerTypeProducts}</p>}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-dark-grey font-medium mb-2">
                  Main Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="handicrafts">Handicrafts</option>
                  <option value="food-products">Food Products</option>
                  <option value="clothing-textiles">Clothing & Textiles</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="security-services">Security Services</option>
                  <option value="training-consulting">Training & Consulting</option>
                  <option value="logistics">Logistics & Transportation</option>
                  <option value="tour-guide">Tour Guide Services</option>
                  <option value="agriculture">Agricultural Products</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-dark-grey font-medium mb-2">
                  Business Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sunrise-orange ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your business, products, and services (minimum 50 characters)"
                ></textarea>
                {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
              </div>
            </div>
          </>
        );
        
      case 'verification':
        return (
          <>
            <h3 className="text-xl font-bold text-deep-forest-green mb-4">Verification & Submit</h3>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your registration will be reviewed by our team for verification. This process typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-dark-grey mb-2">Document Verification</h4>
              <p className="text-dark-grey mb-4">
                To verify your ex-servicemen status, please upload one of the following documents:
              </p>
              <ul className="list-disc pl-5 mb-4 text-dark-grey">
                <li>Discharge Certificate</li>
                <li>Pension Payment Order (PPO)</li>
                <li>Ex-Servicemen Identity Card</li>
                <li>Any other official document establishing your military service</li>
              </ul>
              
              <button 
                type="button"
                className="bg-gray-100 border border-gray-300 text-dark-grey rounded-lg py-2 px-4 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Verification Document
                <span className="text-red-500 ml-1">*</span>
              </button>
              <p className="text-sm text-gray-600 mt-1">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-sunrise-orange border-gray-300 rounded focus:ring-sunrise-orange"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className={`font-medium ${errors.agreeTerms ? 'text-red-500' : 'text-dark-grey'}`}>
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                  <p className="text-gray-500">
                    By checking this box, you confirm that the information provided is accurate and that you agree to our{' '}
                    <Link href="/terms" className="text-sunrise-orange hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-sunrise-orange hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-red-500 text-sm">{errors.agreeTerms}</p>}
            </div>
            
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {errors.general}
              </div>
            )}
          </>
        );
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-deep-forest-green mb-2">Registration Successful!</h2>
          <p className="text-dark-grey mb-6">
            Your registration has been submitted for verification. We'll notify you via email once your account is approved.
          </p>
          <Link href="/esm-portal" passHref>
            <Button variant="primary">Return to ESM Portal</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-deep-forest-green mb-4">
          ESM Seller Registration
        </h2>
        <div className="flex justify-between">
          <div className={`step flex flex-col items-center ${currentStep === 'personal' ? 'text-sunrise-orange font-semibold' : ''}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep === 'personal' ? 'bg-sunrise-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span>Personal</span>
          </div>
          <div className="step-connector flex-grow border-t-2 border-gray-200 mt-4 mx-2"></div>
          <div className={`step flex flex-col items-center ${currentStep === 'military' ? 'text-sunrise-orange font-semibold' : ''}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep === 'military' ? 'bg-sunrise-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span>Military</span>
          </div>
          <div className="step-connector flex-grow border-t-2 border-gray-200 mt-4 mx-2"></div>
          <div className={`step flex flex-col items-center ${currentStep === 'business' ? 'text-sunrise-orange font-semibold' : ''}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep === 'business' ? 'bg-sunrise-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span>Business</span>
          </div>
          <div className="step-connector flex-grow border-t-2 border-gray-200 mt-4 mx-2"></div>
          <div className={`step flex flex-col items-center ${currentStep === 'verification' ? 'text-sunrise-orange font-semibold' : ''}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep === 'verification' ? 'bg-sunrise-orange text-white' : 'bg-gray-200 text-gray-600'}`}>
              4
            </div>
            <span>Verify</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          {currentStep !== 'personal' && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handlePrevStep}
            >
              Previous
            </Button>
          )}
          
          {currentStep === 'personal' && (
            <div className="ml-auto">
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleNextStep}
              >
                Next
              </Button>
            </div>
          )}
          
          {currentStep === 'military' && (
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleNextStep}
            >
              Next
            </Button>
          )}
          
          {currentStep === 'business' && (
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleNextStep}
            >
              Next
            </Button>
          )}
          
          {currentStep === 'verification' && (
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-dark-grey">
          Already have an account?{' '}
          <Link href="/esm-portal/login" className="text-sunrise-orange hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;