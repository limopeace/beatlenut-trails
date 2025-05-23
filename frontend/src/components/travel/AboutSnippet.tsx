'use client';

import React from 'react';
import Link from 'next/link';

const AboutSnippet = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 bg-white">
            <span className="text-deep-forest-green text-2xl">About Us</span>
            <h2 className="text-3xl text-deep-forest-green font-semibold mb-6">The BeatlenutTrails Story</h2>
            <p className="text-gray-700 mb-4">
              BeatlenutTrails was founded by a group of Army veterans who are passionate about sharing the unparalleled beauty and cultural richness of Northeast India. With our deep knowledge of the region and commitment to sustainable tourism, we create authentic travel experiences that connect visitors with the local communities, traditions, and natural wonders.
            </p>
            <p className="text-gray-700 mb-6">
              Our team's military background ensures meticulous attention to detail, safety, and logistics - allowing you to focus on enjoying your journey while we take care of everything else.
            </p>
            
            <div className="flex space-x-8 mb-6">
              <div className="flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-2">
                </span>
                <span className="font-medium">Experienced Guides</span>
              </div>
              <div className="flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-2">
                </span>
                <span className="font-medium">Authentic Experiences</span>
              </div>
            </div>
            
            <Link
              href="/about" 
              className="inline-block bg-deep-forest-green hover:bg-green-900 text-white px-6 py-3 rounded transition duration-300"
            >
              LEARN MORE
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-96 md:h-auto relative">
            <img
              src="/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg"
              alt="About BeatlenutTrails"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;