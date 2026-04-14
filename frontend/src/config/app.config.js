/**
 * App-wide Constants & Configuration
 * Colors, sizes, strings, enums, etc.
 */

// App metadata
export const APP_NAME = 'Axentralab';
export const APP_DESCRIPTION = 'AI-Powered Digital Agency Solutions';
export const APP_URL = process.env.REACT_APP_URL || 'http://localhost:3000';

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Modal sizes
export const MODAL_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  OUTLINE: 'outline',
  GHOST: 'ghost',
};

// Toast positions
export const TOAST_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
};

// Toast durations (in ms)
export const TOAST_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 3500,
  LONG: 5000,
  PERSIST: 0, // Don't auto-close
};

// Debounce delays (in ms)
export const DEBOUNCE_DELAYS = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 1000,
};

// Breakpoints (should match CSS)
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

export default {
  APP_NAME,
  APP_DESCRIPTION,
  PAGINATION,
  MODAL_SIZES,
  BUTTON_VARIANTS,
};
