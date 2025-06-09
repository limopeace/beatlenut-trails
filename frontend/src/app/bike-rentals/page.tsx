'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faCheck, faSearch, faMotorcycle, faShieldAlt, faRoad, faTools, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/common';

// Beatlenut Trails Motorcycle Fleet - Real client data
const bikeRentalsData = [
  {
    id: 1,
    name: '🏍️ Hero Xpulse 200',
    description: 'Forest nimble, village ready — a friendly wild soul. Lightweight, forgiving, and agile — perfect for trail exploration, village loops, and solo discovery.',
    pricePerDay: 2500,
    imageSrc: '/images/bikes/hero-xpulse-200.jpg',
    features: ['199cc FI Engine', 'Long-travel Suspension', 'Lightweight Adventure', 'Trail Ready'],
    specifications: {
      engine: '199cc, FI, long-travel suspension',
      category: 'Lightweight adventure',
      bestFor: 'Beginners, photographers, forest-heavy circuits',
      personality: 'Friendly wild soul',
    },
    availability: true,
    category: 'adventure'
  },
  {
    id: 2,
    name: '🏍️ Honda H\'ness CB350',
    description: 'A gentleman\'s cruiser, with a mountain\'s calm pulse. Comfortable, classy, and refined — ideal for Assam highways, Meghalaya ridges, and gentle long rides.',
    pricePerDay: 3000,
    imageSrc: '/images/bikes/honda-hness-cb350.jpg',
    features: ['348cc Engine', 'Smooth Mid-torque', 'Modern Classic', 'Comfort Focused'],
    specifications: {
      engine: '348cc, smooth mid-torque delivery',
      category: 'Modern classic cruiser',
      bestFor: 'Couples, cruiser lovers, style on smooth roads',
      personality: 'Mountain\'s calm pulse',
    },
    availability: true,
    category: 'cruiser'
  },
  {
    id: 3,
    name: '🏍️ Triumph Scrambler 400X',
    description: 'Heritage looks, Himalayan moves. Classic Triumph styling meets off-road confidence — ideal for curves, climbs, and cultural circuits.',
    pricePerDay: 4500,
    imageSrc: '/images/bikes/triumph-scrambler-400x.jpg',
    features: ['398cc Engine', 'Dual-purpose Capability', 'Classic Styling', 'Off-road Confidence'],
    specifications: {
      engine: '398cc, dual-purpose capability',
      category: 'Mid-range scrambler',
      bestFor: 'Confident riders seeking style + grit',
      personality: 'Heritage meets Himalayas',
    },
    availability: true,
    category: 'scrambler'
  },
  {
    id: 4,
    name: '🏍️ Suzuki V-Strom SX 250',
    description: 'A quiet warrior that keeps going. And going. Balanced, reliable, and surprisingly capable — perfect for mixed terrain with a touring mindset.',
    pricePerDay: 3500,
    imageSrc: '/images/bikes/suzuki-vstrom-sx-250.jpg',
    features: ['249cc Engine', 'All-rounder Geometry', 'Touring Focused', 'Reliable'],
    specifications: {
      engine: '249cc, all-rounder touring geometry',
      category: 'Sport adventure tourer',
      bestFor: 'Mid-level riders on long loops, solo or paired',
      personality: 'Quiet warrior',
    },
    availability: true,
    category: 'adventure'
  },
  {
    id: 5,
    name: '🏍️ Honda Transalp 750',
    description: 'The true alpine monarch. Torque, grace, and trust. Built for Himalayan passes and multi-nation crossings — smooth, authoritative, and road-hungry.',
    pricePerDay: 6500,
    imageSrc: '/images/bikes/honda-transalp-750.jpg',
    features: ['755cc Parallel-twin', 'Long-range Comfort', 'High-altitude Ready', 'Multi-nation Capable'],
    specifications: {
      engine: '755cc, parallel-twin, long-range comfort',
      category: 'Large-capacity ADV',
      bestFor: 'Experienced riders, long-day diverse terrain',
      personality: 'Alpine monarch',
    },
    availability: true,
    category: 'premium'
  },
  {
    id: 6,
    name: '🏍️ Kawasaki Versys 650',
    description: 'For those who treat curves like conversation. Great balance of power and agility — perfect for Bhutan rides, high-mileage road trips, and hill tarmac warriors.',
    pricePerDay: 5500,
    imageSrc: '/images/bikes/kawasaki-versys-650.jpg',
    features: ['649cc Parallel-twin', 'Power + Agility', 'Bhutan Ready', 'Hill Tarmac Warrior'],
    specifications: {
      engine: '649cc, parallel-twin',
      category: 'Mid-to-heavy adventure tourer',
      bestFor: 'Skilled riders wanting comfort + control at speed',
      personality: 'Curves like conversation',
    },
    availability: true,
    category: 'premium'
  },
  {
    id: 7,
    name: '🏍️ Kawasaki Versys 1100 (Advanced Only)',
    description: 'Not for speed. For stride. The king of roads. Built for epic trans-regional rides with power to spare — this beast belongs in the open.',
    pricePerDay: 8500,
    imageSrc: '/images/bikes/kawasaki-versys-1100.jpg',
    features: ['1,043cc Engine', 'Long-haul Dominance', 'Trans-regional', 'Advanced Riders Only'],
    specifications: {
      engine: '1,043cc — designed for long-haul dominance',
      category: 'High-performance grand tourer',
      bestFor: 'Veteran bikers, 1000+ cc experience, multi-nation circuits',
      personality: 'King of roads',
    },
    availability: true,
    category: 'premium'
  },
];

