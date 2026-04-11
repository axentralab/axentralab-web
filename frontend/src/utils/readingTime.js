/**
 * Estimates reading time in minutes.
 * ~200 words per minute average reading speed.
 * @param {string} text
 * @returns {number} minutes (minimum 1)
 */
export function readingTime(text = '') {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}