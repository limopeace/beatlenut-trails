'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  background?: 'pale-straw' | 'moss-green' | 'forest-green' | 'deep-forest' | 'white' | 'none';
  containerClassName?: string;
  id?: string;
  withAnimation?: boolean;
  noPadding?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  background = 'pale-straw',
  containerClassName = '',
  id,
  withAnimation = true,
  noPadding = false,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getBackgroundColor = () => {
    switch (background) {
      case 'pale-straw':
        return 'bg-pale-straw';
      case 'moss-green':
        return 'bg-moss-green';
      case 'forest-green':
        return 'bg-forest-green';
      case 'deep-forest':
        return 'bg-deep-forest';
      case 'white':
        return 'bg-white';
      case 'none':
        return '';
      default:
        return 'bg-pale-straw';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section
      id={id}
      className={`relative ${getBackgroundColor()} ${noPadding ? '' : 'py-16 md:py-24'} ${className}`}
    >
      {withAnimation ? (
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl ${containerClassName}`}
        >
          {children}
        </motion.div>
      ) : (
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl ${containerClassName}`}>{children}</div>
      )}
    </section>
  );
};

export default SectionContainer;