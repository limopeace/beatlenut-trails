'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMountain, faCamera, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentText, setCurrentText] = useState(0);
  
  const slideTexts = [
    {
      subtitle: "Explore Northeast India",
      title: "Discover Untamed Wilderness",
      description: "Experience the breathtaking landscapes and rich cultural heritage of India's last unexplored region"
    },
    {
      subtitle: "Authentic Experiences",
      title: "Journey Through Seven Sisters",
      description: "Immerse yourself in vibrant cultures, ancient traditions, and pristine natural wonders"
    },
    {
      subtitle: "Curated by Experts",
      title: "Adventure Awaits",
      description: "Expert-guided tours to remote villages, misty mountains, and living root bridges"
    }
  ];
  
  // State to manage animation phases for text elements
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Auto-slide functionality for text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % slideTexts.length);
    }, 8000); // 8 seconds to allow for full animation sequence
    
    return () => clearInterval(interval);
  }, [slideTexts.length]);
  
  // Reset and trigger staggered animations when slide changes
  useEffect(() => {
    setAnimationPhase(0); // Reset animation phase
    
    // Trigger subtitle animation first
    setTimeout(() => setAnimationPhase(1), 200);
    
    // Trigger title animation next
    setTimeout(() => setAnimationPhase(2), 600);
    
    // Trigger description animation next
    setTimeout(() => setAnimationPhase(3), 1000);
    
    // Trigger buttons animation last
    setTimeout(() => setAnimationPhase(4), 1400);
  }, [currentText]);

  // Ensure video plays when component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Add event listeners for debugging
      videoRef.current.addEventListener('loadstart', () => console.log('Video loading started'));
      videoRef.current.addEventListener('loadeddata', () => console.log('Video data loaded'));
      videoRef.current.addEventListener('playing', () => console.log('Video is playing'));
      videoRef.current.addEventListener('error', (e) => console.error('Video error:', videoRef.current?.error));
      
      // Try to play the video
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Video playback started successfully'))
          .catch(error => {
            console.error('Video autoplay failed:', error);
            // Try again after a short delay
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => console.error('Retry failed:', e));
              }
            }, 1000);
          });
      }
    }
    
    // Cleanup event listeners
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadstart', () => {});
        videoRef.current.removeEventListener('loadeddata', () => {});
        videoRef.current.removeEventListener('playing', () => {});
        videoRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  return (
    <section className="relative min-h-[550px] h-[95vh] md:h-screen overflow-hidden pt-16 md:pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          poster="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg"
        >
          <source src="/videos/12542049_3840_2160_60fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/70 via-deep-forest/50 to-deep-forest/80"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 3xl:px-16 4xl:px-20 max-w-7xl 3xl:max-w-[1920px]">
          {slideTexts.map((text, index) => (
            <div 
              key={index}
              className={`w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-4xl 3xl:max-w-6xl mx-auto text-center ${
                currentText === index ? 'block' : 'hidden'
              }`}
            >
              {/* Subtitle */}
              <span
                className={`inline-block text-pale-straw text-base sm:text-lg md:text-xl mb-1 sm:mb-2 font-serif italic transition-all duration-700 ${
                  animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.subtitle}
              </span>
              
              {/* Main Heading */}
              <h1 
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-clash font-bold text-pale-straw mb-3 sm:mb-4 md:mb-6 3xl:mb-8 leading-tight transition-all duration-700 uppercase ${
                  animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.title}
              </h1>
              
              {/* Description */}
              <p 
                className={`text-base sm:text-lg md:text-xl lg:text-2xl 3xl:text-3xl text-pale-straw mb-6 md:mb-8 lg:mb-10 3xl:mb-12 font-light leading-relaxed transition-all duration-700 ${
                  animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.description}
              </p>
              
              {/* Action Buttons - Mobile optimized */}
              <div 
                className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 transition-all duration-700 w-full max-w-lg mx-auto ${
                  animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Link 
                  href="/travel-listings"
                  className="w-full sm:w-auto bg-forest-green hover:bg-moss-green text-pale-straw px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                  <span>Explore Tours</span>
                </Link>

                <Link 
                  href="/activities"
                  className="w-full sm:w-auto bg-transparent border-2 border-pale-straw text-pale-straw hover:bg-pale-straw hover:text-deep-forest px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                  <span>Activities</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feature Icons at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-deep-forest/90 backdrop-blur-sm z-20 py-2 sm:py-3 md:py-4">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col items-center text-pale-straw text-center">
              <div className="bg-forest-green p-1.5 sm:p-2 rounded-full mb-1 sm:mb-2">
                <FontAwesomeIcon icon={faMountain} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm md:text-base">Trekking & Hiking</span>
            </div>
            <div className="flex flex-col items-center text-pale-straw text-center">
              <div className="bg-forest-green p-1.5 sm:p-2 rounded-full mb-1 sm:mb-2">
                <FontAwesomeIcon icon={faCamera} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm md:text-base">Photography Tours</span>
            </div>
            <div className="flex flex-col items-center text-pale-straw text-center">
              <div className="bg-forest-green p-1.5 sm:p-2 rounded-full mb-1 sm:mb-2">
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm md:text-base">Cultural Immersion</span>
            </div>
            <div className="flex flex-col items-center text-pale-straw text-center">
              <div className="bg-forest-green p-1.5 sm:p-2 rounded-full mb-1 sm:mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm md:text-base">Hidden Gems</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;