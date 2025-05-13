'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import MotorcycleAnimation from '@/components/animations/MotorcycleAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faShieldAlt, faRoad, faTools } from '@fortawesome/free-solid-svg-icons';
import { WhatsAppButton } from '@/components/common';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import SectionContainer from '@/components/common/SectionContainer';

const BikeRentalsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const featureItems = [
    {
      icon: faMotorcycle,
      title: "PREMIUM BIKES",
      description: "Top-tier motorcycles including Kawasaki, Royal Enfield and KTM"
    },
    {
      icon: faShieldAlt,
      title: "SAFETY FIRST",
      description: "All bikes maintained to the highest safety standards"
    },
    {
      icon: faRoad,
      title: "GUIDED TOURS",
      description: "Options for self-ride or professionally guided adventures"
    },
    {
      icon: faTools,
      title: "FULL SUPPORT",
      description: "24/7 roadside assistance throughout Northeast India"
    }
  ];

  return (
    <SectionContainer
      background="white"
      className="relative overflow-hidden"
      id="bike-rentals"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Motorcycle animation - left side (Desktop only) */}
        <div className="relative hidden md:block h-[400px]">
          <MotorcycleAnimation 
            src="/images/bikes/kawasaki-versys-1000.jpg"
            alt="Beatlenut Trails Motorcycle Rental - Kawasaki Versys 1000"
            width={600}
            height={300}
            priority
          />
        </div>

        {/* Content - right side */}
        <div>
          <FadeIn direction="left" duration={0.8} className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-deep-forest font-clash uppercase">
              Explore on Two Wheels
            </h2>
            <p className="text-deep-forest/90 text-lg">
              Experience the freedom of the open road with our premium motorcycle rental service. 
              From the winding mountain roads to scenic highways, discover Northeast India's
              breathtaking landscapes at your own pace with our well-maintained fleet.
            </p>
          </FadeIn>

          {/* Features */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6" delay={0.3} staggerChildren={0.1}>
            {featureItems.map((item, index) => (
              <StaggerItem 
                key={index}
                className="group bg-pale-straw/10 rounded-md p-5 transition-all duration-300 hover:shadow-md hover:bg-pale-straw/20 border border-forest-green/10"
              >
                <div className="w-12 h-12 bg-pale-straw/50 rounded-full flex items-center justify-center text-forest-green mb-4 group-hover:bg-forest-green group-hover:text-pale-straw transition-colors">
                  <FontAwesomeIcon icon={item.icon} className="text-xl" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-deep-forest font-clash">{item.title}</h3>
                <p className="text-deep-forest/70">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA Buttons */}
          <FadeIn direction="up" delay={0.7} className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <WhatsAppButton 
              template="bikeRentals"
              source="homepage"
              className="px-8 py-3 rounded-md font-medium"
              showIcon={true}
              showText={true}
              text="INQUIRE VIA WHATSAPP"
            />
            <a 
              href="/bike-rentals" 
              className="inline-block px-8 py-3 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition duration-300 text-center"
            >
              VIEW RENTAL OPTIONS
            </a>
          </FadeIn>

          {/* Mobile motorcycle image (only visible on mobile) */}
          <FadeIn direction="up" delay={0.9} className="mt-8 block md:hidden">
            <img
              src="/images/bikes/kawasaki-versys-1000.jpg"
              alt="Beatlenut Trails Motorcycle Rental - Kawasaki Versys 1000"
              className="w-full h-auto object-contain rounded-lg"
            />
          </FadeIn>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-pale-straw/30 -z-10"></div>
    </SectionContainer>
  );
};

export default BikeRentalsSection;