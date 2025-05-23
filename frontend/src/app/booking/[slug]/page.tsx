'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faCalendarAlt, 
  faUsers, 
  faCheck,
  faArrowLeft,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for development - same as in travel listings
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Meghalaya Mountain Retreat',
    slug: 'meghalaya-mountain-retreat',
    location: { 
      city: 'Shillong',
      state: 'Meghalaya',
      country: 'India',
      address: '123 Pine View Road'
    },
    category: 'stay',
    packageType: 'stay',
    duration: { value: 1, unit: 'days' },
    price: { amount: 12999, currency: 'INR', priceType: 'per_night' },
    discountPrice: { amount: 10999, expiresAt: new Date('2024-12-31') },
    images: [
      '/images/real/pexels-travelerchitect-18736328-min.jpg'
    ],
    reviews: { average: 4.8, count: 124 },
  },
  // Other listings would be here
];

const BookingPage: React.FC = () => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const startDateParam = searchParams.get('start');
  const endDateParam = searchParams.get('end');
  const guestsParam = searchParams.get('guests');
  
  // Find listing by slug
  const listing = MOCK_LISTINGS.find(item => item.slug === slug);
  
  // State for form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format dates from URL parameters
  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const guests = guestsParam ? parseInt(guestsParam) : 1;
  
  // Calculate price
  const calculateTotalPrice = () => {
    if (!listing || !startDate || !endDate) return 0;
    
    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let basePrice;
    if (listing.discountPrice && listing.discountPrice.amount && 
        (!listing.discountPrice.expiresAt || new Date(listing.discountPrice.expiresAt) > new Date())) {
      basePrice = listing.discountPrice.amount;
    } else {
      basePrice = listing.price.amount;
    }
    
    let totalPrice;
    if (listing.price.priceType === 'per_person') {
      totalPrice = basePrice * guests;
    } else if (listing.price.priceType === 'per_night') {
      totalPrice = basePrice * durationInDays;
    } else {
      totalPrice = basePrice; // total price
    }
    
    return totalPrice;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // In a real app, this would be an API call to create the booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful booking
      setIsSuccess(true);
      
      // Redirect to confirmation page after a delay
      setTimeout(() => {
        router.push(`/booking-confirmation/booking-${Math.random().toString(36).substring(2, 11)}`);
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };
  
  if (!listing || !startDate || !endDate) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16 mt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Invalid Booking Request</h1>
            <p className="mb-8">Missing required booking information. Please select dates and try again.</p>
            <Button onClick={() => router.push('/travel-listings')}>
              Back to Listings
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16 mt-24">
          <div className="max-w-2xl mx-auto text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mb-6" />
            <h1 className="text-3xl font-bold mb-4">Booking Successful!</h1>
            <p className="mb-8">Your booking is being processed. You will receive a confirmation email shortly.</p>
            <p className="text-gray-600 mb-4">Redirecting to your booking confirmation...</p>
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 mt-24">
        <FadeIn>
          {/* TripAdvisor-style booking page */}
          <div className="max-w-5xl mx-auto">
            {/* Header with back button */}
            <div className="mb-6">
              <button 
                onClick={handleBack}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                <span>Back to listing</span>
              </button>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking form - left side */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Confirmation will be sent to this email
                        </p>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Any special requirements or requests..."
                      ></textarea>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="termsAgreement"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="termsAgreement" className="ml-2 block text-sm text-gray-700">
                          I agree to the <a href="/terms" className="text-green-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Complete Booking'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Booking policies */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Booking Policies</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-800">Cancellation Policy</h3>
                      <p className="text-gray-600 text-sm">
                        Free cancellation up to 24 hours before the start date. Cancellations made less than 24 hours in advance are not refundable.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800">Payment</h3>
                      <p className="text-gray-600 text-sm">
                        Your card will not be charged until your booking is confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking summary - right side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                    
                    {/* Listing details */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex mb-4">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{listing.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-gray-400" />
                            <span>{listing.location.city}, {listing.location.country}</span>
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                            <span>{listing.reviews.average.toFixed(1)}</span>
                            <span className="text-gray-600 ml-1">({listing.reviews.count} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking details */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-gray-700">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-500" />
                          <span>Dates</span>
                        </div>
                        <div className="text-right">
                          <div>{startDate.toLocaleDateString()} - </div>
                          <div>{endDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                          <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-500" />
                          <span>Guests</span>
                        </div>
                        <div>{guests} {guests === 1 ? 'person' : 'people'}</div>
                      </div>
                    </div>
                    
                    {/* Price breakdown */}
                    <div className="mb-4">
                      <h3 className="font-medium mb-3">Price Details</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base price</span>
                          <span>₹{listing.price.amount.toLocaleString('en-IN')} × {guests} {guests === 1 ? 'person' : 'people'}</span>
                        </div>
                        
                        {listing.discountPrice && listing.discountPrice.amount && (
                          <div className="flex justify-between text-green-700">
                            <span>Discount</span>
                            <span>-${(listing.price.amount - listing.discountPrice.amount) * guests}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span>Taxes and fees</span>
                          <span>Included</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        You won't be charged yet
                      </p>
                    </div>
                    
                    {/* Trust badges */}
                    <div className="mt-6 text-center space-y-2">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                        <span>Free cancellation up to 24h before</span>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
};

export default BookingPage;