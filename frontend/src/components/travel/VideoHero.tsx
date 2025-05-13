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
      videoRef.current.play().catch(error => {
        console.error('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <section className="relative h-screen overflow-hidden pt-16 md:pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/12542049_3840_2160_60fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center">
        <div className="container mx-auto px-6">
          {slideTexts.map((text, index) => (
            <div 
              key={index}
              className={`max-w-xl mx-auto text-center ${
                currentText === index ? 'block' : 'hidden'
              }`}
            >
              {/* Subtitle */}
              <span
                className={`inline-block text-white/90 text-lg md:text-xl mb-2 font-serif italic transition-all duration-700 ${
                  animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.subtitle}
              </span>
              
              {/* Main Heading */}
              <h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 leading-tight transition-all duration-700 ${
                  animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.title}
              </h1>
              
              {/* Description */}
              <p 
                className={`text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed transition-all duration-700 ${
                  animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {text.description}
              </p>
              
              {/* Action Buttons */}
              <div 
                className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-700 ${
                  animationPhase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Link 
                  href="/travel-listings"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
                  <span>Explore Tours</span>
                </Link>

                <Link 
                  href="/activities"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-3 rounded-full inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5" />
                  <span>Activities</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feature Icons at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-20 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faMountain} className="w-6 h-6 mb-2" />
              <span className="text-sm md:text-base">Trekking & Hiking</span>
            </div>
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faCamera} className="w-6 h-6 mb-2" />
              <span className="text-sm md:text-base">Photography Tours</span>
            </div>
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faUsers} className="w-6 h-6 mb-2" />
              <span className="text-sm md:text-base">Cultural Immersion</span>
            </div>
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 mb-2" />
              <span className="text-sm md:text-base">Hidden Gems</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;