'use client';

import React, { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: [number, number];
}

const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  className = '',
  speed = 0.2,
  direction = 'up',
  offset = [-100, 100],
}) => {
  const { scrollY } = useScroll();
  
  // Calculate transform property based on direction
  let transform;
  
  if (direction === 'up') {
    transform = useTransform(scrollY, offset, [speed * offset[1], speed * offset[0]]);
  } else if (direction === 'down') {
    transform = useTransform(scrollY, offset, [-speed * offset[1], -speed * offset[0]]);
  } else if (direction === 'left') {
    transform = useTransform(scrollY, offset, [speed * offset[1], speed * offset[0]]);
  } else if (direction === 'right') {
    transform = useTransform(scrollY, offset, [-speed * offset[1], -speed * offset[0]]);
  }

  const motionStyle = direction === 'left' || direction === 'right' 
    ? { x: transform }
    : { y: transform };

  return (
    <motion.div 
      className={className} 
      style={motionStyle}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxScroll;