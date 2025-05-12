'use client';

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, ParallaxScroll } from '../animations';
import NextImage from '../common/NextImage';
import { createPlaceholderImage } from '../common/CreatePlaceholderImage';

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative pt-16 h-screen bg-cover bg-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <ParallaxScroll
        direction="up"
        speed={0.15}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 h-[120%]">
          {/* Simplified image handling */}
          <NextImage
            src="/images/hero-placeholder.jpg"
            alt="Northeast India Landscape"
            fallbackSrc="/images/placeholder.jpg"
            fill
            priority={true}
            containerClassName="h-full w-full"
            className="object-cover object-center"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-black"
          ></motion.div>
        </div>
      </ParallaxScroll>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start relative z-10">
        <StaggerContainer className="max-w-3xl">
          <StaggerItem>
            <h2 className="text-4xl md:text-6xl text-white font-montserrat mb-4">Grandeur in Northeast</h2>
          </StaggerItem>

          <StaggerItem>
            <p className="text-white text-lg mb-6 max-w-2xl">
              Discover extraordinary adventures through breathtaking landscapes and rich cultural heritage of Northeast India
            </p>
          </StaggerItem>

          <StaggerItem>
            <Button
              href="/services"
              variant="primary"
              className="bg-deep-forest-green hover:bg-green-700 text-white px-6 py-3 rounded-full"
            >
              BOOK NOW
            </Button>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Decorative element - floating shapes */}
      <motion.div
        className="absolute right-10 top-1/3 w-16 h-16 rounded-full bg-sunrise-orange/20 hidden md:block"
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-10 top-1/4 w-8 h-8 rounded-full bg-vibrant-teal/20 hidden md:block"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};

export default Hero;