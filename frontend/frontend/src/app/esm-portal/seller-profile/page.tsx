'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SellerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceBackground: string;
  businessName: string;
  businessDescription: string;
  establishmentYear: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  serviceRadius: number;
  categories: string[];
  profileImage: string;
  logoImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function SellerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<{
    businessDescription: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    serviceRadius: number;
    categories: string[];
  }>({
    businessDescription: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    serviceRadius: 0,
    categories: []
  });
  
  // Available service categories
  const availableCategories = [
    'Adventure Tours',
    'Trekking Guide',
    'Motorcycle Tours',
    'Expedition Planning',
    'Survival Training',
    'Wildlife Photography',
    'Equipment Rental',
    'Transport Services',
    'Accommodation',
    'Local Cuisine',
    'Cultural Experiences',
    'Safety & Rescue',
    'Mountaineering',
    'Skiing/Snowboarding',
    'Water Sports',
    'Camping'
  ];
  
  // Fetch seller profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/esm/seller/profile');
        // const data = await response.json();
        // setProfile(data);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockProfile: SellerProfile = {
            id: 'seller123',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            phone: '9876543210',
            serviceBackground: 'Ex-Army with 12 years of service. Specialized in mountain warfare and survival training. After retirement, I started a trekking and expedition company to share my skills and knowledge with adventure enthusiasts.',
            businessName: 'Himalayan Adventures',
            businessDescription: 'We offer guided trekking tours, survival training, and expedition planning services in the Himalayan region. Our team consists of ex-servicemen with extensive mountain experience. We pride ourselves on safety, professionalism, and creating memorable experiences.',
            establishmentYear: '2018',
            website: 'https://himalayanadventures.example.com',
            address: '123 Mountain Road, Himalaya',
            city: 'Manali',
            state: 'Himachal Pradesh',
            pincode: '175131',
            serviceRadius: 100,
            categories: ['Trekking Guide', 'Survival Training', 'Expedition Planning'],
            profileImage: '/images/placeholder.jpg',
            logoImage: '/images/placeholder.jpg',
            status: 'approved',
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          setProfile(mockProfile);
          setEditableFields({
            businessDescription: mockProfile.businessDescription,
            phone: mockProfile.phone,
            website: mockProfile.website,
            address: mockProfile.address,
            city: mockProfile.city,
            state: mockProfile.state,
            pincode: mockProfile.pincode,
            serviceRadius: mockProfile.serviceRadius,
            categories: [...mockProfile.categories]
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableFields(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setEditableFields(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    } else {
      setEditableFields(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== value)
      }));
    }
  };
  
  // Handle save profile changes
  const handleSaveChanges = async () => {
    if (!profile) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch('/api/esm/seller/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editableFields)
      // });
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...editableFields,
          updatedAt: new Date().toISOString()
        };
      });
      
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    if (!profile) return;
    
    // Reset to original values
    setEditableFields({
      businessDescription: profile.businessDescription,
      phone: profile.phone,
      website: profile.website,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      serviceRadius: profile.serviceRadius,
      categories: [...profile.categories]
    });
    
    setIsEditing(false);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-24 w-24"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
          <p className="mt-2 text-gray-600">
            You don't have a seller profile yet. Would you like to create one?
          </p>
          <button
            onClick={() => router.push('/esm-portal/register')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register as Seller
          </button>
        </div>
      </div>
    );
  }
  
  if (profile.status === 'pending') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Application Under Review
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your seller application is currently pending approval. Our team is reviewing your information and documents. You'll receive an email notification once your application is approved.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="w-full bg-yellow-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full w-1/3"></div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-yellow-800">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Seller Application Details</h1>
              <p className="mt-1 text-sm text-gray-500">
                Submitted on {formatDate(profile.createdAt)}
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden">
                    <Image
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {profile.logoImage && (
                    <div className="mt-4 relative h-32 w-32 rounded-md overflow-hidden">
                      <Image
                        src={profile.logoImage}
                        alt={profile.businessName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-xl font-semibold text-gray-900">{profile.businessName}</h2>
                  <p className="text-gray-600">{profile.firstName} {profile.lastName}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                      <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                      <p className="text-sm text-gray-900">{profile.phone}</p>
                      {profile.website && (
                        <p className="text-sm text-gray-900">{profile.website}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
                      <p className="text-sm text-gray-900">{profile.city}, {profile.state} - {profile.pincode}</p>
                      <p className="text-sm text-gray-900">Service Radius: {profile.serviceRadius} km</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {profile.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Business Description</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.businessDescription}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Service Background</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.serviceBackground}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (profile.status === 'rejected') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Application Rejected
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    We're sorry, but your seller application has been rejected. You can review the feedback below and reapply with the necessary changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Feedback</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please address the following concerns and reapply:
            </p>
            <ul className="mt-4 list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Incomplete service background information</li>
              <li>Unable to verify service credentials</li>
              <li>Business description lacks detail</li>
            </ul>
            
            <div className="mt-6">
              <button
                onClick={() => router.push('/esm-portal/register')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reapply as Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="absolute top-16 left-8">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white bg-white">
                <Image
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-6 pt-16 sm:pt-6 sm:pl-40">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.businessName}</h1>
                  <p className="text-gray-600">{profile.firstName} {profile.lastName}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {!isEditing && profile.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveChanges}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="space-y-6">
                  {/* Business Logo */}
                  {profile.logoImage && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Business Logo</h3>
                      <div className="mt-2 relative h-32 w-32 rounded-md overflow-hidden">
                        <Image
                          src={profile.logoImage}
                          alt={profile.businessName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-900">{profile.email}</p>
                      
                      {isEditing ? (
                        <div>
                          <label htmlFor="phone" className="block text-xs font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={editableFields.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900">{profile.phone}</p>
                      )}
                      
                      {isEditing ? (
                        <div>
                          <label htmlFor="website" className="block text-xs font-medium text-gray-700">
                            Website (Optional)
                          </label>
                          <input
                            type="text"
                            id="website"
                            name="website"
                            value={editableFields.website}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      ) : (
                        profile.website && (
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {profile.website}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    {isEditing ? (
                      <div className="mt-2 space-y-3">
                        <div>
                          <label htmlFor="address" className="block text-xs font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={editableFields.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="city" className="block text-xs font-medium text-gray-700">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={editableFields.city}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-xs font-medium text-gray-700">
                              State
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={editableFields.state}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="pincode" className="block text-xs font-medium text-gray-700">
                              Pincode
                            </label>
                            <input
                              type="text"
                              id="pincode"
                              name="pincode"
                              value={editableFields.pincode}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="serviceRadius" className="block text-xs font-medium text-gray-700">
                              Service Radius (km)
                            </label>
                            <input
                              type="number"
                              id="serviceRadius"
                              name="serviceRadius"
                              value={editableFields.serviceRadius}
                              onChange={handleChange}
                              min="1"
                              max="500"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-900">{profile.address}</p>
                        <p className="text-sm text-gray-900">{profile.city}, {profile.state} - {profile.pincode}</p>
                        <p className="text-sm text-gray-900">Service Radius: {profile.serviceRadius} km</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-900">Established: {profile.establishmentYear}</p>
                      <p className="text-sm text-gray-900">Member Since: {formatDate(profile.createdAt)}</p>
                      <p className="text-sm text-gray-900">Last Updated: {formatDate(profile.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {/* Service Categories */}
                  {isEditing && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Service Categories</h3>
                      <p className="mt-1 text-xs text-gray-500">Select all that apply to your services</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {availableCategories.map(category => (
                          <div key={category} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={`category-${category}`}
                                name="category"
                                type="checkbox"
                                value={category}
                                checked={editableFields.categories.includes(category)}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </div>
                            <div className="ml-2 text-sm">
                              <label htmlFor={`category-${category}`} className="font-medium text-gray-700">
                                {category}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Business Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Business Description</h3>
                    {isEditing ? (
                      <div className="mt-1">
                        <textarea
                          id="businessDescription"
                          name="businessDescription"
                          rows={4}
                          value={editableFields.businessDescription}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Provide a detailed description of your business and services
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profile.businessDescription}</p>
                    )}
                  </div>
                  
                  {/* Service Background */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Service Background</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.serviceBackground}</p>
                  </div>
                  
                  {/* Listings (would be populated from API in a real app) */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Your Listings</h3>
                      <a
                        href="/esm-portal/listings/create"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Create New Listing
                      </a>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href="#" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">
                              3-Day Himalayan Trek
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Expedition • ₹8,999
                            </p>
                          </a>
                        </div>
                      </div>
                      
                      <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href="#" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">
                              Survival Training
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Workshop • ₹5,499
                            </p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}