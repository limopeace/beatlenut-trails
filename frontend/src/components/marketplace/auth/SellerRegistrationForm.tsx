'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { esmRegistrationSchema, type EsmRegistrationData } from '@/utils/validationSchemas';
import { useEsmAuth } from '@/hooks/useEsmAuth';
import Button from '@/components/common/Button';

interface SellerRegistrationFormProps {
  userId?: string; // Optional: If user is already logged in
}

interface ExtendedFormData extends EsmRegistrationData {
  // Additional fields not in the base schema
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  serviceBackground: string;
  
  // Business Information
  establishmentYear: string;
  website: string;
  
  // Service Location
  address: string;
  city: string;
  state: string;
  pincode: string;
  serviceRadius: string;
  
  // Service Categories
  categories: string[];
  customCategories: string; // Comma-separated custom categories
  
  // Documents
  identityProof: File | null;
  serviceProof: File | null;
  businessProof: File | null;
  profileImage: File | null;
  logoImage: File | null;
  
  // Terms and Conditions
  acceptPrivacyPolicy: boolean;
}

// Available service categories (similar to OLX/Quikr/Craigslist)
const availableCategories = [
  // Electronics & Technology
  'Mobile Phones',
  'Computers & Laptops',
  'Electronics & Appliances',
  'Cameras & Photography',
  'Gaming & Entertainment',
  
  // Vehicles
  'Cars & Motorcycles',
  'Commercial Vehicles',
  'Spare Parts',
  'Bicycles',
  
  // Home & Living
  'Furniture',
  'Home Decor',
  'Garden & Outdoor',
  'Kitchen & Dining',
  'Home Appliances',
  
  // Fashion & Beauty
  'Clothing & Accessories',
  'Shoes',
  'Watches',
  'Jewelry',
  'Beauty & Personal Care',
  
  // Hobbies & Sports
  'Sports Equipment',
  'Musical Instruments',
  'Books & Magazines',
  'Art & Collectibles',
  'Toys & Games',
  
  // Services
  'Home Services',
  'Repair & Maintenance',
  'Professional Services',
  'Education & Training',
  'Health & Wellness',
  'Event Services',
  'Security Services',
  'Transport Services',
  'Consulting',
  'Digital Services',
  
  // Business & Industrial
  'Business Equipment',
  'Industrial Machinery',
  'Office Supplies',
  'Raw Materials',
  
  // Agriculture & Farming
  'Agricultural Equipment',
  'Seeds & Plants',
  'Livestock',
  'Farm Produce',
  
  // Real Estate & Property
  'Property Sales',
  'Property Rentals',
  'Commercial Property',
  'Land & Plots',
  
  // Jobs & Employment
  'Full-time Jobs',
  'Part-time Jobs',
  'Freelancing',
  'Internships',
  
  // Community & Social
  'Community Services',
  'Volunteer Work',
  'Social Events',
  'Local News & Updates'
];

