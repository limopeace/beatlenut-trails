import React, { useEffect, useRef, useState } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import './PhotoSwipeGallery.css';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  isVideo?: boolean;
  videoSrc?: string;
  thumbnail?: string; // Optional thumbnail for videos
}

interface GalleryTab {
  label: string;
  images: GalleryImage[];
}

interface PhotoSwipeGalleryProps {
  tabs: GalleryTab[];
  className?: string;
  lightboxOptions?: Partial<PhotoSwipe.Options>;
  galleryId?: string;
}

const PhotoSwipeGallery: React.FC<PhotoSwipeGalleryProps> = ({ 
  tabs, 
  className = '', 
  lightboxOptions = {},
  galleryId = 'photo-gallery'
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  
  // Create unique gallery selector
  const gallerySelector = `#${galleryId}`;

  useEffect(() => {
    if (!galleryRef.current) return;
    
    // Initialize PhotoSwipe Lightbox with merged options
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: gallerySelector,
      children: 'a',
      pswpModule: PhotoSwipe,
      mainClass: 'pswp--custom-bg',
      showHideAnimationType: 'zoom',
      bgOpacity: 0.85,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      closeTitle: 'Close',
      zoomTitle: 'Zoom',
      arrowPrevTitle: 'Previous',
      arrowNextTitle: 'Next',
      errorMsg: 'The image cannot be loaded',
      ...lightboxOptions
    });

    // Add event handler for slide content creation
    lightboxRef.current.on('contentLoad', (e) => {
      const { content, isLazy } = e;
      
      // Handle video content
      if (tabs[activeTab]?.images[content.index]?.isVideo) {
        e.preventDefault();
        
        const videoSrc = tabs[activeTab]?.images[content.index]?.videoSrc || 
                       tabs[activeTab]?.images[content.index]?.src;
        
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.muted = false;
        videoElement.className = 'pswp__video';
        videoElement.style.objectFit = 'contain';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.position = 'absolute';
        
        content.element = videoElement;
      }
    });

    // Clean up video elements when closing
    lightboxRef.current.on('close', () => {
      const videos = document.querySelectorAll('.pswp__video');
      videos.forEach(video => {
        if (video instanceof HTMLVideoElement) {
          video.pause();
        }
      });
    });

    lightboxRef.current.init();

    // Cleanup function
    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [activeTab, gallerySelector, lightboxOptions, tabs]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={`photo-gallery ${className}`} id={galleryId}>
      {/* Tabs navigation */}
      <div className="tabs-container mb-6">
        <div className="tabs flex flex-wrap space-x-1 md:space-x-2 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-2 px-3 md:px-4 text-sm md:text-base font-medium transition-colors duration-200 focus:outline-none ${
                activeTab === index
                  ? 'text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(index)}
              aria-selected={activeTab === index}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <div 
        ref={galleryRef}
        className="pswp-gallery grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4"
      >
        {tabs[activeTab]?.images.map((image, index) => {
          const isVideo = image.isVideo === true;
          
          return (
            <figure 
              key={index}
              className="gallery-item relative overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 hover:shadow-md aspect-square"
            >
              <a
                href={isVideo ? (image.thumbnail || image.src) : image.src}
                data-pswp-width={image.width}
                data-pswp-height={image.height}
                data-pswp-type={isVideo ? 'video' : 'image'}
                data-video-src={isVideo ? (image.videoSrc || image.src) : undefined}
                data-cropped="true"
                data-caption={image.caption}
                className="block w-full h-full"
                aria-label={image.alt || `Gallery item ${index + 1}`}
              >
                {isVideo ? (
                  <div className="relative w-full h-full overflow-hidden">
                    {/* Thumbnail for video (with play button overlay) */}
                    <img
                      src={image.thumbnail || image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300 hover:bg-opacity-30">
                      <div className="p-2 rounded-full bg-white/30 backdrop-blur-sm">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Standard image */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-5"></div>
                  </>
                )}
                
                {/* Caption overlay - only shown on hover */}
                {image.caption && (
                  <figcaption className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <p className="text-white text-xs md:text-sm line-clamp-2">{image.caption}</p>
                  </figcaption>
                )}
              </a>
            </figure>
          );
        })}
      </div>
      
      {/* Empty state if no images */}
      {(!tabs[activeTab] || tabs[activeTab].images.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <svg 
            className="w-12 h-12 text-gray-400 mb-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm md:text-base">No images to display in this collection</p>
        </div>
      )}
    </div>
  );
};

export default PhotoSwipeGallery;