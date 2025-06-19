'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import SectionContainer from '@/components/common/SectionContainer';

const destinations = [
  {
    id: 1,
    name: 'Shillong – The Abode in the Clouds',
    state: 'Meghalaya',
    description: '🌿 The Capital of Serenity, Sound, and Soul. Shillong sits like a song in the hills — cool, pine-scented, alive with colonial charm, Khasi hospitality, winding streets, and cascading waterfalls.',
    imageSrc: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    href: '/travel-listings/shillong-abode-clouds',
    highlights: ['Colonial Charm', 'Khasi Culture', 'Jazz Cafes', 'Waterfalls'],
    duration: '4-6 Days',
    difficulty: 'Easy'
  },
  {
    id: 2,
    name: 'Kaziranga – Where the Wild Things Roam',
    state: 'Assam',
    description: '🐘 Of Grasslands, Giants, and Soulful Silence. A UNESCO World Heritage Site holding the largest population of one-horned rhinoceros on Earth, with mist rising over elephant grass.',
    imageSrc: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    href: '/travel-listings/kaziranga-wild-roam',
    highlights: ['One-horned Rhino', 'UNESCO Heritage', 'Tea Bungalows', 'Tribal Dances'],
    duration: '3-4 Days',
    difficulty: 'Easy'
  },
  {
    id: 3,
    name: 'Tawang – The Monastic Kingdom in the Clouds',
    state: 'Arunachal Pradesh',
    description: '🕉️ Where the road rises into prayer. At 10,000 ft, this mystical town houses India\'s largest monastery, ancient passes, and lakes that shimmer with spiritual stillness.',
    imageSrc: '/images/real/pexels-dipinder-rainu-247864103-16258336-min.jpg',
    href: '/travel-listings/tawang-monastic-kingdom',
    highlights: ['Largest Monastery', 'Prayer Flags', 'Yak Butter Tea', 'Himalayan Views'],
    duration: '6-8 Days',
    difficulty: 'Challenging'
  },
  {
    id: 4,
    name: 'Majuli – The Island That Floats on Faith',
    state: 'Assam',
    description: '🌾 A river\'s dream. A monk\'s silence. A storyteller\'s paradise. The world\'s largest river island, tucked in the mighty Brahmaputra\'s embrace with living monastic culture.',
    imageSrc: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    href: '/travel-listings/majuli-floating-faith',
    highlights: ['River Island', 'Neo-Vaishnavite Art', 'Clay Houses', 'Monastic Life'],
    duration: '4 Days',
    difficulty: 'Easy'
  },
  {
    id: 5,
    name: 'Dzukou Valley – The Last Bloom Before the Sky',
    state: 'Nagaland',
    description: '🏞️ Where the world fades, and the wild begins to whisper. A high-altitude meadowland of windswept silence, jade-green hills, and rolling rivers of wildflowers.',
    imageSrc: '/images/real/pexels-nans1419-20519339-min.jpg',
    href: '/travel-listings/dzukou-valley-bloom',
    highlights: ['Dzukou Lily', 'Valley of Flowers', 'Natural Caves', 'High-altitude Trek'],
    duration: '3-4 Days',
    difficulty: 'Challenging'
  },
  {
    id: 6,
    name: 'Upper Assam Tea Trail',
    state: 'Assam',
    description: 'Colonial heritage bungalows, tea estate cycling, wild mahseer biodiversity corridor, and authentic Assamese cuisine.',
    imageSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    href: '/travel-listings/assam-tea-heritage',
    highlights: ['Heritage Tea Estates', 'Colonial Bungalows', 'Authentic Cuisine'],
    duration: '4 Days',
    difficulty: 'Easy'
  },
];

const FeaturedDestinations = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const displayedDestinations = isMobile ? destinations.slice(0, 4) : destinations;

  return (
    <SectionContainer
      id="destinations"
      background="pale-straw"
      className="relative py-12 sm:py-16 md:py-20"
    >
      <FadeIn direction="up" duration={0.7} className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <span className="text-forest-green text-lg sm:text-xl md:text-2xl font-serif">Discover</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-deep-forest font-bold mb-2 sm:mb-3 md:mb-4 mt-1 sm:mt-2 font-clash uppercase">
          Top Destinations
        </h2>
        <p className="text-deep-forest/80 max-w-3xl mx-auto text-sm sm:text-base">
          Explore the most beautiful and culturally rich destinations of Northeast India
        </p>
      </FadeIn>

      {/* Improved grid layout with smaller gaps on mobile */}
      <div className="px-4 sm:px-6">
        <StaggerContainer 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" 
          delay={0.2} 
          staggerChildren={0.15}
        >
          {displayedDestinations.map((destination) => (
            <StaggerItem 
              key={destination.id} 
              direction="up" 
              className="group overflow-hidden rounded-md shadow-md bg-white transition duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <Link href={destination.href} className="block h-full flex flex-col">
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={destination.imageSrc}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/70 via-deep-forest/30 to-transparent"></div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-forest-green text-pale-straw text-xs font-bold px-2 sm:px-3 py-1 rounded-md">
                    {destination.state}
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-deep-forest mb-1 sm:mb-2 font-clash">
                    {destination.name}
                  </h3>
                  <p className="text-deep-forest/70 mb-3 text-sm sm:text-base flex-grow">{destination.description}</p>
                  
                  {/* Duration and Difficulty */}
                  <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm">
                    <span className="bg-forest-green/10 text-forest-green px-2 py-1 rounded-md font-medium">
                      {destination.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-md font-medium ${
                      destination.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      destination.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {destination.difficulty}
                    </span>
                  </div>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 2).map((highlight, index) => (
                        <span key={index} className="text-xs bg-moss-green/20 text-deep-forest px-2 py-1 rounded-md">
                          {highlight}
                        </span>
                      ))}
                      {destination.highlights.length > 2 && (
                        <span className="text-xs text-deep-forest/60">
                          +{destination.highlights.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-forest-green font-medium group-hover:underline inline-flex items-center text-sm sm:text-base mt-auto">
                    Explore Package
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:ml-2 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <FadeIn direction="up" delay={0.5} className="mt-8 sm:mt-10 md:mt-12 text-center px-4">
        <Link 
          href="/travel-listings" 
          className="inline-block px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-forest-green hover:bg-moss-green text-pale-straw font-medium rounded-md shadow-md transition duration-300 text-sm sm:text-base max-w-full"
        >
          Browse All Destinations
        </Link>
      </FadeIn>
      
      {/* Abstract decorative element - hidden on smaller screens */}
      <div className="absolute -bottom-8 right-0 w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 bg-moss-green/20 rounded-full opacity-50 hidden md:block"></div>
      <div className="absolute top-24 left-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-moss-green/20 rounded-full opacity-50 hidden md:block"></div>
    </SectionContainer>
  );
};

export default FeaturedDestinations;