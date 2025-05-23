'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faSearch, 
  faStar,
  faCheck,
  faTimes,
  faTrash,
  faArrowUp,
  faArrowDown,
  faEdit,
  faPlus,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import { Button } from '@/components/common';

// Mock data for development
const MOCK_HOMEPAGE_REVIEWS = [
  {
    id: "1",
    author: "Rahul Sharma",
    location: "Delhi, India",
    avatar: "/images/testimonial-placeholder.jpg",
    rating: 5,
    review: "Amazing experience! The guides were knowledgeable and the accommodations were excellent. I'll definitely book through Beatlenut Trails again.",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    author: "Priya Patel",
    location: "Mumbai, India",
    avatar: "/images/testimonial-placeholder.jpg",
    rating: 5,
    review: "Our trekking adventure in Meghalaya was the highlight of our year. Everything was perfectly arranged. Highly recommended!",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    author: "Amit Desai",
    location: "Bangalore, India",
    avatar: "/images/testimonial-placeholder.jpg",
    rating: 5,
    review: "The Kerala backwater houseboat experience exceeded all our expectations. Professional service from start to finish.",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    author: "Sneha Gupta",
    location: "Kolkata, India",
    avatar: "/images/testimonial-placeholder.jpg",
    rating: 4,
    review: "Great service and beautiful locations. The only small issue was the weather, but that's obviously not in anyone's control!",
    featured: false,
    order: null,
  },
  {
    id: "5",
    author: "Vikram Singh",
    location: "Jaipur, India",
    avatar: "/images/testimonial-placeholder.jpg",
    rating: 5,
    review: "Beatlenut Trails organized a perfect vacation for our family. The local guides were exceptional and showed us places we wouldn't have found on our own.",
    featured: false,
    order: null,
  }
];

// Function to filter and sort homepage reviews
const getFilteredReviews = (reviews, searchTerm = '', showFeatured = false) => {
  let filtered = [...reviews];
  
  // Apply search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(review => 
      review.author.toLowerCase().includes(search) || 
      review.review.toLowerCase().includes(search) ||
      review.location.toLowerCase().includes(search)
    );
  }
  
  // Apply featured filter
  if (showFeatured) {
    filtered = filtered.filter(review => review.featured);
  }
  
  // Sort by order for featured reviews, then by id for non-featured
  filtered.sort((a, b) => {
    if (a.featured && b.featured) {
      return a.order - b.order;
    }
    if (a.featured) return -1;
    if (b.featured) return 1;
    return a.id.localeCompare(b.id);
  });
  
  return filtered;
};

export default function HomepageReviewsPage() {
  const router = useRouter();
  
  // State for reviews
  const [allReviews, setAllReviews] = useState(MOCK_HOMEPAGE_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  
  // Get filtered reviews
  const filteredReviews = getFilteredReviews(allReviews, searchTerm, showFeatured);
  
  // Fetch reviews (simulated)
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setAllReviews(MOCK_HOMEPAGE_REVIEWS);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Toggle feature status
  const handleToggleFeature = (id: string) => {
    setAllReviews(prev => {
      const updated = prev.map(review => {
        if (review.id === id) {
          // If we're featuring a previously unfeatured review
          if (!review.featured) {
            // Find max order of currently featured reviews
            const maxOrder = Math.max(0, ...prev.filter(r => r.featured).map(r => r.order || 0));
            return { 
              ...review, 
              featured: true, 
              order: maxOrder + 1 
            };
          }
          // If we're unfeaturing a review
          return { 
            ...review, 
            featured: false, 
            order: null 
          };
        }
        return review;
      });
      
      return updated;
    });
  };
  
  // Reorder featured reviews
  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setAllReviews(prev => {
      // Get only featured reviews, sorted by order
      const featuredReviews = prev
        .filter(r => r.featured)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Find current index
      const currentIndex = featuredReviews.findIndex(r => r.id === id);
      if (currentIndex === -1) return prev;
      
      // Calculate new index
      const newIndex = direction === 'up' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(featuredReviews.length - 1, currentIndex + 1);
      
      // If no change needed
      if (newIndex === currentIndex) return prev;
      
      // Swap orders
      const targetReview = featuredReviews[newIndex];
      const currentReview = featuredReviews[currentIndex];
      
      return prev.map(review => {
        if (review.id === currentReview.id) {
          return { ...review, order: targetReview.order };
        }
        if (review.id === targetReview.id) {
          return { ...review, order: currentReview.order };
        }
        return review;
      });
    });
  };
  
  // Delete review
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setAllReviews(prev => prev.filter(review => review.id !== id));
    }
  };
  
  // Start editing review
  const handleEdit = (review: any) => {
    setEditingReview({ ...review });
    setEditMode(true);
  };
  
  // Create new review
  const handleCreateNew = () => {
    setEditingReview({
      id: `new-${Date.now()}`,
      author: "",
      location: "",
      avatar: "/images/testimonial-placeholder.jpg",
      rating: 5,
      review: "",
      featured: false,
      order: null
    });
    setEditMode(true);
  };
  
  // Save edited review
  const handleSave = () => {
    // Validate
    if (!editingReview.author.trim() || !editingReview.review.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    setAllReviews(prev => {
      // Check if this is a new review or updating existing
      const exists = prev.some(r => r.id === editingReview.id);
      
      if (exists) {
        // Update existing
        return prev.map(r => r.id === editingReview.id ? editingReview : r);
      } else {
        // Add new
        return [...prev, editingReview];
      }
    });
    
    setEditMode(false);
    setEditingReview(null);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingReview(null);
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={index < rating ? "text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };
  
  // Edit star rating
  const handleRatingChange = (newRating: number) => {
    if (editingReview) {
      setEditingReview({
        ...editingReview,
        rating: newRating
      });
    }
  };
  
  return (
    <FadeIn>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Homepage Testimonials</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Testimonial
          </button>
        </div>
      </div>
          
          {/* Main content */}
          {editMode ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingReview?.id.startsWith('new-') ? 'Create New Testimonial' : 'Edit Testimonial'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Author field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={editingReview?.author || ''}
                      onChange={(e) => setEditingReview({...editingReview, author: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  
                  {/* Location field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingReview?.location || ''}
                      onChange={(e) => setEditingReview({...editingReview, location: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  {/* Avatar preview and upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar Image
                    </label>
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={editingReview?.avatar || '/images/testimonial-placeholder.jpg'}
                          alt="Avatar"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        accept="image/*"
                        onChange={(e) => {
                          // In a real app, you would upload this file to a server
                          // For now, we'll just simulate the change
                          if (e.target.files && e.target.files[0]) {
                            // Dummy URL assignment - in real app you would upload and get a URL back
                            setEditingReview({
                              ...editingReview,
                              avatar: URL.createObjectURL(e.target.files[0])
                            });
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Square images work best. Maximum size: 2MB.
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="text-2xl focus:outline-none"
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className={star <= (editingReview?.rating || 0) ? "text-yellow-500" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Featured toggle */}
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingReview?.featured || false}
                        onChange={(e) => setEditingReview({...editingReview, featured: e.target.checked})}
                        className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Feature on homepage
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  {/* Review text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial Text *
                    </label>
                    <textarea
                      value={editingReview?.review || ''}
                      onChange={(e) => setEditingReview({...editingReview, review: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={6}
                      placeholder="Enter testimonial text"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingReview?.review ? editingReview.review.length : 0}/500 characters
                    </p>
                  </div>
                  
                  {/* Preview */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={editingReview?.avatar || '/images/testimonial-placeholder.jpg'}
                            alt="Avatar"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div className="mb-1">{renderStarRating(editingReview?.rating || 5)}</div>
                          <p className="text-gray-700 mb-2">{editingReview?.review || 'Testimonial text will appear here'}</p>
                          <p className="text-sm font-medium">{editingReview?.author || 'Author'}</p>
                          {editingReview?.location && (
                            <p className="text-xs text-gray-500">{editingReview.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Testimonial
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Filters and search */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-grow max-w-md">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search testimonials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show featured only
                    </span>
                  </label>
                  
                  <div className="text-sm text-gray-500 ml-auto">
                    {filteredReviews.length} testimonials found
                  </div>
                </div>
              </div>
              
              {/* Reviews list */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 text-3xl mb-4" />
                  <p>Loading testimonials...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 mb-4">No testimonials found</p>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New Testimonial
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className={`border-l-4 ${review.featured ? 'border-green-500' : 'border-gray-200'}`}>
                        <div className="p-4 md:p-6">
                          <div className="flex items-start">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                              <Image
                                src={review.avatar}
                                alt={review.author}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex flex-wrap justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-bold text-lg">{review.author}</h3>
                                  <p className="text-sm text-gray-500">{review.location}</p>
                                  <div className="mt-1">{renderStarRating(review.rating)}</div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                                  {review.featured && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                                      Featured
                                    </span>
                                  )}
                                  
                                  {review.featured && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => handleReorder(review.id, 'up')}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                        title="Move up"
                                        disabled={review.order === 1}
                                      >
                                        <FontAwesomeIcon icon={faArrowUp} />
                                      </button>
                                      <button
                                        onClick={() => handleReorder(review.id, 'down')}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                        title="Move down"
                                        disabled={review.order === filteredReviews.filter(r => r.featured).length}
                                      >
                                        <FontAwesomeIcon icon={faArrowDown} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mt-2">{review.review}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 border-t pt-4">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleFeature(review.id)}
                              className={`${review.featured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-800'} mr-4`}
                              title={review.featured ? "Unfeature" : "Feature"}
                            >
                              <FontAwesomeIcon icon={review.featured ? faTimes : faCheck} className="mr-1" />
                              {review.featured ? "Unfeature" : "Feature"}
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
    </FadeIn>
  );
}