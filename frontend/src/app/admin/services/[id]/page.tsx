'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  duration: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  availability: 'available' | 'booked' | 'unavailable';
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from your API
        // For now, using mock data
        const mockService: Service = {
          id: serviceId,
          title: `Service ${serviceId}`,
          description: 'This is a comprehensive service offering. In a real implementation, this would be fetched from your backend API with full details and specifications.',
          price: 599.99,
          category: 'Tourism',
          location: 'Shillong, Meghalaya',
          duration: '3 days',
          seller: {
            id: '1',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com'
          },
          images: [
            '/images/hero-placeholder.jpg',
            '/images/hero-placeholder.jpg',
            '/images/hero-placeholder.jpg'
          ],
          status: 'active',
          availability: 'available',
          createdAt: '2023-07-20T14:15:00.000Z'
        };
        
        setService(mockService);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleStatusUpdate = async (newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      // In a real implementation, this would call your API
      console.log(`Updating service ${serviceId} status to ${newStatus}`);
      if (service) {
        setService({ ...service, status: newStatus });
      }
      alert(`Service status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update service status');
    }
  };

  const handleAvailabilityUpdate = async (newAvailability: 'available' | 'booked' | 'unavailable') => {
    try {
      // In a real implementation, this would call your API
      console.log(`Updating service ${serviceId} availability to ${newAvailability}`);
      if (service) {
        setService({ ...service, availability: newAvailability });
      }
      alert(`Service availability updated to ${newAvailability}`);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update service availability');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h3>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link
            href="/admin/services"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityBadgeClass = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin/services" 
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Services
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
              <p className="text-gray-600">Service ID: {service.id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadgeClass(service.status)}`}>
                {service.status}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${getAvailabilityBadgeClass(service.availability)}`}>
                {service.availability}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Service Images</h2>
              <div className="grid grid-cols-3 gap-4">
                {service.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Service Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{service.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{service.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="mt-1 text-sm text-gray-900">₹{service.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="mt-1 text-sm text-gray-900">{service.duration}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{service.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(service.createdAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Information</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Coming Soon</h3>
                <p className="text-sm text-yellow-700">
                  Booking history and calendar management will be available in the next update.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Provider Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Service Provider</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{service.seller.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{service.seller.email}</p>
                </div>
                <div>
                  <Link
                    href={`/admin/sellers/${service.seller.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Provider Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Management Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={service.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as 'active' | 'inactive' | 'pending')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={service.availability}
                    onChange={(e) => handleAvailabilityUpdate(e.target.value as 'available' | 'booked' | 'unavailable')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                
                <div className="space-y-2 pt-2">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => alert('Edit functionality will be implemented soon!')}
                  >
                    Edit Service
                  </button>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => alert('Booking management will be implemented soon!')}
                  >
                    Manage Bookings
                  </button>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this service?')) {
                        alert('Delete functionality will be implemented soon!');
                      }
                    }}
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-sm font-medium">₹7,199</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                * Mock data for demonstration
              </div>
            </div>

            {/* Development Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Development Notice</h3>
              <p className="text-sm text-yellow-700">
                This page shows mock data. Full service management functionality will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}