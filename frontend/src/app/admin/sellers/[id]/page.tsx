'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faCheck,
  faTimes,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faShieldAlt,
  faStar,
  faStore,
  faBox,
  faUserShield,
  faSpinner,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';
import SellersService, { Seller } from '@/services/api/sellersService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MediaGallery from '@/components/common/MediaGallery';

const VerificationBadge = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      <FontAwesomeIcon icon={faUserShield} className="mr-1" />
      {isVerified ? 'Verified' : 'Not Verified'}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let label = status.charAt(0).toUpperCase() + status.slice(1);
  
  switch (status) {
    case 'active':
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

const InfoItem = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start">
    <FontAwesomeIcon icon={icon} className="text-gray-400 mr-3 mt-0.5" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const SellerDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchSeller();
    }
  }, [id]);
  
  const fetchSeller = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await SellersService.getSellerById(id);
      setSeller(response);
      setNotes(response.verificationNotes || '');
    } catch (err: any) {
      console.error('Error fetching seller:', err);
      
      // Handle specific error types
      if (err.response?.status === 404) {
        setError(`Seller with ID "${id}" not found.`);
      } else if (err.response?.status === 400) {
        setError(`Invalid seller ID "${id}". Please check the URL and try again.`);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this seller.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch seller details');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      await SellersService.updateSellerVerification(id, {
        isVerified: true,
        status: 'active',
        notes: notes || 'Approved by admin'
      });
      
      // Refresh seller data
      await fetchSeller();
    } catch (err: any) {
      setError(err.message || 'Failed to approve seller');
      console.error('Error approving seller:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleReject = async () => {
    setIsUpdating(true);
    try {
      await SellersService.updateSellerVerification(id, {
        isVerified: false,
        status: 'rejected',
        notes: notes || 'Rejected by admin'
      });
      
      // Refresh seller data
      await fetchSeller();
    } catch (err: any) {
      setError(err.message || 'Failed to reject seller');
      console.error('Error rejecting seller:', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Loading seller details..." 
        size="lg" 
        fullScreen={true}
        type="gear"
      />
    );
  }
  
  if (error || !seller) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Seller</h3>
          <p className="text-red-600 mb-4">{error || 'Seller not found'}</p>
          
          <div className="text-sm text-red-700">
            <p className="mb-2">Possible solutions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check if the seller ID in the URL is correct</li>
              <li>Ensure the seller exists in the system</li>
              <li>Try refreshing the page</li>
              <li>Return to the sellers list and select a different seller</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to sellers
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <FontAwesomeIcon icon={faSpinner} className="mr-2" />
            Refresh page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <FadeIn>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to sellers
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">Seller Details</h1>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    {(seller as any).profileImage || seller.profileImg ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${((seller as any).profileImage || seller.profileImg).replace(/^\/?(uploads\/)?/, '')}`} 
                        alt={seller.fullName} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-600">
                        {seller.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{seller.fullName}</h2>
                    <p className="text-gray-500">{seller.businessName || 'No business name'}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <StatusBadge status={seller.status} />
                  <VerificationBadge isVerified={seller.isVerified} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <InfoItem icon={faEnvelope} label="Email" value={seller.email} />
                <InfoItem icon={faPhone} label="Phone" value={seller.phone} />
                <InfoItem icon={faMapMarkerAlt} label="Location" value={seller.location} />
                <InfoItem icon={faStore} label="Category" value={seller.category} />
              </div>
              
              {seller.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{seller.description}</p>
                </div>
              )}
            </div>
            
            {/* Service info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={faShieldAlt} label="Service Branch" value={seller.serviceBranch} />
                <InfoItem icon={faIdCard} label="Rank" value={seller.rank} />
                <InfoItem icon={faIdCard} label="Service Number" value={seller.serviceNumber} />
                <InfoItem 
                  icon={faIdCard} 
                  label="Years of Service" 
                  value={`${seller.serviceYears.from} - ${seller.serviceYears.to}`} 
                />
              </div>
            </div>
            
            {/* Seller type info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Type</h3>
              <div className="flex space-x-4">
                <div className={`px-4 py-2 rounded-lg ${seller.sellerType.products ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                  <FontAwesomeIcon icon={faBox} className="mr-2" />
                  Products
                </div>
                <div className={`px-4 py-2 rounded-lg ${seller.sellerType.services ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  Services
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add notes about this seller..."
                />
              </div>
              
              {seller.status === 'pending' && (
                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    disabled={isUpdating}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    )}
                    Approve Seller
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isUpdating}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    )}
                    Reject Seller
                  </button>
                </div>
              )}
              
              {seller.status !== 'pending' && (
                <p className="text-sm text-gray-500">
                  This seller has already been {seller.status}.
                </p>
              )}
            </div>
            
            {/* Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Rating</span>
                  <span className="text-sm font-medium">
                    {seller.ratings.average > 0 ? (
                      <>
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
                        {seller.ratings.average.toFixed(1)} ({seller.ratings.count})
                      </>
                    ) : (
                      'No ratings yet'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(seller.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Media Gallery */}
            <div className="bg-white shadow rounded-lg p-6">
              <MediaGallery 
                files={{
                  profileImage: (seller as any).profileImage,
                  logoImage: (seller as any).logoImage,
                  identityProof: (seller as any).identityProof,
                  serviceProof: (seller as any).serviceProof,
                  businessProof: (seller as any).businessProof,
                  verificationDocument: seller.verificationDocument
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default SellerDetailsPage;