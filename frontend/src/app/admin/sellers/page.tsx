'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faEye, 
  faSearch, 
  faFilter, 
  faSort, 
  faEllipsisV,
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import SellersService, { Seller, SellerStats, SellerFilters } from '@/services/api/sellersService';

// Define seller status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let label = status.charAt(0).toUpperCase() + status.slice(1);
  
  switch (status) {
    case 'active':
    case 'approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Active';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'suspended':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

// Action Menu component
const ActionMenu = ({ 
  isOpen, 
  toggleMenu, 
  onViewDetails, 
  onApprove, 
  onReject,
  seller 
}: { 
  isOpen: boolean; 
  toggleMenu: () => void; 
  onViewDetails: () => void; 
  onApprove: () => void; 
  onReject: () => void;
  seller: Seller;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onViewDetails}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          role="menuitem"
        >
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          View Details
        </button>
        {seller.status === 'pending' && (
          <>
            <button
              onClick={onApprove}
              className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Approve
            </button>
            <button
              onClick={onReject}
              className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Seller list item component for mobile view
const SellerListItem = ({ 
  seller, 
  onView, 
  onApprove, 
  onReject,
  isUpdating 
}: { 
  seller: Seller; 
  onView: (id: string) => void; 
  onApprove: (id: string) => void; 
  onReject: (id: string) => void;
  isUpdating: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
          {seller.profileImg ? (
            <img src={seller.profileImg} alt={seller.fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-600">
              {seller.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{seller.fullName}</h3>
          <p className="text-sm text-gray-600">{seller.businessName || seller.category}</p>
        </div>
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isUpdating}
          >
            <FontAwesomeIcon icon={isUpdating ? faSpinner : faEllipsisV} className={`text-gray-500 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
          <ActionMenu 
            isOpen={isMenuOpen}
            toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            onViewDetails={() => {
              onView(seller.id);
              setIsMenuOpen(false);
            }}
            onApprove={() => {
              onApprove(seller.id);
              setIsMenuOpen(false);
            }}
            onReject={() => {
              onReject(seller.id);
              setIsMenuOpen(false);
            }}
            seller={seller}
          />
        </div>
      </div>
      
      <div className="mb-3">
        <StatusBadge status={seller.status} />
        <span className="ml-2 text-sm text-gray-500">
          Registered: {new Date(seller.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-medium">{seller.category}</p>
        </div>
        <div>
          <p className="text-gray-500">Location</p>
          <p className="font-medium">{seller.location}</p>
        </div>
        <div>
          <p className="text-gray-500">Service</p>
          <p className="font-medium">{seller.serviceBranch}</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium truncate">{seller.email}</p>
        </div>
      </div>
    </div>
  );
};

// Main page component
const SellersManagementPage: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const isMobile = windowWidth < 768;
  
  // Fetch sellers and stats
  useEffect(() => {
    fetchSellers();
    fetchStats();
  }, [searchTerm, statusFilter, page]);
  
  const fetchSellers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: SellerFilters = {
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter as any
      };
      
      const response = await SellersService.getSellers(filters, page, 10);
      setSellers(response.sellers || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sellers');
      console.error('Error fetching sellers:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await SellersService.getSellerStats();
      setStats(response);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };
  
  const handleViewDetails = (id: string) => {
    // Navigate to seller details page
    window.location.href = `/admin/sellers/${id}`;
  };
  
  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    try {
      await SellersService.updateSellerVerification(id, {
        isVerified: true,
        status: 'active',
        notes: 'Approved by admin'
      });
      
      // Refresh sellers list
      await fetchSellers();
      await fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to approve seller');
      console.error('Error approving seller:', err);
    } finally {
      setUpdatingId(null);
    }
  };
  
  const handleReject = async (id: string) => {
    setUpdatingId(id);
    try {
      await SellersService.updateSellerVerification(id, {
        isVerified: false,
        status: 'rejected',
        notes: 'Rejected by admin'
      });
      
      // Refresh sellers list
      await fetchSellers();
      await fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to reject seller');
      console.error('Error rejecting seller:', err);
    } finally {
      setUpdatingId(null);
    }
  };
  
  return (
    <FadeIn>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Seller Management</h1>
          <p className="text-gray-600">Approve and manage marketplace sellers</p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {/* Filters and search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sellers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Sellers</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Pending Approval</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm md:block hidden">
              <div className="text-sm text-gray-500">Active Sellers</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faSpinner} className="text-gray-400 text-2xl animate-spin" />
            <p className="text-gray-500 mt-2">Loading sellers...</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            {isMobile && (
              <div className="space-y-4">
                {sellers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No sellers found matching your criteria.</p>
                  </div>
                ) : (
                  sellers.map(seller => (
                    <SellerListItem
                      key={seller.id}
                      seller={seller}
                      onView={handleViewDetails}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isUpdating={updatingId === seller.id}
                    />
                  ))
                )}
              </div>
            )}
            
            {/* Desktop view */}
            {!isMobile && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sellers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No sellers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      sellers.map((seller) => (
                        <tr key={seller.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  {seller.profileImg ? (
                                    <img className="h-10 w-10 rounded-full" src={seller.profileImg} alt="" />
                                  ) : (
                                    <span className="text-sm font-semibold text-gray-600">
                                      {seller.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{seller.fullName}</div>
                                <div className="text-sm text-gray-500">{seller.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{seller.businessName || seller.category}</div>
                            <div className="text-sm text-gray-500">{seller.serviceBranch} - {seller.rank}</div>
                            <div className="text-sm text-gray-500">{seller.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={seller.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(seller.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(seller.id)}
                                className="text-blue-600 hover:text-blue-900"
                                disabled={updatingId === seller.id}
                              >
                                View
                              </button>
                              {seller.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(seller.id)}
                                    className="text-green-600 hover:text-green-900"
                                    disabled={updatingId === seller.id}
                                  >
                                    {updatingId === seller.id ? (
                                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    ) : (
                                      'Approve'
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(seller.id)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={updatingId === seller.id}
                                  >
                                    {updatingId === seller.id ? (
                                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    ) : (
                                      'Reject'
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {sellers.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </FadeIn>
  );
};

export default SellersManagementPage;