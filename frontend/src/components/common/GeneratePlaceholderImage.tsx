'use client';

import React, { useEffect, useState } from 'react';
import { createPlaceholderImage } from './CreatePlaceholderImage';

interface GeneratePlaceholderImageProps {
  text: string;
  width?: number;
  height?: number;
  bgColor?: string;
  textColor?: string;
}

/**
 * Component to generate and display a placeholder image
 * Can be used in development to generate placeholder images
 */
const GeneratePlaceholderImage: React.FC<GeneratePlaceholderImageProps> = ({
  text,
  width = 800,
  height = 600,
  bgColor = '#E2E8F0',
  textColor = '#718096',
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      const url = createPlaceholderImage({
        text,
        width,
        height,
        bgColor,
        textColor,
      });
      setDataUrl(url);
    }
  }, [text, width, height, bgColor, textColor]);

  if (!dataUrl) {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center" 
        style={{ width, height }}
      >
        <p className="text-gray-500">Generating placeholder...</p>
      </div>
    );
  }

  return (
    <div>
      <img src={dataUrl} alt={`Placeholder: ${text}`} width={width} height={height} />
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Data URL (copy this to use as a fallback):</p>
        <textarea
          className="w-full h-24 p-2 text-xs bg-gray-100 border border-gray-300 rounded"
          value={dataUrl}
          readOnly
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      </div>
    </div>
  );
};

export default GeneratePlaceholderImage;