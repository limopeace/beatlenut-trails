import React from 'react';

interface PhotoSwipeVideoItemProps {
  id: string;
  thumbnailSrc: string;
  videoSrc: string;
  width: number;
  height: number;
  alt: string;
  category: string;
}

const PhotoSwipeVideoItem: React.FC<PhotoSwipeVideoItemProps> = ({
  id,
  thumbnailSrc,
  videoSrc,
  width,
  height,
  alt,
  category
}) => {
  return (
    <a
      href={thumbnailSrc}
      key={id}
      data-pswp-width={width}
      data-pswp-height={height}
      data-pswp-type="video"
      data-pswp-video-src={videoSrc}
      className="pswp-gallery-item block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
      aria-label={alt}
      target="_blank"
      rel="noreferrer"
    >
      <div className="w-full h-0 pb-[75%] relative">
        <img
          src={thumbnailSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-8 h-8 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-2 bg-white">
        <p className="text-sm font-medium truncate">{alt}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </a>
  );
};

export default PhotoSwipeVideoItem;