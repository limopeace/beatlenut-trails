'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSearch, 
  faFilter, 
  faEdit, 
  faEye, 
  faTrash, 
  faStar,
  faCheck,
  faTimes,
  faHeart,
  faReply,
  faComment,
  faThumbsUp,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for initial development
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Meghalaya Mountain Retreat',
    slug: 'meghalaya-mountain-retreat',
    location: { city: 'Shillong', country: 'India' }
  },
  {
    id: '2',
    title: 'Kerala Backwater Houseboat',
    slug: 'kerala-backwater-houseboat',
    location: { city: 'Alleppey', country: 'India' }
  },
  {
    id: '3',
    title: 'Himalayan Trekking Adventure',
    slug: 'himalayan-trekking-adventure',
    location: { city: 'Manali', country: 'India' }
  }
];

const MOCK_REVIEWS = [
  {
    id: 'review-1',
    listingId: '1',
    author: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    avatar: '/images/testimonial-placeholder.jpg',
    rating: 5,
    title: 'Breathtaking scenery and exceptional service',
    comment: 'Our stay at the Meghalaya Mountain Retreat was absolutely phenomenal. The views are even better than the pictures suggest, and the staff went above and beyond to make our stay special. The guided tour to the living root bridges was a highlight of our trip. Highly recommend!',
    verified: true,
    approved: true,
    featured: true,
    travelDate: new Date('2023-05-10'),
    helpfulVotes: 12,
    adminResponse: 'Thank you for your wonderful review, Rahul! We\'re delighted to hear you enjoyed the living root bridges tour. We hope to welcome you back soon!',
    images: [
      { url: '/images/real/pexels-travelerchitect-18736328-min.jpg', caption: 'View from our room' },
      { url: '/images/real/pexels-nans1419-20519339-min.jpg', caption: 'Living root bridge' }
    ],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-18')
  },
  {
    id: 'review-2',
    listingId: '1',
    author: 'Priya Patel',
    email: 'priya.patel@example.com',
    avatar: '/images/testimonial-placeholder.jpg',
    rating: 4,
    title: 'Perfect getaway from city life',
    comment: 'Such a peaceful and rejuvenating experience. The rooms are spacious and comfortable, and the food is outstanding with fresh local ingredients. My only small complaint is that the wifi was a bit spotty, but then again, we came here to disconnect!',
    verified: true,
    approved: true,
    featured: false,
    travelDate: new Date('2023-04-18'),
    helpfulVotes: 8,
    adminResponse: null,
    images: [],
    createdAt: new Date('2023-04-22'),
    updatedAt: new Date('2023-04-22')
  },
  {
    id: 'review-3',
    listingId: '2',
    author: 'Amit Desai',
    email: 'amit.desai@example.com',
    avatar: '/images/testimonial-placeholder.jpg',
    rating: 5,
    title: 'A magical experience in the backwaters',
    comment: 'Spending a night on the houseboat was magical. Watching the sunset over the backwaters while eating freshly caught fish was an experience I\'ll never forget. The crew was professional and attentive, making sure we had everything we needed.',
    verified: true,
    approved: true,
    featured: true,
    travelDate: new Date('2023-03-05'),
    helpfulVotes: 15,
    adminResponse: 'Thank you for your kind words, Amit! The backwater sunsets are indeed spectacular, and we\'re glad you enjoyed the cuisine.',
    images: [
      { url: '/images/real/pexels-dizitalboost-11622977-min.jpg', caption: 'Sunset over the backwaters' }
    ],
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-12')
  },
  {
    id: 'review-4',
    listingId: '3',
    author: 'Sneha Gupta',
    email: 'sneha.gupta@example.com',
    avatar: '/images/testimonial-placeholder.jpg',
    rating: 3,
    title: 'Good trek but some issues with accommodations',
    comment: 'The trek itself was wonderful with breathtaking views of the Himalayas. Our guide was knowledgeable and made sure everyone was safe. However, the accommodations during the trek were not as described - they were quite basic and not very clean. Be prepared for very rustic conditions.',
    verified: true,
    approved: false, // Awaiting approval
    featured: false,
    travelDate: new Date('2023-06-01'),
    helpfulVotes: 0,
    adminResponse: null,
    images: [],
    createdAt: new Date('2023-06-08'),
    updatedAt: new Date('2023-06-08')
  },
  {
    id: 'review-5',
    listingId: '2',
    author: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    avatar: '/images/testimonial-placeholder.jpg',
    rating: 5,
    title: 'Exceptional service and delicious food',
    comment: 'The houseboat exceeded our expectations in every way. The bedroom was comfortable and air-conditioned, and the bathroom was clean with hot water. The real highlight was the food - fresh, flavorful, and plentiful. We were treated to some amazing Kerala specialties.',
    verified: false, // Not verified
    approved: false, // Awaiting approval
    featured: false,
    travelDate: new Date('2023-05-25'),
    helpfulVotes: 0,
    adminResponse: null,
    images: [],
    createdAt: new Date('2023-05-30'),
    updatedAt: new Date('2023-05-30')
  }
];

