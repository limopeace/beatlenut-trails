'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  type?: 'heading' | 'paragraph';
  variant?: 'word' | 'letter' | 'character' | 'line';
  color?: string;
  className?: string;
  duration?: number;
  staggerChildren?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
  highlightWords?: string[];
  highlightColor?: string;
}

/**
 * AnimatedText - A component that animates text by words, letters, or characters
 * Perfect for creating engaging headings and text content
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  type = 'heading',
  variant = 'word',
  color,
  className = '',
  duration = 0.5,
  staggerChildren = 0.03,
  delay = 0,
  once = true,
  threshold = 0.1,
  highlightWords = [],
  highlightColor = 'text-golden-medium',
}) => {
  // Variants for animation
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

  // Animation for children based on type
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
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Split text by variant type
  const renderText = () => {
    const tagType = type === 'heading' ? 'h2' : 'p';
    const baseClass = `${className} ${color ? color : type === 'heading' ? 'text-forest-deep' : 'text-ink-medium'}`;

    // Handle different splitting methods
    if (variant === 'word') {
      const words = text.split(' ');
      return React.createElement(
        tagType,
        { className: baseClass },
        <motion.span
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, threshold }}
          className="inline-block"
        >
          {words.map((word, index) => {
            // Check if this word should be highlighted
            const isHighlighted = highlightWords.some(hw => word.includes(hw));
            const wordClass = isHighlighted ? highlightColor : '';
            
            return (
              <motion.span
                key={index}
                variants={child}
                className={`inline-block mr-1.5 ${wordClass}`}
              >
                {word}
              </motion.span>
            );
          })}
        </motion.span>
      );
    }

    if (variant === 'letter' || variant === 'character') {
      const letters = text.split('');
      return React.createElement(
        tagType,
        { className: baseClass },
        <motion.span
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, threshold }}
          className="inline-block"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.span>
      );
    }

    if (variant === 'line') {
      const lines = text.split('\n');
      return React.createElement(
        tagType,
        { className: baseClass },
        <motion.span
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, threshold }}
          className="inline-block"
        >
          {lines.map((line, index) => (
            <motion.div
              key={index}
              variants={child}
              className="block"
            >
              {line}
            </motion.div>
          ))}
        </motion.span>
      );
    }

    // Default fallback
    return React.createElement(
      tagType,
      { className: baseClass },
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once, threshold }}
        transition={{ duration, delay }}
      >
        {text}
      </motion.span>
    );
  };

  return renderText();
};

export default AnimatedText;