const SellerRegistrationForm: React.FC<SellerRegistrationFormProps> = ({ userId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '', // Add password field
    confirmPassword: '', // Add confirm password field
    serviceBackground: '',
    
    businessName: '',
    businessDescription: '',
    establishmentYear: '',
    website: '',
    
    address: '',
    city: '',
    state: '',
    pincode: '',
    serviceRadius: '50',
    
    categories: [],
    customCategories: '',
    
    identityProof: null,
    serviceProof: null,
    businessProof: null,
    profileImage: null,
    logoImage: null,
    
    acceptTerms: false,
    acceptPrivacyPolicy: false
  });
  
  // Preview URLs for uploaded images
  const [previewUrls, setPreviewUrls] = useState<{
    profileImage: string | null;
    logoImage: string | null;
  }>({
    profileImage: null,
    logoImage: null
  });
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'category') {
      // Handle category selection (multiple)
      const categoryValue = e.target.value;
      setFormData(prev => {
        if (checked) {
          return { ...prev, categories: [...prev.categories, categoryValue] };
        } else {
          return { ...prev, categories: prev.categories.filter(cat => cat !== categoryValue) };
        }
      });
    } else {
      // Handle regular checkbox (single boolean value)
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Update form data with file
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview URL for images
      if (name === 'profileImage' || name === 'logoImage') {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, [name]: objectUrl }));
      }
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    setError(null);
    
    // Validation for step 1: Personal Information
    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.lastName.trim()) {
        setError('Last name is required');
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Valid email is required');
        return false;
      }
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
        setError('Valid 10-digit phone number is required');
        return false;
      }
      if (!formData.password.trim() || formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      // Password validation to match backend
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
      if (!passwordRegex.test(formData.password)) {
        setError('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.serviceBackground.trim() || formData.serviceBackground.length < 50) {
        setError('Please provide more details about your service background (minimum 50 characters)');
        return false;
      }
    }
    
    // Validation for step 2: Business Information
    else if (currentStep === 2) {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return false;
      }
      if (!formData.businessDescription.trim() || formData.businessDescription.length < 100) {
        setError('Please provide a detailed business description (minimum 100 characters)');
        return false;
      }
      if (!formData.establishmentYear.trim() || 
          !/^\d{4}$/.test(formData.establishmentYear) || 
          parseInt(formData.establishmentYear) < 1950 || 
          parseInt(formData.establishmentYear) > new Date().getFullYear()) {
        setError('Please enter a valid establishment year (1950-present)');
        return false;
      }
      // Website is optional but must be valid if provided
      if (formData.website.trim() && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(formData.website)) {
        setError('Please enter a valid website URL');
        return false;
      }
    }
    
    // Validation for step 3: Location Information
    else if (currentStep === 3) {
      if (!formData.address.trim()) {
        setError('Address is required');
        return false;
      }
      if (!formData.city.trim()) {
        setError('City is required');
        return false;
      }
      if (!formData.state.trim()) {
        setError('State is required');
        return false;
      }
      if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.replace(/[^0-9]/g, ''))) {
        setError('Valid 6-digit pincode is required');
        return false;
      }
      if (!formData.serviceRadius.trim() || parseInt(formData.serviceRadius) <= 0) {
        setError('Service radius must be greater than 0');
        return false;
      }
    }
    
    // Validation for step 4: Categories
    else if (currentStep === 4) {
      if (formData.categories.length === 0) {
        setError('Please select at least one service category');
        return false;
      }
      // If "Other" is selected, custom categories must be provided
      if (formData.categories.includes('Other') && !formData.customCategories.trim()) {
        setError('Please specify your custom categories when "Other" is selected');
        return false;
      }
    }
    
    // Validation for step 5: Documents
    else if (currentStep === 5) {
      if (!formData.identityProof) {
        setError('Identity proof document is required');
        return false;
      }
      if (!formData.serviceProof) {
        setError('Service proof document is required');
        return false;
      }
      // Business proof is optional for some categories
      
      // Profile image is required
      if (!formData.profileImage) {
        setError('Profile image is required');
        return false;
      }
      // Logo is optional but recommended
    }
    
    // Validation for step 6: Terms and Conditions
    else if (currentStep === 6) {
      if (!formData.acceptTerms) {
        setError('You must accept the terms and conditions');
        return false;
      }
      if (!formData.acceptPrivacyPolicy) {
        setError('You must accept the privacy policy');
        return false;
      }
    }
    
    return true;
  };
  
  // Force detection of autofilled values
  const captureAutofillValues = () => {
    const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
    const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    
    // Force update formData with actual DOM values (handles Chrome autofill)
    const updatedData = {
      ...formData,
      firstName: firstNameInput?.value || formData.firstName,
      lastName: lastNameInput?.value || formData.lastName,
      email: emailInput?.value || formData.email,
      phone: phoneInput?.value || formData.phone,
      password: passwordInput?.value || formData.password,
      confirmPassword: confirmPasswordInput?.value || formData.confirmPassword,
    };
    
    setFormData(updatedData);
    return updatedData;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Form submission started');
    
    // Capture autofill values before validation
    const actualFormData = captureAutofillValues();
    console.log('📋 Current form data (with autofill):', actualFormData);
    console.log('📍 Current step:', currentStep);
    
    if (!validateCurrentStep()) {
      console.log('❌ Current step validation failed');
      return;
    }
    
    // Validate all steps before final submission
    if (currentStep === 6) {
      console.log('🔍 Final validation - checking all steps');
      
      // Check for autofilled values that didn't trigger onChange (Chrome autofill issue)
      const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
      const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const phoneInput = document.getElementById('phone') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      // Update formData with actual DOM values (handles autofill)
      const actualFormData = {
        ...formData,
        firstName: firstNameInput?.value || formData.firstName,
        lastName: lastNameInput?.value || formData.lastName,
        email: emailInput?.value || formData.email,
        phone: phoneInput?.value || formData.phone,
        password: passwordInput?.value || formData.password
      };
      
      console.log('🔍 Actual form values (including autofill):', actualFormData);
      
      // Check all required fields are present
      const requiredFields = {
        firstName: actualFormData.firstName,
        lastName: actualFormData.lastName, 
        email: actualFormData.email,
        phone: actualFormData.phone,
        password: actualFormData.password,
        serviceBackground: actualFormData.serviceBackground,
        businessName: actualFormData.businessName,
        businessDescription: actualFormData.businessDescription,
        address: actualFormData.address,
        city: actualFormData.city,
        state: actualFormData.state,
        pincode: actualFormData.pincode,
        categories: actualFormData.categories,
        identityProof: actualFormData.identityProof,
        serviceProof: actualFormData.serviceProof,
        profileImage: actualFormData.profileImage,
        acceptTerms: actualFormData.acceptTerms,
        acceptPrivacyPolicy: actualFormData.acceptPrivacyPolicy
      };
      
      console.log('🔍 Required fields check:', requiredFields);
      
      // Check for missing required fields
      const missingFields = [];
      if (!actualFormData.firstName?.trim()) missingFields.push('First Name');
      if (!actualFormData.lastName?.trim()) missingFields.push('Last Name');
      if (!actualFormData.email?.trim()) missingFields.push('Email');
      if (!actualFormData.phone?.trim()) missingFields.push('Phone Number');
      if (!actualFormData.password?.trim()) missingFields.push('Password');
      if (!actualFormData.serviceBackground?.trim()) missingFields.push('Service Background');
      if (!actualFormData.businessName?.trim()) missingFields.push('Business Name');
      if (!actualFormData.businessDescription?.trim()) missingFields.push('Business Description');
      if (!actualFormData.address?.trim()) missingFields.push('Address');
      if (!actualFormData.city?.trim()) missingFields.push('City');
      if (!actualFormData.state?.trim()) missingFields.push('State');
      if (!actualFormData.pincode?.trim()) missingFields.push('Pincode');
      if (!actualFormData.categories?.length) missingFields.push('Service Categories');
      if (!actualFormData.identityProof) missingFields.push('Identity Proof');
      if (!actualFormData.serviceProof) missingFields.push('Service Proof');
      if (!actualFormData.profileImage) missingFields.push('Profile Image');
      if (!actualFormData.acceptTerms) missingFields.push('Terms Acceptance');
      if (!actualFormData.acceptPrivacyPolicy) missingFields.push('Privacy Policy Acceptance');
      
      if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Email validation
      if (!/\S+@\S+\.\S+/.test(actualFormData.email)) {
        console.log('❌ Invalid email format');
        setError('Please enter a valid email address');
        return;
      }
      
      // Phone validation
      if (!/^\d{10}$/.test(actualFormData.phone.replace(/[^0-9]/g, ''))) {
        console.log('❌ Invalid phone format');
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      
      // Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
      if (!passwordRegex.test(actualFormData.password)) {
        console.log('❌ Invalid password format');
        setError('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character');
        return;
      }
      
      // Update formData with actual values before submission
      setFormData(actualFormData);
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create FormData to send files
      const submitData = new FormData();
      
      console.log('📦 Preparing form data for submission...');
      
      // Get actual values from DOM (handles autofill)
      const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
      const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const phoneInput = document.getElementById('phone') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
      
      const actualFirstName = firstNameInput?.value || formData.firstName;
      const actualLastName = lastNameInput?.value || formData.lastName;
      const actualEmail = emailInput?.value || formData.email;
      const actualPhone = phoneInput?.value || formData.phone;
      const actualPassword = passwordInput?.value || formData.password;
      const actualConfirmPassword = confirmPasswordInput?.value || formData.confirmPassword;
      
      // Create name from firstName and lastName (to match schema)
      const name = `${actualFirstName.trim()} ${actualLastName.trim()}`;
      submitData.append('name', name);
      
      console.log('📝 Using actual values:', {
        name,
        email: actualEmail,
        password: actualPassword ? '***masked***' : 'empty',
        phone: actualPhone
      });
      
      // Add all text fields with proper mapping
      const fieldMappings = {
        email: actualEmail,
        password: actualPassword,
        confirmPassword: actualConfirmPassword,
        phoneNumber: actualPhone, // Map phone to phoneNumber for schema
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        serviceBackground: formData.serviceBackground,
        establishmentYear: formData.establishmentYear,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        serviceRadius: formData.serviceRadius,
        role: 'seller', // Set role as seller by default
        termsAccepted: formData.acceptTerms, // Map acceptTerms to termsAccepted for schema
        acceptPrivacyPolicy: formData.acceptPrivacyPolicy
      };
      
      Object.entries(fieldMappings).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, String(value));
        }
      });
      
      // Handle categories
      let allCategories = [...formData.categories];
      if (formData.categories.includes('Other') && formData.customCategories.trim()) {
        const customCats = formData.customCategories
          .split(',')
          .map(cat => cat.trim())
          .filter(cat => cat.length > 0);
        allCategories = [...allCategories.filter(cat => cat !== 'Other'), ...customCats];
      }
      submitData.append('categories', JSON.stringify(allCategories));
      
      // Add user ID if provided
      if (userId) {
        submitData.append('userId', userId);
      }
      
      // Add file fields
      if (formData.identityProof) {
        submitData.append('identityProof', formData.identityProof);
        console.log('📎 Added identity proof:', formData.identityProof.name);
      }
      if (formData.serviceProof) {
        submitData.append('serviceProof', formData.serviceProof);
        console.log('📎 Added service proof:', formData.serviceProof.name);
      }
      if (formData.businessProof) {
        submitData.append('businessProof', formData.businessProof);
        console.log('📎 Added business proof:', formData.businessProof.name);
      }
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
        console.log('📎 Added profile image:', formData.profileImage.name);
      }
      if (formData.logoImage) {
        submitData.append('logoImage', formData.logoImage);
        console.log('📎 Added logo image:', formData.logoImage.name);
      }
      
      // Log what we're sending
      console.log('📤 Submitting to API...');
      for (const [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`📎 ${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`📝 ${key}: ${value}`);
        }
      }
      
      // Submit the form
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      console.log('🌐 API endpoint:', `${API_BASE_URL}/esm/sellers/register`);
      
      const response = await fetch(`${API_BASE_URL}/esm/sellers/register`, {
        method: 'POST',
        body: submitData,
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error response:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const responseData = await response.json();
      console.log('✅ Registration successful:', responseData);
      
      // Show success message and redirect
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/esm-portal/register/success');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Better error handling with user-friendly messages
      if (error instanceof Error) {
        // Parse specific validation errors from server
        if (error.message.includes('fullName') || error.message.includes('name') && error.message.includes('empty')) {
          setError('Please fill in your first and last name.');
        } else if (error.message.includes('Email is required')) {
          setError('Please enter your email address.');
        } else if (error.message.includes('Password must include')) {
          setError('Please set a strong password with uppercase, lowercase, number, and special character.');
        } else if (error.message.includes('Phone number is required')) {
          setError('Please enter your phone number.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Registration failed. Please check all fields and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Set up autofill detection
  React.useEffect(() => {
    const handleAutofill = () => {
      setTimeout(() => {
        captureAutofillValues();
      }, 100);
    };

    // Add event listeners for autofill detection
    const inputs = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    const elements: HTMLInputElement[] = [];
    
    inputs.forEach(id => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        elements.push(element);
        element.addEventListener('animationstart', handleAutofill);
        element.addEventListener('input', handleAutofill);
        element.addEventListener('change', handleAutofill);
      }
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('animationstart', handleAutofill);
        element.removeEventListener('input', handleAutofill);
        element.removeEventListener('change', handleAutofill);
      });
    };
  }, [currentStep]);

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrls.profileImage) URL.revokeObjectURL(previewUrls.profileImage);
      if (previewUrls.logoImage) URL.revokeObjectURL(previewUrls.logoImage);
    };
  }, [previewUrls]);
  
  // Render success message
  if (success) {
    return (
      <div className="mt-8 p-6 bg-green-50 rounded-lg text-center">
        <div className="inline-flex h-14 w-14 rounded-full bg-green-100 p-4 text-green-600 mb-4">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registration Submitted Successfully!</h2>
        <p className="text-gray-600 mb-4">
          Your seller registration has been submitted for review. You will be notified once it's approved.
        </p>
        <p className="text-sm text-gray-500">Redirecting to success page...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div 
              key={step}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : step === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{step}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              <p className="mt-1 text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.firstName) {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }));
                    }
                  }}
                  autoComplete="given-name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.lastName) {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }));
                    }
                  }}
                  autoComplete="family-name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.email) {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                    }
                  }}
                  autoComplete="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.phone) {
                      setFormData(prev => ({ ...prev, phone: e.target.value }));
                    }
                  }}
                  autoComplete="tel"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10-digit mobile number"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.password) {
                      setFormData(prev => ({ ...prev, password: e.target.value }));
                    }
                  }}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a strong password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must include uppercase, lowercase, number, and special character
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // Handle autofill on blur
                    if (e.target.value !== formData.confirmPassword) {
                      setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    }
                  }}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="serviceBackground" className="block text-sm font-medium text-gray-700">
                  Service Background*
                </label>
                <textarea
                  id="serviceBackground"
                  name="serviceBackground"
                  value={formData.serviceBackground}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your service experience, including years served, branch, special skills, and relevant qualifications..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Minimum 50 characters. This helps establish your credibility as a service provider.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Business Information</h2>
              <p className="mt-1 text-gray-600">Tell us about your business</p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name*
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                  Business Description*
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your business, services offered, and what makes you unique..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Minimum 100 characters. This will be displayed on your profile page.
                </p>
              </div>
              
              <div>
                <label htmlFor="establishmentYear" className="block text-sm font-medium text-gray-700">
                  Establishment Year*
                </label>
                <input
                  type="text"
                  id="establishmentYear"
                  name="establishmentYear"
                  value={formData.establishmentYear}
                  onChange={handleChange}
                  required
                  placeholder="YYYY"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Service Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Service Location</h2>
              <p className="mt-1 text-gray-600">Where do you provide your services?</p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Pincode*
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700">
                  Service Radius (km)*
                </label>
                <input
                  type="number"
                  id="serviceRadius"
                  name="serviceRadius"
                  value={formData.serviceRadius}
                  onChange={handleChange}
                  required
                  min="1"
                  max="500"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  How far from your location can you provide services?
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Service Categories */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Service Categories</h2>
              <p className="mt-1 text-gray-600">Select all categories that apply to your services</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableCategories.map(category => (
                <div key={category} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="checkbox"
                      value={category}
                      checked={formData.categories.includes(category)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`category-${category}`} className="font-medium text-gray-700">
                      {category}
                    </label>
                  </div>
                </div>
              ))}
              
              {/* Other option */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="category-other"
                    name="category"
                    type="checkbox"
                    value="Other"
                    checked={formData.categories.includes('Other')}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="category-other" className="font-medium text-gray-700">
                    Other (Please specify)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Custom categories input */}
            {formData.categories.includes('Other') && (
              <div className="mt-4">
                <label htmlFor="customCategories" className="block text-sm font-medium text-gray-700">
                  Custom Categories*
                </label>
                <textarea
                  id="customCategories"
                  name="customCategories"
                  value={formData.customCategories}
                  onChange={handleChange}
                  placeholder="Enter your service categories separated by commas (e.g., Custom Electronics Repair, Specialized Training, Unique Consulting)"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Please separate multiple categories with commas. These will be reviewed by our team.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-4">
              You must select at least one category that best represents your services.
              You can update these later if needed.
            </p>
          </div>
        )}
        
        {/* Step 5: Documents */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
              <p className="mt-1 text-gray-600">Upload the required documents for verification</p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Identity Proof*
                </label>
                {!formData.identityProof ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="identityProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            id="identityProof" 
                            name="identityProof" 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={handleFileUpload} 
                            className="sr-only" 
                            required 
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
                        <p className="text-sm text-green-600">{formData.identityProof.name}</p>
                        <p className="text-xs text-green-500">
                          {(formData.identityProof.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <label htmlFor="identityProof" className="cursor-pointer text-blue-600 hover:text-blue-500 text-sm font-medium">
                        Change
                        <input 
                          id="identityProof" 
                          name="identityProof" 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleFileUpload} 
                          className="sr-only" 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, identityProof: null }))}
                        className="text-red-600 hover:text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Acceptable documents: Aadhaar Card, PAN Card, Passport, Voter ID
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Proof*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="serviceProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="serviceProof" 
                          name="serviceProof" 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleFileUpload} 
                          className="sr-only" 
                          required 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Acceptable documents: Service certificate, Discharge book, ESM card
                </p>
                {formData.serviceProof && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected file: {formData.serviceProof.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Registration (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="businessProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="businessProof" 
                          name="businessProof" 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png" 
                          onChange={handleFileUpload} 
                          className="sr-only" 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  If applicable: GST registration, Shop & establishment license, Trade license
                </p>
                {formData.businessProof && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected file: {formData.businessProof.name}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo*
                  </label>
                  <div className="mt-1 flex items-center">
                    {previewUrls.profileImage ? (
                      <div className="relative h-40 w-40">
                        <Image 
                          src={previewUrls.profileImage} 
                          alt="Profile preview" 
                          fill
                          className="rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.profileImage!);
                            setPreviewUrls(prev => ({ ...prev, profileImage: null }));
                            setFormData(prev => ({ ...prev, profileImage: null }));
                          }}
                          className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="h-40 w-40 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-5">
                      <label htmlFor="profileImage" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Upload
                        <input 
                          id="profileImage" 
                          name="profileImage" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="sr-only" 
                          required={!formData.profileImage}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Logo (Optional)
                  </label>
                  <div className="mt-1 flex items-center">
                    {previewUrls.logoImage ? (
                      <div className="relative h-40 w-40">
                        <Image 
                          src={previewUrls.logoImage} 
                          alt="Logo preview" 
                          fill
                          className="rounded-md object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.logoImage!);
                            setPreviewUrls(prev => ({ ...prev, logoImage: null }));
                            setFormData(prev => ({ ...prev, logoImage: null }));
                          }}
                          className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="h-40 w-40 rounded-md bg-gray-100 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 16H6a1 1 0 01-1-1V6a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1z" />
                          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-5">
                      <label htmlFor="logoImage" className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Upload
                        <input 
                          id="logoImage" 
                          name="logoImage" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="sr-only" 
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 6: Terms and Conditions */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Review & Submit</h2>
              <p className="mt-1 text-gray-600">Please review your information and accept our terms</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Personal Information</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.email} | {formData.phone}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Business Information</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {formData.businessName} (Est. {formData.establishmentYear})
                  </p>
                  {formData.website && (
                    <p className="text-sm text-gray-600">
                      Website: {formData.website}
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Location</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Service Radius: {formData.serviceRadius} km
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Categories</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {formData.categories.map(category => (
                      <span 
                        key={category}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Documents</h4>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside space-y-1">
                    {formData.identityProof && <li>Identity Proof: {formData.identityProof.name}</li>}
                    {formData.serviceProof && <li>Service Proof: {formData.serviceProof.name}</li>}
                    {formData.businessProof && <li>Business Proof: {formData.businessProof.name}</li>}
                    {formData.profileImage && <li>Profile Photo: {formData.profileImage.name}</li>}
                    {formData.logoImage && <li>Business Logo: {formData.logoImage.name}</li>}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleCheckboxChange}
                    required
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    I accept the Terms and Conditions*
                  </label>
                  <p className="text-gray-500">
                    I confirm that I have read and agree to the <a href="/terms" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> of the ESM Marketplace.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptPrivacyPolicy"
                    name="acceptPrivacyPolicy"
                    type="checkbox"
                    checked={formData.acceptPrivacyPolicy}
                    onChange={handleCheckboxChange}
                    required
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptPrivacyPolicy" className="font-medium text-gray-700">
                    I accept the Privacy Policy*
                  </label>
                  <p className="text-gray-500">
                    I confirm that I have read and understand the <a href="/privacy" className="text-blue-600 hover:text-blue-500" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to the collection and use of my information as described.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Your application will be reviewed by our team. You will be notified once it's approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SellerRegistrationForm;

// Add CSS to detect autofill
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes autofill {
      0%, 100% { background: transparent; }
    }
    input:-webkit-autofill {
      animation: autofill 0s forwards;
    }
  `;
  document.head.appendChild(style);
}