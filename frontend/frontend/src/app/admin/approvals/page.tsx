'use client';

import React, { useState, useEffect } from 'react';

interface SellerApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  categories: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    identityProof: string;
    serviceProof: string;
    businessProof?: string;
    profileImage: string;
    logoImage?: string;
  };
}

export default function SellerApprovalsPage() {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/admin/seller-applications');
        // const data = await response.json();
        // setApplications(data);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockApplications: SellerApplication[] = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '9876543210',
              businessName: 'Mountain Trekking Adventures',
              categories: ['Trekking Guide', 'Expedition Planning', 'Survival Training'],
              submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending',
              documents: {
                identityProof: '/images/placeholder.jpg',
                serviceProof: '/images/placeholder.jpg',
                profileImage: '/images/placeholder.jpg'
              }
            },
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
              phone: '8765432109',
              businessName: 'Jane\'s Photography Tours',
              categories: ['Adventure Tours', 'Wildlife Photography'],
              submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending',
              documents: {
                identityProof: '/images/placeholder.jpg',
                serviceProof: '/images/placeholder.jpg',
                businessProof: '/images/placeholder.jpg',
                profileImage: '/images/placeholder.jpg',
                logoImage: '/images/placeholder.jpg'
              }
            },
            {
              id: '3',
              firstName: 'Robert',
              lastName: 'Johnson',
              email: 'robert.johnson@example.com',
              phone: '7654321098',
              businessName: 'Highland Equipment Rentals',
              categories: ['Equipment Rental', 'Transport Services'],
              submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'approved',
              documents: {
                identityProof: '/images/placeholder.jpg',
                serviceProof: '/images/placeholder.jpg',
                profileImage: '/images/placeholder.jpg',
                logoImage: '/images/placeholder.jpg'
              }
            },
            {
              id: '4',
              firstName: 'Sarah',
              lastName: 'Williams',
              email: 'sarah.williams@example.com',
              phone: '6543210987',
              businessName: 'Adventure Cuisine',
              categories: ['Local Cuisine', 'Cultural Experiences'],
              submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'rejected',
              documents: {
                identityProof: '/images/placeholder.jpg',
                serviceProof: '/images/placeholder.jpg',
                profileImage: '/images/placeholder.jpg'
              }
            }
          ];
          setApplications(mockApplications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);
  
  // Handle application approval
  const handleApprove = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/seller-applications/${id}/approve`, { method: 'POST' });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === id ? { ...app, status: 'approved' } : app
        )
      );
      
      // Close modal if open
      if (showModal) {
        setShowModal(false);
        setSelectedApplication(null);
      }
      
      // Show success message
      alert('Application approved successfully');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    }
  };
  
  // Handle application rejection
  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/seller-applications/${id}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // });
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === id ? { ...app, status: 'rejected' } : app
        )
      );
      
      // Close modal
      setShowModal(false);
      setSelectedApplication(null);
      setRejectionReason('');
      
      // Show success message
      alert('Application rejected successfully');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    }
  };
  
  // View application details
  const handleViewDetails = (application: SellerApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };
  
  // Filter applications based on active tab and search term
  const filteredApplications = applications.filter(app => {
    // Filter by status tab
    if (activeTab !== 'all' && app.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.firstName.toLowerCase().includes(searchLower) ||
        app.lastName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.businessName.toLowerCase().includes(searchLower) ||
        app.categories.some(cat => cat.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Seller Applications</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve applications from sellers requesting to join the marketplace.
          </p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'rejected' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-10 py-2 w-full"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Applications Table */}
      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-500">No applications found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
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
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={application.documents.profileImage} 
                            alt={`${application.firstName} ${application.lastName}`} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.businessName}</div>
                      <div className="text-sm text-gray-500">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {application.categories.map((category, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                      
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowModal(true);
                              setRejectionReason('');
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Application Details
                    </h3>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 h-16 w-16 relative overflow-hidden rounded-full">
                              <img 
                                src={selectedApplication.documents.profileImage} 
                                alt={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {selectedApplication.firstName} {selectedApplication.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Submitted: {formatDate(selectedApplication.submittedAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Email: </span>
                              <span className="text-sm text-gray-900">{selectedApplication.email}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Phone: </span>
                              <span className="text-sm text-gray-900">{selectedApplication.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Business Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Business Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-4">
                            {selectedApplication.documents.logoImage ? (
                              <div className="flex-shrink-0 h-16 w-16 relative overflow-hidden rounded-md">
                                <img 
                                  src={selectedApplication.documents.logoImage} 
                                  alt={selectedApplication.businessName}
                                  className="h-full w-full object-contain" 
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {selectedApplication.businessName}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-500">Categories: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedApplication.categories.map((category, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Documents */}
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Verification Documents</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-700">Identity Proof</div>
                              <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                                <img 
                                  src={selectedApplication.documents.identityProof} 
                                  alt="Identity Proof"
                                  className="object-cover" 
                                />
                              </div>
                              <a 
                                href={selectedApplication.documents.identityProof} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center"
                              >
                                View Full Size
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-700">Service Proof</div>
                              <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                                <img 
                                  src={selectedApplication.documents.serviceProof} 
                                  alt="Service Proof"
                                  className="object-cover" 
                                />
                              </div>
                              <a 
                                href={selectedApplication.documents.serviceProof} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center"
                              >
                                View Full Size
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                            
                            {selectedApplication.documents.businessProof && (
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-700">Business Proof</div>
                                <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                                  <img 
                                    src={selectedApplication.documents.businessProof} 
                                    alt="Business Proof"
                                    className="object-cover" 
                                  />
                                </div>
                                <a 
                                  href={selectedApplication.documents.businessProof} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center"
                                >
                                  View Full Size
                                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rejection Form */}
                    {selectedApplication.status === 'pending' && (
                      <div className="mt-6 bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Decision</h4>
                        <div className="flex flex-col md:flex-row gap-4">
                          <button
                            onClick={() => handleApprove(selectedApplication.id)}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve Application
                          </button>
                          
                          <div className="flex-1">
                            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
                              Rejection Reason
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="rejection-reason"
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300"
                                placeholder="Enter reason for rejection..."
                              />
                              <button
                                type="button"
                                onClick={() => handleReject(selectedApplication.id, rejectionReason)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApplication(null);
                    setRejectionReason('');
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}