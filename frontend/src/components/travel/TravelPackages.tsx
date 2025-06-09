'use client';

import React from 'react';
import Link from 'next/link';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { motion } from 'framer-motion';

const packages = [
  {
    id: 1,
    title: '🌧️ The Megha Ride in the Clouds',
    duration: '7-9 Days',
    price: 35000,
    description: 'A cycling expedition through mist, myths, and monsoon melodies. Ride from Shillong to Sohra through sacred valleys and cloud-kissed ridges.',
    highlights: ['Shillong Musical Alleys', 'Sohra Waterfalls', 'Living Root Bridges', 'Sacred Groves', 'Village Stays'],
    imageSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    href: '/travel-listings/megha-ride-clouds',
    category: 'Cycling',
    emoji: '🌿'
  },
  {
    id: 2,
    title: '🍃 Whispers from the Bungalows',
    duration: '10-12 Days',
    price: 85000,
    description: 'A luxury tea trail through time — from Kaziranga to Dibrugarh. Stay in 100-year-old colonial tea estates and explore wildlife sanctuaries.',
    highlights: ['Heritage Tea Bungalows', 'Kaziranga Safaris', 'Majuli River Island', 'Tea Garden Walks', 'Colonial Architecture'],
    imageSrc: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    href: '/travel-listings/whispers-bungalows',
    category: 'Luxury',
    emoji: '🍵'
  },
  {
    id: 3,
    title: '🕉️ The Monastic Himalayan Circuit',
    duration: '9-12 Days',
    price: 65000,
    description: 'From Bomdila to Tawang — a spiritual ascent through clouds and chants. Journey through western Arunachal Pradesh\'s sacred monasteries.',
    highlights: ['Tawang Monastery', 'Sela Pass', 'Buddhist Rituals', 'Himalayan Villages', 'Sacred Lakes'],
    imageSrc: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    href: '/travel-listings/monastic-himalayan-circuit',
    category: 'Spiritual',
    emoji: '🏔️'
  },
  {
    id: 4,
    title: '🔥 Hornbill Festival & Naga Soul Trail',
    duration: '5-7 Days',
    price: 42000,
    description: 'Dance, fire, folklore — the tribes gather, and so must you. Experience Nagaland\'s cultural heritage during the famous Hornbill Festival.',
    highlights: ['Hornbill Festival', 'Tribal Dances', 'Naga Villages', 'Traditional Crafts', 'Fire Ceremonies'],
    imageSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    href: '/travel-listings/hornbill-naga-trail',
    category: 'Cultural',
    emoji: '🪖'
  },
  {
    id: 5,
    title: '🌅 Loktak Lake & the Floating Worlds',
    duration: '3-5 Days',
    price: 25000,
    description: 'Where the lake breathes, and the world floats quietly with it. Experience India\'s only floating lake ecosystem in Manipur.',
    highlights: ['Floating Phumdis', 'Keibul Lamjao Park', 'Fishermen Villages', 'Sunrise Boat Rides', 'Manipuri Culture'],
    imageSrc: '/images/real/pexels-nans1419-20519339-min.jpg',
    href: '/travel-listings/loktak-floating-worlds',
    category: 'Nature',
    emoji: '🌺'
  },
  {
    id: 6,
    title: '🏍️ Nepal Overland Bike Expedition',
    duration: '14-18 Days',
    price: 95000,
    description: 'From Brahmaputra bends to Himalayan breaths — a ride that spans soul and silence. Guwahati to the Himalayas and back.',
    highlights: ['Cross-Border Riding', 'Himalayan Passes', 'Kathmandu Valley', 'Pokhara Lakes', 'Terai Plains'],
    imageSrc: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    href: '/travel-listings/nepal-overland-expedition',
    category: 'Adventure',
    emoji: '🛣️'
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const TravelPackages = () => {
  return (
    <SectionContainer
      background="pale-straw"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16"
      id="travel-packages"
    >
      <div className="px-4 sm:px-6 md:px-8">
        {/* Decorative elements - scaled for mobile */}
        <div className="absolute top-0 right-0 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-moss-green/10 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-8 sm:-mt-12 md:-mt-16 -z-10"></div>
        
        {/* Section Header */}
        <FadeIn direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-forest-green text-lg sm:text-xl md:text-2xl font-serif">🌍 Explore Tours</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-deep-forest font-semibold mb-3 sm:mb-4 mt-1 sm:mt-2 font-clash">Soul-Stirring Expeditions</h2>
          <p className="text-deep-forest/80 max-w-3xl mx-auto text-sm sm:text-base">
            Handcrafted journeys through Northeast India's breathtaking landscapes, ancient cultures, and sacred spaces
          </p>
        </FadeIn>
        
        {/* Packages Grid - improved for mobile with better responsive columns */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg) => (
            <StaggerItem key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-moss-green/20 hover:shadow-lg transition-all duration-300">
              <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                <img 
                  src={pkg.imageSrc} 
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-forest-green text-pale-straw py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-medium z-10">
                  {pkg.category}
                </div>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 text-deep-forest py-1 px-2 rounded-full text-lg z-10">
                  {pkg.emoji}
                </div>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-forest-green font-clash">{pkg.title}</h3>
                  <div className="text-deep-forest font-bold bg-moss-green/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm self-start">
                    {formatPrice(pkg.price)}
                  </div>
                </div>
                
                <div className="mb-2 sm:mb-3 text-xs sm:text-sm text-deep-forest/70 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-forest-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {pkg.duration}
                </div>
                
                <p className="text-deep-forest/70 mb-3 sm:mb-4 text-xs sm:text-sm">{pkg.description}</p>
                
                <div className="mb-4 sm:mb-5 flex-grow">
                  <p className="text-xs sm:text-sm font-semibold text-deep-forest mb-1 sm:mb-2">Highlights:</p>
                  <ul className="text-xs sm:text-sm space-y-1">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-moss-green mt-0.5 mr-1 sm:mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-deep-forest/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={pkg.href}
                  className="w-full bg-forest-green hover:bg-moss-green text-pale-straw py-2 px-4 rounded-md text-xs sm:text-sm font-medium text-center transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        {/* View All Button */}
        <FadeIn direction="up" delay={0.5} className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Link 
            href="/travel-listings" 
            className="inline-block px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 bg-forest-green text-pale-straw text-xs sm:text-sm font-medium rounded-md hover:bg-deep-forest transition duration-300 shadow-md">
            View All Packages
          </Link>
        </FadeIn>
      </div>
      
      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-moss-green/20 -z-10"></div>
    </SectionContainer>
  );
};

export default TravelPackages;