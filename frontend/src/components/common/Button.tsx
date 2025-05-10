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

  if (href) {
    return (
      <Link href={href} className={baseClasses} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

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
};

export default Button;