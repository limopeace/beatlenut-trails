'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';
import ListingCard from '@/components/travel/ListingCard';

// Mock data for initial development
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Meghalaya Mountain Retreat',
    slug: 'meghalaya-mountain-retreat',
    location: { city: 'Shillong', country: 'India' },
    category: 'stay',
    packageType: 'stay',
    price: { amount: 12999, currency: 'INR', priceType: 'per_night' },
    images: ['/images/real/pexels-travelerchitect-18736328-min.jpg'],
    reviews: { average: 4.8, count: 124 },
    summary: 'Experience luxury in the mountains with breathtaking views and premium amenities.',
    availableDates: [
      { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), availability: 5 },
    ],
  },
  {
    id: '2',
    title: 'Goa Beach Resort',
    slug: 'goa-beach-resort',
    location: { city: 'Calangute', country: 'India' },
    category: 'resort',
    packageType: 'stay',
    price: { amount: 8999, currency: 'INR', priceType: 'per_night' },
    images: ['/images/real/pexels-nans1419-20519339-min.jpg'],
    reviews: { average: 4.5, count: 87 },
    summary: 'Relax on pristine beaches and enjoy world-class service at our beachfront property.',
    availableDates: [
      { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), availability: 3 },
    ],
  },
  {
    id: '3',
    title: 'Jaipur Heritage Tour',
    slug: 'jaipur-heritage-tour',
    location: { city: 'Jaipur', country: 'India' },
    category: 'tour',
    packageType: 'tour',
    price: { amount: 3499, currency: 'INR', priceType: 'per_person' },
    images: ['/images/real/pexels-dizitalboost-11622977-min.jpg'],
    reviews: { average: 4.7, count: 156 },
    summary: 'Discover the ancient wonders of Jaipur with our expert guides and skip-the-line access.',
    availableDates: [
      { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), availability: 10 },
    ],
  },
  {
    id: '4',
    title: 'Kaziranga Wildlife Adventure',
    slug: 'kaziranga-wildlife-adventure',
    location: { city: 'Kaziranga', country: 'India' },
    category: 'adventure',
    packageType: 'tour',
    price: { amount: 18999, currency: 'INR', priceType: 'per_person' },
    images: ['/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg'],
    reviews: { average: 4.9, count: 78 },
    summary: 'Embark on an unforgettable journey through Kaziranga National Park with expert guides.',
    availableDates: [
      { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), availability: 8 },
    ],
  },
  {
    id: '5',
    title: 'Northeast Bike Expedition',
    slug: 'northeast-bike-expedition',
    location: { city: 'Guwahati', country: 'India' },
    category: 'biking',
    packageType: 'biking',
    price: { amount: 15999, currency: 'INR', priceType: 'per_person' },
    images: ['/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg'],
    reviews: { average: 4.6, count: 92 },
    summary: 'Experience the thrill of biking through the scenic Northeast with experienced guides.',
    availableDates: [
      { startDate: new Date('2023-09-01'), endDate: new Date('2024-03-31'), availability: 6 },
    ],
  },
  {
    id: '6',
    title: 'Ladakh Biking Tour',
    slug: 'ladakh-biking-tour',
    location: { city: 'Leh', country: 'India' },
    category: 'biking',
    packageType: 'biking',
    price: { amount: 22999, currency: 'INR', priceType: 'per_person' },
    images: ['/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg'],
    reviews: { average: 4.4, count: 112 },
    summary: 'Ride through the breathtaking landscapes of Ladakh on this thrilling biking adventure.',
    availableDates: [
      { startDate: new Date('2023-06-01'), endDate: new Date('2023-12-31'), availability: 15 },
    ],
  },
];

// Categories for filters
const CATEGORIES = [
  { value: 'hotel', label: 'Hotels' },
  { value: 'resort', label: 'Resorts' },
  { value: 'tour', label: 'Tours' },
  { value: 'adventure', label: 'Adventures' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'cruise', label: 'Cruises' },
  { value: 'retreat', label: 'Retreats' },
  { value: 'camping', label: 'Camping' },
];

