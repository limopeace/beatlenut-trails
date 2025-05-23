'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '@/utils/cartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Group items by seller
  const itemsBySeller = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = [];
    }
    acc[item.sellerId].push(item);
    return acc;
  }, {});
  
  // Handle quantity change
  const handleQuantityChange = (id: string, type: 'product' | 'service', newQuantity: number) => {
    updateQuantity(id, type, newQuantity);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          ref={drawerRef}
          className="w-screen max-w-md transform transition ease-in-out duration-300"
        >
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              
              {itemCount === 0 ? (
                <div className="mt-20 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start adding items to your cart to see them here.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {Object.entries(itemsBySeller).map(([sellerId, sellerItems]) => (
                        <li key={sellerId} className="py-6">
                          <div className="font-medium text-gray-900 mb-2">
                            {sellerItems[0].sellerName}
                          </div>
                          
                          {sellerItems.map((item) => (
                            <div
                              key={`${item.id}-${item.type}`}
                              className="flex py-4 border-t border-gray-200 first:border-t-0"
                            >
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              
                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <Link href={`/esm-portal/${item.type === 'product' ? 'products' : 'services'}/${item.id}`}>
                                        {item.name}
                                      </Link>
                                    </h3>
                                    <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.type === 'product' ? 'Product' : 'Service'}
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
                                  <div className="flex items-center border rounded">
                                    <button
                                      type="button"
                                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                      onClick={() => handleQuantityChange(item.id, item.type, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                      onClick={() => handleQuantityChange(item.id, item.type, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                  
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-blue-600 hover:text-blue-500"
                                      onClick={() => removeItem(item.id, item.type)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {itemCount > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <p>GST (18%)</p>
                  <p>{formatCurrency(tax)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>{formatCurrency(total)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping calculated at checkout
                </p>
                <div className="mt-6">
                  <Link
                    href="/esm-portal/checkout"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-blue-600 font-medium hover:text-blue-500"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
                <div className="mt-2 flex justify-center">
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-500"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;