'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OrderService, Order, TrackingInfo } from '@/services/api/orderService';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const OrderDetailPage = ({ params }: OrderDetailPageProps) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await OrderService.getOrderById(params.id);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status: Order['currentStatus']): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status: Order['paymentStatus']): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await OrderService.cancelOrder(order.id);
        if (response.data.success) {
          fetchOrderDetails(); // Refresh order details
        } else {
          setError('Failed to cancel order');
        }
      } catch (err: any) {
        console.error('Error cancelling order:', err);
        setError(err.response?.data?.message || 'An error occurred while cancelling the order');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
        <div className="text-center">
          <Link
            href="/esm-portal/my-orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-6">The requested order could not be found.</p>
          <Link
            href="/esm-portal/my-orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link
            href="/esm-portal/my-orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            &larr; Back to My Orders
          </Link>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        <div className="mt-4 md:mt-0">
          {order.currentStatus === 'pending' && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Order #{order.orderNumber}</h2>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex flex-col sm:items-end">
                  <div className="mb-2">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.currentStatus)}`}>
                      {order.currentStatus.charAt(0).toUpperCase() + order.currentStatus.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-md font-semibold mb-4 border-b pb-2">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.type}`} className="flex border-b pb-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h4>{item.name}</h4>
                        <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Seller: {item.sellerName}
                      </p>
                      
                      {/* Display options if any */}
                      {item.options && Object.keys(item.options).length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {Object.entries(item.options).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <p className="text-gray-500">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax (GST)</p>
                <p className="font-medium">{formatCurrency(order.tax)}</p>
              </div>
              
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                <p className="text-gray-800 font-medium">Total</p>
                <p className="font-bold text-blue-600">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {order.trackingInfo && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-md font-semibold mb-4">Tracking Information</h3>
              
              {order.trackingInfo.trackingNumber ? (
                <div className="space-y-2">
                  {order.trackingInfo.carrier && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier:</span>
                      <span className="font-medium">{order.trackingInfo.carrier}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-medium">{order.trackingInfo.trackingNumber}</span>
                  </div>
                  
                  {order.trackingInfo.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">{new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  
                  {order.trackingInfo.trackingUrl && (
                    <div className="mt-4">
                      <a
                        href={order.trackingInfo.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded inline-block hover:bg-blue-700"
                      >
                        Track Package
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Tracking information will be updated once your order ships.</p>
              )}
            </div>
          )}

          {/* Order Status History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold mb-4">Order History</h3>
            
            <div className="space-y-6">
              {order.statusHistory.map((status, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900">
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </h4>
                      <span className="ml-2 text-xs text-gray-500">
                        {formatDate(status.updatedAt)}
                      </span>
                    </div>
                    {status.notes && <p className="text-sm text-gray-500 mt-1">{status.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-md font-semibold mb-4">Shipping Address</h3>
            <address className="not-italic">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
            </address>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-md font-semibold mb-4">Payment Information</h3>
            <p className="mb-2">
              <span className="font-medium">Method:</span>{' '}
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
               order.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 
               order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </p>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions or issues with this order, please contact our customer support.
            </p>
            <Link
              href="/esm-portal/messages/new"
              className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;