'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import NextImage from './NextImage';

interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  footer?: ReactNode;
  className?: string;
  showLearnMore?: boolean; // New prop to show "Learn More" text
}

const Card = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Card image',
  href,
  footer,
  className = '',
  showLearnMore = false,
}: CardProps) => {
  // A separate component for the card image to ensure consistent rendering
  const CardImage = () => (
    <>
      {imageSrc && (
        <div className="relative w-full h-48 md:h-56">
          <NextImage
            src={imageSrc}
            alt={imageAlt}
            fallbackSrc="/images/hero-placeholder.jpg"
            containerClassName="h-full w-full"
            fill
            className="object-cover rounded-t-lg"
            shimmer={true}
          />
        </div>
      )}
    </>
  );

  // A separate component for the card content to ensure consistent rendering
  const CardContent = () => (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-earthy-brown mb-2" style={{ fontFamily: 'var(--font-clash), sans-serif' }}>
        {title}
      </h3>
      <p className="text-dark-grey mb-4">{description}</p>
      
      {/* Only show the "Learn More" text within linked cards if specified */}
      {href && showLearnMore && (
        <div className="text-deep-forest-green font-medium hover:underline mt-2">
          Learn More
        </div>
      )}
      
      {/* Only show footer on non-linked cards */}
      {!href && footer && <div className="mt-auto">{footer}</div>}
    </div>
  );

  // When card has href, render as a link
  if (href) {
    return (
      <div className={`card ${className}`}>
        <Link href={href} className="block h-full">
          <CardImage />
          <CardContent />
        </Link>
      </div>
    );
  }

  // When card doesn't have href, render normally with potential footer
  return (
    <div className={`card ${className}`}>
      <CardImage />
      <CardContent />
    </div>
  );
};

export default Card;