// Status options for filter
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'featured', label: 'Featured' }
];

// Listing options for filter
const LISTING_OPTIONS = [
  { value: 'all', label: 'All Listings' },
  ...MOCK_LISTINGS.map(listing => ({
    value: listing.id,
    label: listing.title
  }))
];

export default function AdminReviewsPage() {
  const router = useRouter();
  
  // State for reviews and filters
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filteredReviews, setFilteredReviews] = useState(MOCK_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [listingFilter, setListingFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // Selected review
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [responseText, setResponseText] = useState('');
  
  // Apply filters
  useEffect(() => {
    let filtered = [...reviews];
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        review => 
          review.author.toLowerCase().includes(search) ||
          review.email.toLowerCase().includes(search) ||
          review.title.toLowerCase().includes(search) ||
          review.comment.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(review => review.approved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(review => !review.approved);
      } else if (statusFilter === 'featured') {
        filtered = filtered.filter(review => review.featured);
      }
    }
    
    // Apply listing filter
    if (listingFilter !== 'all') {
      filtered = filtered.filter(review => review.listingId === listingFilter);
    }
    
    // Apply rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredReviews(filtered);
  }, [reviews, searchTerm, statusFilter, listingFilter, ratingFilter]);
  
  // Fetch reviews from API (simulated)
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        setReviews(MOCK_REVIEWS);
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get listing info by ID
  const getListingById = (id: string) => {
    return MOCK_LISTINGS.find(listing => listing.id === id) || {
      title: 'Unknown Listing',
      location: { city: 'Unknown', country: 'Unknown' }
    };
  };
  
  // Get star rating display
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className={i < rating ? "text-yellow-500" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };
  
  // Handle toggle approval
  const handleToggleApproval = async (reviewId: string) => {
    // In a real app, this would be an API call
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, approved: !review.approved }
          : review
      )
    );
    
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview({ ...selectedReview, approved: !selectedReview.approved });
    }
    
    // Show success message
    alert(`Review ${selectedReview?.approved ? 'unapproved' : 'approved'} successfully`);
  };
  
  // Handle toggle featured
  const handleToggleFeatured = async (reviewId: string) => {
    // In a real app, this would be an API call
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, featured: !review.featured }
          : review
      )
    );
    
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview({ ...selectedReview, featured: !selectedReview.featured });
    }
    
    // Show success message
    alert(`Review ${selectedReview?.featured ? 'unfeatured' : 'featured'} successfully`);
  };
  
  // Handle delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      // In a real app, this would be an API call
      setReviews(prevReviews =>
        prevReviews.filter(review => review.id !== reviewId)
      );
      
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview(null);
      }
      
      // Show success message
      alert('Review deleted successfully');
    }
  };
  
  // Handle add response
  const handleAddResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }
    
    // In a real app, this would be an API call
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, adminResponse: responseText, updatedAt: new Date() }
          : review
      )
    );
    
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview({ 
        ...selectedReview, 
        adminResponse: responseText,
        updatedAt: new Date()
      });
    }
    
    setResponseText('');
    
    // Show success message
    alert('Response added successfully');
  };
  
  // View review details
  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setResponseText(review.adminResponse || '');
  };
  
  // Close details panel
  const handleCloseDetails = () => {
    setSelectedReview(null);
    setResponseText('');
  };
  
  return (
    <>
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Review Management</h1>
            
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
            {/* Left column - Reviews list */}
            <div className={`${selectedReview ? 'hidden lg:block' : ''} lg:col-span-${selectedReview ? '1' : '3'}`}>
              {/* Filters */}
              <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
                  <h2 className="text-lg font-medium">Filters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  {/* Listing filter */}
                  <div>
                    <select
                      value={listingFilter}
                      onChange={(e) => setListingFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      {LISTING_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  
                  {/* Rating filter */}
                  <div>
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={0}>All Ratings</option>
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Reviews list */}
              {loading ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-3xl mb-4" />
                  <p>Loading reviews...</p>
                </div>
              ) : error ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center text-red-600">
                  <FontAwesomeIcon icon={faTimes} className="text-3xl mb-4" />
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <p className="text-lg mb-4">No reviews match your filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setListingFilter('all');
                      setRatingFilter(0);
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
                          Review
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Listing
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
                      {filteredReviews.map((review) => {
                        const listing = getListingById(review.listingId);
                        
                        return (
                          <tr 
                            key={review.id} 
                            className={`hover:bg-gray-50 ${!review.approved ? 'bg-yellow-50' : ''}`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-start">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                  <Image
                                    src={review.avatar}
                                    alt={review.author}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{review.title}</div>
                                  <div className="text-sm text-gray-500">
                                    By {review.author}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-400 mt-1">
                                    {renderStarRating(review.rating)}
                                    <span className="ml-2">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium">{listing.title}</div>
                              <div className="text-sm text-gray-500">
                                {listing.location.city}, {listing.location.country}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col space-y-2">
                                {review.approved ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                    Approved
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                                    Pending
                                  </span>
                                )}
                                
                                {review.featured && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                    Featured
                                  </span>
                                )}
                                
                                {review.verified && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                    Verified
                                  </span>
                                )}
                                
                                {review.adminResponse && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                                    Response
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewReview(review)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Details"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                  onClick={() => handleToggleApproval(review.id)}
                                  className={review.approved ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"}
                                  title={review.approved ? "Unapprove" : "Approve"}
                                >
                                  <FontAwesomeIcon icon={review.approved ? faTimes : faCheck} />
                                </button>
                                <button
                                  onClick={() => handleToggleFeatured(review.id)}
                                  className={review.featured ? "text-gray-600 hover:text-gray-800" : "text-indigo-600 hover:text-indigo-800"}
                                  title={review.featured ? "Unfeature" : "Feature"}
                                >
                                  <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Right column - Review details */}
            {selectedReview && (
              <div className="lg:col-span-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Review Details</h2>
                    <button
                      onClick={handleCloseDetails}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Review header */}
                    <div className="flex items-start mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={selectedReview.avatar}
                          alt={selectedReview.author}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedReview.title}</h3>
                        <div className="flex items-center mt-1">
                          {renderStarRating(selectedReview.rating)}
                          <span className="ml-2 text-gray-600">
                            Traveled on {formatDate(selectedReview.travelDate)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          By {selectedReview.author} ({selectedReview.email})
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Posted on {formatDate(selectedReview.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Listing info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium">
                        {getListingById(selectedReview.listingId).title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getListingById(selectedReview.listingId).location.city}, 
                        {getListingById(selectedReview.listingId).location.country}
                      </div>
                    </div>
                    
                    {/* Review content */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Review</h4>
                      <p className="text-gray-700 whitespace-pre-line">{selectedReview.comment}</p>
                    </div>
                    
                    {/* Review images */}
                    {selectedReview.images && selectedReview.images.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedReview.images.map((image: any, index: number) => (
                            <div key={index} className="relative">
                              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                <Image
                                  src={image.url}
                                  alt={image.caption || `Review image ${index + 1}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              {image.caption && (
                                <p className="text-xs text-gray-500 mt-1 text-center">
                                  {image.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Admin response */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Admin Response</h4>
                      {selectedReview.adminResponse ? (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-700">{selectedReview.adminResponse}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Last updated: {formatDate(selectedReview.updatedAt)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No response added yet</p>
                      )}
                    </div>
                    
                    {/* Add/Edit response */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">
                        {selectedReview.adminResponse ? 'Edit Response' : 'Add Response'}
                      </h4>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                        placeholder="Enter your response to this review..."
                      />
                      <button
                        onClick={() => handleAddResponse(selectedReview.id)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faReply} className="mr-2" />
                        {selectedReview.adminResponse ? 'Update Response' : 'Add Response'}
                      </button>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="border-t pt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleToggleApproval(selectedReview.id)}
                        className={`px-4 py-2 rounded-md ${
                          selectedReview.approved
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        <FontAwesomeIcon 
                          icon={selectedReview.approved ? faTimes : faCheck} 
                          className="mr-2" 
                        />
                        {selectedReview.approved ? 'Unapprove Review' : 'Approve Review'}
                      </button>
                      
                      <button
                        onClick={() => handleToggleFeatured(selectedReview.id)}
                        className={`px-4 py-2 rounded-md ${
                          selectedReview.featured
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                        }`}
                      >
                        <FontAwesomeIcon 
                          icon={faHeart} 
                          className="mr-2" 
                        />
                        {selectedReview.featured ? 'Unfeature Review' : 'Feature Review'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteReview(selectedReview.id)}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
    </>
  );
};

