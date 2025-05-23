'use client';

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Import all Vaani components
import VaaniNavbar from '@/components/travel/VaaniNavbar';
import VaaniImprovedHero from '@/components/travel/VaaniImprovedHero';
import VaaniAboutEstate from '@/components/travel/VaaniAboutEstate';
import VaaniStats from '@/components/travel/VaaniStats';
import VaaniTeaCollection from '@/components/travel/VaaniTeaCollection';
import VaaniTestimonials from '@/components/travel/VaaniTestimonials';
import VaaniGallery from '@/components/travel/VaaniGallery';
import VaaniBookingCTA from '@/components/travel/VaaniBookingCTA';
import VaaniLocation from '@/components/travel/VaaniLocation';
import VaaniAerialView from '@/components/travel/VaaniAerialView';
import VaaniFooter from '@/components/travel/VaaniFooter';

// Import styles
import '@/styles/vaani-style.css';

export default function VaaniPage() {
  // Initialize Font Awesome
  useEffect(() => {
    // This ensures Font Awesome icons load properly
    import('@fortawesome/fontawesome-svg-core').then(fasCore => {
      fasCore.config.autoAddCss = false;
    });
  }, []);

  return (
    <div className="font-sans">
      {/* Fixed WhatsApp Contact Button */}
      <a 
        href="https://wa.me/919876543210?text=Hello%20Vaani%20Greens.%20I'm%20interested%20in%20learning%20more%20about%20your%20teas%20and%20experiences."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contact us via WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
      </a>
      
      {/* Navigation */}
      <VaaniNavbar />
      
      {/* Hero Section with improved functionality */}
      <VaaniImprovedHero />
      
      {/* About the Estate Section */}
      <VaaniAboutEstate />
      
      {/* Estate Stats */}
      <VaaniStats />
      
      {/* Tea Collection Showcase */}
      <VaaniTeaCollection />
      
      {/* Guest Testimonials */}
      <VaaniTestimonials />
      
      {/* Gallery and Visual Tour */}
      <VaaniGallery />
      
      {/* Booking Call-to-Action */}
      <VaaniBookingCTA />
      
      {/* Location and Directions */}
      <VaaniLocation />
      
      {/* Aerial View */}
      <VaaniAerialView />
      
      {/* Footer */}
      <VaaniFooter />
    </div>
  );
}