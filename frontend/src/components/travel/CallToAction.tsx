'use client';

import React from 'react';
import Button from '../common/Button';

const CallToAction = () => {
  return (
    <section className="py-20 relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/cta-placeholder.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-deep-forest-green opacity-80"></div>
      </div>
      
      <div className="container-custom relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-off-white">
          Ready to Embark on an Unforgettable Journey?
        </h2>
        <p className="text-xl text-light-grey max-w-3xl mx-auto mb-10">
          Let us help you create memories that will last a lifetime in the magical landscapes of Northeast India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="/contact"
            variant="primary"
            className="text-lg px-8 py-4"
          >
            Contact Us
          </Button>
          <Button
            href="/packages"
            variant="secondary"
            className="text-lg px-8 py-4 bg-transparent border-2 border-off-white text-off-white hover:bg-off-white hover:text-deep-forest-green"
          >
            View Packages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;