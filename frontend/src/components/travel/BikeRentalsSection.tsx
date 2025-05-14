'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import MotorcycleAnimation from '@/components/animations/MotorcycleAnimation';
import { WhatsAppButton } from '@/components/common';
import FadeIn from '@/components/animations/FadeIn';

const BikeRentalsSection = () => {

  return (
    <section 
      id="bike-rentals"
      className="bg-gray-900 relative overflow-hidden w-full py-10 sm:py-12 md:py-16" /* Lightened background from gray-950 to gray-900 */
    >
      {/* Fixed background image - no stacking issues */}
      <div className="absolute inset-0 w-full h-full">
        {/* Dark base layer - changed to lighter gray (gray-900) */}
        <div className="absolute inset-0 bg-gray-900"></div>
        
        {/* Background image with overlay - increased opacity for lighter look */}
        <div 
          className="absolute inset-0 opacity-25" /* Increased from 20% to 25% opacity */
          style={{
            backgroundImage: 'url("/images/temp/pexels-maxandrey-1197095 (1).jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
        
        {/* Gradient overlay - updated to match lighter background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/95"></div>
        
        {/* Subtle texture - increased opacity */}
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 0h2v2H1V0zm0 4h2v2H1V4zm0 4h2v2H1V8zm0 4h2v2H1v-2zm0 4h2v2H1v-2zM5 0h2v2H5V0zm0 8h2v2H5V8zm0 8h2v2H5v-2zM9 0h2v2H9V0zm0 4h2v2H9V4zm0 4h2v2H9V8zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 0h2v2h-2V0zm0 8h2v2h-2V8zm0 8h2v2h-2v-2zM17 0h2v2h-2V0zm0 4h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z\' fill=\'%23ffffff\' fill-opacity=\'0.15\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '10px 10px'
          }}
        ></div>
      </div>
      
      {/* Content container */}
      <div className="container mx-auto relative z-10">
        {/* Hero Section with Motorcycle Animation - swapped positions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Motorcycle Animation (was on right side) */}
          <div className="order-1 md:order-1 h-60 sm:h-72 md:h-80 lg:h-96">
            <MotorcycleAnimation 
              src="/images/versys-nobg.png"
              alt="Beatlenut Trails Motorcycle Rental - Kawasaki Versys 1000"
              width={600}
              height={400}
              priority={true}
            />
          </div>
          
          {/* Right side - Content (was on left side) */}
          <FadeIn direction="left" className="order-2 md:order-2"> {/* Changed direction from right to left */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 text-white font-clash uppercase">
              Explore on Two Wheels
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Experience the freedom of the open road with our premium motorcycle rental service. 
              From the winding mountain roads to scenic highways, discover Northeast India's
              breathtaking landscapes at your own pace with our well-maintained fleet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <WhatsAppButton 
                template="bikeRentals"
                source="homepage"
                className="px-6 sm:px-7 py-3 sm:py-4 rounded-md font-medium"
                showIcon={true}
                showText={true}
                text="INQUIRE VIA WHATSAPP"
              />
              <a 
                href="/bike-rentals" 
                className="inline-block px-6 sm:px-7 py-3 sm:py-4 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition duration-300 text-center"
              >
                VIEW ALL BIKES
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 md:h-12 bg-moss-green/20 -z-10"></div>
      <div className="absolute top-12 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-forest-green/5 rounded-full -mr-8 sm:-mr-12 md:-mr-16 -z-10"></div>
    </section>
  );
};

export default BikeRentalsSection;