/**
 * Utility Functions - Format/Transform Data
 * Use these for consistent formatting across the app
 */

/**
 * Format currency value
 * @param {number} amount
 * @param {string} currency - Default: USD
 * @returns {string} Formatted price like "$1,234.56"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date
 * @param {Date|string} date
 * @param {string} format - 'short', 'long', 'full'
 * @returns {string}
 */
export const formatDate = (date, format = 'long') => {
  const d = new Date(date);
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
  };
  return d.toLocaleDateString('en-US', options[format] || options.long);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date
 * @returns {string}
 */
export const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

/**
 * Truncate text
 * @param {string} text
 * @param {number} limit
 * @returns {string}
 */
export const truncate = (text, limit = 50) => {
  if (!text || text.length <= limit) return text;
  return text.substring(0, limit).trim() + '...';
};

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase to readable text
 * @param {string} str - e.g., "firstName" → "First Name"
 * @returns {string}
 */
export const humanize = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

/**
 * Convert to slug
 * @param {string} text
 * @returns {string}
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

export default {
  formatCurrency,
  formatDate,
  formatTimeAgo,
  truncate,
  capitalize,
  humanize,
  slugify,
};
