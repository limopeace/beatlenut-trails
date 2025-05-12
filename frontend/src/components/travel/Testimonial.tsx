'use client';

import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    content:
      "Our trip to Meghalaya with BeatlenutTrails was nothing short of magical. The team's attention to detail and knowledge of hidden gems made this journey unforgettable. Highly recommended for anyone wanting to experience the authentic Northeast!",
    author: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    imageSrc: '/images/testimonial-placeholder.jpg',
  },
  {
    id: 2,
    content:
      "As a solo traveler, safety was my top concern. The ex-Army team at BeatlenutTrails made me feel secure while exploring remote areas of Arunachal Pradesh. Their local connections provided cultural experiences that wouldn't be possible otherwise.",
    author: 'Rajiv Mehta',
    location: 'Bangalore',
    rating: 5,
    imageSrc: '/images/testimonial-placeholder.jpg',
  },
  {
    id: 3,
    content:
      "The wildlife safari in Kaziranga organized by BeatlenutTrails exceeded all expectations. Their guides were knowledgeable, patient, and passionate about conservation. A perfect balance of adventure and education!",
    author: 'Ananya Gupta',
    location: 'Delhi',
    rating: 4,
    imageSrc: '/images/testimonial-placeholder.jpg',
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 relative bg-gray-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-deep-forest-green text-2xl">Testimonials</span>
          <h2 className="text-3xl md:text-4xl text-deep-forest-green font-semibold mb-4">What Our Travelers Say</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover why our guests keep coming back for more adventures
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left side - Image */}
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <img
                  src={testimonials[activeIndex].imageSrc}
                  alt={`${testimonials[activeIndex].author} testimonial`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-deep-forest-green bg-opacity-20"></div>
              </div>
              
              {/* Right side - Content */}
              <div className="md:w-2/3 p-8 md:p-12">
                <div className="flex mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div className="relative">
                  <svg className="text-deep-forest-green opacity-20 w-16 h-16 absolute -top-6 -left-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <blockquote className="text-lg text-gray-700 mb-6 z-10 relative">
                    {testimonials[activeIndex].content}
                  </blockquote>
                </div>

                <div className="mt-8 border-t pt-4 border-gray-100">
                  <p className="font-semibold text-deep-forest-green text-lg">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-gray-500">
                    {testimonials[activeIndex].location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-deep-forest-green text-white hover:bg-opacity-90 transition"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex
                      ? 'bg-deep-forest-green'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-deep-forest-green text-white hover:bg-opacity-90 transition"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;