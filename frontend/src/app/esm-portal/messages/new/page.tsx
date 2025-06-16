'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ComposeMessage from '@/components/marketplace/messages/ComposeMessage';
import messageService from '@/services/api/messageService';
import Cookies from 'js-cookie';

// Get user info from cookie
const getUserId = (): string => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return '';
    }
    
    const userCookie = Cookies.get('esm_user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return userData._id || '';
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error);
  }
  return '';
};

interface Seller {
  _id: string;
  businessName: string;
  description: string;
  logoImage?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

function NewMessagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get query parameters
  const recipientId = searchParams.get('recipient');
  const productId = searchParams.get('product');
  const serviceId = searchParams.get('service');
  const orderId = searchParams.get('order');
  
  const currentUserId = getUserId();

  // Handle relatedType and relatedId
  const relatedType = productId ? 'product' : serviceId ? 'service' : null;
  const relatedId = productId || serviceId || null;

  // Fetch seller details if recipientId is provided
  useEffect(() => {
    if (recipientId) {
      const fetchSellerDetails = async () => {
        setIsLoading(true);
        try {
          // In a real app, this would fetch seller details from API
          // For now, use example data
          setSelectedSeller({
            _id: `seller-${recipientId}`,
            businessName: 'Sample Business Name',
            description: 'Sample seller description',
            logoImage: '/images/logo/beatlenut-logo.svg',
            userId: {
              _id: recipientId,
              firstName: 'John',
              lastName: 'Doe'
            }
          });
        } catch (error) {
          console.error('Error fetching seller details:', error);
          setError('Failed to load seller details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSellerDetails();
    }
  }, [recipientId]);

  // Set subject from related item if applicable
  useEffect(() => {
    if (productId) {
      setSubject('Inquiry about Product');
    } else if (serviceId) {
      setSubject('Inquiry about Service');
    } else if (orderId) {
      setSubject(`Order #${orderId} Inquiry`);
    }
  }, [productId, serviceId, orderId]);

  // Search for sellers
  const searchSellers = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real app, this would search sellers via API
      // For now, use example data
      setTimeout(() => {
        setSellers([
          {
            _id: 'seller-1',
            businessName: 'Military Surplus Store',
            description: 'Veteran-owned tactical gear and equipment',
            logoImage: '/images/logo/beatlenut-logo.svg',
            userId: {
              _id: 'user-1',
              firstName: 'John',
              lastName: 'Veteran'
            }
          },
          {
            _id: 'seller-2',
            businessName: 'Security Services Inc.',
            description: 'Professional security consultation and training',
            logoImage: '/images/logo/beatlenut-logo.svg',
            userId: {
              _id: 'user-2',
              firstName: 'Sarah',
              lastName: 'Security'
            }
          },
          {
            _id: 'seller-3',
            businessName: 'Tactical Training Academy',
            description: 'Comprehensive defense and tactical training programs',
            userId: {
              _id: 'user-3',
              firstName: 'Mike',
              lastName: 'Tactical'
            }
          }
        ].filter(seller => 
          seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${seller.userId.firstName} ${seller.userId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error('Error searching sellers:', error);
      setIsSearching(false);
      setError('Failed to search sellers. Please try again.');
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (content: string, attachments: File[]) => {
    if (!selectedSeller || !content.trim()) return;
    
    setIsLoading(true);
    try {
      // Prepare message data
      const messageData = {
        recipientId: selectedSeller.userId._id,
        content,
        subject: subject || undefined,
        attachments
      };
      
      // Add related items if provided
      if (productId) {
        Object.assign(messageData, {
          relatedItemId: productId,
          relatedItemType: 'product'
        });
      } else if (serviceId) {
        Object.assign(messageData, {
          relatedItemId: serviceId,
          relatedItemType: 'service'
        });
      } else if (orderId) {
        Object.assign(messageData, {
          relatedOrderId: orderId
        });
      }
      
      // Send message using service
      const result = await messageService.sendMessage(messageData);
      
      // Navigate to messages page with the new conversation selected
      router.push(`/esm-portal/messages?conversation=${result.conversation.conversationId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to messages
  const handleBack = () => {
    router.push('/esm-portal/messages');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">New Message</h1>
          </div>
          
          <div className="p-6">
            {/* Select Recipient */}
            {!selectedSeller && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recipient
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchSellers()}
                    placeholder="Search for a seller..."
                    className="flex-1 block w-full rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={searchSellers}
                    className="px-4 py-2 border border-transparent rounded-r-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
                
                {/* Search Results */}
                {sellers.length > 0 && (
                  <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {sellers.map((seller) => (
                        <li
                          key={seller._id}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedSeller(seller)}
                        >
                          <div className="flex items-center">
                            {seller.logoImage ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <Image
                                  src={seller.logoImage}
                                  alt={seller.businessName}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                {seller.businessName.charAt(0)}
                              </div>
                            )}
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{seller.businessName}</p>
                              <p className="text-sm text-gray-500">{seller.userId.firstName} {seller.userId.lastName}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {sellers.length === 0 && searchTerm && !isSearching && (
                  <p className="mt-2 text-sm text-gray-500">
                    No sellers found matching "{searchTerm}". Try a different search term.
                  </p>
                )}
              </div>
            )}
            
            {/* Selected Recipient */}
            {selectedSeller && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  {selectedSeller.logoImage ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={selectedSeller.logoImage}
                        alt={selectedSeller.businessName}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {selectedSeller.businessName.charAt(0)}
                    </div>
                  )}
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{selectedSeller.businessName}</p>
                    <p className="text-xs text-gray-500">{selectedSeller.userId.firstName} {selectedSeller.userId.lastName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSeller(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            
            {/* Subject */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject (optional)
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a subject..."
                disabled={isLoading}
              />
            </div>
            
            {/* Related Item */}
            {(productId || serviceId || orderId) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related To
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">
                      {productId && 'Product: '}
                      {serviceId && 'Service: '}
                      {orderId && 'Order: '}
                    </span>
                    {productId && 'Product Name'}
                    {serviceId && 'Service Name'}
                    {orderId && `#${orderId}`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Message */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <ComposeMessage
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Type your message here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewMessagePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <NewMessagePageContent />
    </Suspense>
  );
}