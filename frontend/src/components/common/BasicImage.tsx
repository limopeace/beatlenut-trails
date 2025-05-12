'use client';

import React from 'react';
import Image from 'next/image';

interface BasicImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const BasicImage = ({ 
  src, 
  alt, 
  width, 
  height,
  className = '',
  priority = false
}: BasicImageProps) => {
  return (
    <div className="relative">
      {width && height ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
        />
      )}
    </div>
  );
};

export default BasicImage;