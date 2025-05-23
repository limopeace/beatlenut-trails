'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for cart items and context
export interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  options?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, type: 'product' | 'service', quantity: number) => void;
  removeItem: (id: string, type: 'product' | 'service') => void;
  clearCart: () => void;
  isInCart: (id: string, type: 'product' | 'service') => boolean;
}

// Default context state
const defaultCartContext: CartContextType = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  isInCart: () => false
};

// Create context
const CartContext = createContext<CartContextType>(defaultCartContext);

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  
  // Calculate derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.18; // 18% GST
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('esmCart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setCartLoaded(true);
      }
    };
    
    loadCart();
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    // Only save once the cart has been loaded
    if (cartLoaded) {
      localStorage.setItem('esmCart', JSON.stringify(items));
    }
  }, [items, cartLoaded]);
  
  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.id === newItem.id && item.type === newItem.type
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        // If there are new options, update or add them
        if (newItem.options) {
          updatedItems[existingItemIndex].options = {
            ...(updatedItems[existingItemIndex].options || {}),
            ...newItem.options
          };
        }
        
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, newItem];
      }
    });
  };
  
  // Update item quantity
  const updateQuantity = (id: string, type: 'product' | 'service', quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  // Remove item from cart
  const removeItem = (id: string, type: 'product' | 'service') => {
    setItems(currentItems =>
      currentItems.filter(item => !(item.id === id && item.type === type))
    );
  };
  
  // Clear entire cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Check if item is in cart
  const isInCart = (id: string, type: 'product' | 'service'): boolean => {
    return items.some(item => item.id === id && item.type === type);
  };
  
  // Create context value
  const contextValue: CartContextType = {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;