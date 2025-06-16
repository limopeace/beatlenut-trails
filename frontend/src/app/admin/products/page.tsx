'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye,
  faCheck,
  faTimes,
  faFilter,
  faSearch,
  faSpinner,
  faBox,
  faStore,
  faTag,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

// Types
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  seller: {
    _id: string;
    businessName: string;
    contactPerson: {
      name: string;
    };
  };
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  stock: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  status: string;
  category: string;
  seller: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  minPrice: string;
  maxPrice: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<FilterState>({
    status: '',
    category: '',
    seller: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: ''
  });

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      _id: '1',
      title: 'Professional Trekking Backpack',
      description: 'High-quality 65L backpack perfect for multi-day treks',
      price: 2500,
      category: 'Outdoor Gear',
      images: ['/images/products/backpack1.jpg'],
      seller: {
        _id: 'seller1',
        businessName: 'Mountain Gear Co.',
        contactPerson: { name: 'John Doe' }
      },
      status: 'approved',
      stock: 15,
      tags: ['trekking', 'backpack', 'outdoor'],
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:00:00Z'
    },
    {
      _id: '2',
      title: 'Mountain Bike Maintenance Kit',
      description: 'Complete toolkit for bike maintenance and repairs',
      price: 1800,
      category: 'Bike Accessories',
      images: ['/images/products/toolkit1.jpg'],
      seller: {
        _id: 'seller2',
        businessName: 'Bike Masters',
        contactPerson: { name: 'Jane Smith' }
      },
      status: 'pending',
      stock: 8,
      tags: ['bike', 'maintenance', 'tools'],
      createdAt: '2024-12-02T14:30:00Z',
      updatedAt: '2024-12-02T14:30:00Z'
    },
    {
      _id: '3',
      title: 'Camping Tent (4-person)',
      description: 'Weather-resistant 4-person tent for family camping',
      price: 4200,
      category: 'Camping',
      images: ['/images/products/tent1.jpg'],
      seller: {
        _id: 'seller3',
        businessName: 'Camp & Hike',
        contactPerson: { name: 'Mike Johnson' }
      },
      status: 'approved',
      stock: 5,
      tags: ['camping', 'tent', 'family'],
      createdAt: '2024-12-03T09:15:00Z',
      updatedAt: '2024-12-03T09:15:00Z'
    },
    {
      _id: '4',
      title: 'Hiking Boots - Waterproof',
      description: 'Professional waterproof hiking boots for all terrains',
      price: 3500,
      category: 'Footwear',
      images: ['/images/products/boots1.jpg'],
      seller: {
        _id: 'seller1',
        businessName: 'Mountain Gear Co.',
        contactPerson: { name: 'John Doe' }
      },
      status: 'rejected',
      stock: 0,
      tags: ['hiking', 'boots', 'waterproof'],
      createdAt: '2024-12-04T11:20:00Z',
      updatedAt: '2024-12-04T11:20:00Z'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on current filters
      let filteredProducts = mockProducts;
      
      if (filters.status) {
        filteredProducts = filteredProducts.filter(p => p.status === filters.status);
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      if (filters.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.seller.businessName.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProducts(filteredProducts);
      setTotalProducts(filteredProducts.length);
      setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
      
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, status }
          : product
      ));
      
      console.log(`Product ${productId} status updated to ${status}`);
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        setProducts(prev => prev.map(product => 
          selectedProducts.includes(product._id)
            ? { ...product, status: 'approved' as const }
            : product
        ));
      } else if (action === 'reject') {
        setProducts(prev => prev.map(product => 
          selectedProducts.includes(product._id)
            ? { ...product, status: 'rejected' as const }
            : product
        ));
      }
      
      setSelectedProducts([]);
      console.log(`Bulk ${action} completed for ${selectedProducts.length} products`);
    } catch (err) {
      console.error(`Error performing bulk ${action}:`, err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: faCheck },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faSpinner },
      rejected: { color: 'bg-red-100 text-red-800', icon: faTimes },
      draft: { color: 'bg-gray-100 text-gray-800', icon: faEdit }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1 w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage ESM marketplace products and listings</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Filters
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="Filter by category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products, sellers..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  status: '',
                  category: '',
                  seller: '',
                  search: '',
                  dateFrom: '',
                  dateTo: '',
                  minPrice: '',
                  maxPrice: ''
                })}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <span className="text-blue-800 font-medium mb-2 sm:mb-0">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={faBox} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <FontAwesomeIcon icon={faTag} className="mr-1 w-2 h-2" />
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.seller.businessName}</div>
                    <div className="text-sm text-gray-500">{product.seller.contactPerson.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? product.stock : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900 p-1"
                        title="Edit Product"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      {product.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateProductStatus(product._id, 'approved')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Approve Product"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            onClick={() => updateProductStatus(product._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Reject Product"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faBox} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {Object.values(filters).some(f => f) 
                ? "No products match your current filters." 
                : "No products have been listed yet."
              }
            </p>
            {!Object.values(filters).some(f => f) && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add First Product
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;