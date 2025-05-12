'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  className = '',
  once = true,
  threshold = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  // Set initial and animate values based on direction
  let initial = { opacity: 0 };
  
  if (direction === 'up') {
    initial = { ...initial, y: distance };
  } else if (direction === 'down') {
    initial = { ...initial, y: -distance };
  } else if (direction === 'left') {
    initial = { ...initial, x: distance };
  } else if (direction === 'right') {
    initial = { ...initial, x: -distance };
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;