'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';

interface TruckAnimationProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  direction?: 'left-to-right' | 'right-to-left';
}

const TruckAnimation: React.FC<TruckAnimationProps> = ({
  src,
  alt,
  width = 600,
  height = 300,
  className = '',
  priority = false,
  direction = 'left-to-right',
}) => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: false, amount: 0.3 });
  
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Trigger animation when element comes into view
  useEffect(() => {
    const startAnimation = async () => {
      if (inView) {
        // First fade in
        await controls.start({
          opacity: 1,
          transition: { duration: 0.3 }
        });
        
        // Then slide in with physics-based animation
        await controls.start({
          x: '0%',
          transition: {
            type: 'spring',
            stiffness: 28,
            damping: 30,
            mass: 3.8,
            velocity: -2,
            duration: 2.5,
            restDelta: 0.0001
          }
        });
      } else {
        // Reset animation when out of view
        controls.start({
          x: prefersReducedMotion ? 0 : (direction === 'left-to-right' ? '-120%' : '120%'),
          opacity: prefersReducedMotion ? 1 : 0
        });
      }
    };

    startAnimation();
  }, [inView, controls, prefersReducedMotion, direction]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ 
        x: prefersReducedMotion ? 0 : (direction === 'left-to-right' ? '-120%' : '120%'), 
        opacity: prefersReducedMotion ? 1 : 0 
      }}
      animate={controls}
      className={`${className} relative`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto object-contain"
        priority={priority}
      />
    </motion.div>
  );
};

export default TruckAnimation;