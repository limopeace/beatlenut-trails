'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import MistyOverlay from './MistyOverlay';
import NatureButton from './NatureButton';

interface HeroSectionProps {
  title: string;
  titleHighlight?: string;
  slogan: string;
  description: string;
  imageSrc: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  overlayIntensity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

/**
 * HeroSection - An immersive, fullscreen hero section with parallax effect,
 * misty overlay, and responsive design, perfect for showcasing Northeast India
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  titleHighlight,
  slogan,
  description,
  imageSrc,
  primaryCta,
  secondaryCta,
  overlayIntensity = 'medium',
  className = '',
}) => {
  const [clientReady, setClientReady] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effect values
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.5, 0.8]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Ensure we only run certain effects client-side
  useEffect(() => {
    setClientReady(true);
  }, []);
  
  // Split the title if a highlight is provided
  const renderTitle = () => {
    if (!titleHighlight) return title;
    
    const parts = title.split(titleHighlight);
    return (
      <>
        {parts[0]}
        <span className="text-golden-medium">{titleHighlight}</span>
        {parts[1] || ''}
      </>
    );
  };

  return (
    <section 
      className={`
        relative min-h-[90vh] w-full flex items-center justify-center
        overflow-hidden
        ${className}
      `}
    >
      {/* Background Image with Parallax Effect */}
      {clientReady && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <img
            src={imageSrc}
            alt="Breathtaking Northeast India landscape"
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
      
      {/* Forest Gradient Overlay (Static for SSR compat) */}
      <div 
        className="absolute inset-0 z-10 bg-forest-overlay"
        style={{ opacity: clientReady ? undefined : 0.5 }}
      >
        {clientReady && (
          <motion.div
            className="absolute inset-0 bg-forest-deep"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </div>
      
      {/* Misty Overlay Effect */}
      <MistyOverlay 
        className="absolute inset-0 z-20"
        intensity={overlayIntensity}
        animate={true}
      />
      
      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-30 py-16">
        {clientReady ? (
          <motion.div
            className="max-w-2xl"
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Slogan/Tagline */}
            <motion.span
              className="inline-block text-misty-medium text-lg md:text-xl mb-3 font-montserrat tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {slogan}
            </motion.span>
            
            {/* Main Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-canvas-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {renderTitle()}
            </motion.h1>
            
            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-canvas-white opacity-90 mb-8 font-merriweather font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {description}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <NatureButton 
                href={primaryCta.href}
                variant="primary"
                size="lg"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                }
              >
                {primaryCta.text}
              </NatureButton>
              
              {secondaryCta && (
                <NatureButton 
                  href={secondaryCta.href}
                  variant="glass"
                  size="lg"
                >
                  {secondaryCta.text}
                </NatureButton>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // Static fallback for SSR
          <div className="max-w-2xl">
            <span className="inline-block text-misty-medium text-lg md:text-xl mb-3 font-montserrat tracking-wider">
              {slogan}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-canvas-white mb-6 leading-tight">
              {renderTitle()}
            </h1>
            
            <p className="text-lg md:text-xl text-canvas-white opacity-90 mb-8 font-merriweather font-light leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href={primaryCta.href}
                className="bg-golden-medium hover:bg-golden-dark text-canvas-white px-8 py-4 rounded-md inline-block font-montserrat font-medium text-lg transition-all duration-300"
              >
                {primaryCta.text}
              </Link>
              
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-8 py-4 rounded-md inline-block font-montserrat font-medium text-lg transition-all duration-300"
                >
                  {secondaryCta.text}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll Indicator */}
      {clientReady && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="text-canvas-white text-sm tracking-widest mb-2 font-montserrat">
            SCROLL
          </span>
          <motion.div
            className="w-0.5 h-12 bg-canvas-white opacity-60"
            animate={{
              scaleY: [1, 0.6, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;