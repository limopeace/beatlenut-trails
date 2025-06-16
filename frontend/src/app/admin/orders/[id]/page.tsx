'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Order, 
  getOrderById,
  updateOrderStatus
} from '@/services/api/orderService';
import Cookies from 'js-cookie';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AdminOrderDetailPage = ({ params }: OrderDetailPageProps) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<UpdateOrderStatusPayload>({
    status: 'processing',
    notes: '',
  });
  const [trackingUpdate, setTrackingUpdate] = useState<UpdateTrackingInfoPayload>({
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
  });
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = Cookies.get('admin_token');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    
    fetchOrderDetails();
  }, [resolvedParams.id, router]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await OrderService.adminGetOrderById(resolvedParams.id);
      if (response.data.success) {
        const orderData = response.data.data;
        setOrder(orderData);
        
        // Initialize status and tracking forms with current values
        setStatusUpdate({
          status: orderData.status,
          notes: '',
        });
        
        setTrackingUpdate({
          carrier: orderData.trackingInfo?.carrier || '',
          trackingNumber: orderData.trackingInfo?.trackingNumber || '',
          trackingUrl: orderData.trackingInfo?.trackingUrl || '',
          estimatedDelivery: orderData.trackingInfo?.estimatedDelivery || '',
        });
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

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      const response = await OrderService.adminUpdateOrderStatus(order.id, statusUpdate);
      if (response.data.success) {
        setOrder(response.data.data);
        setIsStatusModalOpen(false);
      } else {
        setError('Failed to update order status');
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'An error occurred while updating order status');
    }
  };

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      const response = await OrderService.adminUpdateTrackingInfo(order.id, trackingUpdate);
      if (response.data.success) {
        setOrder(response.data.data);
        setIsTrackingModalOpen(false);
      } else {
        setError('Failed to update tracking information');
      }
    } catch (err: any) {
      console.error('Error updating tracking info:', err);
      setError(err.response?.data?.message || 'An error occurred while updating tracking information');
    }
  };

  const handleDeleteOrder = async () => {
    if (!order) return;

    try {
      const response = await OrderService.adminDeleteOrder(order.id);
      if (response.data.success) {
        router.push('/admin/orders');
      } else {
        setError('Failed to delete order');
        setIsConfirmDeleteModalOpen(false);
      }
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setError(err.response?.data?.message || 'An error occurred while deleting the order');
      setIsConfirmDeleteModalOpen(false);
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
  const getStatusBadgeClass = (status: Order['status']): string => {
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Orders
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
            href="/admin/orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/orders"
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Status
          </button>
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Tracking
          </button>
          <button
            onClick={() => setIsConfirmDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Order
          </button>
        </div>
      </div>

      {/* Order Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Status:</span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span>{formatDate(order.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Buyer Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Buyer Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {order.customer.name}</p>
            <p><span className="font-medium">Buyer ID:</span> {order.customer.id}</p>
            <h3 className="font-medium mt-4 mb-2">Shipping Address:</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">
              <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span>{formatCurrency(order.tax || 0)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-gray-600">Total Items:</span>
              <span>{order.items.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={`${item.id}-${item.type}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          src={item.imageUrl || '/images/placeholder.jpg'}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="text-xs text-gray-500">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.sellerName}</div>
                    <div className="text-xs text-gray-500">ID: {item.sellerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Tracking Information</h2>
        {order.trackingInfo && (order.trackingInfo.trackingNumber || order.trackingInfo.carrier) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="text-gray-600 block mb-1">Carrier:</span>
                <span className="text-gray-900 font-medium">{order.trackingInfo.carrier || 'Not specified'}</span>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 block mb-1">Tracking Number:</span>
                <span className="text-gray-900 font-medium">{order.trackingInfo.trackingNumber || 'Not specified'}</span>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-gray-600 block mb-1">Estimated Delivery:</span>
                <span className="text-gray-900 font-medium">
                  {order.trackingInfo.estimatedDelivery 
                    ? new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('en-IN') 
                    : 'Not specified'}
                </span>
              </div>
              {order.trackingInfo.trackingUrl && (
                <div>
                  <span className="text-gray-600 block mb-1">Tracking Link:</span>
                  <a 
                    href={order.trackingInfo.trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Track Package
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No tracking information has been provided yet.</p>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order History</h2>
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

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateStatus}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Update Order Status
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          Order #{order.orderNumber}
                        </p>

                        <div className="mb-4">
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            id="status"
                            value={statusUpdate.status}
                            onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value as any})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional)
                          </label>
                          <textarea
                            id="notes"
                            value={statusUpdate.notes || ''}
                            onChange={(e) => setStatusUpdate({...statusUpdate, notes: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add any notes about this status update"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Info Modal */}
      {isTrackingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateTracking}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Update Tracking Information
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          Order #{order.orderNumber}
                        </p>

                        <div className="mb-4">
                          <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-1">
                            Carrier
                          </label>
                          <input
                            type="text"
                            id="carrier"
                            value={trackingUpdate.carrier || ''}
                            onChange={(e) => setTrackingUpdate({...trackingUpdate, carrier: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., FedEx, UPS, DTDC"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Tracking Number
                          </label>
                          <input
                            type="text"
                            id="trackingNumber"
                            value={trackingUpdate.trackingNumber || ''}
                            onChange={(e) => setTrackingUpdate({...trackingUpdate, trackingNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter tracking number"
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="trackingUrl" className="block text-sm font-medium text-gray-700 mb-1">
                            Tracking URL (optional)
                          </label>
                          <input
                            type="url"
                            id="trackingUrl"
                            value={trackingUpdate.trackingUrl || ''}
                            onChange={(e) => setTrackingUpdate({...trackingUpdate, trackingUrl: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/track?number=12345"
                          />
                        </div>

                        <div>
                          <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Delivery Date (optional)
                          </label>
                          <input
                            type="date"
                            id="estimatedDelivery"
                            value={trackingUpdate.estimatedDelivery ? new Date(trackingUpdate.estimatedDelivery).toISOString().substring(0, 10) : ''}
                            onChange={(e) => setTrackingUpdate({...trackingUpdate, estimatedDelivery: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTrackingModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Order
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this order? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteOrder}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetailPage;