import React, { useEffect, useRef, useState } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

// Define the media item types
interface MediaItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  type: 'image' | 'video';
  videoSrc?: string;
  thumbnailSrc?: string;
  category: string;
  aspectRatio?: number; // Optional aspect ratio for masonry layout
}

interface GalleryProps {
  items: MediaItem[];
  categories?: string[];
  masonryClassName?: string;
  itemClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}

const PhotoSwipeMasonryGallery: React.FC<GalleryProps> = ({ 
  items, 
  categories = [],
  masonryClassName = "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4",
  itemClassName = "break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300",
  activeButtonClassName = "bg-blue-600 text-white",
  inactiveButtonClassName = "bg-gray-200 hover:bg-gray-300 text-gray-800"
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(items);

  // Add aspect ratio to items if not provided
  const itemsWithAspectRatio = items.map(item => {
    if (item.aspectRatio) return item;
    return {
      ...item,
      aspectRatio: item.height / item.width
    };
  });

  // Filter items by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredItems(itemsWithAspectRatio);
    } else {
      setFilteredItems(itemsWithAspectRatio.filter(item => item.category === activeCategory));
    }
  }, [itemsWithAspectRatio, activeCategory]);

  // Initialize PhotoSwipe lightbox
  useEffect(() => {
    if (!galleryRef.current) return;

    // PhotoSwipe options
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: '.pswp-gallery-item',
      pswpModule: PhotoSwipe,
      showHideAnimationType: 'zoom',
      bgOpacity: 0.85,
      imageClickAction: 'zoom',
      tapAction: 'toggle-controls',
      
      // Handle video items
      itemContent: (itemData) => {
        const mediaItem = items.find(item => item.src === itemData.src);
        
        if (mediaItem?.type === 'video') {
          // Return video content
          return {
            html: `
              <div class="pswp__video-wrapper">
                <video controls playsInline autoPlay>
                  <source src="${mediaItem.videoSrc}" type="video/mp4">
                  Your browser doesn't support HTML5 video.
                </video>
              </div>
            `
          };
        }
        
        // Default image content handling by PhotoSwipe
        return null;
      }
    });

    // Add event listeners
    lightboxRef.current.on('uiRegister', function() {
      lightboxRef.current?.pswp?.ui?.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
          lightboxRef.current?.pswp?.on('change', () => {
            const currSlideElement = lightboxRef.current?.pswp?.currSlide?.data;
            let captionHTML = '';
            if (currSlideElement) {
              const mediaItem = items.find(item => item.src === currSlideElement.src);
              if (mediaItem) {
                captionHTML = `
                  <div class="pswp__caption">
                    <div class="pswp__caption__center">
                      <h3 style="margin: 0 0 6px 0; font-weight: bold;">${mediaItem.alt}</h3>
                      <span style="color: #999;">${mediaItem.category}</span>
                    </div>
                  </div>
                `;
              }
            }
            el.innerHTML = captionHTML;
          });
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
  }, [items]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="pswp-gallery-container">
      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === 'all'
                ? activeButtonClassName
                : inactiveButtonClassName
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category
                  ? activeButtonClassName
                  : inactiveButtonClassName
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Gallery Layout */}
      <div ref={galleryRef} className={masonryClassName}>
        {filteredItems.map((item) => (
          <div key={item.id} className={itemClassName}>
            <a
              href={item.src}
              data-pswp-width={item.width}
              data-pswp-height={item.height}
              className="pswp-gallery-item block"
              aria-label={item.alt}
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative">
                {item.type === 'video' ? (
                  <>
                    <img
                      src={item.thumbnailSrc || item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
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
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-2 bg-white">
                <p className="text-sm font-medium truncate">{item.alt}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Empty state - show when no items match the filter */}
      {filteredItems.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      )}

      {/* Add custom PhotoSwipe styles */}
      <style jsx global>{`
        .pswp__video-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pswp__video-wrapper video {
          max-width: 100%;
          max-height: 80vh;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
        }
        
        .pswp__caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 15px;
          transform: translateY(0);
          transition: transform 0.3s;
        }
        
        .pswp__caption__center {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PhotoSwipeMasonryGallery;