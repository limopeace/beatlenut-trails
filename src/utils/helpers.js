/**
 * Collection of helper utility functions
 */

/**
 * Formats a date object to ISO string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Creates a slug from a string
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w-]+/g, '')  // Remove all non-word characters
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

/**
 * Generates a random ID
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
const generateId = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

module.exports = {
  formatDate,
  slugify,
  generateId
};