'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faEnvelope, 
  faCalendarAlt, 
  faUsers, 
  faArrowLeft,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Simulated mock booking data
const MOCK_BOOKING = {
  id: 'booking-123456789',
  status: 'pending',
  verified: false,
  verificationCode: 'ABC123',
  listing: {
    id: '1',
    title: 'Serene Mountain Retreat',
    slug: 'serene-mountain-retreat',
    location: { city: 'Aspen', country: 'USA' },
    image: '/images/real/pexels-travelerchitect-18736328-min.jpg'
  },
  startDate: new Date('2023-08-15'),
  endDate: new Date('2023-08-20'),
  guestName: 'John Doe',
  guestEmail: 'john.doe@example.com',
  guestPhone: '+1234567890',
  numberOfGuests: 2,
  totalPrice: 1495,
  createdAt: new Date('2023-06-10T12:30:00')
};

const BookingConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API call to get booking details
    const fetchBooking = async () => {
      try {
        // In a real app, this would be an API call to get booking details by ID
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, just use the mock booking
        setBooking({
          ...MOCK_BOOKING,
          id: id // Use the ID from the URL
        });
      } catch (err) {
        setError('Failed to load booking details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id]);
  
  const handleVerifyEmail = async () => {
    setVerifying(true);
    setVerificationError(null);
    
    try {
      // In a real app, this would be an API call to verify the booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful verification
      setVerificationSuccess(true);
      setBooking(prev => ({
        ...prev,
        status: 'confirmed',
        verified: true
      }));
    } catch (err) {
      setVerificationError('Failed to verify your booking. Please try again or contact support.');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };
  
  const handleResendVerification = async () => {
    // In a real app, this would be an API call to resend verification email
    alert('Verification email resent! Please check your inbox.');
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-500' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'bg-green-500' };
      case 'completed':
        return { label: 'Completed', color: 'bg-blue-500' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-500' };
      default:
        return { label: status, color: 'bg-gray-500' };
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-4xl mb-4" />
            <h2 className="text-xl font-medium">Loading booking details...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-4xl mb-4" />
            <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
            <p className="mb-8">{error || 'The booking you are looking for does not exist or has been removed.'}</p>
            <Button onClick={() => router.push('/travel-listings')}>
              Browse Listings
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const status = getStatusLabel(booking.status);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <button
              onClick={() => router.push('/travel-listings')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Listings
            </button>
            
            {/* Booking confirmation header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-green-600 text-white p-6 text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3" />
                <h1 className="text-2xl md:text-3xl font-bold">Booking Received</h1>
                <p className="text-green-100">Thank you for your booking!</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Booking Reference</p>
                    <p className="font-bold text-lg">{booking.id}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-gray-600 text-sm">Status</p>
                    <span className={`${status.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {status.label}
                    </span>
                  </div>
                </div>
                
                {/* Verification notice */}
                {!booking.verified && booking.status === 'pending' && !verificationSuccess && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Please verify your email</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          We've sent a verification email to <strong>{booking.guestEmail}</strong>. 
                          Please check your inbox and click the verification link.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={handleVerifyEmail}
                            disabled={verifying}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                          >
                            {verifying ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                Verifying...
                              </>
                            ) : (
                              'Verify Now'
                            )}
                          </button>
                          <button
                            onClick={handleResendVerification}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                          >
                            Resend Email
                          </button>
                        </div>
                        {verificationError && (
                          <p className="text-sm text-red-600 mt-2">{verificationError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Verification success */}
                {(booking.verified || verificationSuccess) && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Email Verified</h3>
                        <p className="text-sm text-gray-600">
                          Your email has been verified and your booking is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Booking details */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Listing info */}
                    <div className="md:col-span-2">
                      <h3 className="font-medium mb-2">{booking.listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{booking.listing.location.city}, {booking.listing.location.country}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Check-in</p>
                          <p className="font-medium">{booking.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Check-out</p>
                          <p className="font-medium">{booking.endDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Guests</p>
                          <p className="font-medium">{booking.numberOfGuests}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Total Price</p>
                          <p className="font-medium">${booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Listing image */}
                    <div className="md:col-span-1">
                      <div className="relative h-32 w-full rounded-md overflow-hidden">
                        <Image
                          src={booking.listing.image}
                          alt={booking.listing.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Guest information */}
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h3 className="font-medium mb-4">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Name</p>
                        <p className="font-medium">{booking.guestName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Email</p>
                        <p className="font-medium">{booking.guestEmail}</p>
                      </div>
                      {booking.guestPhone && (
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Phone</p>
                          <p className="font-medium">{booking.guestPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Information and next steps */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">What's Next?</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faEnvelope} className="text-green-600 mt-1 mr-2" />
                        <span>
                          You will receive a confirmation email with all the details of your booking.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 mt-1 mr-2" />
                        <span>
                          We recommend adding the dates to your calendar.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faUsers} className="text-green-600 mt-1 mr-2" />
                        <span>
                          If you need to make any changes to your booking, please contact us as soon as possible.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => router.push('/travel-listings')}>
                Browse More Listings
              </Button>
              <Button onClick={() => window.print()} variant="outline">
                Print Confirmation
              </Button>
            </div>
          </div>
        </FadeIn>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;