'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MotorcycleAnimationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const MotorcycleAnimation = ({ src, alt, width, height, priority = false }: MotorcycleAnimationProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (inView) {
      controls.start({
        x: 0, // Final position is centered (started from left)
        opacity: 1,
        scale: 1.02,
        rotate: 0,
        transition: { 
          type: 'spring',
          damping: 15,
          stiffness: 80,
          duration: 1.8
        }
      });
    } else if (!isFirstRender.current) {
      controls.start({
        x: -500, // Off-screen to the left
        opacity: 0,
        scale: 0.95,
        rotate: -2, // Slight rotation for dynamic effect
        transition: { duration: 0.5 }
      });
    }
    
    isFirstRender.current = false;
  }, [controls, inView]);

  return (
    <div ref={ref} className="relative w-full h-full">
      <motion.div
        className="absolute"
        initial={{ x: -500, opacity: 0, scale: 0.95, rotate: -2 }} // Initial position off-screen to the left
        animate={controls}
        style={{ top: '-70px' }} /* Moved 100px higher from original 30px position */
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="max-w-full h-auto object-contain"
          loading={priority ? 'eager' : 'lazy'}
        />
      </motion.div>
    </div>
  );
};

export default MotorcycleAnimation;