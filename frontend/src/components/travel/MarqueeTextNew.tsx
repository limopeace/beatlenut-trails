'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeTextNewProps {
  phrases: string[];
  className?: string;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'medium' | 'fast';
  textSize?: 'sm' | 'md' | 'lg';
}

const MarqueeTextNew = ({ 
  phrases, 
  className = '', 
  direction = 'left', 
  speed = 'medium',
  textSize = 'md'
}: MarqueeTextNewProps) => {
  
  // Determine animation speed
  const getDuration = () => {
    switch (speed) {
      case 'slow': return 40;
      case 'fast': return 15;
      default: return 25;
    }
  };
  
  // Determine text size classes
  const getTextSizeClasses = () => {
    switch (textSize) {
      case 'sm': return 'text-2xl md:text-3xl';
      case 'lg': return 'text-4xl md:text-6xl';
      default: return 'text-3xl md:text-5xl';
    }
  };
  
  // Animation properties
  const duration = getDuration();
  const textSizeClasses = getTextSizeClasses();
  const directionValue = direction === 'left' ? [0, -2000] : [-2000, 0];

  return (
    <div className={`overflow-hidden bg-forest-deep py-12 ${className}`}>
      <div className="relative flex">
        {/* First marquee for seamless loop */}
        <motion.div 
          className={`flex whitespace-nowrap ${textSizeClasses} font-montserrat font-light tracking-wider`}
          animate={{ 
            x: directionValue
          }}
          transition={{ 
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          }}
        >
          {[...Array(5)].map((_, repeat) => (
            phrases.map((phrase, index) => (
              <div 
                key={`${phrase}-${index}-${repeat}`} 
                className="px-8 md:px-16 inline-block"
              >
                {phrase.includes('.') ? (
                  <>
                    <span className="text-stone">{phrase.split('.')[0]}.</span>
                    {phrase.split('.')[1] && 
                      <span className="text-moss">{phrase.split('.')[1]}.</span>
                    }
                  </>
                ) : (
                  <span className="text-stone">{phrase}</span>
                )}
              </div>
            ))
          ))}
        </motion.div>
        
        {/* Second identical marquee for seamless loop */}
        <motion.div 
          className={`flex whitespace-nowrap ${textSizeClasses} font-montserrat font-light tracking-wider absolute top-0 left-0`}
          animate={{ 
            x: direction === 'left' ? [2000, 0] : [0, 2000]
          }}
          transition={{ 
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          }}
        >
          {[...Array(5)].map((_, repeat) => (
            phrases.map((phrase, index) => (
              <div 
                key={`${phrase}-${index}-${repeat}-dup`} 
                className="px-8 md:px-16 inline-block"
              >
                {phrase.includes('.') ? (
                  <>
                    <span className="text-stone">{phrase.split('.')[0]}.</span>
                    {phrase.split('.')[1] && 
                      <span className="text-moss">{phrase.split('.')[1]}.</span>
                    }
                  </>
                ) : (
                  <span className="text-stone">{phrase}</span>
                )}
              </div>
            ))
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeTextNew;