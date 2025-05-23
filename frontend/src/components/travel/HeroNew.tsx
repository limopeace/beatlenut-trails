'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroNew = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
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

  return (
    <section className="relative h-screen-90 w-full overflow-hidden">
      {/* Background Video/Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0 transform"
        style={{ 
          transform: `translateY(${scrollPosition * 0.15}px)`,
          transition: 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)'
        }}
      >
        <img
          src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg"
          alt="Breathtaking Northeast India Landscape"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-gradient-v"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-end">
        <div className="container mx-auto px-6 pb-24 md:pb-32">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
          >
            {/* Tagline */}
            <motion.span 
              className="inline-block text-stone font-montserrat text-lg md:text-xl mb-4 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience The Extraordinary
            </motion.span>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold text-stone mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Untamed <span className="text-moss">Northeast</span> Wilderness
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-xl md:text-2xl text-stone opacity-90 mb-8 font-merriweather font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Journey through breathtaking landscapes and immerse yourself in the 
              rich cultural tapestry of Northeast India.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link 
                href="/services" 
                className="bg-forest-medium hover:bg-forest-deep text-stone px-8 py-4 rounded-soft inline-block transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-medium text-lg font-montserrat font-medium tracking-wide text-center"
              >
                Explore Journeys
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border-2 border-stone text-stone hover:bg-stone hover:text-forest-deep px-8 py-4 rounded-soft inline-block transition-all duration-300 ease-in-out transform hover:scale-105 text-lg font-montserrat font-medium tracking-wide text-center"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-stone text-sm tracking-widest mb-2 font-montserrat">SCROLL</span>
          <motion.div 
            className="w-0.5 h-12 bg-stone opacity-60"
            animate={{ 
              scaleY: [1, 0.6, 1],
              opacity: [0.6, 1, 0.6]
            }} 
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroNew;