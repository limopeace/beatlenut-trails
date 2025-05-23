'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarAlt, faMountain, faCamera, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

const BeatlenutHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Images for the hero slider from public folder
  const heroImages = [
    "/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg", // Mountain landscape
    "/images/real/pexels-travelerchitect-18736328-min.jpg",  // Misty mountains
    "/images/real/pexels-dizitalboost-11622977-min.jpg"   // Riverside landscape
  ];

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
  
  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 8000); // Increased to 8 seconds to allow for full animation sequence
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
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
  }, [currentSlide]);
  
  // Navigation functions
  const nextSlide = () => {
    setAnimationPhase(0); // Reset animation phase
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };
  
  const prevSlide = () => {
    setAnimationPhase(0); // Reset animation phase
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative h-screen overflow-hidden pt-16 md:pt-20">
      {/* Background Image with simplified display */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1500 transform ${
              currentSlide === index 
                ? 'opacity-100 scale-100' 
                : index === (currentSlide - 1 + heroImages.length) % heroImages.length
                  ? 'opacity-0 scale-105' // Zoom out effect for the previous slide
                  : 'opacity-0 scale-100'
            }`}
          >
            <img
              src={img}
              alt={`Northeast India Landscape Slide ${index + 1}`}
              className="absolute w-full h-full object-cover transition-transform duration-8000 ease-in-out"
              style={{
                transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
                transitionDuration: '8000ms'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
          </div>
        ))}
      </div>
      
      {/* Slider navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center">
        <div className="container mx-auto px-6">
          {slideTexts.map((text, index) => (
            <div 
              key={index}
              className={`max-w-xl mx-auto text-center ${
                currentSlide === index ? 'block' : 'hidden'
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

export default BeatlenutHero;