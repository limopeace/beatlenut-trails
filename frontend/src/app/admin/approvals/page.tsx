'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faEye, 
  faFileAlt, 
  faIdCard, 
  faExclamationTriangle,
  faFilter,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import ApprovalsService, { type Approval } from '@/services/api/approvalsService';

// Define status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  switch (status) {
    case 'approved':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'rejected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'verified':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Format approval type for display
const formatApprovalType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Mobile approval card component
const ApprovalCard = ({ 
  approval, 
  onView, 
  onApprove, 
  onReject 
}: { 
  approval: Approval; 
  onView: (id: string) => void; 
  onApprove: (id: string) => void; 
  onReject: (id: string) => void;
}) => {
  const details = approval.itemDetails;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={details.profileImg || approval.requesterProfileImage || '/images/placeholder.jpg'} 
            alt={approval.requesterName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">
            {approval.requesterName}
          </h3>
          <p className="text-sm text-gray-500">
            {approval.requesterBusinessName || details.businessName}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-xs text-gray-500">Type</p>
          <p className="font-medium text-sm">
            {formatApprovalType(approval.type)}
          </p>
        </div>
        <StatusBadge status={approval.status} />
      </div>
      
      {(approval.type === 'product_listing' || approval.type === 'service_listing') && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">{approval.type === 'product_listing' ? 'Product' : 'Service'}</p>
          <p className="font-medium text-sm">{approval.itemName || details.productName}</p>
          <p className="text-sm">₹{details.price?.toLocaleString()}</p>
        </div>
      )}
      
      {approval.type === 'seller_registration' && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Service Record</p>
          <p className="font-medium text-sm">{details.serviceRecord}</p>
        </div>
      )}
      
      <div className="mb-3">
        <p className="text-xs text-gray-500">Documents</p>
        <div className="mt-1 space-y-1">
          {(approval.documents || details.documents)?.map((doc: any) => (
            <div key={doc.id} className="flex justify-between items-center text-sm">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 mr-2" />
                {doc.name}
              </span>
              <StatusBadge status={doc.status} />
            </div>
          ))}
        </div>
      </div>
      
      {(approval.requesterNotes || details.notes) && (
        <div className="mb-4 text-sm bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p>{approval.requesterNotes || details.notes}</p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(approval.id)}
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <FontAwesomeIcon icon={faEye} className="mr-1" /> View
        </button>
        <button
          onClick={() => onApprove(approval.id)}
          className="flex-1 py-2 px-3 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
        >
          <FontAwesomeIcon icon={faCheck} className="mr-1" /> Approve
        </button>
        <button
          onClick={() => onReject(approval.id)}
          className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-1" /> Reject
        </button>
      </div>
    </div>
  );
};

