'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    businessName: string;
  };
  total: number;
  status: string;
  paymentStatus: string;
  items: number;
  createdAt: string;
}

interface FilterOptions {
  status: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  sellerFilter: string;
}

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const badgeColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const badgeColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
    partially_refunded: 'bg-blue-100 text-blue-800'
  };
  
  const displayText: Record<string, string> = {
    partially_refunded: 'Partial Refund'
  };
  
  const text = displayText[status] || (status.charAt(0).toUpperCase() + status.slice(1));
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {text}
    </span>
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0 
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const AdminOrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: '',
    sellerFilter: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  useEffect(() => {
    const adminToken = Cookies.get('admin_token');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    
    fetchOrders();
  }, [router, currentPage, filters]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/admin/orders?page=${currentPage}&status=${filters.status}&...`);
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ESM2310000123',
            customer: {
              name: 'Rahul Sharma',
              email: 'rahul.sharma@example.com'
            },
            seller: {
              name: 'Vikram Mehta',
              businessName: 'Adventure Gear Co.'
            },
            total: 12500,
            status: 'completed',
            paymentStatus: 'completed',
            items: 3,
            createdAt: '2023-10-15T10:30:00Z'
          },
          {
            id: '2',
            orderNumber: 'ESM2310000122',
            customer: {
              name: 'Priya Patel',
              email: 'priya.patel@example.com'
            },
            seller: {
              name: 'Suresh Reddy',
              businessName: 'Mountain Explorers'
            },
            total: 8750,
            status: 'processing',
            paymentStatus: 'completed',
            items: 2,
            createdAt: '2023-10-14T14:20:00Z'
          },
          {
            id: '3',
            orderNumber: 'ESM2310000120',
            customer: {
              name: 'Amit Singh',
              email: 'amit.singh@example.com'
            },
            seller: {
              name: 'Vikram Mehta',
              businessName: 'Adventure Gear Co.'
            },
            total: 3200,
            status: 'shipped',
            paymentStatus: 'completed',
            items: 1,
            createdAt: '2023-10-12T09:15:00Z'
          },
          {
            id: '4',
            orderNumber: 'ESM2310000118',
            customer: {
              name: 'Neha Gupta',
              email: 'neha.gupta@example.com'
            },
            seller: {
              name: 'Anita Desai',
              businessName: 'Himalayan Treks'
            },
            total: 5800,
            status: 'cancelled',
            paymentStatus: 'refunded',
            items: 2,
            createdAt: '2023-10-10T16:45:00Z'
          },
          {
            id: '5',
            orderNumber: 'ESM2310000116',
            customer: {
              name: 'Rajesh Kumar',
              email: 'rajesh.kumar@example.com'
            },
            seller: {
              name: 'Suresh Reddy',
              businessName: 'Mountain Explorers'
            },
            total: 9350,
            status: 'completed',
            paymentStatus: 'completed',
            items: 3,
            createdAt: '2023-10-08T11:30:00Z'
          },
          {
            id: '6',
            orderNumber: 'ESM2310000115',
            customer: {
              name: 'Ananya Desai',
              email: 'ananya.desai@example.com'
            },
            seller: {
              name: 'Vikram Mehta',
              businessName: 'Adventure Gear Co.'
            },
            total: 6700,
            status: 'delivered',
            paymentStatus: 'completed',
            items: 2,
            createdAt: '2023-10-07T13:20:00Z'
          },
          {
            id: '7',
            orderNumber: 'ESM2310000112',
            customer: {
              name: 'Kiran Rao',
              email: 'kiran.rao@example.com'
            },
            seller: {
              name: 'Anita Desai',
              businessName: 'Himalayan Treks'
            },
            total: 15200,
            status: 'completed',
            paymentStatus: 'completed',
            items: 4,
            createdAt: '2023-10-05T10:15:00Z'
          },
          {
            id: '8',
            orderNumber: 'ESM2310000110',
            customer: {
              name: 'Vivek Joshi',
              email: 'vivek.joshi@example.com'
            },
            seller: {
              name: 'Suresh Reddy',
              businessName: 'Mountain Explorers'
            },
            total: 4300,
            status: 'pending',
            paymentStatus: 'pending',
            items: 1,
            createdAt: '2023-10-03T16:50:00Z'
          },
          {
            id: '9',
            orderNumber: 'ESM2310000109',
            customer: {
              name: 'Pooja Mehra',
              email: 'pooja.mehra@example.com'
            },
            seller: {
              name: 'Vikram Mehta',
              businessName: 'Adventure Gear Co.'
            },
            total: 7800,
            status: 'confirmed',
            paymentStatus: 'completed',
            items: 2,
            createdAt: '2023-10-02T09:30:00Z'
          },
          {
            id: '10',
            orderNumber: 'ESM2310000105',
            customer: {
              name: 'Sandeep Verma',
              email: 'sandeep.verma@example.com'
            },
            seller: {
              name: 'Anita Desai',
              businessName: 'Himalayan Treks'
            },
            total: 11900,
            status: 'completed',
            paymentStatus: 'partially_refunded',
            items: 3,
            createdAt: '2023-09-28T14:20:00Z'
          },
        ];
        
        // Filter orders
        let filteredOrders = [...mockOrders];
        
        if (filters.status) {
          filteredOrders = filteredOrders.filter(order => order.status === filters.status);
        }
        
        if (filters.paymentStatus) {
          filteredOrders = filteredOrders.filter(order => order.paymentStatus === filters.paymentStatus);
        }
        
        if (filters.sellerFilter) {
          filteredOrders = filteredOrders.filter(order => 
            order.seller.businessName.toLowerCase().includes(filters.sellerFilter.toLowerCase())
          );
        }
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom).getTime();
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt).getTime() >= fromDate
          );
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo).getTime();
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt).getTime() <= toDate
          );
        }
        
        if (searchTerm) {
          filteredOrders = filteredOrders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.seller.businessName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setOrders(filteredOrders);
        setTotalPages(Math.ceil(filteredOrders.length / 10));
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      dateFrom: '',
      dateTo: '',
      sellerFilter: ''
    });
    setSearchTerm('');
  };
  
  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };
  
  const handleBulkAction = (action: string) => {
    // In a real implementation, this would be an API call
    console.log(`Performing ${action} on orders:`, selectedOrders);
    alert(`${action} action would be performed on ${selectedOrders.length} orders`);
    setSelectedOrders([]);
  };
  
  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };
  
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Orders</h1>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 flex items-center"
            >
              <i className="fas fa-filter mr-2"></i>
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {selectedOrders.length > 0 && (
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <span>Bulk Actions ({selectedOrders.length})</span>
                    <i className="fas fa-chevron-down ml-2"></i>
                  </button>
                </div>
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleBulkAction('mark-processing')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => handleBulkAction('mark-shipped')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export Orders
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by number, customer, or seller..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-blue-600"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
        
        {isFilterOpen && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Payment Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="partially_refunded">Partially Refunded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seller
                </label>
                <input
                  type="text"
                  name="sellerFilter"
                  placeholder="Filter by seller name"
                  value={filters.sellerFilter}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items} {order.items === 1 ? 'item' : 'items'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.seller.businessName}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Edit Status
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            View Invoice
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-search text-3xl mb-2"></i>
                      <p className="text-lg">No orders found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                      {(searchTerm || Object.values(filters).some(val => val !== '')) && (
                        <button
                          onClick={clearFilters}
                          className="mt-2 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {orders.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, orders.length)}</span> of{' '}
                  <span className="font-medium">{orders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === page
                          ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;