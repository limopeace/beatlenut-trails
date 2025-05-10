/**
 * Input sanitization utility
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {String} text - Text to sanitize
 * @returns {String} Sanitized text
 */
const sanitizeHtml = (text) => {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Strip all HTML tags from a string
 * @param {String} text - Text to sanitize
 * @returns {String} Text with HTML tags removed
 */
const stripHtml = (text) => {
  if (!text) return '';
  
  return String(text).replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * Normalize email address (lowercase and trim)
 * @param {String} email - Email to normalize
 * @returns {String} Normalized email
 */
const normalizeEmail = (email) => {
  if (!email) return '';
  
  return String(email).trim().toLowerCase();
};

/**
 * Remove special characters from string
 * @param {String} text - Text to sanitize
 * @returns {String} Sanitized text
 */
const removeSpecialChars = (text) => {
  if (!text) return '';
  
  return String(text).replace(/[^\w\s]/gi, '');
};

/**
 * Trim and normalize whitespace in text
 * @param {String} text - Text to normalize
 * @returns {String} Normalized text
 */
const normalizeText = (text) => {
  if (!text) return '';
  
  return String(text).trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize an object by applying sanitization to all string properties
 * @param {Object} obj - Object to sanitize
 * @param {Function} sanitizer - Sanitization function to apply
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj, sanitizer = sanitizeHtml) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizer(result[key]);
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObject(result[key], sanitizer);
    }
  }
  
  return result;
};

module.exports = {
  sanitizeHtml,
  stripHtml,
  normalizeEmail,
  removeSpecialChars,
  normalizeText,
  sanitizeObject
};