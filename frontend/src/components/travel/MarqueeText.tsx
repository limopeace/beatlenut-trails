'use client';

import React from 'react';

interface MarqueeTextProps {
  phrases: string[];
  className?: string;
  backgroundColor?: string;
}

const MarqueeText = ({ 
  phrases, 
  className = '',
  backgroundColor = 'bg-deep-forest-green'
}: MarqueeTextProps) => {
  return (
    <div className={`relative overflow-hidden ${backgroundColor} py-6 md:py-8 ${className}`}>
      <div className="whitespace-nowrap animate-marquee-slower inline-block">
        <div className="inline-flex items-center text-[28px] sm:text-[36px] md:text-[60px] lg:text-[80px] font-bold tracking-tight leading-none font-clash">
          {phrases.map((phrase, index) => (
            <React.Fragment key={`${phrase}-${index}`}>
              {phrase.includes('.') ? (
                <>
                  <span className="text-white uppercase">{phrase.split('.')[0]}.</span>
                  {phrase.split('.')[1] && 
                    <span className="text-sunrise-orange uppercase">{phrase.split('.')[1]}.</span>
                  }
                  <span className="mx-6">·</span>
                </>
              ) : (
                <>
                  <span className="text-white uppercase">{phrase}</span>
                  <span className="mx-6 text-white">·</span>
                </>
              )}
            </React.Fragment>
          ))}
          
          {/* Repeat the phrases to ensure continuous scrolling */}
          {phrases.map((phrase, index) => (
            <React.Fragment key={`${phrase}-repeat-${index}`}>
              {phrase.includes('.') ? (
                <>
                  <span className="text-white uppercase">{phrase.split('.')[0]}.</span>
                  {phrase.split('.')[1] && 
                    <span className="text-sunrise-orange uppercase">{phrase.split('.')[1]}.</span>
                  }
                  <span className="mx-6">·</span>
                </>
              ) : (
                <>
                  <span className="text-white uppercase">{phrase}</span>
                  <span className="mx-6 text-white">·</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeText;