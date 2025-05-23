import React, { useEffect, useRef, useState } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import './PhotoSwipeGallery.css';
import SectionContainer from '@/components/common/SectionContainer';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

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
  title?: string;
  subtitle?: string;
}

const PhotoSwipeGallery: React.FC<PhotoSwipeGalleryProps> = ({ 
  tabs, 
  className = '', 
  lightboxOptions = {},
  galleryId = 'photo-gallery',
  title = 'Our Gallery',
  subtitle = 'Explore breathtaking views and experiences from Northeast India'
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
    <SectionContainer
      background="deep-forest"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16"
      id="gallery-section"
    >
      <div className="px-4 sm:px-6 md:px-8">
        {/* Decorative elements - scaled for mobile */}
        <div className="absolute top-0 left-0 w-full h-8 sm:h-10 md:h-12 bg-moss-green/10 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 sm:w-48 md:w-72 lg:w-96 h-32 sm:h-48 md:h-72 lg:h-96 bg-moss-green/5 rounded-full -mr-12 sm:-mr-20 md:-mr-32 -mb-6 sm:-mb-10 md:-mb-16 -z-10"></div>
        
        {/* Section header */}
        <FadeIn direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-moss-green text-lg sm:text-xl md:text-2xl font-serif">{title}</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-pale-straw font-semibold mb-3 sm:mb-4 mt-1 sm:mt-2 font-clash">{subtitle}</h2>
        </FadeIn>
        
        <div className={`photo-gallery ${className}`} id={galleryId}>
          {/* Tabs navigation - improved for mobile scrolling if needed */}
          <div className="tabs-container mb-6 sm:mb-8 overflow-x-auto sm:overflow-visible">
            <div className="tabs flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 md:gap-3 pb-2 sm:pb-0 min-w-max sm:min-w-0">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`py-1.5 sm:py-2 px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 rounded-full whitespace-nowrap ${
                    activeTab === index
                      ? 'bg-forest-green text-pale-straw shadow-md'
                      : 'bg-pale-straw/10 text-pale-straw/70 hover:bg-pale-straw/20 hover:text-pale-straw'
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

          {/* Gallery grid - improved for mobile */}
          <FadeIn direction="up" className="w-full">
            <div 
              ref={galleryRef}
              className="pswp-gallery grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5"
            >
              {tabs[activeTab]?.images.map((image, index) => {
                const isVideo = image.isVideo === true;
                
                return (
                  <figure 
                    key={index}
                    className="gallery-item relative overflow-hidden rounded-lg bg-moss-green/10 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 aspect-square"
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
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-[1.05]"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-deep-forest/40 transition-opacity duration-300 hover:bg-deep-forest/30">
                            <div className="p-2 sm:p-3 rounded-full bg-forest-green/70 backdrop-blur-sm">
                              <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-pale-straw"
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
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-[1.05]"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-deep-forest/20 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                        </>
                      )}
                      
                      {/* Caption overlay - improved for mobile and touch devices */}
                      {image.caption && (
                        <figcaption className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 bg-gradient-to-t from-deep-forest/90 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:opacity-100">
                          <p className="text-pale-straw text-xs md:text-sm line-clamp-2">{image.caption}</p>
                        </figcaption>
                      )}
                    </a>
                  </figure>
                );
              })}
            </div>
          </FadeIn>
          
          {/* Empty state if no images */}
          {(!tabs[activeTab] || tabs[activeTab].images.length === 0) && (
            <FadeIn direction="up" className="w-full">
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 border border-dashed border-moss-green/30 rounded-lg bg-moss-green/5">
                <svg 
                  className="w-10 h-10 sm:w-12 sm:h-12 text-moss-green/50 mb-2 sm:mb-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-pale-straw/70 text-xs sm:text-sm md:text-base">No images to display in this collection</p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PhotoSwipeGallery;