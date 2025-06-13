'use client';

import React from 'react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Guwahati, Assam",
      text: "Amazing experience with Beatlenut Trails! The ESM portal helped me find quality products from fellow veterans.",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Shillong, Meghalaya",
      text: "The travel packages are perfectly curated. Highly recommend for Northeast India exploration.",
      rating: 5
    },
    {
      id: 3,
      name: "Colonel (Retd.) Singh",
      location: "Imphal, Manipur",
      text: "Great platform for Ex-Servicemen to showcase their businesses. Professional and trustworthy.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}