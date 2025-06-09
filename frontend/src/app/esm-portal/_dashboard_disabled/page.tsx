'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBoxOpen, faCog, faChartLine, faStore, faClock, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

export default function SellerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    views: 0,
    inquiries: 0,
  });
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
        try {
          setUser(JSON.parse(userData));
          // Fetch dashboard data here when we have an API
          // For now, set dummy data
          setStats({
            totalProducts: 3,
            totalServices: 2,
            views: 150,
            inquiries: 12,
          });
        } catch (e) {
          console.error('Failed to parse user data:', e);
          router.push('/esm-portal/login');
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/esm-portal/login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const recentListings = [
    {
      id: 1,
      name: 'Handcrafted Bamboo Art',
      type: 'Product',
      price: '₹1,200',
      thumbnail: 'https://picsum.photos/id/119/800/500',
      created: '3 days ago',
    },
    {
      id: 2,
      name: 'Organic Tea Collection',
      type: 'Product',
      price: '₹850',
      thumbnail: 'https://picsum.photos/id/431/800/500',
      created: '1 week ago',
    },
    {
      id: 3,
      name: 'Security Consultation',
      type: 'Service',
      price: 'Starts at ₹5,000',
      thumbnail: 'https://picsum.photos/id/668/800/500',
      created: '2 weeks ago',
    }
  ];

  const recentInquiries = [
    {
      id: 1,
      product: 'Handcrafted Bamboo Art',
      customer: 'Rahul Sharma',
      date: '2 days ago',
      message: 'I am interested in the bamboo wall hanging. Is it available in different sizes?',
      status: 'Pending',
    },
    {
      id: 2,
      product: 'Security Consultation',
      customer: 'Amit Patel',
      date: '5 days ago',
      message: 'We need a security assessment for our new office building. Can you provide details about your service?',
      status: 'Replied',
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="esm-hero-section">
        <div className="esm-container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="esm-section-title">
                Seller Dashboard
              </h1>
              <p className="text-pale-straw/80 mb-0">
                Welcome back, {user?.fullName || 'Seller'}
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

      {/* Dashboard Content */}
      <section className="py-12 bg-gray-50">
        <div className="esm-container">
          
          {/* Stats */}
          <div className="esm-dashboard-stats">
            <div className="esm-dashboard-stat-card">
              <div className="esm-dashboard-stat-icon">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <h3 className="esm-dashboard-stat-value">{stats.totalProducts}</h3>
              </div>
            </div>
            
            <div className="esm-dashboard-stat-card">
              <div className="esm-dashboard-stat-icon">
                <FontAwesomeIcon icon={faCog} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Services</p>
                <h3 className="esm-dashboard-stat-value">{stats.totalServices}</h3>
              </div>
            </div>
            
            <div className="esm-dashboard-stat-card">
              <div className="esm-dashboard-stat-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <h3 className="esm-dashboard-stat-value">{stats.views}</h3>
              </div>
            </div>
            
            <div className="esm-dashboard-stat-card">
              <div className="esm-dashboard-stat-icon">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Inquiries</p>
                <h3 className="esm-dashboard-stat-value">{stats.inquiries}</h3>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Listings */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Listings</h2>
                  <Link href="/esm-portal/my-listings" className="text-forest-green hover:text-moss-green text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {recentListings.map(listing => (
                    <div key={listing.id} className="py-4 flex items-center">
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                        <img 
                          src={listing.thumbnail} 
                          alt={listing.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">{listing.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <div>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                              listing.type === 'Product' ? 'bg-forest-green/10 text-forest-green' : 'bg-moss-green/10 text-moss-green'
                            } mr-2`}>{listing.type}</span>
                            <span className="text-sm text-gray-500">{listing.price}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                            {listing.created}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Link href="/esm-portal/add-product" passHref>
                    <Button variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all mr-3">
                      Add New Product
                    </Button>
                  </Link>
                  <Link href="/esm-portal/add-service" passHref>
                    <Button variant="secondary" className="border-2 border-forest-green text-forest-green hover:bg-forest-green/5 transition-all">
                      Add New Service
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Inquiries */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Inquiries</h2>
                  <Link href="/esm-portal/inquiries" className="text-forest-green hover:text-moss-green text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                {recentInquiries.map(inquiry => (
                  <div key={inquiry.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-800">{inquiry.customer}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        inquiry.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{inquiry.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <span>About:</span> {inquiry.product}
                    </p>
                    <p className="text-sm text-gray-600 my-2 line-clamp-2">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                        {inquiry.date}
                      </span>
                      <button className="text-forest-green hover:text-moss-green text-sm font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
                
                {recentInquiries.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No recent inquiries
                  </div>
                )}
              </div>
              
              {/* Account Verification Status */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-forest-green mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">Account Status</h2>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Your account is verified
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        You can create listings and receive inquiries from customers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Need help with your seller account? Contact our support team anytime.
                </p>
                <Link href="/esm-portal/support" passHref>
                  <Button
                    variant="tertiary"
                    className="text-forest-green hover:text-moss-green mt-2 text-sm pl-0"
                  >
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}