// Main page component
const ApprovalsPage: React.FC = () => {
  const router = useRouter();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPending: 0,
    sellerPending: 0,
    productPending: 0,
    servicePending: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Load approvals data from API
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get pending approvals
        const response = await ApprovalsService.getPendingApprovals(
          {
            type: typeFilter !== 'all' ? typeFilter : undefined,
            search: debouncedSearchTerm || undefined
          },
          currentPage,
          10
        );
        
        setApprovals(response.approvals);
        setTotalPages(response.pagination.totalPages);
        
        // Get stats
        const statsData = await ApprovalsService.getApprovalStats();
        setStats({
          totalPending: statsData.totalPending,
          sellerPending: statsData.sellerPending,
          productPending: statsData.productPending,
          servicePending: statsData.servicePending
        });
        
      } catch (err) {
        console.error('Error fetching approvals:', err);
        setError('Failed to load approvals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApprovals();
  }, [typeFilter, debouncedSearchTerm, currentPage]);
  
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
  
  const handleViewDetails = (id: string) => {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
      if (approval.type === 'seller_registration') {
        router.push(`/admin/sellers/${approval.itemDetails.sellerId || approval.requesterId}`);
      } else if (approval.type === 'product_listing') {
        // Navigate to product details
        console.log(`View product details: ${approval.itemDetails.productId || approval.itemId}`);
        // router.push(`/admin/products/${approval.itemDetails.productId || approval.itemId}`);
      } else if (approval.type === 'document_verification') {
        // Navigate to document verification
        console.log(`View document: ${approval.itemDetails.documentId || approval.itemId}`);
        // router.push(`/admin/documents/${approval.itemDetails.documentId || approval.itemId}`);
      }
    }
  };
  
  const handleApprove = async (id: string) => {
    try {
      setError(null);
      
      // Call API to approve
      await ApprovalsService.approveRequest(id);
      
      // Remove the approved item from the list (since we're showing only pending)
      setApprovals(approvals.filter(item => item.id !== id));
      
      // Refresh stats
      const statsData = await ApprovalsService.getApprovalStats();
      setStats({
        totalPending: statsData.totalPending,
        sellerPending: statsData.sellerPending,
        productPending: statsData.productPending,
        servicePending: statsData.servicePending
      });
      
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Failed to approve request. Please try again.');
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      setError(null);
      
      // In a real implementation, we'd prompt for rejection reason
      const reason = prompt('Enter rejection reason:') || 'Does not meet requirements';
      
      if (!reason.trim()) {
        return;
      }
      
      // Call API to reject
      await ApprovalsService.rejectRequest(id, reason);
      
      // Remove the rejected item from the list (since we're showing only pending)
      setApprovals(approvals.filter(item => item.id !== id));
      
      // Refresh stats
      const statsData = await ApprovalsService.getApprovalStats();
      setStats({
        totalPending: statsData.totalPending,
        sellerPending: statsData.sellerPending,
        productPending: statsData.productPending,
        servicePending: statsData.servicePending
      });
      
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError('Failed to reject request. Please try again.');
    }
  };
  
  return (
    <FadeIn>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Pending Approvals</h1>
          <p className="text-gray-600">Review and manage approval requests</p>
        </div>
        
        {/* Filters */}
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
                placeholder="Search by name or business..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="sm:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="seller_registration">Seller Registration</option>
                  <option value="product_listing">Product Listing</option>
                  <option value="document_verification">Document Verification</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Pending</div>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.totalPending}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Seller Registrations</div>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? '...' : stats.sellerPending}
            </div>
          </div>
          <div className="hidden md:block bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Product Listings</div>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : stats.productPending}
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="text-red-500">×</span>
            </button>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        
        {/* No results message */}
        {!isLoading && approvals.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No approvals found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' ? 
                'Try adjusting your search filters' : 
                'There are no pending approvals at this time'}
            </p>
          </div>
        )}
        
        {/* Mobile view */}
        {!isLoading && isMobile && approvals.length > 0 && (
          <div className="space-y-4">
            {approvals.map(approval => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onView={handleViewDetails}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
        
        {/* Desktop view */}
        {!isLoading && !isMobile && approvals.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvals.map((approval) => {
                  const details = approval.itemDetails;
                  return (
                    <tr key={approval.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={details.profileImg || approval.requesterProfileImage || '/images/placeholder.jpg'} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {approval.requesterName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {approval.requesterBusinessName || details.businessName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatApprovalType(approval.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {approval.type === 'seller_registration' && (
                          <div>
                            <div className="text-sm text-gray-900">{details.category}</div>
                            <div className="text-sm text-gray-500">{details.location}</div>
                            <div className="text-sm text-gray-500">{details.serviceRecord}</div>
                          </div>
                        )}
                        
                        {(approval.type === 'product_listing' || approval.type === 'service_listing') && (
                          <div>
                            <div className="text-sm text-gray-900">{approval.itemName || details.productName}</div>
                            {details.price && (
                              <div className="text-sm text-gray-500">₹{details.price.toLocaleString()}</div>
                            )}
                            <div className="text-sm text-gray-500">{details.category}</div>
                          </div>
                        )}
                        
                        {approval.type === 'document_verification' && (
                          <div>
                            <div className="text-sm text-gray-900">{details.documentName}</div>
                            <div className="text-sm text-gray-500">{details.documentType}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={approval.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(approval.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleViewDetails(approval.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {approval.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(approval.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(approval.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && approvals.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show for pagination
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  // Center current page in pagination when possible
                  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  pageNum = startPage + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default ApprovalsPage;