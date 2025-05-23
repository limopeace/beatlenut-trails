'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Product categories
const productCategories = [
  { value: 'handicrafts', label: 'Handicrafts' },
  { value: 'food-products', label: 'Food Products' },
  { value: 'textiles', label: 'Clothing & Textiles' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'stationery', label: 'Stationery & Art' },
  { value: 'wellness', label: 'Health & Wellness' },
  { value: 'agriculture', label: 'Agricultural Products' },
  { value: 'electronics', label: 'Electronics & Gadgets' },
  { value: 'other', label: 'Other' },
];

export default function AddProductPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    salePrice: '',
    category: '',
    description: '',
    stock: '1',
    weight: '',
    dimensions: '',
    tags: '',
    featured: false,
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      // First check sessionStorage (non-persistent login)
      let token = sessionStorage.getItem('auth_token');
      let userData = sessionStorage.getItem('user');
      
      // If not found, check localStorage (persistent login)
      if (!token) {
        token = localStorage.getItem('auth_token');
        userData = localStorage.getItem('user');
      }
      
      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
        router.push('/esm-portal/login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
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
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (formData.salePrice && (isNaN(parseFloat(formData.salePrice)) || parseFloat(formData.salePrice) <= 0)) {
      newErrors.salePrice = 'Please enter a valid sale price';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }
    
    if (previewImages.length === 0) {
      newErrors.images = 'At least one product image is required';
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        stock: parseInt(formData.stock),
        images: previewImages,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      
      // Call API endpoint
      // Uncomment when API is ready
      /*
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const response = await fetch('/api/esm/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }
      */
      
      // For now, simulate success
      setSuccessMessage('Product created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        price: '',
        salePrice: '',
        category: '',
        description: '',
        stock: '1',
        weight: '',
        dimensions: '',
        tags: '',
        featured: false,
      });
      setPreviewImages([]);
      
      // Redirect to product listing after 2 seconds
      setTimeout(() => {
        router.push('/esm-portal/my-listings');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
              Add New Product
            </h1>
            <p className="text-pale-straw/80 mb-0">
              Create a new product listing to showcase your offerings to potential customers
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
                        Product Name*
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
                        placeholder="Enter product name"
                      />
                      {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                        Price (₹)*
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="salePrice" className="block text-gray-700 font-medium mb-2">
                        Sale Price (₹) <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="salePrice"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green ${
                          errors.salePrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.salePrice && <p className="mt-1 text-red-500 text-sm">{errors.salePrice}</p>}
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
                        {productCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="stock" className="block text-gray-700 font-medium mb-2">
                        Stock Quantity*
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                        placeholder="1"
                      />
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
                        placeholder="Provide a detailed description of your product"
                      ></textarea>
                      {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum 50 characters. Include details about materials, usage, benefits, and any unique features.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Product Images */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Product Images</h2>
                  
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                        Weight <span className="text-gray-500 font-normal">(in grams, optional)</span>
                      </label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                        placeholder="e.g. 500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensions" className="block text-gray-700 font-medium mb-2">
                        Dimensions <span className="text-gray-500 font-normal">(L x W x H in cm, optional)</span>
                      </label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                        placeholder="e.g. 20 x 15 x 10"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
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
                        placeholder="e.g. bamboo, handmade, eco-friendly"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Add tags to help customers find your product easily
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
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
                          Feature this product on your store
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 ml-6">
                        Featured products are displayed prominently on your seller profile
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
                      <h3 className="text-sm font-medium text-blue-800">Listing Tips</h3>
                      <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                        <li>Use high-quality images to showcase your product</li>
                        <li>Write detailed, accurate descriptions</li>
                        <li>Highlight what makes your product special or unique</li>
                        <li>Include any care instructions or special features</li>
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
                    {isSubmitting ? 'Creating Product...' : 'Create Product'}
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