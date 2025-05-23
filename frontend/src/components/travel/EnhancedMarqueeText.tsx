'use client';

import React from 'react';

interface MarqueePhrase {
  text: string;
  isHighlighted?: boolean;
}

interface EnhancedMarqueeTextProps {
  phrases: MarqueePhrase[];
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  highlightColor?: string;
  separatorColor?: string;
  speed?: 'slow' | 'medium' | 'fast';
}

const EnhancedMarqueeText = ({ 
  phrases, 
  className = '',
  backgroundColor = 'bg-moss-green',
  textColor = 'text-deep-forest',
  highlightColor = 'text-pale-straw',
  separatorColor = 'text-pale-straw/60',
  speed = 'medium'
}: EnhancedMarqueeTextProps) => {
  // Determine animation speed class based on the speed prop
  const animationSpeedClass = {
    slow: 'animate-marquee-slower',
    medium: 'animate-marquee',
    fast: 'animate-marquee-fast',
  }[speed];

  return (
    <div className={`relative overflow-hidden ${backgroundColor} py-5 sm:py-6 md:py-8 lg:py-12 border-t border-forest-green/30 z-20 ${className}`}>
      <div className={`whitespace-nowrap ${animationSpeedClass} inline-block`}>
        <div className="inline-flex items-center text-[20px] xs:text-[24px] sm:text-[32px] md:text-[48px] lg:text-[64px] xl:text-[80px] font-normal tracking-tight leading-none font-clash">
          {phrases.map((phrase, index) => (
            <React.Fragment key={`${phrase.text}-${index}`}>
              <span 
                className={`
                  ${phrase.isHighlighted ? highlightColor : textColor} 
                  transition-all duration-300 hover:scale-105 hover:opacity-90
                  ${phrase.isHighlighted ? 'font-medium' : ''}
                `}
              >
                {phrase.text}
              </span>
              <span className={`mx-3 xs:mx-4 sm:mx-5 md:mx-6 ${separatorColor}`}>·</span>
            </React.Fragment>
          ))}
          
          {/* Repeat the phrases to ensure continuous scrolling */}
          {phrases.map((phrase, index) => (
            <React.Fragment key={`${phrase.text}-repeat-${index}`}>
              <span 
                className={`
                  ${phrase.isHighlighted ? highlightColor : textColor} 
                  transition-all duration-300 hover:scale-105 hover:opacity-90
                  ${phrase.isHighlighted ? 'font-medium' : ''}
                `}
              >
                {phrase.text}
              </span>
              <span className={`mx-3 xs:mx-4 sm:mx-5 md:mx-6 ${separatorColor}`}>·</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Add subtle gradient overlay at the edges for a fading effect */}
      <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-moss-green to-transparent z-10"></div>
      <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-moss-green to-transparent z-10"></div>
    </div>
  );
};

export default EnhancedMarqueeText;