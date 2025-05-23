'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpa, faLeaf, faCoffee, faWater, faMountain, faCloudSun } from '@fortawesome/free-solid-svg-icons';

const VaaniAboutEstate = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 text-green-900 opacity-5 transform rotate-45">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M42.7,-73.2C55.9,-65.7,67.7,-54.9,76.6,-41.4C85.5,-28,91.5,-12,92.3,4.5C93.1,21,88.7,38,77.8,48.2C67,58.4,49.8,61.8,34.7,66.5C19.7,71.2,6.7,77.2,-7.8,79.7C-22.4,82.1,-38.4,81,-48.2,72.1C-58,63.3,-61.5,46.8,-68.9,31.7C-76.2,16.6,-87.4,3,-87.5,-10.9C-87.7,-24.8,-77,-38.9,-65.2,-49.4C-53.5,-59.9,-40.7,-66.7,-28.1,-74.2C-15.5,-81.7,-3.1,-90,8.5,-88.1C20.1,-86.2,29.5,-80.8,42.7,-73.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12 relative">
          {/* Decorative script heading */}
          <div className="absolute -top-10 transform -rotate-6">
            <span className="font-serif italic text-green-700 text-4xl opacity-30">About Us</span>
          </div>
          
          <motion.h2 
            className="text-4xl font-serif font-medium text-green-800 mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Harmony Story
          </motion.h2>
          <div className="w-24 h-0.5 bg-green-600 mb-4"></div>
          <p className="text-center text-gray-600 max-w-3xl">
            Discover the legacy of Vaani Greens, where tradition meets sustainable luxury
          </p>
        </div>
        
        {/* Main content with overlap */}
        <div className="relative">
          <motion.div 
            className="bg-white rounded-lg shadow-2xl overflow-hidden relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Content - 7 columns */}
              <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-gray-700 mb-5 leading-relaxed">
                  <span className="font-medium text-green-800">Vaani Greens</span> is nestled in the pristine foothills of Eastern Himalayan Range, where the perfect harmony of climate, elevation, and soil creates the ideal conditions for growing exceptional teas. Our 150-acre estate has been cultivating premium tea since 2020, combining traditional methods with sustainable innovation.
                </p>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Each of our tea gardens has its own distinct character, influenced by subtle variations in terrain, sunlight exposure, and microclimate. From the misty slopes of our white tea section to the lush valleys where our robust black teas flourish, every leaf tells a story of its origin.
                </p>
                
                {/* Estate features */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                      <FontAwesomeIcon icon={faMountain} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Perfect Elevation</h4>
                      <p className="text-sm text-gray-600">1,100 meters above sea level</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                      <FontAwesomeIcon icon={faWater} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Pristine Water</h4>
                      <p className="text-sm text-gray-600">Natural spring-fed irrigation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                      <FontAwesomeIcon icon={faCloudSun} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Ideal Climate</h4>
                      <p className="text-sm text-gray-600">Moderate temperatures, ample rainfall</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="bg-green-100 p-3 rounded-full text-green-700 mr-4">
                      <FontAwesomeIcon icon={faLeaf} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Organic Practices</h4>
                      <p className="text-sm text-gray-600">No chemicals, natural pest control</p>
                    </div>
                  </div>
                </div>
                
                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <a href="/vaani-test/tea-collection" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center">
                    <FontAwesomeIcon icon={faCoffee} className="w-4 h-4 mr-2" />
                    Explore Our Teas
                  </a>
                  <a href="/vaani-test/about" className="bg-green-100 hover:bg-green-200 text-green-800 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center">
                    <FontAwesomeIcon icon={faSpa} className="w-4 h-4 mr-2" />
                    Our Philosophy
                  </a>
                </div>
              </div>
              
              {/* Image - 5 columns */}
              <div className="md:col-span-5 order-first md:order-last h-64 md:h-auto relative">
                <img 
                  src="https://picsum.photos/id/1060/800/600" 
                  alt="Vaani Greens Tea Estate" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 md:-left-10 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                  <div className="flex items-center">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faLeaf} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 text-sm">Certified Organic</h4>
                      <p className="text-xs text-gray-600">Premium Tea Estate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Decorative circle */}
          <div className="absolute top-1/4 -left-16 w-32 h-32 bg-green-50 rounded-full z-0 hidden md:block"></div>
          <div className="absolute bottom-1/4 -right-16 w-48 h-48 bg-green-50 rounded-full z-0 hidden md:block opacity-60"></div>
        </div>
        
        {/* Quote section */}
        <div className="mt-20 max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-green-900 text-9xl font-serif">"</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <p className="text-xl md:text-2xl text-green-800 font-serif italic mb-6">
              "We believe that a truly remarkable cup of tea tells the story of its origin - the soil, the climate, and the hands that nurture it from leaf to cup."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img 
                  src="https://picsum.photos/id/64/100/100" 
                  alt="Estate Owner" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-green-800">Rajiv Sharma</h4>
                <p className="text-sm text-gray-600">Estate Owner & Tea Master</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VaaniAboutEstate;