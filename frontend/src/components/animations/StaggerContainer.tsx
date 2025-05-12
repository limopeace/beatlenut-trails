'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface StaggerContainerProps {
  children: ReactNode;
  delay?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  delay = 0,
  staggerChildren = 0.1,
  className = '',
  once = true,
  threshold = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Child component to be used inside StaggerContainer
export const StaggerItem: React.FC<{
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}> = ({ children, className = '', direction = 'up', distance = 30 }) => {
  // Set initial and animate values based on direction
  let initial = { opacity: 0 };
  let animate = { opacity: 1, x: 0, y: 0 };
  
  if (direction === 'up') {
    initial = { ...initial, y: distance };
  } else if (direction === 'down') {
    initial = { ...initial, y: -distance };
  } else if (direction === 'left') {
    initial = { ...initial, x: distance };
  } else if (direction === 'right') {
    initial = { ...initial, x: -distance };
  }
  
  const item = {
    hidden: initial,
    show: {
      ...animate,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

export default StaggerContainer;