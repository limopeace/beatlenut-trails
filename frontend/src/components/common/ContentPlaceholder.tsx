'use client';

import React, { useState, useEffect } from 'react';

interface ContentPlaceholderProps {
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  className?: string;
  iconSize?: 'small' | 'medium' | 'large';
  text?: string;
  icon?: React.ReactNode;
  imageType?: boolean;
}

/**
 * ContentPlaceholder component for displaying in place of content that may not be loaded yet
 * This prevents blank spaces in the UI
 */
const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  width = '100%',
  height = '100%',
  animated = true,
  className = '',
  iconSize = 'medium',
  text,
  icon,
  imageType = false,
}) => {
  // For SSR compatibility
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getIconSize = () => {
    switch (iconSize) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-16 h-16';
      case 'medium':
      default:
        return 'w-10 h-10';
    }
  };

  const defaultIcon = (
    <svg
      className={`${getIconSize()} text-gray-400`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      {imageType ? (
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M13.75 6.75L13.75 9.25M16.25 9.25L16.25 6.75M13.75 6.75C13.75 5.64543 14.6454 4.75 15.75 4.75H16.25C17.3546 4.75 18.25 5.64543 18.25 6.75V9.25C18.25 10.3546 17.3546 11.25 16.25 11.25H15.75C14.6454 11.25 13.75 10.3546 13.75 9.25V6.75Z"
        />
      ) : (
        <>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </>
      )}
    </svg>
  );

  // Use a consistent static placeholder for server-side rendering
  if (!isMounted) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-200 ${className}`}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }}
      >
        {/* Static server-side content */}
      </div>
    );
  }

  // Client-side dynamic content
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gray-200 ${animated ? 'animate-pulse' : ''} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    >
      {icon || defaultIcon}
      {text && (
        <p className="mt-2 text-center text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default ContentPlaceholder;