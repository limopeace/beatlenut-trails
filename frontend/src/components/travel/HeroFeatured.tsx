'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GradientText, fadeInUp, buttonHover, buttonTap } from '../animations/MotionUtils';

// Define the featured destinations
const featuredDestinations = [
  {
    id: 1,
    name: 'Kaziranga',
    location: 'Assam',
    description: 'Home to the one-horned rhinoceros in expansive grasslands',
    imageSrc: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    tagline: 'WILDLIFE PARADISE',
    color: 'from-mint to-sage',
    href: '/destinations/kaziranga',
  },
  {
    id: 2,
    name: 'Cherrapunji',
    location: 'Meghalaya',
    description: 'The wettest place on earth with living root bridges',
    imageSrc: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    tagline: 'LIVING BRIDGES',
    color: 'from-sage to-forest',
    href: '/destinations/cherrapunji',
  },
  {
    id: 3,
    name: 'Majuli',
    location: 'Assam',
    description: 'World\'s largest river island with vibrant culture',
    imageSrc: '/images/real/pexels-nans1419-20519339-min.jpg',
    tagline: 'RIVER ISLAND',
    color: 'from-forest to-deep-forest',
    href: '/destinations/majuli',
  },
];

const HeroFeatured = () => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // For glitter effect on CTA button
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  // Handle mouse move for glitter effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Reset autoplay when leaving the component
  const resetAutoplay = () => {
    setAutoplay(true);
  };
  
  // Pause autoplay when interacting with component
  const pauseAutoplay = () => {
    setAutoplay(false);
    
    // Resume autoplay after 8 seconds of inactivity
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }
    
    autoplayRef.current = setTimeout(() => {
      setAutoplay(true);
    }, 8000);
  };

  // Change slide every 5 seconds if autoplay is enabled
  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % featuredDestinations.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
    
    return () => {};
  }, [autoplay]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, []);

  // Handle next/prev navigation
  const handleNext = () => {
    pauseAutoplay();
    setActive((prev) => (prev + 1) % featuredDestinations.length);
  };
  
  const handlePrev = () => {
    pauseAutoplay();
    setActive((prev) => (prev - 1 + featuredDestinations.length) % featuredDestinations.length);
  };
  
  // Directly select a slide
  const handleDotClick = (index: number) => {
    if (index !== active) {
      pauseAutoplay();
      setActive(index);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden" onMouseLeave={resetAutoplay}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots bg-[length:20px_20px] opacity-5"></div>
        <motion.div 
          className="absolute -bottom-80 -left-80 w-[500px] h-[500px] rounded-full bg-mint opacity-10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute -top-40 -right-40 w-[300px] h-[300px] rounded-full bg-sage opacity-10"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-2xl md:text-4xl font-montserrat font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-forest">Experience</span>{' '}
            <GradientText 
              fromColor="from-sage"
              toColor="to-forest"
              animate={true}
              className="font-bold"
            >
              Northeast Magic
            </GradientText>
          </motion.h2>
          
          <motion.p
            className="text-slate mt-4 max-w-2xl mx-auto font-merriweather"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our breathtaking destinations and immerse yourself in the rich culture and natural beauty of Northeast India
          </motion.p>
        </div>
        
        {/* Featured Destinations Slider */}
        <div
          className="relative mx-auto max-w-6xl"
          onMouseEnter={pauseAutoplay}
        >
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center bg-white bg-opacity-60 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-lg border border-mint">
            {/* Left: Image */}
            <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-xl shadow-medium">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${active}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-forest-gradient-v opacity-40 z-10"></div>
                  <motion.img
                    src={featuredDestinations[active].imageSrc}
                    alt={featuredDestinations[active].name}
                    className="absolute w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  
                  {/* Destination Location Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <motion.div
                      className="flex items-center gap-2 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <span className="text-forest font-montserrat text-sm tracking-wide">
                        {featuredDestinations[active].location}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Destination Tagline */}
                  <div className="absolute bottom-6 right-6 z-20">
                    <motion.div
                      className="bg-forest bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-soft"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <span className="text-mint font-montserrat text-sm font-bold tracking-widest">
                        {featuredDestinations[active].tagline}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Right: Content */}
            <div className="p-2 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${active}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  {/* Destination Name */}
                  <motion.h3
                    className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-deep-forest mb-4"
                    variants={fadeInUp}
                  >
                    <GradientText 
                      className={featuredDestinations[active].color}
                    >
                      {featuredDestinations[active].name}
                    </GradientText>
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p
                    className="text-lg text-slate font-merriweather leading-relaxed mb-8"
                    variants={fadeInUp}
                  >
                    {featuredDestinations[active].description}
                  </motion.p>
                  
                  {/* CTA Button with Glitter Effect */}
                  <div className="mt-auto">
                    <Link
                      href={featuredDestinations[active].href}
                      ref={buttonRef}
                      onMouseMove={handleMouseMove}
                      className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-montserrat font-medium text-white bg-forest rounded-lg group"
                    >
                      <motion.span
                        className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-[300px] group-hover:h-[300px] opacity-10"
                        style={{
                          left: mousePosition.x,
                          top: mousePosition.y,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      ></motion.span>
                      <span className="relative">Explore {featuredDestinations[active].name}</span>
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 relative"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Prev Button */}
            <motion.button
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-sage shadow-soft text-forest transition-colors hover:bg-forest hover:text-white"
              whileHover={buttonHover}
              whileTap={buttonTap}
              aria-label="Previous destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {featuredDestinations.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 ${
                    index === active
                      ? 'w-8 h-3 bg-forest rounded-full'
                      : 'w-3 h-3 bg-sage bg-opacity-40 rounded-full hover:bg-opacity-60'
                  }`}
                  aria-label={`Go to destination ${index + 1}`}
                ></button>
              ))}
            </div>
            
            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-sage shadow-soft text-forest transition-colors hover:bg-forest hover:text-white"
              whileHover={buttonHover}
              whileTap={buttonTap}
              aria-label="Next destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroFeatured;