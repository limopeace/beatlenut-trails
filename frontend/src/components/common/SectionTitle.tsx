import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle = ({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionTitleProps) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-deep-forest-green">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg max-w-3xl mx-auto text-earthy-brown">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;