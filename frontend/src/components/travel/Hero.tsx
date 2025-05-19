'use client';

import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg"
          alt="Northeast India Landscape"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 md:px-4 h-full flex flex-col justify-center items-start relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl text-white mb-3 sm:mb-4 font-bold">Grandeur in Northeast</h1>
          <p className="text-white text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            Discover extraordinary adventures through breathtaking landscapes and rich cultural heritage of Northeast India
          </p>
          <Link 
            href="/services" 
            className="bg-deep-forest-green hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full inline-block transition-colors duration-300 font-medium tracking-wide"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;