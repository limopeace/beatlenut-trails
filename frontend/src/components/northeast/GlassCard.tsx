'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blurStrength?: 'sm' | 'md' | 'lg';
  bgOpacity?: number; 
  borderOpacity?: number;
  hover?: boolean;
  onClick?: () => void;
  initial?: any;
  animate?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
}

/**
 * GlassCard - A reusable glassmorphic component with customizable blur, opacity, and animations
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  blurStrength = 'md',
  bgOpacity = 0.3,
  borderOpacity = 0.5,
  hover = true,
  onClick,
  initial,
  animate,
  whileHover,
  whileTap,
  transition,
}) => {
  // Determine blur amount based on strength
  const getBlurFilter = () => {
    switch (blurStrength) {
      case 'sm': return 'backdrop-blur-sm'; // 4px
      case 'lg': return 'backdrop-blur-lg'; // 16px
      default: return 'backdrop-blur'; // 8px (medium)
    }
  };

  // Set up hover animation if enabled
  const hoverAnimation = hover 
    ? { 
        scale: 1.02, 
        y: -5, 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        ...whileHover 
      }
    : whileHover;

  // Default tap animation
  const tapAnimation = { 
    scale: 0.98,
    ...whileTap 
  };

  return (
    <motion.div 
      className={`
        relative rounded-lg overflow-hidden
        ${getBlurFilter()}
        ${className}
      `}
      style={{
        backgroundColor: `rgba(248, 246, 242, ${bgOpacity})`,
        border: `1px solid rgba(248, 246, 242, ${borderOpacity})`,
      }}
      initial={initial}
      animate={animate}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1],
        ...transition
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;