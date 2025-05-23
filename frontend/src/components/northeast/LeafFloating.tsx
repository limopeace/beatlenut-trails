'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LeafProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  initialX?: number;
  initialY?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  delay?: number;
}

interface LeafFloatingProps {
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Individual leaf component
const Leaf: React.FC<LeafProps> = ({
  size = 'md',
  color = '#2A4030',
  initialX = Math.random() * 100,
  initialY = Math.random() * -50,
  rotationSpeed = 1 + Math.random() * 2,
  floatSpeed = 15 + Math.random() * 30,
  delay = Math.random() * 5,
}) => {
  // Determine leaf size
  const getLeafSize = () => {
    switch (size) {
      case 'sm': return { width: 12, height: 15 };
      case 'lg': return { width: 24, height: 30 };
      default: return { width: 18, height: 22 }; // medium
    }
  };

  const { width, height } = getLeafSize();

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}px`,
        width,
        height,
        opacity: 0.6,
      }}
      animate={{
        y: ['0vh', '100vh'],
        x: [0, Math.sin(initialX) * 100],
        rotate: [0, 360 * rotationSpeed],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: floatSpeed,
        ease: "easeInOut",
        times: [0, 0.9, 1],
        repeat: Infinity,
        delay,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C7.58 2 4 5.58 4 10C4 16.56 12 22 12 22C12 22 20 16.56 20 10C20 5.58 16.42 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
};

/**
 * LeafFloating - A component that creates floating leaves animation
 * Perfect for background decoration in nature-themed websites
 */
const LeafFloating: React.FC<LeafFloatingProps> = ({
  count = 8,
  className = '',
  style = {},
}) => {
  const [leaves, setLeaves] = useState<React.ReactNode[]>([]);
  const [clientReady, setClientReady] = useState(false);

  // Setup leaves after component mounts
  useEffect(() => {
    setClientReady(true);
    
    const leafElements = Array.from({ length: count }).map((_, i) => {
      const leafSize = Math.random() > 0.7 ? 'lg' : Math.random() > 0.5 ? 'md' : 'sm';
      
      // Darker and lighter variations of forest green
      const colorVariations = [
        '#2A4030', // deep forest
        '#3B5E45', // medium forest
        '#4D7A5A', // light forest
        '#6D5D4B', // earth medium
      ];
      
      const color = colorVariations[Math.floor(Math.random() * colorVariations.length)];
      
      return (
        <Leaf
          key={i}
          size={leafSize}
          color={color}
          initialX={Math.random() * 100}
          initialY={Math.random() * -100}
          rotationSpeed={1 + Math.random() * 2}
          floatSpeed={20 + Math.random() * 40}
          delay={Math.random() * 10}
        />
      );
    });
    
    setLeaves(leafElements);
  }, [count]);

  if (!clientReady) return null;

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ ...style }}
    >
      {leaves}
    </div>
  );
};

export default LeafFloating;