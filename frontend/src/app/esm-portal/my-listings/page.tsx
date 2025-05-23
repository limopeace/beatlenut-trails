'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faPlus, faPencilAlt, faTrashAlt, 
  faEye, faEyeSlash, faStar, faChartLine, faFilter, 
  faSort, faSearch
} from '@fortawesome/free-solid-svg-icons';

// Dummy data for listings
const dummyListings = [
  {
    id: 1,
    type: 'product',
    name: 'Handcrafted Bamboo Art',
    price: '₹1,200',
    category: 'Handicrafts',
    status: 'active',
    featured: true,
    views: 120,
    inquiries: 5,
    sales: 3,
    createdAt: '2023-09-15',
    thumbnail: 'https://picsum.photos/id/119/800/500',
  },
  {
    id: 2,
    type: 'product',
    name: 'Organic Tea Collection',
    price: '₹850',
    category: 'Food Products',
    status: 'active',
    featured: false,
    views: 85,
    inquiries: 3,
    sales: 2,
    createdAt: '2023-09-20',
    thumbnail: 'https://picsum.photos/id/431/800/500',
  },
  {
    id: 3,
    type: 'service',
    name: 'Security Consultation',
    price: 'Starts at ₹5,000',
    category: 'Security Services',
    status: 'active',
    featured: true,
    views: 65,
    inquiries: 7,
    sales: 1,
    createdAt: '2023-09-25',
    thumbnail: 'https://picsum.photos/id/668/800/500',
  },
  {
    id: 4,
    type: 'service',
    name: 'Logistics Planning',
    price: 'Starts at ₹3,500',
    category: 'Logistics',
    status: 'inactive',
    featured: false,
    views: 30,
    inquiries: 1,
    sales: 0,
    createdAt: '2023-09-10',
    thumbnail: 'https://picsum.photos/id/1072/800/500',
  },
  {
    id: 5,
    type: 'product',
    name: 'Traditional Handloom Textile',
    price: '₹2,500',
    category: 'Textiles',
    status: 'active',
    featured: false,
    views: 110,
    inquiries: 4,
    sales: 2,
    createdAt: '2023-09-05',
    thumbnail: 'https://picsum.photos/id/104/800/500',
  },
];

export default function MyListingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [listings, setListings] = useState(dummyListings);
  const [filteredListings, setFilteredListings] = useState(dummyListings);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);
  
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      // First check sessionStorage (non-persistent login)
      let token = sessionStorage.getItem('auth_token');
      let userData = sessionStorage.getItem('user');
      
      // If not found, check localStorage (persistent login)
      if (!token) {
        token = localStorage.getItem('auth_token');
        userData = localStorage.getItem('user');
      }
      
      if (token && userData) {
        setIsAuthenticated(true);
        // Fetch listings here when we have an API
        // For now, use dummy data
        setIsLoading(false);
      } else {
        // Redirect to login if not authenticated
        router.push('/esm-portal/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Filter and sort listings
  useEffect(() => {
    let result = [...listings];
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(listing => listing.type === selectedType);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(listing => listing.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        listing => 
          listing.name.toLowerCase().includes(query) || 
          listing.category.toLowerCase().includes(query)
      );
    }
    
    // Sort listings
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'price-low':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'inquiries':
        result.sort((a, b) => b.inquiries - a.inquiries);
        break;
    }
    
    setFilteredListings(result);
  }, [listings, selectedType, selectedStatus, sortBy, searchQuery]);

  const handleStatusToggle = (id: number) => {
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === id
          ? { ...listing, status: listing.status === 'active' ? 'inactive' : 'active' }
          : listing
      )
    );
  };

  const handleFeaturedToggle = (id: number) => {
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === id
          ? { ...listing, featured: !listing.featured }
          : listing
      )
    );
  };

  const handleDeleteClick = (id: number) => {
    setListingToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      // Call API to delete listing
      // For now, just filter it out
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== listingToDelete)
      );
      
      setDeleteModalOpen(false);
      setListingToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {/* Header */}
      <section className="bg-deep-forest-green pt-32 pb-12 md:py-28">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <Link href="/esm-portal/dashboard" className="inline-flex items-center text-pale-straw/80 hover:text-pale-straw mb-2">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-3 h-3" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-pale-straw">
                My Listings
              </h1>
              <p className="text-pale-straw/80 mb-0">
                Manage your products and services
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link href="/esm-portal/add-product" passHref>
                <Button variant="primary" className="bg-pale-straw text-deep-forest hover:bg-pale-straw/90 transition-all flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  Add Product
                </Button>
              </Link>
              <Link href="/esm-portal/add-service" passHref>
                <Button variant="secondary" className="border-2 border-pale-straw text-pale-straw hover:bg-pale-straw/20 transition-all flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  Add Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search listings..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <label htmlFor="type-filter" className="mr-2 text-sm font-medium text-gray-700">Type:</label>
                  <select
                    id="type-filter"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="product">Products</option>
                    <option value="service">Services</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">Status:</label>
                  <select
                    id="status-filter"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">Sort:</label>
                  <select
                    id="sort-by"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="views">Most Views</option>
                    <option value="inquiries">Most Inquiries</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Listings */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listing
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredListings.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={listing.thumbnail} 
                                alt={listing.name} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                                {listing.featured && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <FontAwesomeIcon icon={faStar} className="mr-1 w-3 h-3" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{listing.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.type === 'product' 
                              ? 'bg-forest-green/10 text-forest-green' 
                              : 'bg-moss-green/10 text-moss-green'
                          }`}>
                            {listing.type === 'product' ? 'Product' : 'Service'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{listing.price}</div>
                          <div className="text-xs text-gray-500">
                            {listing.type === 'service' ? 'Base Price' : 'Per Unit'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <div className="flex items-center" title="Views">
                              <FontAwesomeIcon icon={faEye} className="mr-1 w-3 h-3" />
                              {listing.views}
                            </div>
                            <div className="flex items-center" title="Inquiries">
                              <FontAwesomeIcon icon={faChartLine} className="mr-1 w-3 h-3" />
                              {listing.inquiries}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(listing.id)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                              listing.status === 'active'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            <FontAwesomeIcon 
                              icon={listing.status === 'active' ? faEye : faEyeSlash} 
                              className="mr-1 w-3 h-3" 
                            />
                            {listing.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleFeaturedToggle(listing.id)}
                              className="text-yellow-600 hover:text-yellow-800 p-1"
                              title={listing.featured ? 'Remove from featured' : 'Add to featured'}
                            >
                              <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/esm-portal/edit-${listing.type}/${listing.id}`}
                              className="text-indigo-600 hover:text-indigo-800 p-1"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(listing.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                    ? 'Try changing your filters or search query'
                    : 'Get started by creating a new product or service'}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link href="/esm-portal/add-product" passHref>
                    <Button variant="primary" className="bg-forest-green text-white hover:bg-moss-green transition-all flex items-center gap-2">
                      <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                      Add Product
                    </Button>
                  </Link>
                  <Link href="/esm-portal/add-service" passHref>
                    <Button variant="secondary" className="border-2 border-forest-green text-forest-green hover:bg-forest-green/5 transition-all flex items-center gap-2">
                      <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                      Add Service
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}