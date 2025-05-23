import React from 'react';
import { useRouter } from 'next/navigation';

interface ContactButtonProps {
  recipientId: string;
  recipientName: string;
  relatedItem?: {
    type: 'product' | 'service';
    id: string;
    name: string;
  };
  relatedOrder?: {
    id: string;
    number: string;
  };
  variant?: 'primary' | 'secondary' | 'text' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  icon?: boolean;
  fullWidth?: boolean;
}

/**
 * Contact Button component for products and services
 * 
 * This button redirects to the new message page with pre-filled recipient and related item data
 */
const ContactButton: React.FC<ContactButtonProps> = ({
  recipientId,
  recipientName,
  relatedItem,
  relatedOrder,
  variant = 'primary',
  size = 'md',
  className = '',
  label = 'Contact Seller',
  icon = true,
  fullWidth = false
}) => {
  const router = useRouter();

  // Button style variants
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    text: 'bg-transparent hover:bg-gray-100 text-blue-600',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
  };

  // Button size variants
  const sizeStyles = {
    sm: 'text-xs py-1 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6'
  };

  const handleClick = () => {
    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append('recipient', recipientId);
    
    // Add related item parameters if provided
    if (relatedItem) {
      params.append(relatedItem.type, relatedItem.id);
    }
    
    // Add related order parameters if provided
    if (relatedOrder) {
      params.append('order', relatedOrder.id);
    }
    
    // Navigate to new message page with parameters
    router.push(`/esm-portal/messages/new?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        rounded-md font-medium transition-colors
        flex items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      aria-label={`Contact ${recipientName}`}
    >
      {icon && (
        <svg 
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} ${label ? 'mr-2' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      )}
      {label}
    </button>
  );
};

export default ContactButton;