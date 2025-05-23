'use client';

import React, { useState, useEffect } from 'react';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    content:
      "Our trip to Meghalaya with BeatlenutTrails was nothing short of magical. The team's attention to detail and knowledge of hidden gems made this journey unforgettable. Highly recommended for anyone wanting to experience the authentic Northeast!",
    author: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    imageSrc: 'https://picsum.photos/id/1036/800/600', // Mountain/forest landscape
    avatarSrc: 'https://randomuser.me/api/portraits/women/32.jpg', // Woman avatar
  },
  {
    id: 2,
    content:
      "As a solo traveler, safety was my top concern. The ex-Army team at BeatlenutTrails made me feel secure while exploring remote areas of Arunachal Pradesh. Their local connections provided cultural experiences that wouldn't be possible otherwise.",
    author: 'Rajiv Mehta',
    location: 'Bangalore',
    rating: 5,
    imageSrc: 'https://picsum.photos/id/1037/800/600', // People in mountains
    avatarSrc: 'https://randomuser.me/api/portraits/men/45.jpg', // Man avatar
  },
  {
    id: 3,
    content:
      "The wildlife safari in Kaziranga organized by BeatlenutTrails exceeded all expectations. Their guides were knowledgeable, patient, and passionate about conservation. A perfect balance of adventure and education!",
    author: 'Ananya Gupta',
    location: 'Delhi',
    rating: 4,
    imageSrc: 'https://picsum.photos/id/137/800/600', // Wildlife/nature scene
    avatarSrc: 'https://randomuser.me/api/portraits/women/65.jpg', // Woman avatar
  },
  {
    id: 4,
    content:
      "My family's adventure through Northeast India with BeatlenutTrails was the highlight of our year. The cultural experiences were authentic and the mountain views were spectacular. Our guide went above and beyond to ensure we had the best experience.",
    author: 'Vikram Singh',
    location: 'Kolkata',
    rating: 5,
    imageSrc: 'https://picsum.photos/id/184/800/600', // Mountain village scene
    avatarSrc: 'https://randomuser.me/api/portraits/men/22.jpg', // Man avatar
  },
  {
    id: 5,
    content:
      "The motorcycle tour through Arunachal Pradesh was an adventure of a lifetime! BeatlenutTrails handled all the logistics perfectly, from bikes to accommodations. Their knowledge of the terrain and local culture made this a truly special experience.",
    author: 'Aditya Patel',
    location: 'Hyderabad',
    rating: 5,
    imageSrc: 'https://picsum.photos/id/28/800/600', // Road/journey image
    avatarSrc: 'https://randomuser.me/api/portraits/men/54.jpg', // Man avatar
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <SectionContainer
      background="moss-green"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16"
      id="testimonials"
    >
      <div className="px-4 sm:px-6 md:px-8">
        {/* Decorative elements - scaled for mobile */}
        <div className="absolute top-0 left-0 w-full h-8 sm:h-10 md:h-12 bg-forest-green/10 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-72 lg:w-96 h-32 sm:h-48 md:h-72 lg:h-96 bg-pale-straw/5 rounded-full -ml-8 sm:-ml-16 md:-ml-32 -mb-6 sm:-mb-10 md:-mb-16 -z-10"></div>
        
        {/* Section header */}
        <FadeIn direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-pale-straw text-lg sm:text-xl md:text-2xl font-serif">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-pale-straw font-semibold mb-3 sm:mb-4 mt-1 sm:mt-2 font-clash">What Our Travelers Say</h2>
          <p className="text-pale-straw/80 max-w-3xl mx-auto text-sm sm:text-base">
            Discover why our guests keep coming back for more adventures
          </p>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          {/* Testimonial Card - improved for mobile */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Top/Left side - Image - responsive height on mobile */}
              <div className="md:w-1/3 relative h-56 sm:h-64 md:h-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={testimonials[activeIndex].imageSrc}
                      alt={`${testimonials[activeIndex].author} testimonial`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-deep-forest/40"></div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Bottom/Right side - Content */}
              <div className="md:w-2/3 p-5 sm:p-6 md:p-8 lg:p-12 bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex mb-4 sm:mb-6">
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-forest-green"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <div className="relative">
                      {/* Quote icon - smaller on mobile */}
                      <svg className="text-forest-green opacity-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 absolute -top-3 -left-2 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <blockquote className="text-sm sm:text-base md:text-lg text-deep-forest/80 mb-4 sm:mb-6 z-10 relative">
                        {testimonials[activeIndex].content}
                      </blockquote>
                    </div>

                    <div className="mt-4 sm:mt-6 md:mt-8 border-t pt-3 sm:pt-4 border-moss-green/20 flex items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-moss-green/30 shadow-md mr-3 sm:mr-4 flex-shrink-0">
                        <img 
                          src={testimonials[activeIndex].avatarSrc} 
                          alt={testimonials[activeIndex].author}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-semibold text-forest-green text-base sm:text-lg font-clash">
                            {testimonials[activeIndex].author}
                          </p>
                          <span className="ml-2 bg-moss-green/20 text-forest-green text-xs px-2 py-0.5 rounded-full">Verified Traveler</span>
                        </div>
                        <p className="text-deep-forest/60 text-sm sm:text-base">
                          {testimonials[activeIndex].location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Controls - improved for mobile touch */}
          <div className="flex justify-between items-center mt-6 sm:mt-8">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest-green text-pale-straw hover:bg-deep-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex justify-center gap-2 sm:gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 600);
                  }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === activeIndex
                      ? 'bg-pale-straw'
                      : 'bg-pale-straw/30 hover:bg-pale-straw/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest-green text-pale-straw hover:bg-deep-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Testimonial;