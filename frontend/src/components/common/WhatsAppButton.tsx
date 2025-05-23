'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getWhatsAppLinkFromTemplate, createWhatsAppLink } from '@/utils/whatsappUtils';

interface WhatsAppButtonProps {
  template?: keyof typeof whatsAppTemplates;
  source?: string;
  product?: string;
  customPhone?: string;
  customText?: string;
  className?: string;
  label?: string;
  showIcon?: boolean;
  showText?: boolean;
  text?: string;
  position?: 'fixed' | 'static';
  size?: 'sm' | 'md' | 'lg';
}

// Import WhatsApp templates type
import { whatsAppTemplates } from '@/utils/whatsappUtils';

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  template = 'general',
  source,
  product,
  customPhone,
  customText,
  className = '',
  label = 'Contact us via WhatsApp',
  showIcon = true,
  showText = false,
  text = 'WhatsApp',
  position = 'static',
  size = 'md',
}) => {
  // Generate WhatsApp link
  const whatsAppLink = customPhone && customText
    ? createWhatsAppLink({
        phone: customPhone,
        text: customText,
        source,
        product,
      })
    : getWhatsAppLinkFromTemplate(template, source, product);

  // Size classes
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  // Position classes
  const positionClasses = position === 'fixed'
    ? 'fixed bottom-6 right-6 z-50'
    : '';

  // Base classes
  const baseClasses = 'bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-lg transition-colors';

  // Text version classes
  const textButtonClasses = showText
    ? 'px-4 py-3 rounded-full flex items-center'
    : sizeClasses[size];

  return (
    <a
      href={whatsAppLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${positionClasses} ${textButtonClasses} ${className}`}
      aria-label={label}
    >
      {showIcon && (
        <FontAwesomeIcon icon={faWhatsapp} className={showText ? `${iconSizeClasses.sm} mr-2` : iconSizeClasses[size]} />
      )}
      {showText && <span>{text}</span>}
    </a>
  );
};

export default WhatsAppButton;