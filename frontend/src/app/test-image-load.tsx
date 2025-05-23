'use client';

import React from 'react';

const TestImageLoad = () => {
  // The images from different components
  const images = [
    // Hero section images
    "/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg",
    "/images/real/pexels-travelerchitect-18736328-min.jpg",
    "/images/real/pexels-dizitalboost-11622977-min.jpg",
    
    // About section image
    "/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg",
    
    // Gallery images
    "/images/real/pexels-nans1419-20519339-min.jpg",
    "/images/real/pexels-kanishka-211910-679492-min.jpg",
    "/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg",
    "/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg"
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((src, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h2 className="mb-2 font-medium">Image {index + 1}</h2>
            <p className="text-xs mb-2 overflow-auto">{src}</p>
            <div className="h-64 relative bg-gray-100">
              <img 
                src={src} 
                alt={`Test image ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestImageLoad; 