'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSearch, 
  faFilter, 
  faEdit, 
  faEye, 
  faEnvelope,
  faExclamationCircle,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for initial development
const MOCK_BOOKINGS = [
  {
    id: 'booking-123456789',
    status: 'pending',
    verified: false,
    listing: {
      id: '1',
      title: 'Serene Mountain Retreat',
      location: { city: 'Aspen', country: 'USA' }
    },
    startDate: new Date('2023-08-15'),
    endDate: new Date('2023-08-20'),
    guestName: 'John Doe',
    guestEmail: 'john.doe@example.com',
    guestPhone: '+1234567890',
    numberOfGuests: 2,
    totalPrice: 1495,
    createdAt: new Date('2023-06-10T12:30:00'),
    viewedByAdmin: true,
    specialRequests: 'I would like a room with a mountain view if possible.'
  },
  {
    id: 'booking-987654321',
    status: 'confirmed',
    verified: true,
    listing: {
      id: '2',
      title: 'Tropical Beach Paradise',
      location: { city: 'Bali', country: 'Indonesia' }
    },
    startDate: new Date('2023-09-05'),
    endDate: new Date('2023-09-12'),
    guestName: 'Jane Smith',
    guestEmail: 'jane.smith@example.com',
    guestPhone: '+0987654321',
    numberOfGuests: 3,
    totalPrice: 2100,
    createdAt: new Date('2023-06-12T09:45:00'),
    viewedByAdmin: true,
    specialRequests: null
  },
  {
    id: 'booking-456789123',
    status: 'pending',
    verified: false,
    listing: {
      id: '3',
      title: 'Historic City Tour',
      location: { city: 'Rome', country: 'Italy' }
    },
    startDate: new Date('2023-10-10'),
    endDate: new Date('2023-10-15'),
    guestName: 'Michael Johnson',
    guestEmail: 'michael.johnson@example.com',
    guestPhone: '+1122334455',
    numberOfGuests: 2,
    totalPrice: 890,
    createdAt: new Date('2023-06-15T15:20:00'),
    viewedByAdmin: false,
    specialRequests: 'We would prefer morning tours as we have afternoon plans.'
  },
  {
    id: 'booking-789123456',
    status: 'cancelled',
    verified: true,
    listing: {
      id: '4',
      title: 'Amazon Rainforest Adventure',
      location: { city: 'Manaus', country: 'Brazil' }
    },
    startDate: new Date('2023-11-08'),
    endDate: new Date('2023-11-15'),
    guestName: 'Emily Williams',
    guestEmail: 'emily.williams@example.com',
    guestPhone: '+2233445566',
    numberOfGuests: 1,
    totalPrice: 1200,
    createdAt: new Date('2023-06-20T10:10:00'),
    viewedByAdmin: true,
    specialRequests: null
  },
  {
    id: 'booking-234567891',
    status: 'completed',
    verified: true,
    listing: {
      id: '5',
      title: 'Northern Lights Expedition',
      location: { city: 'Tromsø', country: 'Norway' }
    },
    startDate: new Date('2023-03-10'),
    endDate: new Date('2023-03-15'),
    guestName: 'Robert Brown',
    guestEmail: 'robert.brown@example.com',
    guestPhone: '+3344556677',
    numberOfGuests: 4,
    totalPrice: 3490,
    createdAt: new Date('2023-01-05T14:30:00'),
    viewedByAdmin: true,
    specialRequests: 'We all have advanced camera equipment and would appreciate guidance on best settings for Aurora photography.'
  }
];