// Bike rental categories
const categories = [
  { id: 'all', name: 'All Bikes' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'cruiser', name: 'Cruiser' },
  { id: 'scrambler', name: 'Scrambler' },
  { id: 'premium', name: 'Premium & Specialist' }
];

// Cover images for carousel
const carouselImages = [
  '/images/WhatsApp Image 2025-05-13 at 5.58.51 PM.jpeg',
  '/images/WhatsApp Image 2025-05-13 at 5.58.52 PM.jpeg',
  '/images/WhatsApp Image 2025-05-13 at 5.58.52 PM (1).jpeg',
  '/images/WhatsApp Image 2025-05-13 at 5.58.53 PM.jpeg'
];

const BikeRentalsPage = () => {
  const [bikeRentals, setBikeRentals] = useState(bikeRentalsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter and sort bikes when parameters change
  useEffect(() => {
    let filteredBikes = [...bikeRentalsData];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredBikes = filteredBikes.filter(bike => bike.category === selectedCategory);
    }
    
    // Apply availability filter
    if (availableOnly) {
      filteredBikes = filteredBikes.filter(bike => bike.availability);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredBikes = filteredBikes.filter(bike => 
        bike.name.toLowerCase().includes(query) || 
        bike.description.toLowerCase().includes(query) ||
        bike.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredBikes.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        filteredBikes.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'name':
        filteredBikes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'recommended' - no additional sorting needed
        break;
    }
    
    setBikeRentals(filteredBikes);
  }, [selectedCategory, availableOnly, sortBy, searchQuery]);

  // Function to navigate to the previous slide
  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1));
  };

  // Function to navigate to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1));
  };

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="bg-pale-straw min-h-screen">
      {/* Hero Section with Carousel */}
      <div className="relative h-70 sm:h-80 md:h-96">
        <div className="absolute inset-0 overflow-hidden">
          {carouselImages.map((image, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={image}
                alt="Motorcycle rental in Northeast India"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Carousel Controls */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 sm:p-2 rounded-full transition"
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-base sm:text-xl" />
        </button>
        <button 
          onClick={goToNextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 sm:p-2 rounded-full transition"
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-base sm:text-xl" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1.5 sm:space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 font-clash">Bike Rentals</h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl">
            Explore Northeast India on two wheels with our premium motorcycle rental fleet
          </p>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-8 sm:py-10 md:py-12 shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-moss-green/30 rounded-full flex items-center justify-center text-forest-green mr-3 sm:mr-4">
                <FontAwesomeIcon icon={faMotorcycle} className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-deep-forest">Premium Bikes</h3>
                <p className="text-sm sm:text-base text-deep-forest/80">Top-tier motorcycles including Kawasaki, Royal Enfield and KTM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-moss-green/30 rounded-full flex items-center justify-center text-forest-green mr-3 sm:mr-4">
                <FontAwesomeIcon icon={faShieldAlt} className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-deep-forest">Safety First</h3>
                <p className="text-sm sm:text-base text-deep-forest/80">All bikes maintained to the highest safety standards</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-moss-green/30 rounded-full flex items-center justify-center text-forest-green mr-3 sm:mr-4">
                <FontAwesomeIcon icon={faRoad} className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-deep-forest">Guided Tours</h3>
                <p className="text-sm sm:text-base text-deep-forest/80">Options for self-ride or professionally guided adventures</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-moss-green/30 rounded-full flex items-center justify-center text-forest-green mr-3 sm:mr-4">
                <FontAwesomeIcon icon={faTools} className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-deep-forest">Full Support</h3>
                <p className="text-sm sm:text-base text-deep-forest/80">24/7 roadside assistance throughout Northeast India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Bike Listing */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-deep-forest mb-3 sm:mb-0 font-clash">Available Motorcycles</h2>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4 w-full xs:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search bikes..."
                  className="w-full px-3 sm:px-4 py-2 pr-9 sm:pr-10 border border-moss-green/30 rounded-full focus:outline-none focus:ring-2 focus:ring-forest-green bg-white text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-forest-green text-base"
                />
              </div>
              <button
                className="bg-moss-green text-deep-forest px-4 py-2 rounded-full flex items-center justify-center hover:bg-moss-green/80 transition-colors text-sm sm:text-base"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                <span className="inline">Filters</span>
              </button>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-5 sm:mb-6 border border-moss-green/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-deep-forest text-sm sm:text-base">Category</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`block w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition text-xs sm:text-sm ${
                          selectedCategory === category.id
                            ? 'bg-forest-green text-pale-straw'
                            : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-deep-forest text-sm sm:text-base">Sort By</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    <button
                      className={`block w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition text-xs sm:text-sm ${
                        sortBy === 'recommended'
                          ? 'bg-forest-green text-pale-straw'
                          : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                      }`}
                      onClick={() => setSortBy('recommended')}
                    >
                      Recommended
                    </button>
                    <button
                      className={`block w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition text-xs sm:text-sm ${
                        sortBy === 'price-low'
                          ? 'bg-forest-green text-pale-straw'
                          : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                      }`}
                      onClick={() => setSortBy('price-low')}
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`block w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition text-xs sm:text-sm ${
                        sortBy === 'price-high'
                          ? 'bg-forest-green text-pale-straw'
                          : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                      }`}
                      onClick={() => setSortBy('price-high')}
                    >
                      Price: High to Low
                    </button>
                    <button
                      className={`block w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition text-xs sm:text-sm ${
                        sortBy === 'name'
                          ? 'bg-forest-green text-pale-straw'
                          : 'bg-moss-green/20 text-deep-forest hover:bg-moss-green/30'
                      }`}
                      onClick={() => setSortBy('name')}
                    >
                      Name: A to Z
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-2 md:col-span-1">
                  <h3 className="font-medium mb-2 sm:mb-3 text-deep-forest text-sm sm:text-base">Availability</h3>
                  <div>
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center ${availableOnly ? 'bg-forest-green' : 'border border-moss-green/50'}`}>
                        {availableOnly && <FontAwesomeIcon icon={faCheck} className="text-pale-straw text-xs sm:text-sm" />}
                      </div>
                      <span className="text-deep-forest text-xs sm:text-sm">Show only available bikes</span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={availableOnly}
                        onChange={() => setAvailableOnly(!availableOnly)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bike Listings */}
        {bikeRentals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {bikeRentals.map((bike) => (
              <div key={bike.id} className="group block transform transition duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full border border-moss-green/10">
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                    <img
                      src={bike.imageSrc}
                      alt={bike.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    {!bike.availability && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Booked
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-forest-green text-pale-straw text-sm sm:text-base md:text-lg font-bold px-3 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-md">
                      ${bike.pricePerDay}/day
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-deep-forest mb-1 sm:mb-2 font-clash">
                      {bike.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-deep-forest/80 mb-3 sm:mb-4">{bike.description}</p>
                    
                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-forest-green mb-1 sm:mb-2">Specifications:</h4>
                      <ul className="text-deep-forest/80 text-xs sm:text-sm">
                        {Object.entries(bike.specifications).map(([key, value]) => (
                          <li key={key} className="flex items-center mb-0.5 sm:mb-1">
                            <span className="capitalize w-20 sm:w-24">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                            <span className="font-medium">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-forest-green mb-1 sm:mb-2">Features:</h4>
                      <ul className="text-deep-forest/80 text-xs sm:text-sm grid grid-cols-1 xs:grid-cols-2 gap-x-1 sm:gap-x-2 gap-y-0.5 sm:gap-y-1">
                        {bike.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-forest-green mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {bike.availability ? (
                      <WhatsAppButton 
                        template="bikeRentals"
                        source="bike-rentals-page"
                        product={bike.name}
                        className="w-full py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
                        showIcon={true}
                        showText={true}
                        text="Book Now via WhatsApp"
                      />
                    ) : (
                      <button 
                        className="w-full py-1.5 sm:py-2 rounded-full font-medium bg-gray-300 text-gray-600 cursor-not-allowed text-xs sm:text-sm"
                        disabled
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-5 sm:p-8 rounded-lg shadow-sm text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No bikes found</h3>
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">Try adjusting your filters or search criteria</p>
            <button 
              className="bg-forest-green text-pale-straw px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm"
              onClick={() => {
                setSelectedCategory('all');
                setAvailableOnly(false);
                setSortBy('recommended');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Booking Information */}
      <div className="bg-deep-forest text-pale-straw py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-clash">How to Book a Motorcycle</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-forest-green/20 p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-pale-straw text-deep-forest rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-md">1</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-clash">Choose Your Bike</h3>
                <p className="text-pale-straw/90 text-sm sm:text-base">Browse our selection and find the perfect motorcycle for your adventure</p>
              </div>
              
              <div className="bg-forest-green/20 p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-pale-straw text-deep-forest rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-md">2</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-clash">Book Online</h3>
                <p className="text-pale-straw/90 text-sm sm:text-base">Reserve your motorcycle with our easy online booking system</p>
              </div>
              
              <div className="bg-forest-green/20 p-4 sm:p-5 md:p-6 rounded-lg sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-pale-straw text-deep-forest rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-md">3</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-clash">Ride Away</h3>
                <p className="text-pale-straw/90 text-sm sm:text-base">Pick up your bike and begin your Northeast India adventure</p>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-10 md:mt-12">
              <WhatsAppButton 
                template="bikeRentals"
                source="bike-rentals-page"
                className="bg-pale-straw text-deep-forest px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-pale-straw/90 transition-colors shadow-md text-sm sm:text-base"
                showIcon={true}
                showText={true}
                text="Contact Us for Special Requests"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-forest-green/10 -z-5"></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-pale-straw/5 rounded-full -z-5"></div>
      </div>
    </div>
  );
};

export default BikeRentalsPage;