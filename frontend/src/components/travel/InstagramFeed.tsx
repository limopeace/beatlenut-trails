'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';

interface InstagramFeedProps {
  accessToken: string;
  limit?: number;
  className?: string;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({ 
  accessToken, 
  limit = 8,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if window and document are defined (client-side only)
    if (typeof window !== 'undefined' && window.Instafeed && containerRef.current) {
      const feed = new window.Instafeed({
        accessToken: accessToken,
        target: containerRef.current,
        limit: limit,
        template: `
          <a href="{{link}}" target="_blank" rel="noopener noreferrer" class="instagram-item group block relative overflow-hidden rounded-lg aspect-square">
            <img src="{{image}}" alt="{{caption}}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-deep-forest/60 flex items-center justify-center transition-opacity duration-300">
              <div class="text-pale-straw text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div class="flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2 text-forest-green">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span class="text-moss-green">{{likes}}</span>
                </div>
                <p class="text-sm text-pale-straw line-clamp-2">{{caption}}</p>
              </div>
            </div>
          </a>
        `,
        after: function() {
          // Any post-processing can be done here
          console.log('Instafeed loaded successfully');
        }
      });
      
      feed.run();
    }
  }, [accessToken, limit]);

  return (
    <SectionContainer
      background="pale-straw"
      className="relative overflow-hidden"
      id="instagram-feed"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-green/5 rounded-full -mr-32 -mt-16 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-moss-green/10 rounded-full -ml-16 -mb-16 -z-10"></div>
      
      <Script 
        src="https://cdn.jsdelivr.net/gh/stevenschobert/instafeed.js@2.0.0/dist/instafeed.min.js"
        strategy="lazyOnload"
        onLoad={() => console.log('Instafeed.js script loaded')}
      />
      
      {/* Section header */}
      <FadeIn direction="up" className="text-center mb-12">
        <span className="text-forest-green text-xl md:text-2xl font-serif">Instagram</span>
        <h2 className="text-3xl md:text-4xl text-deep-forest font-semibold mb-4 mt-2 font-clash">Follow Our Journey</h2>
        <p className="text-deep-forest/80 max-w-3xl mx-auto">
          Join us on Instagram for daily updates, travel tips, and stunning Northeast India inspiration
        </p>
      </FadeIn>
      
      <div className={`instagram-feed-container ${className}`}>
        <FadeIn direction="up" delay={0.2}>
          <div 
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5"
          >
            {/* Instafeed.js will populate this container */}
            {/* Placeholder for when feed is loading */}
            {Array.from({ length: limit }).map((_, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-lg bg-gradient-to-br from-moss-green/20 to-pale-straw/30 animate-pulse"
              />
            ))}
          </div>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.4} className="text-center mt-10">
          <a 
            href="https://www.instagram.com/beatlenut_trails" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-forest-green text-pale-straw font-medium rounded-md transition-all duration-300 hover:shadow-md hover:bg-deep-forest"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @beatlenut_trails
          </a>
        </FadeIn>
      </div>
    </SectionContainer>
  );
};

export default InstagramFeed;