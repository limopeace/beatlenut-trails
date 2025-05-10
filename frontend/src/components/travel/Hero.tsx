'use client';

import React from 'react';
import Button from '../common/Button';

const Hero = () => {
  return (
    <div className="relative h-screen-85 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl text-off-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover Extraordinary Adventures in Northeast India
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-light-grey">
            Curated experiences that connect you with breathtaking landscapes and rich cultural heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              href="/services" 
              variant="primary"
              className="text-lg px-8 py-4"
            >
              Explore Our Services
            </Button>
            <Button 
              href="/about" 
              variant="secondary"
              className="text-lg px-8 py-4 bg-transparent border-2 border-off-white text-off-white hover:bg-off-white hover:text-deep-forest-green"
            >
              About Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;