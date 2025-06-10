'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload, faInfoCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import esmServiceService from '@/services/api/esmServiceService';
import { useEsmAuth } from '@/hooks/useEsmAuth';

// Service categories
const serviceCategories = [
  { value: 'security', label: 'Security Services' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'training', label: 'Training & Education' },
  { value: 'logistics', label: 'Logistics & Transportation' },
  { value: 'technical', label: 'Technical Services' },
  { value: 'event-management', label: 'Event Management' },
  { value: 'agriculture', label: 'Agricultural Services' },
  { value: 'coaching', label: 'Personal Coaching' },
  { value: 'tour-guide', label: 'Tour Guide Services' },
  { value: 'other', label: 'Other' },
];

export default function AddServicePage() {
  const { user, isAuthenticated, loading } = useEsmAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    category: '',
    description: '',
    duration: '',
    location: 'onsite',
    customLocation: '',
    tags: '',
    featured: false,
  });
  
  const [packages, setPackages] = useState([
    { name: 'Basic', description: '', price: '' },
    { name: 'Standard', description: '', price: '' },
    { name: 'Premium', description: '', price: '' },
  ]);
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/esm-portal/login');
      return;
    }
    
    // Check if user is a seller
    if (user && user.role !== 'seller') {
      router.push('/esm-portal');
      return;
    }
  }, [isAuthenticated, user, router, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (name === 'location' && value === 'custom') {
      // Show custom location field
      setFormData({
        ...formData,
        location: value
      });
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    setPackages(updatedPackages);
    
    // Clear error when user starts typing
    if (errors[`package_${index}_${field}`]) {
      setErrors({
        ...errors,
        [`package_${index}_${field}`]: ''
      });
    }
  };

  const addPackage = () => {
    if (packages.length < 5) {
      setPackages([...packages, { name: '', description: '', price: '' }]);
    }
  };

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      const updatedPackages = [...packages];
      updatedPackages.splice(index, 1);
      setPackages(updatedPackages);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const newPreviewImages: string[] = [];
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newPreviewImages.push(reader.result.toString());
            if (newPreviewImages.length === fileArray.length) {
              setPreviewImages([...previewImages, ...newPreviewImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.basePrice.trim()) {
      newErrors.basePrice = 'Base price is required';
    } else if (isNaN(parseFloat(formData.basePrice)) || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Please enter a valid price';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }
    
    if (formData.location === 'custom' && !formData.customLocation.trim()) {
      newErrors.customLocation = 'Please specify the location';
    }
    
    // Validate packages
    packages.forEach((pkg, index) => {
      if (!pkg.name.trim()) {
        newErrors[`package_${index}_name`] = 'Package name is required';
      }
      
      if (!pkg.price.trim()) {
        newErrors[`package_${index}_price`] = 'Package price is required';
      } else if (isNaN(parseFloat(pkg.price)) || parseFloat(pkg.price) <= 0) {
        newErrors[`package_${index}_price`] = 'Please enter a valid price';
      }
      
      if (!pkg.description.trim()) {
        newErrors[`package_${index}_description`] = 'Package description is required';
      }
    });
    
    if (previewImages.length === 0) {
      newErrors.images = 'At least one service image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Format data for API
      const serviceData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        location: formData.location === 'custom' ? formData.customLocation : formData.location,
        images: previewImages,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        packages: packages.map(pkg => ({
          name: pkg.name,
          description: pkg.description,
          price: parseFloat(pkg.price),
        })),
      };
      
      // Call API endpoint
      const newService = await esmServiceService.createService(serviceData);
      
      // For now, simulate success
      setSuccessMessage('Service created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        basePrice: '',
        category: '',
        description: '',
        duration: '',
        location: 'onsite',
        customLocation: '',
        tags: '',
        featured: false,
      });
      setPackages([
        { name: 'Basic', description: '', price: '' },
        { name: 'Standard', description: '', price: '' },
        { name: 'Premium', description: '', price: '' },
      ]);
      setPreviewImages([]);
      
      // Redirect to service listing after 2 seconds
      setTimeout(() => {
        router.push('/esm-portal/my-listings');
      }, 2000);
    } catch (error) {
      console.error('Error creating service:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {/* Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-28">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link href="/esm-portal/dashboard" className="inline-flex items-center text-pale-straw/80 hover:text-pale-straw mb-4">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-3 h-3" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-pale-straw">
              Add New Service
            </h1>
            <p className="text-pale-straw/80 mb-0">
              Create a new service listing to offer your expertise to potential customers
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {successMessage && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Service Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter service name"
                      />
                      {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="basePrice" className="block text-gray-700 font-medium mb-2">
                        Starting Price (₹)*
                      </label>
                      <input
                        type="text"
                        id="basePrice"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.basePrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.basePrice && <p className="mt-1 text-red-500 text-sm">{errors.basePrice}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                        Category*
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {serviceCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description*
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Provide a detailed description of your service"
                      ></textarea>
                      {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum 50 characters. Include details about what your service includes, your expertise, and benefits for potential clients.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                        Duration <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                        placeholder="e.g. 2 hours, 1 day, 3 sessions, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Location*
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="onsite"
                            name="location"
                            value="onsite"
                            checked={formData.location === 'onsite'}
                            onChange={handleChange}
                            className="h-4 w-4 text-forest-green focus:ring-forest-green"
                          />
                          <label htmlFor="onsite" className="ml-2 block text-gray-700">
                            At client's location
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="remote"
                            name="location"
                            value="remote"
                            checked={formData.location === 'remote'}
                            onChange={handleChange}
                            className="h-4 w-4 text-forest-green focus:ring-forest-green"
                          />
                          <label htmlFor="remote" className="ml-2 block text-gray-700">
                            Remote / Online
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="custom"
                            name="location"
                            value="custom"
                            checked={formData.location === 'custom'}
                            onChange={handleChange}
                            className="h-4 w-4 text-forest-green focus:ring-forest-green"
                          />
                          <label htmlFor="custom" className="ml-2 block text-gray-700">
                            Specific location
                          </label>
                        </div>
                        
                        {formData.location === 'custom' && (
                          <div className="mt-2 pl-6">
                            <input
                              type="text"
                              id="customLocation"
                              name="customLocation"
                              value={formData.customLocation}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                                errors.customLocation ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter service location"
                            />
                            {errors.customLocation && (
                              <p className="mt-1 text-red-500 text-sm">{errors.customLocation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Service Packages */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Service Packages</h2>
                  
                  {packages.map((pkg, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Package {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removePackage(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={packages.length <= 1}
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`package_${index}_name`} className="block text-gray-700 font-medium mb-2">
                            Package Name*
                          </label>
                          <input
                            type="text"
                            id={`package_${index}_name`}
                            value={pkg.name}
                            onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                              errors[`package_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g. Basic, Standard, Premium"
                          />
                          {errors[`package_${index}_name`] && (
                            <p className="mt-1 text-red-500 text-sm">{errors[`package_${index}_name`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor={`package_${index}_price`} className="block text-gray-700 font-medium mb-2">
                            Price (₹)*
                          </label>
                          <input
                            type="text"
                            id={`package_${index}_price`}
                            value={pkg.price}
                            onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                              errors[`package_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          {errors[`package_${index}_price`] && (
                            <p className="mt-1 text-red-500 text-sm">{errors[`package_${index}_price`]}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor={`package_${index}_description`} className="block text-gray-700 font-medium mb-2">
                            Package Description*
                          </label>
                          <textarea
                            id={`package_${index}_description`}
                            value={pkg.description}
                            onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                              errors[`package_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Describe what's included in this package"
                          ></textarea>
                          {errors[`package_${index}_description`] && (
                            <p className="mt-1 text-red-500 text-sm">{errors[`package_${index}_description`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {packages.length < 5 && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={addPackage}
                        className="inline-flex items-center text-forest-green hover:text-moss-green"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2 w-3 h-3" />
                        Add Another Package
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Service Images */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Service Images</h2>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Images* <span className="text-gray-500 font-normal">(Max 5 images)</span>
                    </label>
                    
                    <div className={`border-2 border-dashed rounded-md p-6 text-center ${
                      errors.images ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        id="images"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      <label htmlFor="images" className="cursor-pointer block">
                        <FontAwesomeIcon icon={faUpload} className="text-gray-400 w-8 h-8 mb-2" />
                        <p className="text-gray-700 font-medium">Drag and drop images here or click to browse</p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, or WebP. Max size 5MB each.
                        </p>
                      </label>
                    </div>
                    {errors.images && <p className="mt-1 text-red-500 text-sm">{errors.images}</p>}
                    
                    {/* Preview Images */}
                    {previewImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-700 font-medium mb-2">Uploaded Images ({previewImages.length})</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {previewImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border border-gray-200">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Additional Details */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Additional Details</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
                        Tags <span className="text-gray-500 font-normal">(comma separated, optional)</span>
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                        placeholder="e.g. security, training, professional, experienced"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Add tags to help customers find your service easily
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 text-forest-green rounded focus:ring-forest-green"
                        />
                        <label htmlFor="featured" className="ml-2 block text-gray-700">
                          Feature this service on your profile
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 ml-6">
                        Featured services are displayed prominently on your seller profile
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Help Tip */}
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Service Listing Tips</h3>
                      <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                        <li>Clearly outline what makes your service unique</li>
                        <li>Highlight your expertise, credentials, and experience</li>
                        <li>Use high-quality images that represent the service you provide</li>
                        <li>Structure your packages to cater to different client needs and budgets</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                  <Link href="/esm-portal/dashboard" passHref>
                    <Button
                      variant="secondary"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-forest-green text-white hover:bg-moss-green"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Service...' : 'Create Service'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}