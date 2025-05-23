'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BuyerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

interface OrderSummary {
  id: string;
  sellerName: string;
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  type: 'service' | 'product';
}

interface MessageSummary {
  id: string;
  conversationId: string;
  participantName: string;
  subject: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [recentMessages, setRecentMessages] = useState<MessageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    interests: string[];
  }>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    interests: []
  });
  
  // Available interest categories
  const availableInterests = [
    'Adventure Tours',
    'Trekking',
    'Motorcycle Tours',
    'Expeditions',
    'Survival Training',
    'Wildlife Photography',
    'Equipment Rental',
    'Transport Services',
    'Accommodation',
    'Local Cuisine',
    'Cultural Experiences',
    'Mountaineering',
    'Skiing/Snowboarding',
    'Water Sports',
    'Camping'
  ];
  
  // Fetch buyer profile and related data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        // const profileResponse = await fetch('/api/esm/buyer/profile');
        // const ordersResponse = await fetch('/api/esm/buyer/orders?limit=3');
        // const messagesResponse = await fetch('/api/esm/buyer/messages?limit=3');
        
        // const profileData = await profileResponse.json();
        // const ordersData = await ordersResponse.json();
        // const messagesData = await messagesResponse.json();
        
        // setProfile(profileData);
        // setRecentOrders(ordersData.orders);
        // setRecentMessages(messagesData.messages);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockProfile: BuyerProfile = {
            id: 'user123',
            firstName: 'Rahul',
            lastName: 'Sharma',
            email: 'rahul.sharma@example.com',
            phone: '9876543210',
            avatar: '/images/placeholder.jpg',
            address: '42 Park Avenue',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            interests: ['Trekking', 'Wildlife Photography', 'Camping'],
            createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          const mockOrders: OrderSummary[] = [
            {
              id: 'order1',
              sellerName: 'Himalayan Adventures',
              title: '3-Day Himalayan Trek',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              type: 'service'
            },
            {
              id: 'order2',
              sellerName: 'Mountain Gear',
              title: 'Camping Equipment Package',
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              type: 'product'
            },
            {
              id: 'order3',
              sellerName: 'Wildlife Explorer',
              title: 'Photography Tour',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'in-progress',
              type: 'service'
            }
          ];
          
          const mockMessages: MessageSummary[] = [
            {
              id: 'msg1',
              conversationId: 'conv1',
              participantName: 'Himalayan Adventures',
              subject: 'Trek Booking Details',
              lastMessageDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              unreadCount: 2
            },
            {
              id: 'msg2',
              conversationId: 'conv2',
              participantName: 'Mountain Gear',
              subject: 'Equipment Rental Query',
              lastMessageDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              unreadCount: 0
            },
            {
              id: 'msg3',
              conversationId: 'conv3',
              participantName: 'Wildlife Explorer',
              subject: 'Photography Tour Schedule',
              lastMessageDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              unreadCount: 0
            }
          ];
          
          setProfile(mockProfile);
          setRecentOrders(mockOrders);
          setRecentMessages(mockMessages);
          
          setEditableFields({
            firstName: mockProfile.firstName,
            lastName: mockProfile.lastName,
            phone: mockProfile.phone || '',
            address: mockProfile.address || '',
            city: mockProfile.city || '',
            state: mockProfile.state || '',
            pincode: mockProfile.pincode || '',
            interests: [...mockProfile.interests]
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableFields(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle interest selection
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setEditableFields(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
    } else {
      setEditableFields(prev => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== value)
      }));
    }
  };
  
  // Handle save profile changes
  const handleSaveChanges = async () => {
    if (!profile) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch('/api/esm/buyer/profile', {
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
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || '',
      interests: [...profile.interests]
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
  
  // Format relative time for messages
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
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
            There was an error loading your profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="sm:flex sm:items-center p-6">
            <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
              <div className="relative h-20 w-20 rounded-full overflow-hidden">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="sm:ml-4 sm:flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Member since {formatDate(profile.createdAt)}</p>
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
          
          {/* Main content */}
          <div className="border-t border-gray-200">
            {/* Tab navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <a 
                  href="#" 
                  className="border-b-2 border-blue-500 py-4 px-6 text-sm font-medium text-blue-600"
                >
                  Profile
                </a>
                <a 
                  href="#" 
                  className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Orders
                </a>
                <a 
                  href="#" 
                  className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Messages
                </a>
                <a 
                  href="#" 
                  className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Favorites
                </a>
              </nav>
            </div>
            
            {/* Profile content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {isEditing ? (
                      <>
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={editableFields.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={editableFields.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profile.email}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={editableFields.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                          <p className="mt-1 text-sm text-gray-900">{profile.firstName}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                          <p className="mt-1 text-sm text-gray-900">{profile.lastName}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                        </div>
                        
                        {profile.phone && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Address Information */}
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Address Information</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      {isEditing ? (
                        <>
                          <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                              Address (Optional)
                            </label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={editableFields.address}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                              City (Optional)
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={editableFields.city}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                              State (Optional)
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={editableFields.state}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                              Pincode (Optional)
                            </label>
                            <input
                              type="text"
                              id="pincode"
                              name="pincode"
                              value={editableFields.pincode}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {profile.address && (
                            <div className="sm:col-span-2">
                              <h3 className="text-sm font-medium text-gray-500">Address</h3>
                              <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
                            </div>
                          )}
                          
                          {profile.city && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">City</h3>
                              <p className="mt-1 text-sm text-gray-900">{profile.city}</p>
                            </div>
                          )}
                          
                          {profile.state && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">State</h3>
                              <p className="mt-1 text-sm text-gray-900">{profile.state}</p>
                            </div>
                          )}
                          
                          {profile.pincode && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
                              <p className="mt-1 text-sm text-gray-900">{profile.pincode}</p>
                            </div>
                          )}
                          
                          {!profile.address && !profile.city && !profile.state && !profile.pincode && (
                            <div className="sm:col-span-2">
                              <p className="text-sm text-gray-500 italic">No address information provided</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Interests */}
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Interests</h2>
                    
                    {isEditing ? (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Select your interests to get personalized recommendations</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableInterests.map(interest => (
                            <div key={interest} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`interest-${interest}`}
                                  name="interest"
                                  type="checkbox"
                                  value={interest}
                                  checked={editableFields.interests.includes(interest)}
                                  onChange={handleInterestChange}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                              <div className="ml-2 text-sm">
                                <label htmlFor={`interest-${interest}`} className="font-medium text-gray-700">
                                  {interest}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        {profile.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No interests selected</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="md:col-span-1">
                  {/* Recent Orders */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Recent Orders</h3>
                      <Link 
                        href="/esm-portal/orders" 
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                      >
                        View All
                      </Link>
                    </div>
                    
                    {recentOrders.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {recentOrders.map(order => (
                          <li key={order.id} className="py-3">
                            <Link href={`/esm-portal/orders/${order.id}`} className="block hover:bg-gray-50">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">{order.title}</p>
                                <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                              </div>
                              <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-500">{order.sellerName}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  order.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {order.status === 'completed' ? 'Completed' : 
                                   order.status === 'in-progress' ? 'In Progress' : 'Cancelled'}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No recent orders</p>
                    )}
                  </div>
                  
                  {/* Recent Messages */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Recent Messages</h3>
                      <Link 
                        href="/esm-portal/messages" 
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                      >
                        View All
                      </Link>
                    </div>
                    
                    {recentMessages.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {recentMessages.map(message => (
                          <li key={message.id} className="py-3">
                            <Link href={`/esm-portal/messages?conversation=${message.conversationId}`} className="block hover:bg-gray-50">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 truncate">{message.participantName}</p>
                                  {message.unreadCount > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-600">
                                      <span className="text-xs font-medium leading-none text-white">{message.unreadCount}</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{formatRelativeTime(message.lastMessageDate)}</p>
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-1">{message.subject}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No recent messages</p>
                    )}
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