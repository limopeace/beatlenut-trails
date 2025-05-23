'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faCalendarAlt, 
  faUsers, 
  faCheck,
  faTimes,
  faArrowLeft,
  faChevronRight,
  faBed,
  faUtensils,
  faShuttleVan,
  faWifi,
  faCoffee,
  faWineGlassAlt,
  faSmokingBan,
  faChild
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for development
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Meghalaya Mountain Retreat',
    slug: 'meghalaya-mountain-retreat',
    description: 'Experience luxury in the mountains of Meghalaya with breathtaking views and premium amenities. Our resort features spacious rooms with panoramic mountain views, a full-service spa, fine dining restaurant, and outdoor activities for all seasons.\n\nThe property is nestled among the lush hills of Meghalaya, offering a perfect blend of natural beauty and modern comforts. Wake up to stunning sunrise views, followed by a day of adventure or relaxation.\n\nOur attentive staff ensures your stay is nothing short of exceptional, with personalized service and attention to detail that sets us apart from other accommodations in the region.',
    location: { 
      city: 'Shillong', 
      state: 'Meghalaya',
      country: 'India',
      address: '123 Mountain View Road'
    },
    userReviews: [
      {
        id: 1,
        name: 'Rahul Sharma',
        rating: 5,
        date: '2023-04-15',
        comment: 'Absolutely stunning location with breathtaking views. The staff was extremely attentive and made our stay memorable. The rooms are spacious and well-appointed. Would definitely recommend!'
      },
      {
        id: 2,
        name: 'Priya Patel',
        rating: 4,
        date: '2023-03-22',
        comment: 'Great experience overall. The property is beautiful and the food at the restaurant was excellent. Only small issue was with the Wi-Fi being a bit spotty in some areas.'
      },
      {
        id: 3,
        name: 'Aditya Menon',
        rating: 5,
        date: '2023-02-10',
        comment: 'One of the best mountain retreats I\'ve stayed at. The guided nature walks were informative and enjoyable. The spa services are top-notch - don\'t miss the traditional massage!'
      }
    ],
    category: 'resort',
    packageType: 'stay',
    price: { amount: 12999, currency: 'INR', priceType: 'per_night' },
    images: [
      '/images/real/pexels-travelerchitect-18736328-min.jpg',
      '/images/real/pexels-nans1419-20519339-min.jpg'
    ],
    reviews: { 
      average: 4.8, 
      count: 124
    },
    amenities: [
      'Free Wi-Fi',
      'Spa Services',
      'Restaurant',
      'Swimming Pool'
    ],
    highlights: [
      'Stunning mountain views',
      'Close to living root bridges',
      'Gourmet dining options with local cuisine'
    ],
    includedServices: [
      'Daily housekeeping',
      'Welcome drink',
      'Free guided nature walks'
    ],
    excludedServices: [
      'Airport transfers',
      'Private guided tours',
      'Equipment rental'
    ],
    packageFeatures: {
      accommodation: true,
      meals: {
        breakfast: true,
        lunch: false,
        dinner: true
      },
      transport: {
        airportPickup: false,
        localTransport: true
      },
      amenities: {
        wifi: true,
        airConditioning: true,
        swimmingPool: true,
        spa: true
      },
      activities: {
        guidedTours: false,
        adventureSports: true,
        culturalEvents: true
      },
      restrictions: {
        noSmoking: true,
        noPets: true,
        notSuitableForChildren: false
      }
    }
  },
  {
    id: '2',
    title: 'Goa Beach Resort',
    slug: 'goa-beach-resort',
    description: 'Relax on pristine beaches and enjoy world-class service at our beachfront property.',
    location: { 
      city: 'Calangute', 
      state: 'Goa',
      country: 'India',
      address: '456 Beach Road'
    },
    userReviews: [
      {
        id: 1,
        name: 'Vikram Mehta',
        rating: 4,
        date: '2023-05-18',
        comment: 'Beautiful beachfront location with easy access to the water. Rooms were clean and comfortable. Staff was friendly and accommodating.'
      },
      {
        id: 2,
        name: 'Ananya Singh',
        rating: 5,
        date: '2023-04-30',
        comment: 'Perfect getaway! The beach view from our room was spectacular. The restaurant served delicious seafood and the cocktails were amazing.'
      }
    ],
    category: 'resort',
    packageType: 'stay',
    price: { amount: 8999, currency: 'INR', priceType: 'per_night' },
    images: [
      '/images/real/pexels-nans1419-20519339-min.jpg',
      '/images/real/pexels-travelerchitect-18736328-min.jpg'
    ],
    reviews: { 
      average: 4.5, 
      count: 87
    },
    amenities: [
      'Free Wi-Fi',
      'Beach Access',
      'Swimming Pool',
      'Restaurant'
    ],
    highlights: [
      'Private beach access',
      'Water sports activities',
      'Sunset views'
    ],
    includedServices: [
      'Daily housekeeping',
      'Welcome drink',
      'Beach towels'
    ],
    excludedServices: [
      'Airport transfers',
      'Water sports equipment',
      'Spa treatments'
    ],
    packageFeatures: {
      accommodation: true,
      meals: {
        breakfast: true,
        lunch: false,
        dinner: false
      },
      transport: {
        airportPickup: false,
        localTransport: false
      },
      amenities: {
        wifi: true,
        airConditioning: true,
        swimmingPool: true,
        spa: false
      },
      activities: {
        guidedTours: false,
        adventureSports: true,
        culturalEvents: false
      },
      restrictions: {
        noSmoking: true,
        noPets: false,
        notSuitableForChildren: false
      }
    }
  }
];

