'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button = ({
  href,
  onClick,
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  fullWidth = false,
  disabled = false,
  ariaLabel,
}: ButtonProps) => {
  const baseClasses = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  // If we have onClick but no href, or if we have both onClick and href,
  // render a button element
  if ((onClick && !href) || (onClick && href)) {
    return (
      <button
        type={type}
        className={baseClasses}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  // If we only have href, render a link
  if (href) {
    return (
      <Link 
        href={href} 
        className={baseClasses} 
        aria-label={ariaLabel}
        prefetch={false} // Disable prefetching to prevent hydration issues
      >
        {children}
      </Link>
    );
  }

  // Default to button if neither onClick nor href is provided
  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;