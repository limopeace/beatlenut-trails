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

// Mock approval requests data
const MOCK_APPROVALS = [
  {
    id: 'a1',
    type: 'seller_registration',
    status: 'pending',
    createdAt: '2023-11-01T15:30:00Z',
    updatedAt: '2023-11-01T15:30:00Z',
    details: {
      sellerId: 's2',
      name: 'Priya Singh',
      businessName: 'Ladakh Expeditions',
      category: 'Trekking Services',
      location: 'Leh, Ladakh',
      profileImg: 'https://randomuser.me/api/portraits/women/44.jpg',
      serviceRecord: 'Indian Army, 10 years',
      documents: [
        { 
          id: 'd1', 
          type: 'ID Proof', 
          name: 'Aadhaar Card', 
          status: 'verified'
        },
        { 
          id: 'd2', 
          type: 'Service Certificate', 
          name: 'Army Discharge Certificate', 
          status: 'pending' 
        },
        { 
          id: 'd3', 
          type: 'Business Registration', 
          name: 'Shop & Establishment Certificate', 
          status: 'pending'
        }
      ],
      notes: ''
    }
  },
  {
    id: 'a2',
    type: 'product_listing',
    status: 'pending',
    createdAt: '2023-11-02T09:15:00Z',
    updatedAt: '2023-11-02T09:15:00Z',
    details: {
      productId: 'p5',
      sellerId: 's1',
      sellerName: 'Rajesh Kumar',
      businessName: 'Himalayan Adventures',
      productName: 'Spiti Valley Winter Trek',
      category: 'Adventure Tours',
      price: 35000,
      profileImg: 'https://randomuser.me/api/portraits/men/32.jpg',
      documents: [
        { 
          id: 'd1', 
          type: 'Safety Certificate', 
          name: 'Adventure Tourism Safety Compliance', 
          status: 'pending'
        },
        { 
          id: 'd2', 
          type: 'Insurance Policy', 
          name: 'Tourist Group Insurance', 
          status: 'pending'
        }
      ],
      notes: 'New winter trek product needs safety verification'
    }
  },
  {
    id: 'a3',
    type: 'seller_registration',
    status: 'pending',
    createdAt: '2023-11-03T11:45:00Z',
    updatedAt: '2023-11-03T11:45:00Z',
    details: {
      sellerId: 's4',
      name: 'Anita Sharma',
      businessName: 'Rajasthan Heritage Tours',
      category: 'Cultural Tours',
      location: 'Jaipur, Rajasthan',
      profileImg: 'https://randomuser.me/api/portraits/women/28.jpg',
      serviceRecord: 'Indian Air Force, 8 years',
      documents: [
        { 
          id: 'd1', 
          type: 'ID Proof', 
          name: 'Aadhaar Card', 
          status: 'verified'
        },
        { 
          id: 'd2', 
          type: 'Service Certificate', 
          name: 'Air Force Discharge Certificate', 
          status: 'verified'
        },
        { 
          id: 'd3', 
          type: 'Business Registration', 
          name: 'Tourism Department License', 
          status: 'pending'
        }
      ],
      notes: 'All documents look legitimate but need final verification'
    }
  },
  {
    id: 'a4',
    type: 'document_verification',
    status: 'pending',
    createdAt: '2023-11-04T14:20:00Z',
    updatedAt: '2023-11-04T14:20:00Z',
    details: {
      documentId: 'd12',
      sellerId: 's3',
      sellerName: 'Sanjay Mehta',
      businessName: 'Kerala Backwaters',
      documentType: 'Boat License',
      documentName: 'Commercial Boating Permit',
      profileImg: 'https://randomuser.me/api/portraits/men/22.jpg',
      note: 'Annual license renewal needs verification'
    }
  }
];

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
  approval: any; 
  onView: (id: string) => void; 
  onApprove: (id: string) => void; 
  onReject: (id: string) => void;
}) => {
  const details = approval.details;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img 
            src={details.profileImg} 
            alt={details.name || details.sellerName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">
            {details.name || details.sellerName}
          </h3>
          <p className="text-sm text-gray-500">
            {details.businessName}
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
      
      {approval.type === 'product_listing' && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Product</p>
          <p className="font-medium text-sm">{details.productName}</p>
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
          {details.documents?.map((doc: any) => (
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
      
      {details.notes && (
        <div className="mb-4 text-sm bg-gray-50 p-2 rounded">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p>{details.notes}</p>
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
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [filteredApprovals, setFilteredApprovals] = useState(MOCK_APPROVALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
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
  
  // Filter approvals based on search and type filter
  useEffect(() => {
    let filtered = approvals;
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const details = item.details;
        const searchLower = searchTerm.toLowerCase();
        
        return (
          (details.name?.toLowerCase().includes(searchLower)) ||
          (details.sellerName?.toLowerCase().includes(searchLower)) ||
          (details.businessName?.toLowerCase().includes(searchLower)) ||
          (details.productName?.toLowerCase().includes(searchLower)) ||
          (details.category?.toLowerCase().includes(searchLower))
        );
      });
    }
    
    setFilteredApprovals(filtered);
  }, [approvals, searchTerm, typeFilter]);
  
  const handleViewDetails = (id: string) => {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
      if (approval.type === 'seller_registration') {
        router.push(`/admin/sellers/${approval.details.sellerId}`);
      } else if (approval.type === 'product_listing') {
        // Navigate to product details
        console.log(`View product details: ${approval.details.productId}`);
        // router.push(`/admin/products/${approval.details.productId}`);
      } else if (approval.type === 'document_verification') {
        // Navigate to document verification
        console.log(`View document: ${approval.details.documentId}`);
        // router.push(`/admin/documents/${approval.details.documentId}`);
      }
    }
  };
  
  const handleApprove = (id: string) => {
    // In a real app, make API call to approve
    setApprovals(
      approvals.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };
  
  const handleReject = (id: string) => {
    // In a real app, make API call to reject
    setApprovals(
      approvals.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
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
            <div className="text-2xl font-bold">{
              approvals.filter(a => a.status === 'pending').length
            }</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Seller Registrations</div>
            <div className="text-2xl font-bold text-blue-600">
              {approvals.filter(a => a.type === 'seller_registration' && a.status === 'pending').length}
            </div>
          </div>
          <div className="hidden md:block bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Product Listings</div>
            <div className="text-2xl font-bold text-green-600">
              {approvals.filter(a => a.type === 'product_listing' && a.status === 'pending').length}
            </div>
          </div>
        </div>
        
        {/* No results message */}
        {filteredApprovals.length === 0 && (
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
        {isMobile && filteredApprovals.length > 0 && (
          <div className="space-y-4">
            {filteredApprovals.map(approval => (
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
        {!isMobile && filteredApprovals.length > 0 && (
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
                {filteredApprovals.map((approval) => {
                  const details = approval.details;
                  return (
                    <tr key={approval.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={details.profileImg} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {details.name || details.sellerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {details.businessName}
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
                        
                        {approval.type === 'product_listing' && (
                          <div>
                            <div className="text-sm text-gray-900">{details.productName}</div>
                            <div className="text-sm text-gray-500">₹{details.price?.toLocaleString()}</div>
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
      </div>
    </FadeIn>
  );
};

export default ApprovalsPage;