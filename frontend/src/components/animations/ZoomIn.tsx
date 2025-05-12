'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ZoomInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const ZoomIn: React.FC<ZoomInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  scale = 0.95,
  className = '',
  once = true,
  threshold = 0.1,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
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

export default ZoomIn;