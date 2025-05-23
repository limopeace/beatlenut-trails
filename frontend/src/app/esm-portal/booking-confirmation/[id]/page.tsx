'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderConfirmationProps {
  params: {
    id: string;
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // In a real application, fetch the order details from the API
    // const fetchOrderDetails = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch(`/api/orders/${id}`);
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch order details');
    //     }
    //     const data = await response.json();
    //     setOrderData(data);
    //   } catch (error) {
    //     setError('Could not load order details');
    //     console.error('Error fetching order details:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchOrderDetails();
    
    // For demo purposes, create mock order data
    setTimeout(() => {
      setOrderData({
        orderNumber: id,
        status: 'confirmed',
        date: new Date().toISOString(),
        total: 15750,
        items: [
          {
            name: 'Premium Hiking Backpack',
            quantity: 1,
            price: 5200
          },
          {
            name: 'Waterproof Tent',
            quantity: 1,
            price: 8500
          },
          {
            name: 'Trail Map Package',
            quantity: 1,
            price: 350
          }
        ],
        customer: {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com'
        },
        shipping: {
          address: '123 Main Street, Apartment 4B',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001'
        },
        payment: {
          method: 'upi',
          transactionId: 'TXN123456789'
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Order Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || 'We could not find the order you are looking for.'}
          </p>
          <div className="mt-6">
            <Link 
              href="/esm-portal/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Thanks for ordering!</h1>
              <p className="mt-2 text-lg text-gray-500">
                Your order has been placed successfully.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We've sent you an email with all the details.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Order Summary</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Order #{orderData.orderNumber}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on {formatDate(orderData.date)}
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Items</dt>
                  <dd className="mt-1">
                    <ul className="divide-y divide-gray-200">
                      {orderData.items.map((item: any, index: number) => (
                        <li key={index} className="py-3 flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      {orderData.shipping.address}<br />
                      {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.postalCode}
                    </address>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {orderData.payment.method === 'credit_card' && 'Credit Card'}
                    {orderData.payment.method === 'debit_card' && 'Debit Card'}
                    {orderData.payment.method === 'upi' && 'UPI'}
                    {orderData.payment.method === 'net_banking' && 'Net Banking'}
                    {orderData.payment.method === 'wallet' && 'Wallet'}
                    {orderData.payment.method === 'cod' && 'Cash on Delivery'}
                  </dd>
                </div>

                <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                    <dd className="text-sm text-gray-900">{formatCurrency(orderData.total / 1.18)}</dd>
                  </div>

                  <div className="flex justify-between mt-2">
                    <dt className="text-sm font-medium text-gray-500">GST (18%)</dt>
                    <dd className="text-sm text-gray-900">{formatCurrency(orderData.total - (orderData.total / 1.18))}</dd>
                  </div>

                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                    <dt className="text-base font-medium text-gray-900">Total</dt>
                    <dd className="text-base font-medium text-gray-900">{formatCurrency(orderData.total)}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/esm-portal/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </Link>
            <Link
              href="/esm-portal/my-orders"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;