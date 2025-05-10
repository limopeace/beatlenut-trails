'use client';

import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';

const testimonials = [
  {
    id: 1,
    content:
      "Our trip to Meghalaya with BeatlenutTrails was nothing short of magical. The team's attention to detail and knowledge of hidden gems made this journey unforgettable. Highly recommended for anyone wanting to experience the authentic Northeast!",
    author: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
  },
  {
    id: 2,
    content:
      "As a solo traveler, safety was my top concern. The ex-Army team at BeatlenutTrails made me feel secure while exploring remote areas of Arunachal Pradesh. Their local connections provided cultural experiences that wouldn't be possible otherwise.",
    author: 'Rajiv Mehta',
    location: 'Bangalore',
    rating: 5,
  },
  {
    id: 3,
    content:
      "The wildlife safari in Kaziranga organized by BeatlenutTrails exceeded all expectations. Their guides were knowledgeable, patient, and passionate about conservation. A perfect balance of adventure and education!",
    author: 'Ananya Gupta',
    location: 'Delhi',
    rating: 4,
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
    <section className="section relative bg-deep-forest-green text-off-white">
      <div className="absolute inset-0 bg-[url('/images/testimonial-placeholder.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="container-custom relative z-10">
        <SectionTitle
          title="What Our Travelers Say"
          subtitle="Discover why our guests keep coming back for more adventures"
          className="text-off-white"
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-white border-opacity-20">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-golden-ochre"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-xl italic mb-6 text-center">
              "{testimonials[activeIndex].content}"
            </blockquote>

            <div className="text-center">
              <p className="font-montserrat font-semibold text-lg">
                {testimonials[activeIndex].author}
              </p>
              <p className="text-misty-blue">
                {testimonials[activeIndex].location}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 bg-sunrise-orange text-off-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-vibrant-teal transition-colors"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 bg-sunrise-orange text-off-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-vibrant-teal transition-colors"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex
                    ? 'bg-sunrise-orange'
                    : 'bg-white bg-opacity-30'
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

export default Testimonial;