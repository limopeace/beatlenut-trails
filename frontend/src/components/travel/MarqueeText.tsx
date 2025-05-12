'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeTextProps {
  phrases: string[];
  className?: string;
}

const MarqueeText = ({ phrases, className = '' }: MarqueeTextProps) => {
  return (
    <div className={`overflow-hidden bg-deep-forest-green py-8 ${className}`}>
      <motion.div 
        className="flex whitespace-nowrap text-4xl md:text-6xl font-bold"
        animate={{ 
          x: [0, -2000] 
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
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
                  <span className="text-white">{phrase.split('.')[0]}.</span>
                  {phrase.split('.')[1] && 
                    <span className="text-sunrise-orange">{phrase.split('.')[1]}.</span>
                  }
                </>
              ) : (
                <span className="text-white">{phrase}</span>
              )}
            </div>
          ))
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeText;