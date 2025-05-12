'use client';

import React from 'react';
import Button from '../common/Button';
import { FadeIn } from '../animations';

const AboutSnippet = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 bg-white">
            <FadeIn>
              <span className="text-deep-forest-green font-script text-2xl">About Us</span>
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
                    <i className="fas fa-leaf text-deep-forest-green"></i>
                  </span>
                  <span className="font-medium">Experienced Guides</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-100 p-2 rounded-full mr-2">
                    <i className="fas fa-star text-deep-forest-green"></i>
                  </span>
                  <span className="font-medium">Authentic Experiences</span>
                </div>
              </div>
              
              <Button 
                href="/about" 
                variant="primary"
                className="bg-deep-forest-green hover:bg-green-900 text-white px-6 py-2 rounded"
              >
                LEARN MORE
              </Button>
            </FadeIn>
          </div>
          <div 
            className="w-full md:w-1/2 bg-cover bg-center h-96 md:h-auto" 
            style={{ backgroundImage: "url('/images/about-placeholder.jpg')" }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;