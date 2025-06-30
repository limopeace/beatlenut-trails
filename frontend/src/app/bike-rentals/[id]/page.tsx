'use client';

import React, { useState, useEffect, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faMotorcycle, 
  faShieldAlt, 
  faRoad, 
  faTools, 
  faCheck, 
  faCalendarAlt,
  faClock,
  faUser,
  faGasPump,
  faTachometerAlt,
  faChevronLeft,
  faChevronRight,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/common';
import { notFound } from 'next/navigation';

// Bike data - in real app this would come from API
const bikeRentalsData = [
  {
    id: 1,
    name: '🏍️ Hero Xpulse 200',
    description: 'Forest nimble, village ready — a friendly wild soul. Lightweight, forgiving, and agile — perfect for trail exploration, village loops, and solo discovery.',
    pricePerDay: 2500,
    images: [
      '/images/bikes/hero-xpulse-200.jpg',
      '/images/bikes/hero-xpulse-200-2.jpg',
      '/images/bikes/hero-xpulse-200-3.jpg'
    ],
    features: ['199cc FI Engine', 'Long-travel Suspension', 'Lightweight Adventure', 'Trail Ready'],
    specifications: {
      engine: '199cc, FI, long-travel suspension',
      category: 'Lightweight adventure',
      bestFor: 'Beginners, photographers, forest-heavy circuits',
      personality: 'Friendly wild soul',
      power: '17.8 BHP @ 8500 RPM',
      torque: '16.45 Nm @ 6500 RPM',
      weight: '157 kg',
      fuelCapacity: '13 liters',
      mileage: '35-40 kmpl',
      transmission: '5-speed manual',
      brakes: 'Front disc, Rear disc with ABS',
      suspension: 'Telescopic front, Monoshock rear'
    },
    included: [
      'Comprehensive insurance coverage',
      'Free helmet and safety gear',
      '24/7 roadside assistance',
      'Basic maintenance and servicing',
      'Route planning assistance',
      'Emergency contact support'
    ],
    requirements: [
      'Valid driving license',
      'Age minimum 21 years',
      'Security deposit required',
      'Government ID proof',
      'Emergency contact details'
    ],
    availability: true,
    category: 'adventure',
    recommendedFor: 'Beginners and photography enthusiasts',
    popularRoutes: [
      'Kaziranga National Park Circuit',
      'Meghalaya Living Root Bridges',
      'Assam Tea Garden Tours'
    ]
  },
  {
    id: 2,
    name: '🏍️ Honda H\'ness CB350',
    description: 'A gentleman\'s cruiser, with a mountain\'s calm pulse. Comfortable, classy, and refined — ideal for Assam highways, Meghalaya ridges, and gentle long rides.',
    pricePerDay: 3000,
    images: [
      '/images/bikes/honda-hness-cb350.jpg',
      '/images/bikes/honda-hness-cb350-2.jpg',
      '/images/bikes/honda-hness-cb350-3.jpg'
    ],
    features: ['348cc Engine', 'Smooth Mid-torque', 'Modern Classic', 'Comfort Focused'],
    specifications: {
      engine: '348cc, smooth mid-torque delivery',
      category: 'Modern classic cruiser',
      bestFor: 'Couples, cruiser lovers, style on smooth roads',
      personality: 'Mountain\'s calm pulse',
      power: '20.78 BHP @ 5500 RPM',
      torque: '30 Nm @ 3000 RPM',
      weight: '181 kg',
      fuelCapacity: '15 liters',
      mileage: '45-50 kmpl',
      transmission: '5-speed manual',
      brakes: 'Front disc, Rear drum with ABS',
      suspension: 'Telescopic front, Dual spring rear'
    },
    included: [
      'Comprehensive insurance coverage',
      'Premium helmet and gear',
      '24/7 roadside assistance',
      'Regular maintenance included',
      'Route planning support',
      'Emergency backup vehicle'
    ],
    requirements: [
      'Valid driving license',
      'Age minimum 23 years',
      'Security deposit required',
      'Government ID proof',
      'Previous cruiser experience preferred'
    ],
    availability: true,
    category: 'cruiser',
    recommendedFor: 'Couples and comfort seekers',
    popularRoutes: [
      'Shillong-Cherrapunji Highway',
      'Guwahati-Tezpur Corridor',
      'Assam-Bhutan Border Routes'
    ]
  },
  // Add more bikes as needed
];

interface BikeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BikeDetailPage({ params }: BikeDetailPageProps) {
  const [bike, setBike] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const resolvedParams = use(params);

  useEffect(() => {
    // Find bike by ID
    const foundBike = bikeRentalsData.find(b => b.id === parseInt(resolvedParams.id));
    if (!foundBike) {
      notFound();
    }
    setBike(foundBike);
  }, [resolvedParams.id]);

  if (!bike) {
    return (
      <div className="min-h-screen bg-pale-straw flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto mb-4"></div>
          <p className="text-deep-forest">Loading bike details...</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bike.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bike.images.length) % bike.images.length);
  };

  const calculateTotal = () => {
    return bike.pricePerDay * selectedDuration;
  };

  return (
    <div className="bg-pale-straw min-h-screen">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-moss-green/10">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/bike-rentals"
            className="inline-flex items-center text-forest-green hover:text-deep-forest transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span className="font-medium">Back to Bike Rentals</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <div className="relative">
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          {bike.images.map((image: string, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${bike.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Image Navigation */}
          {bike.images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {bike.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full transition shadow-lg"
          >
            <FontAwesomeIcon 
              icon={faHeart} 
              className={`${isWishlisted ? 'text-red-500' : 'text-gray-400'} transition-colors`} 
            />
          </button>

          {/* Availability Badge */}
          <div className="absolute top-4 left-4">
            {bike.availability ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Available
              </span>
            ) : (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Booked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bike Title and Basic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-deep-forest mb-2 sm:mb-0 font-clash">
                  {bike.name}
                </h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-forest-green">₹{bike.pricePerDay}</div>
                  <div className="text-sm text-deep-forest/70">per day</div>
                </div>
              </div>
              
              <p className="text-lg text-deep-forest/80 mb-6 leading-relaxed">
                {bike.description}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-moss-green/10 rounded-lg">
                  <FontAwesomeIcon icon={faTachometerAlt} className="text-forest-green text-xl mb-2" />
                  <div className="text-sm font-medium text-deep-forest">Engine</div>
                  <div className="text-xs text-deep-forest/70">
                    {bike.specifications.engine.split(',')[0]}
                  </div>
                </div>
                <div className="text-center p-3 bg-moss-green/10 rounded-lg">
                  <FontAwesomeIcon icon={faGasPump} className="text-forest-green text-xl mb-2" />
                  <div className="text-sm font-medium text-deep-forest">Mileage</div>
                  <div className="text-xs text-deep-forest/70">{bike.specifications.mileage}</div>
                </div>
                <div className="text-center p-3 bg-moss-green/10 rounded-lg">
                  <FontAwesomeIcon icon={faUser} className="text-forest-green text-xl mb-2" />
                  <div className="text-sm font-medium text-deep-forest">Category</div>
                  <div className="text-xs text-deep-forest/70 capitalize">{bike.category}</div>
                </div>
                <div className="text-center p-3 bg-moss-green/10 rounded-lg">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-forest-green text-xl mb-2" />
                  <div className="text-sm font-medium text-deep-forest">Weight</div>
                  <div className="text-xs text-deep-forest/70">{bike.specifications.weight}</div>
                </div>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
              <h2 className="text-2xl font-bold text-deep-forest mb-6 font-clash">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(bike.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-moss-green/10 last:border-b-0">
                    <span className="font-medium text-deep-forest capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="text-deep-forest/80 text-right text-sm sm:text-base max-w-[60%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
              <h2 className="text-2xl font-bold text-deep-forest mb-6 font-clash">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bike.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-forest-green mr-3 text-sm" 
                    />
                    <span className="text-deep-forest/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
              <h2 className="text-2xl font-bold text-deep-forest mb-6 font-clash">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bike.included.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-green-500 mr-3 text-sm mt-1" 
                    />
                    <span className="text-deep-forest/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Routes */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
              <h2 className="text-2xl font-bold text-deep-forest mb-6 font-clash">Popular Routes</h2>
              <div className="space-y-3">
                {bike.popularRoutes.map((route: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-moss-green/5 rounded-lg">
                    <FontAwesomeIcon 
                      icon={faRoad} 
                      className="text-forest-green mr-3" 
                    />
                    <span className="text-deep-forest/80">{route}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-moss-green/10">
                <h3 className="text-xl font-bold text-deep-forest mb-6 font-clash">Book This Bike</h3>
                
                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-deep-forest mb-3">
                    Rental Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 3, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() => setSelectedDuration(days)}
                        className={`p-3 rounded-lg text-sm font-medium transition ${
                          selectedDuration === days
                            ? 'bg-forest-green text-pale-straw'
                            : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                        }`}
                      >
                        {days} day{days > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-deep-forest/60 mt-1">
                      <span>1 day</span>
                      <span>{selectedDuration} days</span>
                      <span>30 days</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 p-4 bg-moss-green/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-deep-forest">₹{bike.pricePerDay} × {selectedDuration} day{selectedDuration > 1 ? 's' : ''}</span>
                    <span className="font-medium">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-deep-forest pt-2 border-t border-moss-green/20">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-deep-forest mb-3">Requirements</h4>
                  <div className="space-y-2">
                    {bike.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start text-xs text-deep-forest/70">
                        <span className="w-1 h-1 bg-forest-green rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                {bike.availability ? (
                  <WhatsAppButton 
                    template="bikeRentals"
                    source="bike-detail-page"
                    product={`${bike.name} for ${selectedDuration} day${selectedDuration > 1 ? 's' : ''}`}
                    className="w-full py-4 rounded-lg font-medium text-lg shadow-lg"
                    showIcon={true}
                    showText={true}
                    text="Book via WhatsApp"
                  />
                ) : (
                  <button 
                    className="w-full py-4 rounded-lg font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                    disabled
                  >
                    Currently Unavailable
                  </button>
                )}

                {/* Quick Contact Info */}
                <div className="mt-6 pt-6 border-t border-moss-green/20">
                  <div className="text-center text-sm text-deep-forest/70">
                    <p className="mb-2">Need help choosing?</p>
                    <WhatsAppButton 
                      template="general"
                      source="bike-detail-page-help"
                      className="text-forest-green hover:text-deep-forest underline text-sm"
                      showIcon={false}
                      showText={true}
                      text="Chat with our experts"
                    />
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