'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarAlt, faUtensils, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const VaaniImprovedHero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Images for the hero slider from picsum.photos
  const heroImages = [
    "https://picsum.photos/id/1063/1920/1080",
    "https://picsum.photos/id/1045/1920/1080",
    "https://picsum.photos/id/137/1920/1080"
  ];

  const slideTexts = [
    {
      subtitle: "Welcome to",
      title: "Vaani Greens",
      description: "Experience luxury amidst the lush tea gardens of Assam"
    },
    {
      subtitle: "Premium Tea",
      title: "From Garden to Cup",
      description: "Discover our artisanal tea processing methods and tasting experiences"
    },
    {
      subtitle: "Luxury Stay",
      title: "Plantation Bungalows",
      description: "Immerse yourself in the tranquility of our heritage accommodation"
    }
  ];
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {heroImages.map((img, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0 transform"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentSlide === index ? 1 : 0,
            y: scrollPosition * 0.15
          }}
          transition={{ 
            opacity: { duration: 1 },
            y: { duration: 0.1, ease: "linear" }
          }}
        >
          <img
            src={img}
            alt={`Vaani Greens Slide ${index + 1}`}
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
        </motion.div>
      ))}
      
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
          {heroImages.map((_, index) => (
            <motion.div 
              key={index}
              className={`max-w-xl mx-auto text-center ${currentSlide === index ? 'block' : 'hidden'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 20
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Subtitle */}
              <motion.span
                className="inline-block text-white/90 text-lg md:text-xl mb-2 font-serif italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {slideTexts[index].subtitle}
              </motion.span>
              
              {/* Main Heading */}
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {slideTexts[index].title}
              </motion.h1>
              
              {/* Description */}
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {slideTexts[index].description}
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link 
                  href="/vaani-test/booking"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
                  <span>Book Now</span>
                </Link>

                <a
                  href="https://wa.me/919876543210?text=I'm%20interested%20in%20visiting%20Vaani%20Greens%20Tea%20Estate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded-full inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105 text-lg font-medium tracking-wide gap-2"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Feature Icons at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-20 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faLeaf} className="w-6 h-6 mb-2" />
              <span className="text-xs md:text-sm">Fresh Tea Experience</span>
            </div>
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faUtensils} className="w-6 h-6 mb-2" />
              <span className="text-xs md:text-sm">Garden-to-Table Cuisine</span>
            </div>
            <div className="flex flex-col items-center text-white text-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6 mb-2" />
              <span className="text-xs md:text-sm">Guided Tea Tours</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <a 
          href="https://wa.me/919876543210?text=I'm%20interested%20in%20visiting%20Vaani%20Greens%20Tea%20Estate"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
          className="bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default VaaniImprovedHero;