// Price ranges for filters
const PRICE_RANGES = [
  { value: '0-100', label: 'Under $100' },
  { value: '100-200', label: 'Up to $200' },
  { value: '200-500', label: 'Up to $500' },
  { value: '500-1000', label: 'Up to $1000' },
  { value: '1000+', label: '$1000 & Above' },
];

const TravelListingsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  
  // State for listings and pagination
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [filteredListings, setFilteredListings] = useState(MOCK_LISTINGS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const listingsPerPage = 6;
  
  // Handle search and filter changes
  useEffect(() => {
    // In a real app, this would be an API call with the filters applied
    let filtered = [...listings];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        listing => 
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (listing.summary && listing.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }
    
    // Apply price range filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(val => parseInt(val.replace('+', '9999')));
      filtered = filtered.filter(listing => {
        const price = listing.price.amount;
        return price >= min && (max === 9999 ? true : price <= max);
      });
    }
    
    // Apply date filter
    if (selectedDates.startDate && selectedDates.endDate) {
      filtered = filtered.filter(listing => {
        // Check if any available date range overlaps with selected dates
        return listing.availableDates.some(dateRange => {
          const rangeStart = new Date(dateRange.startDate);
          const rangeEnd = new Date(dateRange.endDate);
          return (
            selectedDates.startDate &&
            selectedDates.endDate &&
            rangeStart <= selectedDates.startDate &&
            rangeEnd >= selectedDates.endDate
          );
        });
      });
    }
    
    setFilteredListings(filtered);
    setTotalPages(Math.ceil(filtered.length / listingsPerPage));
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedCategory, selectedPriceRange, selectedDates, listings]);
  
  // Handle pagination
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedDates({ startDate: null, endDate: null });
  };
  
  // Handle view details
  const handleViewDetails = (slug: string) => {
    router.push(`/travel-listings/${slug}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-pale-straw">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-deep-forest/60 z-10"></div>
        <img 
          src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg" 
          alt="Travel experiences"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 md:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pale-straw mb-4 sm:mb-6 font-clash">
            Discover Amazing Travel Experiences
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pale-straw/90 max-w-md sm:max-w-xl md:max-w-2xl">
            Explore handcrafted journeys through Northeast India's breathtaking landscapes
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <FadeIn>
          {/* Mobile filter toggle button - only visible on small screens */}
          <div className="lg:hidden mb-6 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-deep-forest font-clash">Travel Listings</h2>
            <button 
              onClick={() => document.getElementById('mobile-filters')?.classList.toggle('hidden')} 
              className="bg-forest-green hover:bg-deep-forest text-pale-straw px-4 py-2 rounded-md flex items-center transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
          
          {/* Mobile filters panel */}
          <div id="mobile-filters" className="lg:hidden mb-6 hidden">
            <div className="bg-moss-green/20 p-5 rounded-lg shadow-sm border border-moss-green/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-deep-forest font-clash">Filters</h2>
                <button 
                  onClick={() => document.getElementById('mobile-filters')?.classList.add('hidden')}
                  className="text-deep-forest hover:text-forest-green transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search box */}
              <div className="mb-5">
                <label htmlFor="mobile-search" className="block mb-2 font-medium text-deep-forest/80">
                  Search
                </label>
                <input
                  type="text"
                  id="mobile-search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Location, activity, etc."
                  className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white placeholder-deep-forest/50"
                />
              </div>
              
              {/* Category filter */}
              <div className="mb-5">
                <label htmlFor="mobile-category" className="block mb-2 font-medium text-deep-forest/80">
                  Category
                </label>
                <select
                  id="mobile-category"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price range filter */}
              <div className="mb-5">
                <label htmlFor="mobile-price" className="block mb-2 font-medium text-deep-forest/80">
                  Price Range
                </label>
                <select
                  id="mobile-price"
                  value={selectedPriceRange}
                  onChange={e => setSelectedPriceRange(e.target.value)}
                  className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest"
                >
                  <option value="">Any Price</option>
                  {PRICE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Date range picker */}
              <div className="mb-5">
                <label htmlFor="mobile-dates" className="block mb-2 font-medium text-deep-forest/80">
                  Travel Dates
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={selectedDates.startDate ? selectedDates.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const newStartDate = e.target.value ? new Date(e.target.value) : null;
                      setSelectedDates({...selectedDates, startDate: newStartDate});
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="date"
                    value={selectedDates.endDate ? selectedDates.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const newEndDate = e.target.value ? new Date(e.target.value) : null;
                      setSelectedDates({...selectedDates, endDate: newEndDate});
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min={selectedDates.startDate ? selectedDates.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {/* Clear filters button */}
              <button
                onClick={() => {
                  clearFilters();
                  document.getElementById('mobile-filters')?.classList.add('hidden');
                }}
                className="w-full py-3 px-4 bg-transparent border-2 border-moss-green text-deep-forest font-medium rounded-md hover:bg-moss-green/10 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10">
            {/* Desktop Filters sidebar - only visible on large screens */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-moss-green/20 p-6 rounded-lg shadow-sm border border-moss-green/10 sticky top-24">
                <h2 className="text-2xl font-semibold mb-6 text-deep-forest font-clash">Filters</h2>
                
                {/* Search box */}
                <div className="mb-6">
                  <label htmlFor="search" className="block mb-2 font-medium text-deep-forest/80">
                    Search
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Location, activity, etc."
                    className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white placeholder-deep-forest/50"
                  />
                </div>
                
                {/* Category filter */}
                <div className="mb-6">
                  <label htmlFor="category" className="block mb-2 font-medium text-deep-forest/80">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Price range filter */}
                <div className="mb-6">
                  <label htmlFor="price" className="block mb-2 font-medium text-deep-forest/80">
                    Price Range
                  </label>
                  <select
                    id="price"
                    value={selectedPriceRange}
                    onChange={e => setSelectedPriceRange(e.target.value)}
                    className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-white text-deep-forest"
                  >
                    <option value="">Any Price</option>
                    {PRICE_RANGES.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Date range picker */}
                <div className="mb-6">
                  <label htmlFor="dates" className="block mb-2 font-medium text-deep-forest/80">
                    Travel Dates
                  </label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="date"
                      value={selectedDates.startDate ? selectedDates.startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newStartDate = e.target.value ? new Date(e.target.value) : null;
                        setSelectedDates({...selectedDates, startDate: newStartDate});
                      }}
                      className="w-full p-2 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <input
                      type="date"
                      value={selectedDates.endDate ? selectedDates.endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newEndDate = e.target.value ? new Date(e.target.value) : null;
                        setSelectedDates({...selectedDates, endDate: newEndDate});
                      }}
                      className="w-full p-2 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50"
                      min={selectedDates.startDate ? selectedDates.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                {/* Clear filters button */}
                <button
                  onClick={clearFilters}
                  className="w-full py-3 px-4 bg-transparent border-2 border-moss-green text-deep-forest font-medium rounded-md hover:bg-moss-green/10 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Listings grid */}
            <div className="lg:col-span-3">
              {filteredListings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {paginatedListings.map(listing => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListingCard 
                          listing={listing} 
                          onViewDetails={() => handleViewDetails(listing.slug)} 
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8 sm:mt-10">
                      <nav className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 sm:px-4 py-2 border border-moss-green/30 rounded-md disabled:opacity-50 bg-white text-deep-forest hover:bg-moss-green/10 transition-colors text-sm sm:text-base"
                        >
                          Prev
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded-md text-sm sm:text-base ${
                              currentPage === page
                                ? 'bg-forest-green text-pale-straw border-forest-green'
                                : 'bg-white text-deep-forest border-moss-green/30 hover:bg-moss-green/10'
                            } transition-colors`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 sm:px-4 py-2 border border-moss-green/30 rounded-md disabled:opacity-50 bg-white text-deep-forest hover:bg-moss-green/10 transition-colors text-sm sm:text-base"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 bg-white rounded-lg border border-moss-green/20 shadow-sm p-4">
                  <p className="text-lg sm:text-xl font-medium text-deep-forest mb-4 text-center">
                    No listings found matching your criteria
                  </p>
                  <button
                    onClick={clearFilters}
                    className="py-2 sm:py-3 px-5 sm:px-6 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition-colors duration-300 text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
};

const TravelListingsPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <TravelListingsContent />
    </Suspense>
  );
};

export default TravelListingsPage;