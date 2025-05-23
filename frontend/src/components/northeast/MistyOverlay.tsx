'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MistyOverlayProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  animate?: boolean;
  from?: 'top' | 'bottom' | 'left' | 'right';
  style?: React.CSSProperties;
}

/**
 * MistyOverlay - A component to add misty fog effects on images or content
 * Perfect for creating that Northeast India misty hills aesthetic
 */
const MistyOverlay: React.FC<MistyOverlayProps> = ({
  children,
  className = '',
  intensity = 'medium',
  animate = true,
  from = 'top',
  style,
}) => {
  // Determine gradient direction based on 'from' prop
  const getGradientDirection = () => {
    switch (from) {
      case 'bottom': return 'to top';
      case 'left': return 'to right';
      case 'right': return 'to left';
      default: return 'to bottom'; // top is default
    }
  };

  // Determine opacity based on intensity
  const getOpacityValues = () => {
    switch (intensity) {
      case 'light': return { start: 0.1, end: 0.01 };
      case 'heavy': return { start: 0.5, end: 0.2 };
      default: return { start: 0.3, end: 0.05 }; // medium is default
    }
  };

  const { start, end } = getOpacityValues();
  const direction = getGradientDirection();

  // Animation for the misty effect
  const mistyAnimation = animate ? {
    opacity: [start, start * 1.2, start],
    scale: [1, 1.01, 1],
  } : undefined;

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Main content */}
      {children}
      
      {/* Misty overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(${direction}, rgba(168, 176, 184, ${start}), rgba(168, 176, 184, ${end}))`,
        }}
        animate={mistyAnimation}
        transition={{ 
          duration: 6, 
          ease: "easeInOut", 
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default MistyOverlay;