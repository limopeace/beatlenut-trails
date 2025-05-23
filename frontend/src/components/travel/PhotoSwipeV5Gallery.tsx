'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';

interface GalleryItem {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  isVideo?: boolean;
  videoSrc?: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  items: GalleryItem[];
}

interface PhotoSwipeV5GalleryProps {
  categories: GalleryCategory[];
  initialCategory?: string;
  className?: string;
}

const PhotoSwipeV5Gallery = ({
  categories,
  initialCategory,
  className = '',
}: PhotoSwipeV5GalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || (categories[0]?.id || '')
  );
  const galleryRef = useRef<HTMLDivElement>(null);
  const pswpRef = useRef<PhotoSwipe | null>(null);
  const router = useRouter();

  // Find the current category data
  const currentCategory = categories.find((cat) => cat.id === activeCategory) || categories[0];
  
  // Clean up PhotoSwipe instance on unmount
  useEffect(() => {
    return () => {
      if (pswpRef.current) {
        pswpRef.current.destroy();
        pswpRef.current = null;
      }
    };
  }, []);

  const handleThumbnailClick = (index: number) => {
    const items = currentCategory?.items || [];
    const item = items[index];
    
    if (item.isVideo && item.videoSrc) {
      // For videos, open in a new tab
      window.open(item.videoSrc, '_blank');
      return;
    }

    // For images, open PhotoSwipe
    const pswpElement = document.createElement('div');
    pswpElement.className = 'pswp';
    document.body.appendChild(pswpElement);

    // PhotoSwipe options
    const options = {
      dataSource: items.filter(item => !item.isVideo).map(item => ({
        src: item.src,
        width: item.width,
        height: item.height,
        alt: item.alt,
        caption: item.caption || item.alt,
      })),
      showHideAnimationType: 'fade',
      index: items.filter((item, i) => !item.isVideo && i <= index).length - 1,
      appendToEl: document.body,
      pswpModule: PhotoSwipe,
    };

    const pswp = new PhotoSwipe(options);
    pswpRef.current = pswp;
    
    pswp.on('uiRegister', function() {
      pswp.ui.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
          pswp.on('change', () => {
            const currSlideElement = pswp.currSlide;
            if (currSlideElement) {
              el.innerHTML = currSlideElement.data.caption || '';
            }
          });
        }
      });
    });

    pswp.init();

    // Add an event listener to clean up the element when PhotoSwipe closes
    pswp.on('destroy', () => {
      document.body.removeChild(pswpElement);
      pswpRef.current = null;
    });
  };

  return (
    <div className={`photo-gallery ${className}`}>
      {/* Category Navigation Tabs */}
      <div className="flex mb-4 space-x-2 overflow-x-auto py-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            tabIndex={0}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          ref={galleryRef}
        >
          {currentCategory?.items.map((item, index) => (
            <Fragment key={index}>
              <div 
                className="relative overflow-hidden rounded-lg cursor-pointer group h-60"
                onClick={() => handleThumbnailClick(index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleThumbnailClick(index);
                  }
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Video indicator */}
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                )}
                
                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {item.caption}
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* PhotoSwipe Template (Required for v5) */}
      <div
        id="pswp-template"
        className="pswp"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PhotoSwipeV5Gallery;