// Component for star rating
function StarRating({ rating, size = 'md' }) {
  const sizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={`${sizeClass[size]} ${i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
      {rating > 0 && (
        <span className={`ml-1 font-medium ${sizeClass[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function ListingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  
  // Find listing by slug
  const listing = MOCK_LISTINGS.find(item => item.slug === slug);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Helper function to render feature icons
  const renderFeatureIcon = (isIncluded, iconName, label) => {
    const iconClass = isIncluded ? "text-forest-green" : "text-gray-400";
    
    return (
      <div className="flex flex-col items-center justify-center text-center p-3">
        <FontAwesomeIcon icon={iconName} className={`text-xl ${iconClass} mb-2`} />
        <span className={`text-xs font-medium ${isIncluded ? "text-gray-800" : "text-gray-500"}`}>{label}</span>
        <span className={`text-xs mt-1 ${isIncluded ? "text-forest-green" : "text-gray-400"}`}>
          {isIncluded ? "Included" : "Not included"}
        </span>
      </div>
    );
  };
  
  // State for image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const handleBackClick = () => {
    router.back();
  };
  
  // Format price
  const formatPrice = (price) => {
    const currencySymbol = price.currency === 'INR' ? '₹' : price.currency;
    let priceLabel = '';
    
    switch (price.priceType) {
      case 'per_person':
        priceLabel = 'per person';
        break;
      case 'per_night':
        priceLabel = 'per night';
        break;
      case 'total':
        priceLabel = 'total';
        break;
      default:
        priceLabel = '';
    }
    
    // Format the number with commas for Indian numbering system
    const formattedAmount = price.amount.toLocaleString('en-IN');
    
    return `${currencySymbol}${formattedAmount} ${priceLabel}`;
  };
  
  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#EDF1D6]">
        <main className="flex-grow container mx-auto px-4 py-16 mt-24">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-deep-forest-green">Listing Not Found</h1>
            <p className="mb-8 text-gray-700">The listing you are looking for does not exist or has been removed.</p>
            <Button 
              onClick={() => router.push('/travel-listings')}
              className="bg-forest-green hover:bg-forest-green/90 text-white font-bold py-3 px-6 rounded"
            >
              Back to Listings
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow mt-24">
        <FadeIn>
          {/* Image gallery */}
          <div className="relative -mt-20"> {/* Negative margin to remove white gap */}
            <div className="relative h-[60vh] min-h-[350px] md:h-[70vh] md:min-h-[450px] w-full bg-[#EDF1D6]">
              <img
                src={listing.images[activeImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image counter overlay */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-deep-forest/70 text-pale-straw px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {activeImageIndex + 1} / {listing.images.length}
              </div>
              
              {/* Navigation arrows */}
              <button
                onClick={() => setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 sm:p-3 rounded-full text-deep-forest transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <FontAwesomeIcon icon={faChevronRight} className="rotate-180 text-xs sm:text-sm" />
              </button>
              <button
                onClick={() => setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 sm:p-3 rounded-full text-deep-forest transition-all hover:scale-110"
                aria-label="Next image"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
              </button>
              
              {/* Back button */}
              <button
                onClick={handleBackClick}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full text-deep-forest transition-colors hover:text-forest-green"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs sm:text-sm" />
              </button>
              
              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Thumbnails - visible on all screens but with different styles */}
            <div className="container mx-auto px-4 -mt-8 sm:-mt-10 md:-mt-12 relative z-10">
              <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 flex space-x-2 sm:space-x-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${
                      activeImageIndex === index 
                        ? 'border-forest-green shadow-md scale-105' 
                        : 'border-transparent hover:border-moss-green'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-pale-straw"> {/* Changed to pale straw background */}
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              {/* Breadcrumbs */}
              <div className="text-xs sm:text-sm text-deep-forest/70 mb-3 sm:mb-4 overflow-x-auto whitespace-nowrap">
                <a href="/" className="hover:text-forest-green">Home</a> &gt; 
                <a href="/travel-listings" className="hover:text-forest-green"> Travel Listings</a> &gt; 
                <span className="text-deep-forest"> {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}</span>
              </div>
              
              {/* Title and reviews */}
              <div className="mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-deep-forest font-clash">{listing.title}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span className="bg-moss-green/20 text-deep-forest text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                    {listing.packageType === 'stay' ? 'Accommodation' : listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                  </span>
                  
                  {listing.reviews && (
                    <div className="flex items-center">
                      <StarRating rating={listing.reviews.average} />
                      <span className="ml-1 text-deep-forest/70 text-xs sm:text-sm">({listing.reviews.count} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Location */}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center text-deep-forest/70 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1.5 sm:mr-2 text-forest-green" />
                  <span>
                    {listing.location.address}, {listing.location.city}, 
                    {listing.location.state && ` ${listing.location.state},`} {listing.location.country}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {/* Left column - Listing details */}
              <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {/* Tabs navigation */}
                <div className="border-b border-gray-200 mb-4 sm:mb-6">
                  <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'overview'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('features')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'features'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Package Features
                    </button>
                    <button
                      onClick={() => setActiveTab('amenities')}
                      className={`py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'amenities'
                          ? 'border-forest-green text-forest-green'
                          : 'border-transparent text-deep-forest/70 hover:text-deep-forest hover:border-moss-green'
                      }`}
                    >
                      Amenities
                    </button>
                  </nav>
                </div>
                
                {/* Tab content */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Description */}
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Description</h2>
                      <div className="prose max-w-none text-deep-forest/80 text-sm sm:text-base leading-relaxed">
                        {listing.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-3 sm:mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Highlights */}
                    <div className="mb-6 sm:mb-8 bg-pale-straw p-4 sm:p-5 rounded-lg">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Highlights</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {listing.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <FontAwesomeIcon icon={faCheck} className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 text-forest-green text-sm sm:text-base" />
                            <span className="text-deep-forest/90 font-medium text-sm sm:text-base">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Location Section */}
                    <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-5 rounded-lg border border-pale-straw">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Location</h2>
                      <div className="flex items-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-moss-green/20 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                          <FontAwesomeIcon icon={faLocationDot} className="text-forest-green text-base sm:text-lg" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-medium text-deep-forest mb-1">{listing.location.city}, {listing.location.state}</h3>
                          <p className="text-deep-forest/70 text-sm sm:text-base">{listing.location.address}, {listing.location.city}, {listing.location.state && `${listing.location.state},`} {listing.location.country}</p>
                          <p className="mt-2 text-forest-green text-xs sm:text-sm">
                            Ideal location with easy access to local attractions and transport options
                          </p>
                        </div>
                      </div>
                      
                      {/* Placeholder for map - in production this would be a real map */}
                      <div className="mt-4 bg-pale-straw h-36 sm:h-48 rounded-lg flex items-center justify-center text-deep-forest/50 text-sm">
                        <p>Interactive map would be displayed here</p>
                      </div>
                    </div>
                    
                    {/* Included/Excluded */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                      {/* Included */}
                      <div className="bg-pale-straw/60 p-4 sm:p-5 rounded-lg">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">What's Included</h2>
                        <ul className="space-y-2 sm:space-y-3">
                          {listing.includedServices.map((service, index) => (
                            <li key={index} className="flex items-start">
                              <FontAwesomeIcon icon={faCheck} className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 text-forest-green text-sm sm:text-base" />
                              <span className="text-deep-forest/80 text-sm sm:text-base">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Excluded */}
                      <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-deep-forest font-clash">Not Included</h2>
                        <ul className="space-y-2 sm:space-y-3">
                          {listing.excludedServices.map((service, index) => (
                            <li key={index} className="flex items-start">
                              <FontAwesomeIcon icon={faTimes} className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 text-red-500 text-sm sm:text-base" />
                              <span className="text-deep-forest/80 text-sm sm:text-base">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Reviews Section */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-deep-forest font-clash">Guest Reviews</h2>
                        <div className="flex items-center bg-moss-green/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full self-start sm:self-auto">
                          <StarRating rating={listing.reviews.average} size="lg" />
                          <span className="ml-1 text-deep-forest font-medium text-xs sm:text-sm">
                            ({listing.reviews.count} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6">
                        {listing.userReviews.map(review => (
                          <div key={review.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-2 sm:mb-3">
                              <div>
                                <h3 className="font-medium text-deep-forest text-sm sm:text-base">{review.name}</h3>
                                <p className="text-xs sm:text-sm text-deep-forest/50">{review.date}</p>
                              </div>
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="text-deep-forest/70 text-xs sm:text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-5 sm:mt-6 text-center">
                        <Button className="bg-forest-green hover:bg-forest-green/90 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm">
                          View All {listing.reviews.count} Reviews
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Package Features tab */}
                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-deep-forest-green">Package Features</h2>
                    
                    {/* Accommodation */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-forest-green mb-3">Accommodation</h3>
                      <div className="bg-[#EDF1D6]/40 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                          {renderFeatureIcon(listing.packageFeatures.accommodation, faBed, "Accommodation")}
                        </div>
                      </div>
                    </div>
                    
                    {/* Meals */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-forest-green mb-3">Meals</h3>
                      <div className="bg-[#EDF1D6]/40 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                          {renderFeatureIcon(listing.packageFeatures.meals.breakfast, faCoffee, "Breakfast")}
                          {renderFeatureIcon(listing.packageFeatures.meals.lunch, faUtensils, "Lunch")}
                          {renderFeatureIcon(listing.packageFeatures.meals.dinner, faWineGlassAlt, "Dinner")}
                        </div>
                      </div>
                    </div>
                    
                    {/* Transport */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-forest-green mb-3">Transport</h3>
                      <div className="bg-[#EDF1D6]/40 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                          {renderFeatureIcon(listing.packageFeatures.transport.airportPickup, faShuttleVan, "Airport Pickup")}
                          {renderFeatureIcon(listing.packageFeatures.transport.localTransport, faShuttleVan, "Local Transport")}
                        </div>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-forest-green mb-3">Amenities</h3>
                      <div className="bg-[#EDF1D6]/40 p-4 rounded-lg">
                        <div className="grid grid-cols-4 gap-2">
                          {renderFeatureIcon(listing.packageFeatures.amenities.wifi, faWifi, "Wi-Fi")}
                          {renderFeatureIcon(listing.packageFeatures.amenities.airConditioning, faCoffee, "AC")}
                          {renderFeatureIcon(listing.packageFeatures.amenities.swimmingPool, faWifi, "Pool")}
                          {renderFeatureIcon(listing.packageFeatures.amenities.spa, faWifi, "Spa")}
                        </div>
                      </div>
                    </div>
                    
                    {/* Restrictions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-forest-green mb-3">Restrictions</h3>
                      <div className="bg-[#EDF1D6]/40 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-2">
                          {renderFeatureIcon(listing.packageFeatures.restrictions.noSmoking, faSmokingBan, "No Smoking")}
                          {renderFeatureIcon(listing.packageFeatures.restrictions.noPets, faWifi, "No Pets")}
                          {renderFeatureIcon(listing.packageFeatures.restrictions.notSuitableForChildren, faChild, "Not for Children")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Amenities tab */}
                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-deep-forest-green">Amenities</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#EDF1D6]/50 p-5 rounded-lg">
                      {listing.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center">
                          <FontAwesomeIcon icon={faCheck} className="mr-3 text-forest-green" />
                          <span className="text-gray-800 font-medium">{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Right column - Booking card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md sticky top-24">
                  {/* Booking card header */}
                  <div className="bg-forest-green text-white p-3 sm:p-4 rounded-t-lg">
                    <h3 className="text-lg sm:text-xl font-bold font-clash">From {formatPrice(listing.price)}</h3>
                    <p className="text-xs sm:text-sm">Lowest price guarantee</p>
                  </div>
                  
                  {/* Booking card body */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex justify-center">
                      <Button
                        onClick={() => router.push(`/booking/${listing.slug}`)}
                        className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-bold py-2.5 sm:py-3 px-4 rounded text-sm sm:text-base"
                      >
                        Book Now
                      </Button>
                    </div>
                    
                    {/* Trust elements */}
                    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 bg-pale-straw/50 p-3 sm:p-4 rounded-lg">
                      <p className="flex items-start sm:items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-forest-green mt-0.5 sm:mt-0 mr-2 flex-shrink-0 text-xs sm:text-sm" />
                        <span className="text-deep-forest/70 text-xs sm:text-sm">Free cancellation up to 24 hours before</span>
                      </p>
                      <p className="flex items-start sm:items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-forest-green mt-0.5 sm:mt-0 mr-2 flex-shrink-0 text-xs sm:text-sm" />
                        <span className="text-deep-forest/70 text-xs sm:text-sm">Reserve now, pay later</span>
                      </p>
                      <p className="flex items-start sm:items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-forest-green mt-0.5 sm:mt-0 mr-2 flex-shrink-0 text-xs sm:text-sm" />
                        <span className="text-deep-forest/70 text-xs sm:text-sm">24/7 customer support</span>
                      </p>
                    </div>
                    
                    {/* Additional trust elements */}
                    <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-3 sm:pt-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-deep-forest mb-2 font-clash">Why book with Beatlenut Trails?</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-moss-green/20 rounded-full mr-2 sm:mr-3">
                            <FontAwesomeIcon icon={faUsers} className="text-forest-green text-xs" />
                          </div>
                          <div>
                            <p className="text-xs text-deep-forest/80 font-medium">Over 1000+ happy travelers</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-moss-green/20 rounded-full mr-2 sm:mr-3">
                            <FontAwesomeIcon icon={faStar} className="text-forest-green text-xs" />
                          </div>
                          <div>
                            <p className="text-xs text-deep-forest/80 font-medium">Rated excellent on TripAdvisor</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-moss-green/20 rounded-full mr-2 sm:mr-3">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-forest-green text-xs" />
                          </div>
                          <div>
                            <p className="text-xs text-deep-forest/80 font-medium">Instant booking confirmation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional CTA section */}
            <div className="mt-8 sm:mt-10 md:mt-12 bg-forest-green rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 font-clash">Ready for an Unforgettable Experience?</h2>
                  <p className="text-pale-straw/90 text-sm sm:text-base mb-4 sm:mb-6">Book now to secure your spot at {listing.title}. Our most popular dates fill up quickly.</p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <Button 
                      onClick={() => router.push(`/booking/${listing.slug}`)}
                      className="bg-pale-straw hover:bg-white text-deep-forest font-bold py-2 sm:py-3 px-4 sm:px-6 rounded text-sm sm:text-base"
                    >
                      Book Now
                    </Button>
                    <Button 
                      onClick={() => router.push('/contact')}
                      className="bg-transparent hover:bg-pale-straw/10 text-white border border-pale-straw font-bold py-2 sm:py-3 px-4 sm:px-6 rounded text-sm sm:text-base"
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-green/80 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}