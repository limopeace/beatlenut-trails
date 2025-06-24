'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from your API
        // For now, using mock data
        const mockProduct: Product = {
          id: productId,
          name: `Product ${productId}`,
          description: 'This is a sample product description. In a real implementation, this would be fetched from your backend API.',
          price: 299.99,
          category: 'Electronics',
          seller: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          images: [
            '/images/hero-placeholder.jpg',
            '/images/hero-placeholder.jpg'
          ],
          status: 'active',
          createdAt: '2023-07-15T10:30:00.000Z'
        };
        
        setProduct(mockProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleStatusUpdate = async (newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      // In a real implementation, this would call your API
      console.log(`Updating product ${productId} status to ${newStatus}`);
      if (product) {
        setProduct({ ...product, status: newStatus });
      }
      alert(`Product status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update product status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/admin/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/admin/products" 
            className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
          >
            ← Back to Products
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">Product ID: {product.id}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadgeClass(product.status)}`}>
              {product.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{product.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="mt-1 text-sm text-gray-900">₹{product.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(product.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{product.seller.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{product.seller.email}</p>
                </div>
                <div>
                  <Link
                    href={`/admin/sellers/${product.seller.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Seller Profile →
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as 'active' | 'inactive' | 'pending')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => alert('Edit functionality will be implemented soon!')}
                  >
                    Edit Product
                  </button>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        alert('Delete functionality will be implemented soon!');
                      }
                    }}
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Development Notice</h3>
              <p className="text-sm text-yellow-700">
                This page shows mock data. Full product management functionality will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}