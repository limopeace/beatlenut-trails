'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCompass, 
  faMasksTheater, 
  faPaw, 
  faMountain 
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import SectionContainer from '@/components/common/SectionContainer';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import FadeIn from '@/components/animations/FadeIn';
import { animateCardContainer, animateCard } from '@/components/animations/AnimationConfig';

const services = [
  {
    id: 1,
    title: 'Guided Tours',
    description: 'Expert-led adventures through ancient trails and hidden gems of Northeast India.',
    imageSrc: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    href: '/services/guided-tours',
    icon: faCompass,
  },
  {
    id: 2,
    title: 'Cultural Experiences',
    description: 'Immerse yourself in the rich cultural heritage of diverse ethnic communities.',
    imageSrc: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    href: '/services/cultural-experiences',
    icon: faMasksTheater,
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Explore the diverse wildlife and natural habitats of the region.',
    imageSrc: '/images/real/pexels-dizitalboost-11622977-min.jpg',
    href: '/services/wildlife-safaris',
    icon: faPaw,
  },
  {
    id: 4,
    title: 'Adventure Activities',
    description: 'Experience thrilling adventures from trekking to river rafting and more.',
    imageSrc: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    href: '/services/adventure-activities',
    icon: faMountain,
  },
];

const FeaturedServices = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const displayedServices = isMobile ? services.slice(0, 2) : services;

  return (
    <SectionContainer
      background="pale-straw"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16"
      id="featured-services"
    >
      <div className="px-4 sm:px-6 md:px-8">
        {/* Section Title */}
        <FadeIn direction="up" className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-deep-forest text-lg sm:text-xl md:text-2xl font-serif">Our Services</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-deep-forest font-semibold mb-3 sm:mb-4 mt-1 sm:mt-2 font-clash">Flavors of Northeast</h2>
          <p className="text-deep-forest/80 max-w-3xl mx-auto text-sm sm:text-base">
            Discover the unique services we offer to make your Northeast India journey memorable
          </p>
        </FadeIn>
        
        {/* Services Grid - improved for better mobile layout */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {displayedServices.map((service) => (
            <StaggerItem key={service.id} className="transform transition duration-300 hover:-translate-y-2">
              <Link href={service.href} className="block h-full">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full border border-forest-green/10">
                  <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                    <img
                      src={service.imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-deep-forest bg-opacity-40"></div>
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-forest-green flex items-center justify-center text-pale-straw">
                      <FontAwesomeIcon icon={service.icon} className="text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-forest-green mb-1 sm:mb-2 font-clash">
                      {service.title}
                    </h3>
                    <p className="text-deep-forest/70 mb-3 sm:mb-4 text-xs sm:text-sm">{service.description}</p>
                    <div className="text-forest-green font-medium hover:underline inline-flex items-center text-sm sm:text-base">
                      Learn More 
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:ml-2 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        {/* View All Button */}
        <FadeIn direction="up" delay={0.5} className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Link 
            href="/services" 
            className="inline-block px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 bg-forest-green text-pale-straw text-xs sm:text-sm font-medium rounded-md hover:bg-deep-forest transition duration-300 shadow-md"
          >
            View All Services
          </Link>
        </FadeIn>
      </div>
      
      {/* Decorative Elements - adjusted to match TravelPackages */}
      <div className="absolute top-0 right-0 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-moss-green/10 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-8 sm:-mt-12 md:-mt-16 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-moss-green/20 -z-10"></div>
    </SectionContainer>
  );
};

export default FeaturedServices;