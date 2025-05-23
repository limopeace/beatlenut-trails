/**
 * Utility functions for WhatsApp integration
 */

interface WhatsAppLinkOptions {
  phone: string;
  text?: string;
  source?: string;
  product?: string;
}

/**
 * Creates a WhatsApp chat link with proper encoding of message
 * @param options - WhatsApp link options
 * @returns Formatted WhatsApp URL
 */
export const createWhatsAppLink = (options: WhatsAppLinkOptions): string => {
  const { phone, text, source, product } = options;
  
  // Clean the phone number (remove any non-digit characters)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Base message
  let message = 'Hello BeatlenutTrails.';
  
  // Add source specific message
  if (source) {
    message += ` I'm contacting you from the ${source} page.`;
  }
  
  // Add product specific message
  if (product) {
    message += ` I'm interested in ${product}.`;
  }
  
  // Add custom text
  if (text) {
    message += ` ${text}`;
  }
  
  // Ensure the message ends with proper punctuation
  if (!message.endsWith('.') && !message.endsWith('!') && !message.endsWith('?')) {
    message += '.';
  }
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * WhatsApp templates for different CTAs
 */
export const whatsAppTemplates = {
  general: {
    phone: '919876543210',
    text: "I'm interested in learning more about your services."
  },
  travelPackages: {
    phone: '919876543210',
    text: "I'm interested in learning more about your travel packages."
  },
  bikeRentals: {
    phone: '919876543210',
    text: "I'm interested in your bike rental services."
  },
  bookTour: {
    phone: '919876543210',
    text: "I'd like to book a tour with BeatlenutTrails."
  },
  customTour: {
    phone: '919876543210',
    text: "I'm interested in creating a custom tour in Northeast India."
  },
  support: {
    phone: '919876543210',
    text: "I need some assistance with a booking or inquiry."
  }
};

/**
 * Creates a WhatsApp link for a specific template
 * @param templateName - Name of the template to use
 * @param source - Source page
 * @param productName - Optional product name
 * @returns Formatted WhatsApp URL
 */
export const getWhatsAppLinkFromTemplate = (
  templateName: keyof typeof whatsAppTemplates,
  source?: string,
  productName?: string
): string => {
  const template = whatsAppTemplates[templateName];
  
  return createWhatsAppLink({
    phone: template.phone,
    text: template.text,
    source,
    product: productName
  });
};