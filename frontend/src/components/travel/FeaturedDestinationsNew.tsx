'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define the destination type
interface Destination {
  id: number;
  name: string;
  state: string;
  description: string;
  imageSrc: string;
  href: string;
  tagline?: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Shillong',
    state: 'Meghalaya',
    tagline: 'Scotland of the East',
    description: 'Pristine lakes and majestic waterfalls in the heart of the clouds.',
    imageSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    href: '/destinations/shillong',
  },
  {
    id: 2,
    name: 'Cherrapunji',
    state: 'Meghalaya',
    tagline: 'Land of Living Bridges',
    description: 'Discover ancient living root bridges and breathtaking valleys.',
    imageSrc: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    href: '/destinations/cherrapunji',
  },
  {
    id: 3,
    name: 'Majuli',
    state: 'Assam',
    tagline: 'River Island Sanctuary',
    description: 'The world\'s largest river island, rich with Assamese culture.',
    imageSrc: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    href: '/destinations/majuli',
  },
  {
    id: 4,
    name: 'Kaziranga',
    state: 'Assam',
    tagline: 'Rhino Conservation Legacy',
    description: 'Home to two-thirds of the world\'s one-horned rhinoceroses.',
    imageSrc: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    href: '/destinations/kaziranga',
  },
];

const FeaturedDestinationsNew = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prevIndex => (prevIndex + 1) % destinations.length);
    setTimeout(() => setIsAnimating(false), 600);
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prevIndex => (prevIndex === 0 ? destinations.length - 1 : prevIndex - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };
  
  const handleDotClick = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section className="py-16 md:py-24 bg-stone overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-forest-medium text-lg md:text-xl font-montserrat">Discover</span>
          <h2 className="text-3xl md:text-5xl text-forest-deep font-montserrat font-bold mt-2 mb-4">
            Breathtaking Destinations
          </h2>
          <p className="text-slate max-w-3xl mx-auto font-merriweather">
            Immerse yourself in these extraordinary locations that showcase 
            the natural beauty and cultural richness of Northeast India.
          </p>
        </motion.div>
        
        {/* Featured Destinations Carousel */}
        <div className="relative">
          {/* Main Featured Destination */}
          <motion.div 
            key={`featured-${activeIndex}`}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            {/* Image */}
            <motion.div 
              className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-medium"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={destinations[activeIndex].imageSrc} 
                alt={destinations[activeIndex].name} 
                className="absolute w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-forest-gradient-v opacity-40"></div>
              
              {/* State Badge */}
              <div className="absolute top-6 left-6 bg-forest-medium bg-opacity-80 text-stone py-1 px-4 rounded-full">
                <span className="font-montserrat text-sm tracking-wider">
                  {destinations[activeIndex].state}
                </span>
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div 
              className="flex flex-col justify-center px-4 md:px-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-moss font-montserrat text-lg mb-2">
                {destinations[activeIndex].tagline}
              </span>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-forest-deep mb-4">
                {destinations[activeIndex].name}
              </h3>
              
              <p className="text-lg text-slate font-merriweather mb-8 leading-relaxed">
                {destinations[activeIndex].description}
              </p>
              
              <Link 
                href={destinations[activeIndex].href}
                className="inline-block group"
              >
                <span className="flex items-center text-forest-medium font-montserrat font-medium text-lg">
                  Explore destination
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="block w-0 group-hover:w-full h-0.5 bg-forest-medium mt-1 transition-all duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-between">
            <button 
              onClick={handlePrev}
              className="p-3 border border-forest-medium text-forest-medium rounded-full hover:bg-forest-medium hover:text-stone transition duration-300"
              aria-label="Previous destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-3">
              {destinations.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-forest-medium w-8' 
                      : 'bg-slate bg-opacity-30 hover:bg-opacity-50'
                  }`}
                  aria-label={`Go to destination ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="p-3 border border-forest-medium text-forest-medium rounded-full hover:bg-forest-medium hover:text-stone transition duration-300"
              aria-label="Next destination"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link 
            href="/destinations" 
            className="inline-flex items-center text-forest-medium hover:text-forest-deep font-montserrat text-lg border-b-2 border-transparent hover:border-forest-medium transition-all duration-300"
          >
            View all destinations
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinationsNew;