'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faTimes,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getWhatsAppLinkFromTemplate } from '@/utils/whatsappUtils';

interface BookingActionsProps {
  listing: {
    title: string;
    slug: string;
    location: {
      city: string;
      state?: string;
      country: string;
    };
    price: {
      amount: number;
      currency: string;
      priceType: string;
    };
  };
  triggerText?: string;
  className?: string;
}

const BookingActions: React.FC<BookingActionsProps> = ({ 
  listing, 
  triggerText = 'Book Now',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleEmailBooking = () => {
    const subject = `Booking Inquiry - ${listing.title}`;
    const body = `Dear Beatlenut Trails Team,

I would like to inquire about booking the following travel package:

Package: ${listing.title}
Location: ${listing.location.city}, ${listing.location.state ? listing.location.state + ', ' : ''}${listing.location.country}
Price: ${listing.price.currency === 'INR' ? '₹' : listing.price.currency}${listing.price.amount.toLocaleString('en-IN')} ${listing.price.priceType}

Please provide me with:
- Availability for my preferred dates
- Detailed itinerary
- Inclusions and exclusions
- Booking process and payment terms
- Any special offers or packages available

I am interested in traveling and would appreciate your assistance in planning this trip.

Looking forward to your response.

Best regards,
[Your Name]
[Your Contact Number]`;

    const mailtoUrl = `mailto:info@beatlenuttrails.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setShowModal(false);
  };

  const handleWhatsAppBooking = () => {
    const productDescription = `${listing.title} - ${listing.location.city}, ${listing.location.state ? listing.location.state + ', ' : ''}${listing.location.country} (${listing.price.currency === 'INR' ? '₹' : listing.price.currency}${listing.price.amount.toLocaleString('en-IN')} ${listing.price.priceType})`;
    
    const whatsappUrl = getWhatsAppLinkFromTemplate(
      'travelPackages',
      'travel-listing-detail',
      productDescription
    );
    
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
  };

  const handlePhoneCall = () => {
    window.open('tel:+919876543210', '_self');
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={className}
      >
        {triggerText}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-forest-green text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold">Book Your Experience</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-deep-forest mb-2">{listing.title}</h4>
                <p className="text-sm text-gray-600">
                  {listing.location.city}, {listing.location.state ? listing.location.state + ', ' : ''}{listing.location.country}
                </p>
                <p className="text-lg font-bold text-forest-green mt-2">
                  {listing.price.currency === 'INR' ? '₹' : listing.price.currency}
                  {listing.price.amount.toLocaleString('en-IN')} {listing.price.priceType}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  Choose how you'd like to get in touch with us for booking:
                </p>

                <div className="space-y-3">
                  {/* Email Option */}
                  <button
                    onClick={handleEmailBooking}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-forest-green hover:bg-forest-green/5 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-forest-green/20">
                        <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 group-hover:text-forest-green" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Send Email</p>
                        <p className="text-sm text-gray-600">Draft a detailed inquiry email</p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-gray-400 group-hover:text-forest-green" />
                  </button>

                  {/* WhatsApp Option */}
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200">
                        <FontAwesomeIcon icon={faWhatsapp} className="text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-sm text-gray-600">Chat with us instantly</p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-gray-400 group-hover:text-green-600" />
                  </button>

                  {/* Phone Option */}
                  <button
                    onClick={handlePhoneCall}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-orange-200">
                        <FontAwesomeIcon icon={faPhone} className="text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-600">Speak with our travel experts</p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-gray-400 group-hover:text-orange-600" />
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-pale-straw/30 p-4 rounded-lg">
                <p className="text-sm text-deep-forest/80">
                  <strong>Why book with us?</strong><br />
                  ✓ Best price guarantee<br />
                  ✓ 24/7 customer support<br />
                  ✓ Free cancellation up to 24 hours<br />
                  ✓ Instant booking confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingActions;