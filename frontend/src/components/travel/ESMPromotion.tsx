'use client';

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const ESMPromotion = () => {
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="section bg-deep-forest-green">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-off-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ex-Servicemen Marketplace
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-lg">
                Supporting our heroes through a dedicated portal where Ex-Servicemen can register, list products or services, and connect with potential customers.
              </p>
              <p>
                Our marketplace empowers former military personnel to leverage their skills and create sustainable livelihoods while offering unique, high-quality products and services to customers.
              </p>
              <p>
                Each purchase supports a veteran's business and helps strengthen our community of heroes transitioning to civilian careers.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/esm-portal" variant="primary">
                Visit ESM Portal
              </Button>
              <Button 
                href="/esm-portal/register" 
                variant="secondary"
                className="bg-transparent border-2 border-off-white text-off-white hover:bg-off-white hover:text-deep-forest-green"
              >
                Register as ESM
              </Button>
            </div>
          </div>
          
          {/* Image with real photo */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg"
                alt="Ex-Servicemen Marketplace"
                className="absolute w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-deep-forest-green/60 to-transparent z-10"></div>
            <div className="absolute top-4 left-4 bg-sunrise-orange text-off-white py-2 px-6 rounded-full font-semibold z-20">
              By Army Veterans, For Army Veterans
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ESMPromotion;