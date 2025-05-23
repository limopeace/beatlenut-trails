'use client';

import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

interface VideoSectionProps {
  videoSrc: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoSrc,
  title = "Experience Northeast India",
  subtitle = "IMMERSE YOURSELF",
  description = "Journey through enchanting landscapes, vibrant cultures, and breathtaking moments that define our Northeast expeditions."
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  // Control video playback based on visibility
  useEffect(() => {
    if (!videoRef.current) return;

    if (inView) {
      // Only try to play if the video has a valid source
      if (videoRef.current.src) {
        videoRef.current.play().catch((error) => {
          console.log('Video autoplay failed:', error);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [inView]);
  
  // Handle video errors
  const handleVideoError = () => {
    if (videoRef.current) {
      // If video fails to load, hide play icon and show the poster image only
      const overlayEl = videoRef.current.parentElement?.querySelector('.video-overlay');
      if (overlayEl) {
        overlayEl.classList.add('hidden');
      }
    }
  };

  return (
    <section ref={ref} className="bg-[#F8F6F2] relative">
      {/* Section heading - centered and above the video */}
      <div className="container mx-auto px-4 py-16 text-center">
        <span className="uppercase tracking-wider text-green-700 font-bold font-clash">{subtitle}</span>
        <h2 className="text-3xl md:text-4xl font-medium text-green-800 mt-2 mb-4 font-clash uppercase">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Full-width video container */}
      <div className="relative w-full overflow-hidden max-w-[1920px] mx-auto">
        {/* Play icon overlay (shown before video starts playing) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 pointer-events-none video-overlay">
          <FontAwesomeIcon 
            icon={faPlayCircle} 
            className="text-white text-6xl md:text-7xl opacity-80" 
          />
        </div>
        
        {/* Video element - landscape orientation with 16:9 ratio */}
        <div className="aspect-w-16 aspect-h-9">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster="/images/real/pexels-travelerchitect-18736328-min.jpg"
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Video controls - optional bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
          <span className="text-sm md:text-base font-medium font-clash">
            NORTHEAST INDIA TRAVEL
          </span>
          <div className="text-xs md:text-sm">
            Scroll to pause/play
          </div>
        </div>
      </div>
      
      {/* Additional spacing at the bottom */}
      <div className="h-8 bg-[#F8F6F2]"></div>
    </section>
  );
};

export default VideoSection;