// Status options for filter
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminBookingsPage() {
  const router = useRouter();
  
  // State for listings and filters
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filteredBookings, setFilteredBookings] = useState(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  
  // Selected booking
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...bookings];
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        booking => 
          booking.guestName.toLowerCase().includes(search) ||
          booking.guestEmail.toLowerCase().includes(search) ||
          booking.listing.title.toLowerCase().includes(search) ||
          booking.id.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply verified filter
    if (verifiedFilter !== 'all') {
      const isVerified = verifiedFilter === 'verified';
      filtered = filtered.filter(booking => booking.verified === isVerified);
    }
    
    // Apply unread filter
    if (unreadOnly) {
      filtered = filtered.filter(booking => !booking.viewedByAdmin);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, verifiedFilter, unreadOnly]);
  
  // Fetch bookings from API (simulated)
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        setBookings(MOCK_BOOKINGS);
      } catch (err) {
        setError('Failed to load bookings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Handle status update
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    // In a real app, this would be an API call
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    
    // Show success message
    alert(`Booking status updated to ${newStatus}`);
  };
  
  // Mark as viewed
  const handleMarkAsViewed = async (bookingId: string) => {
    // In a real app, this would be an API call
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, viewedByAdmin: true }
          : booking
      )
    );
    
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, viewedByAdmin: true });
    }
  };
  
  // View booking details
  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    
    // Mark as viewed if it's unread
    if (!booking.viewedByAdmin) {
      handleMarkAsViewed(booking.id);
    }
  };
  
  // Close details panel
  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };
  
  // Resend verification email
  const handleResendVerification = async (bookingId: string) => {
    // In a real app, this would be an API call
    alert(`Verification email resent for booking ${bookingId}`);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          icon: faHourglassHalf,
          label: 'Pending'
        };
      case 'confirmed':
        return {
          color: 'bg-green-500',
          icon: faCheckCircle,
          label: 'Confirmed'
        };
      case 'completed':
        return {
          color: 'bg-blue-500',
          icon: faLayerGroup,
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'bg-red-500',
          icon: faTimesCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: faExclamationCircle,
          label: status
        };
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Bookings list */}
            <div className={`${selectedBooking ? 'hidden lg:block' : ''} lg:col-span-${selectedBooking ? '1' : '3'}`}>
              {/* Filters */}
              <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
                  <h2 className="text-lg font-medium">Filters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Status filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Verification filter */}
                  <div>
                    <select
                      value={verifiedFilter}
                      onChange={(e) => setVerifiedFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Bookings</option>
                      <option value="verified">Verified Only</option>
                      <option value="unverified">Unverified Only</option>
                    </select>
                  </div>
                </div>
                
                {/* Unread filter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="unreadOnly"
                    checked={unreadOnly}
                    onChange={() => setUnreadOnly(!unreadOnly)}
                    className="mr-2"
                  />
                  <label htmlFor="unreadOnly" className="text-sm">
                    Show unread bookings only
                  </label>
                </div>
              </div>
              
              {/* Bookings list */}
              {loading ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-3xl mb-4" />
                  <p>Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center text-red-600">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mb-4" />
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <p className="text-lg mb-4">No bookings match your filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setVerifiedFilter('all');
                      setUnreadOnly(false);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map((booking) => {
                        const status = getStatusBadge(booking.status);
                        
                        return (
                          <tr 
                            key={booking.id} 
                            className={`hover:bg-gray-50 ${!booking.viewedByAdmin ? 'bg-yellow-50' : ''}`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-start">
                                {!booking.viewedByAdmin && (
                                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2"></span>
                                )}
                                <div>
                                  <div className="font-medium">{booking.listing.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {booking.listing.location.city}, {booking.listing.location.country}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {booking.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium">{booking.guestName}</div>
                              <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm">{formatDate(booking.startDate)}</div>
                              <div className="text-sm">to {formatDate(booking.endDate)}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} text-white`}>
                                <FontAwesomeIcon icon={status.icon} className="mr-1" />
                                {status.label}
                              </span>
                              <div className="mt-1 text-xs">
                                {booking.verified ? (
                                  <span className="text-green-600">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    Not verified
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => handleViewBooking(booking)}
                                className="text-blue-600 hover:text-blue-800 mr-3"
                                title="View Details"
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button
                                onClick={() => router.push(`/admin/bookings/${booking.id}/edit`)}
                                className="text-gray-600 hover:text-gray-800"
                                title="Edit Booking"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Right column - Booking details */}
            {selectedBooking && (
              <div className="lg:col-span-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Booking Details</h2>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Reference and status */}
                    <div className="flex flex-wrap justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{selectedBooking.listing.title}</h3>
                        <p className="text-gray-600">
                          Booking ID: {selectedBooking.id}
                        </p>
                        <p className="text-gray-600">
                          Created: {new Date(selectedBooking.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        {/* Status badge */}
                        {(() => {
                          const status = getStatusBadge(selectedBooking.status);
                          return (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color} text-white`}>
                              <FontAwesomeIcon icon={status.icon} className="mr-2" />
                              {status.label}
                            </span>
                          );
                        })()}
                        
                        {/* Verification status */}
                        <div className="mt-2">
                          {selectedBooking.verified ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                              Email Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Grid layout for details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Booking details */}
                      <div>
                        <h4 className="font-medium mb-3 pb-2 border-b">Booking Details</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Location:</dt>
                            <dd className="font-medium text-right">
                              {selectedBooking.listing.location.city}, {selectedBooking.listing.location.country}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Check-in:</dt>
                            <dd className="font-medium text-right">
                              {formatDate(selectedBooking.startDate)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Check-out:</dt>
                            <dd className="font-medium text-right">
                              {formatDate(selectedBooking.endDate)}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Guests:</dt>
                            <dd className="font-medium text-right">
                              {selectedBooking.numberOfGuests}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Total Price:</dt>
                            <dd className="font-medium text-right">
                              ${selectedBooking.totalPrice}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      {/* Guest details */}
                      <div>
                        <h4 className="font-medium mb-3 pb-2 border-b">Guest Information</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Name:</dt>
                            <dd className="font-medium text-right">
                              {selectedBooking.guestName}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Email:</dt>
                            <dd className="font-medium text-right">
                              {selectedBooking.guestEmail}
                            </dd>
                          </div>
                          {selectedBooking.guestPhone && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Phone:</dt>
                              <dd className="font-medium text-right">
                                {selectedBooking.guestPhone}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                    
                    {/* Special requests */}
                    {selectedBooking.specialRequests && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-3 pb-2 border-b">Special Requests</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedBooking.specialRequests}</p>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-3">Actions</h4>
                      
                      {/* Status update */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'pending')}
                          disabled={selectedBooking.status === 'pending'}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            selectedBooking.status === 'pending'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          Set Pending
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                          disabled={selectedBooking.status === 'confirmed'}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            selectedBooking.status === 'confirmed'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                          disabled={selectedBooking.status === 'completed'}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            selectedBooking.status === 'completed'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                          disabled={selectedBooking.status === 'cancelled'}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                            selectedBooking.status === 'cancelled'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          Cancel Booking
                        </button>
                      </div>
                      
                      {/* Other actions */}
                      <div className="flex flex-wrap gap-3">
                        {!selectedBooking.verified && (
                          <button
                            onClick={() => handleResendVerification(selectedBooking.id)}
                            className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium hover:bg-indigo-200"
                          >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            Resend Verification
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/admin/bookings/${selectedBooking.id}/edit`)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Edit Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
    </FadeIn>
  );
}