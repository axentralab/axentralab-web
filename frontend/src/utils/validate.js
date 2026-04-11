/**
 * Validation Utilities
 * Common validation functions
 */

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { isValid, score, feedback }
 */
export const validatePassword = (password) => {
  if (!password) return { isValid: false, score: 0, feedback: 'Password required' };
  
  let score = 0;
  const feedback = [];

  // Length checks
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Include special characters');

  return {
    isValid: score >= 4,
    score,
    strength: score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong',
    feedback,
  };
};

/**
 * Validate phone number (basic)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate required field
 * @param {*} value
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return !!value;
};

/**
 * Validate minimum length
 * @param {string} value
 * @param {number} length
 * @returns {boolean}
 */
export const validateMinLength = (value, length) => {
  return value && value.length >= length;
};

/**
 * Form validation helper - validates multiple fields
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${rule.label || field} is required`;
      continue;
    }

    if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    }

    if (rule.type === 'phone' && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be at most ${rule.maxLength} characters`;
    }

    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.error || `${field} is invalid`;
    }
  }

  return errors;
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  validateRequired,
  validateMinLength,
  validateForm,
};
