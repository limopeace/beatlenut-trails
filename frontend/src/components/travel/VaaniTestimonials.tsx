'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const VaaniTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Amit Sharma",
      role: "Tea Connoisseur",
      quote: "The visit to Vaani Greens was nothing short of magical. The lush tea gardens, the aromatic teas, and the warm hospitality made it an unforgettable experience.",
      image: "https://picsum.photos/id/64/200/200"
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Travel Blogger",
      quote: "As someone who has visited tea estates around the world, I can confidently say that Vaani Greens offers one of the most authentic and immersive tea experiences in India.",
      image: "https://picsum.photos/id/26/200/200"
    },
    {
      id: 3,
      name: "David Wilson",
      role: "International Guest",
      quote: "The tranquility of the estate, combined with the exceptional tea quality and educational tours, made my visit to Vaani Greens a highlight of my Northeast India journey.",
      image: "https://picsum.photos/id/29/200/200"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#1d4ed8"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-green-600 font-medium italic block mb-3">Testimonials</span>
          <h2 className="text-4xl font-serif font-medium text-green-800 mb-4">What Our Guests Say</h2>
          <div className="w-24 h-0.5 bg-green-600 mx-auto mb-4"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`p-8 md:p-12 bg-white rounded-lg shadow-lg transition-all duration-500 ${
                  activeIndex === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 absolute inset-0'
                }`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -right-3 -bottom-3 bg-green-600 text-white p-4 rounded-full w-12 h-12 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" className="text-green-200 mb-4">
                        <path d="M13.415.43c-2.523 0-4.641.864-6.349 2.591C5.34 4.726 4.483 6.84 4.483 9.342c0 2.283.834 4.294 2.502 6.034 1.668 1.718 3.784 2.577 6.349 2.577 1.765 0 3.397-.463 4.9-1.388 1.521-.948 2.622-2.048 3.305-3.297-1.65 2.106-3.568 3.799-5.755 5.078A19.286 19.286 0 0 1 8.54 20.8c.017-1.45.293-2.836.827-4.162a12 12 0 0 1 2.316-3.646 12.259 12.259 0 0 1 3.45-2.597 9.953 9.953 0 0 1 4.284-.96V0c-2.052 0-3.997.143-5.837.43h-.165zm21.998 0c-2.523 0-4.64.864-6.349 2.591-1.726 1.705-2.584 3.82-2.584 6.322 0 2.283.835 4.294 2.502 6.034 1.668 1.718 3.786 2.577 6.35 2.577 1.765 0 3.397-.463 4.9-1.388 1.522-.948 2.622-2.048 3.305-3.297-1.651 2.106-3.569 3.799-5.755 5.078A19.286 19.286 0 0 1 30.538 20.8c.018-1.45.293-2.836.828-4.162a12 12 0 0 1 2.316-3.646 12.26 12.26 0 0 1 3.45-2.597 9.952 9.952 0 0 1 4.283-.96V0c-2.052 0-3.996.143-5.836.43h-.166z" fill="currentColor"/>
                      </svg>
                      
                      <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                        {testimonial.quote}
                      </p>
                      
                      <div>
                        <h4 className="text-lg font-medium text-green-800">{testimonial.name}</h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-green-600 scale-125' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaaniTestimonials;