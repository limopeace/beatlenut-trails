'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendarAlt, 
  faUsers, 
  faDollarSign,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/common';

interface Listing {
  id: string;
  title: string;
  slug: string;
  location: {
    city: string;
    country: string;
  };
  category: string;
  price: {
    amount: number;
    currency: string;
    priceType: string;
  };
}

interface BookingFormProps {
  listing: Listing;
  startDate: Date | null;
  endDate: Date | null;
  guestCount: number;
  totalPrice: number;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  listing,
  startDate,
  endDate,
  guestCount,
  totalPrice,
  onCancel
}) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    
    // Validate form
    if (!validateForm()) return;

    // Check if dates are valid
    if (!startDate || !endDate) {
      setError('Please select valid start and end dates');
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to the booking endpoint
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be the response from the API with booking info
      const bookingInfo = {
        id: 'booking-' + Math.random().toString(36).substr(2, 9),
        listingId: listing.id,
        startDate,
        endDate,
        guestCount,
        totalPrice,
        ...formData
      };
      
      // Simulate successful booking
      setSuccess(true);
      setEmailSent(true);
      
      // Wait for a moment to display success message
      setTimeout(() => {
        router.push(`/booking-confirmation/${bookingInfo.id}`);
      }, 2000);
      
    } catch (err) {
      setError('An error occurred while processing your booking. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="text-center py-8">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-5xl mb-4" />
        <h3 className="text-xl font-bold mb-2">Booking Successful!</h3>
        <p className="mb-4">
          {emailSent 
            ? 'Please check your email for confirmation and verification.'
            : 'Your booking has been processed.'}
        </p>
        <p className="text-sm text-gray-600">You will be redirected to the confirmation page shortly...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Complete Your Booking</h3>
      
      {/* Booking summary */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h4 className="font-medium mb-2">Booking Summary</h4>
        <ul className="text-sm space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-600">Listing:</span>
            <span className="font-medium">{listing.title}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Dates:</span>
            <span className="font-medium">
              {startDate ? startDate.toLocaleDateString() : 'Not specified'} - {endDate ? endDate.toLocaleDateString() : 'Not specified'}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{guestCount}</span>
          </li>
          <li className="flex justify-between border-t border-gray-200 mt-2 pt-2">
            <span className="text-gray-600">Total Price:</span>
            <span className="font-bold">${totalPrice}</span>
          </li>
        </ul>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            A confirmation email will be sent to this address
          </p>
        </div>
        
        {/* Phone field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            <FontAwesomeIcon icon={faPhone} className="mr-2" />
            Phone (optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        {/* Special requests */}
        <div className="mb-6">
          <label htmlFor="specialRequests" className="block text-sm font-medium mb-2">
            Special Requests (optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            placeholder="Any special requests or preferences"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Submit and cancel buttons */}
        <div className="flex flex-col space-y-3">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full p-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;