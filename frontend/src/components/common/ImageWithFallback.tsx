'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

/**
 * Image component with fallback for when images fail to load.
 * This helps prevent blank spaces when images are missing.
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  alt,
  src,
  fallbackSrc = '/images/placeholder.jpg',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set initial states only after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
  }, []);

  if (!isMounted) {
    // Return a static placeholder during SSR to match initial hydration
    return (
      <Image
        {...props}
        src={src}
        alt={alt}
      />
    );
  }

  return (
    <>
      {/* Loading placeholder - only shown client-side */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <div className="w-10 h-10 text-gray-400" />
        </div>
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
      />
    </>
  );
};

export default ImageWithFallback;