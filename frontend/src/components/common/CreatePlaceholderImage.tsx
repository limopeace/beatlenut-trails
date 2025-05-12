'use client';

import React from 'react';

interface CreatePlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  imageType?: 'jpeg' | 'png' | 'webp';
}

/**
 * Creates a data URL for a placeholder image with text
 * This can be used as fallback for images that fail to load
 */
const createPlaceholderImage = ({
  width = 800,
  height = 600,
  text = 'Image Placeholder',
  bgColor = '#E2E8F0', // Tailwind gray-200
  textColor = '#718096', // Tailwind gray-600
  fontSize = 20,
  imageType = 'png'
}: CreatePlaceholderImageProps): string => {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Get context and draw background
  const ctx = canvas.getContext('2d');
  if (!ctx) return ''; // Fallback empty string if context not available
  
  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Draw text
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Draw border
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);
  
  // Convert to data URL
  return canvas.toDataURL(`image/${imageType}`);
};

/**
 * Component wrapper for createPlaceholderImage
 * Generates a data URL for a placeholder image and returns it via the onGenerate callback
 */
const CreatePlaceholderImage: React.FC<CreatePlaceholderImageProps & {
  onGenerate: (dataURL: string) => void;
}> = ({ onGenerate, ...props }) => {
  React.useEffect(() => {
    const dataURL = createPlaceholderImage(props);
    onGenerate(dataURL);
  }, [onGenerate, props]);
  
  return null; // This component doesn't render anything
};

export { createPlaceholderImage, CreatePlaceholderImage };