'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface NextImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  containerClassName?: string;
  aspectRatio?: string;
  shimmer?: boolean;
}

const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  width,
  height,
  containerClassName = '',
  aspectRatio = 'auto',
  shimmer = false,
  priority = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
    setImgSrc(fallbackSrc);
    setIsLoading(false);
  };

  return (
    <div 
      className={`relative ${containerClassName}`}
      style={{
        aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
      }}
    >
      {isLoading && shimmer && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        fill={!width && !height}
        width={width}
        height={height}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        {...props}
      />
    </div>
  );
};

export default NextImage;