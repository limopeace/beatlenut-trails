'use client';

import React, { useState } from 'react';
import { useCart, CartItem } from '@/utils/cartContext';

interface ProductOption {
  name: string;
  values: string[];
}

interface AddToCartButtonProps {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  options?: ProductOption[];
  className?: string;
  buttonText?: string;
  onAddedToCart?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  id,
  type,
  name,
  price,
  imageUrl,
  sellerId,
  sellerName,
  options = [],
  className = '',
  buttonText = 'Add to Cart',
  onAddedToCart,
}) => {
  const { addItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Initialize default options
  React.useEffect(() => {
    const defaults: Record<string, string> = {};
    options.forEach(option => {
      if (option.values.length > 0) {
        defaults[option.name] = option.values[0];
      }
    });
    setSelectedOptions(defaults);
  }, [options]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const newItem: CartItem = {
      id,
      type,
      name,
      price,
      quantity,
      imageUrl,
      sellerId,
      sellerName,
      options: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
    };
    
    addItem(newItem);
    
    if (onAddedToCart) {
      onAddedToCart();
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const alreadyInCart = isInCart(id, type);

  return (
    <div className="mt-6">
      {options.length > 0 && (
        <div className="mb-4 space-y-3">
          {options.map((option) => (
            <div key={option.name}>
              <label htmlFor={`option-${option.name}`} className="block text-sm font-medium text-gray-700 mb-1">
                {option.name}
              </label>
              <select
                id={`option-${option.name}`}
                value={selectedOptions[option.name] || ''}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {option.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-3">
          Quantity
        </label>
        <div className="flex items-center border rounded">
          <button
            type="button"
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-800">{quantity}</span>
          <button
            type="button"
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isAdding ? 'opacity-75 cursor-not-allowed' : ''
        } ${className}`}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </>
        ) : alreadyInCart ? (
          'Add More to Cart'
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;