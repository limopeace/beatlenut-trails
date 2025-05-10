'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  footer?: ReactNode;
  className?: string;
}

const Card = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Card image',
  href,
  footer,
  className = '',
}: CardProps) => {
  const cardContent = (
    <>
      {imageSrc && (
        <div className="relative w-full h-48 md:h-56">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-montserrat font-semibold text-earthy-brown mb-2">
          {title}
        </h3>
        <p className="text-dark-grey mb-4">{description}</p>
        {footer && <div className="mt-auto">{footer}</div>}
      </div>
    </>
  );

  return (
    <div className={`card ${className}`}>
      {href ? (
        <Link href={href} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default Card;