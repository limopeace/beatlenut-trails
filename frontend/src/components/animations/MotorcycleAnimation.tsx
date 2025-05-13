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
        x: 0,
        opacity: 1,
        transition: { 
          type: 'spring', 
          stiffness: 50, 
          damping: 20,
          duration: 1.5
        }
      });
    } else if (!isFirstRender.current) {
      controls.start({
        x: -300,
        opacity: 0,
        transition: { duration: 0.5 }
      });
    }
    
    isFirstRender.current = false;
  }, [controls, inView]);

  return (
    <div ref={ref} className="relative w-full h-full">
      <motion.div
        className="absolute"
        initial={{ x: -300, opacity: 0 }}
        animate={controls}
        style={{ top: '60px' }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="max-w-full h-auto object-contain"
          loading={priority ? 'eager' : 'lazy'}
          style={{}}
        />
      </motion.div>
    </div>
  );
};

export default MotorcycleAnimation;