'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NatureButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * NatureButton - A customizable button with nature-inspired styling and animations
 */
const NatureButton: React.FC<NatureButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'right',
  ariaLabel,
  type = 'button',
  disabled = false,
}) => {
  // Determine size-based classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm py-1.5 px-4';
      case 'lg': return 'text-lg py-3 px-8';
      default: return 'text-base py-2 px-6'; // medium is default
    }
  };

  // Determine variant-based classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-transparent border-2 border-forest-deep text-forest-deep hover:bg-forest-deep hover:text-canvas-white';
      case 'tertiary':
        return 'bg-transparent text-teal-medium hover:text-teal-dark p-0 group';
      case 'glass':
        return 'bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white';
      default: // primary
        return 'bg-golden-medium hover:bg-golden-dark text-canvas-white shadow-md';
    }
  };

  // Common button props
  const buttonProps = {
    className: `
      font-montserrat font-medium rounded-md transition-all
      ${getSizeClasses()}
      ${getVariantClasses()}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `,
    onClick: disabled ? undefined : onClick,
    'aria-label': ariaLabel,
    disabled,
  };

  // Animation props
  const motionProps = {
    whileHover: disabled 
      ? {} 
      : (variant === 'tertiary' 
          ? {} 
          : { scale: 1.05, boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }),
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { duration: 0.2 }
  };

  // Render content with icon
  const renderContent = () => {
    if (!icon) return children;

    return (
      <span className="flex items-center gap-2">
        {iconPosition === 'left' && <span className="inline-block">{icon}</span>}
        <span>{children}</span>
        {iconPosition === 'right' && (
          <span className={`inline-block ${variant === 'tertiary' ? 'group-hover:translate-x-1 transition-transform duration-300' : ''}`}>
            {icon}
          </span>
        )}
      </span>
    );
  };

  // Tertiary button needs underline animation
  const tertiaryElement = variant === 'tertiary' && (
    <span className="block w-0 group-hover:w-full h-0.5 bg-teal-medium mt-0.5 transition-all duration-300"></span>
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        <motion.span {...buttonProps} {...motionProps}>
          {renderContent()}
          {tertiaryElement}
        </motion.span>
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <motion.button type={type} {...buttonProps} {...motionProps}>
      {renderContent()}
      {tertiaryElement}
    </motion.button>
  );
};

export default NatureButton;