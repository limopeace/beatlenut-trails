'use client';

import React from 'react';
import Button from '../common/Button';

const AboutSnippet = () => {
  return (
    <section className="section bg-light-grey">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-lg overflow-hidden h-96">
            <div className="absolute inset-0 bg-[url('/images/about-placeholder.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-deep-forest-green opacity-30"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-sunrise-orange text-off-white py-2 px-6 rounded-full font-montserrat font-semibold">
                Founded by Army Veterans
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-deep-forest-green">Our Story</h2>
            <div className="space-y-4 mb-8">
              <p>
                BeatlenutTrails was founded by a group of Army veterans who are passionate about sharing the unparalleled beauty and cultural richness of Northeast India.
              </p>
              <p>
                With our deep knowledge of the region and commitment to sustainable tourism, we create authentic travel experiences that connect visitors with the local communities, traditions, and natural wonders.
              </p>
              <p>
                Our team's military background ensures meticulous attention to detail, safety, and logistics - allowing you to focus on enjoying your journey while we take care of everything else.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/about" variant="primary">
                Read More
              </Button>
              <Button href="/esm-portal" variant="secondary">
                ESM Portal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;