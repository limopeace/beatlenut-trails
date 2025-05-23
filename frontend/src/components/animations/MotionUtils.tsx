'use client';

import React, { ReactNode } from 'react';
import { motion, useScroll, useTransform, MotionValue, Variant, Variants } from 'framer-motion';

/* 
 * ANIMATION PRESETS
 * Standardized animations to be used throughout the application
 */

// Transition presets
export const transitions = {
  fast: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  medium: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  slow: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  bounce: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] },
  spring: { type: 'spring', stiffness: 400, damping: 30 },
  softSpring: { type: 'spring', stiffness: 100, damping: 20 },
};

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.medium },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitions.medium },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: transitions.medium },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: transitions.medium },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: transitions.medium },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitions.medium },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: transitions.bounce },
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerFast = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerSlow = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Button animations
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
};

export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
};

/* 
 * ANIMATION COMPONENTS 
 * Reusable animation components for common patterns
 */

// Generic animation wrapper
interface AnimateProps {
  children: ReactNode;
  variants?: Variants;
  initial?: string | object;
  animate?: string | object;
  exit?: string | object;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  custom?: any;
}

export const Animate = ({
  children,
  variants = fadeIn,
  initial = "hidden",
  animate = "visible",
  exit,
  className = "",
  delay = 0,
  duration,
  once = true,
  threshold = 0.1,
  custom,
}: AnimateProps) => {
  // Apply custom duration if provided
  const customVariants = duration
    ? {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible?.transition,
            duration,
            delay,
          },
        },
      }
    : {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible?.transition,
            delay,
          },
        },
      };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      variants={customVariants}
      className={className}
      viewport={once ? { once, threshold } : undefined}
      custom={custom}
    >
      {children}
    </motion.div>
  );
};

// Parallax effect component
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  overflow?: boolean;
}

export const Parallax = ({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
  overflow = false,
}: ParallaxProps) => {
  const { scrollY } = useScroll();
  
  // Calculate transform based on direction
  let transform: MotionValue<string>;
  if (direction === 'up') {
    transform = useTransform(scrollY, [0, 1000], ['0%', `${-speed * 100}%`]);
  } else if (direction === 'down') {
    transform = useTransform(scrollY, [0, 1000], ['0%', `${speed * 100}%`]);
  } else if (direction === 'left') {
    transform = useTransform(scrollY, [0, 1000], ['0%', `${-speed * 100}%`]);
  } else {
    transform = useTransform(scrollY, [0, 1000], ['0%', `${speed * 100}%`]);
  }

  const transformProperty = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';

  return (
    <motion.div
      className={`${overflow ? '' : 'overflow-hidden'} ${className}`}
      style={{
        [direction === 'left' || direction === 'right' ? 'x' : 'y']: transform,
      }}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: number[];
  staggerChildren?: number;
  color?: string;
  once?: boolean;
  threshold?: number;
}

export const RevealText = ({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  ease = [0.25, 0.1, 0.25, 1],
  staggerChildren = 0.03,
  color,
  once = true,
  threshold = 0.1,
}: RevealTextProps) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease,
      },
    },
  };

  return (
    <motion.div
      className={`${className} inline-block`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1.5"
          variants={child}
          style={color ? { color } : undefined}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// ScrollReveal - reveals content as user scrolls
interface ScrollRevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal = ({
  children,
  variants = fadeInUp,
  className = '',
  delay = 0,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) => {
  // Apply delay if specified
  const customVariants = delay
    ? {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible?.transition,
            delay,
          },
        },
      }
    : variants;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
      variants={customVariants}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export const StaggerContainer = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
    >
      {children}
    </motion.div>
  );
};

// Animated gradient text (for flashy effect)
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  fromColor?: string;
  toColor?: string;
  direction?: string;
  animate?: boolean;
  duration?: number;
}

export const GradientText = ({
  children,
  className = '',
  fromColor = 'from-forest',
  toColor = 'to-sage',
  direction = 'bg-gradient-to-r',
  animate = false,
  duration = 3
}: GradientTextProps) => {
  if (!animate) {
    return (
      <span className={`${className} ${direction} ${fromColor} ${toColor} text-transparent bg-clip-text`}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`${className} text-transparent bg-clip-text ${direction} ${fromColor} ${toColor}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity,
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  );
};

// Export all components and utilities
export {
  motion,
  useScroll,
  useTransform
};