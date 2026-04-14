/**
 * API Configuration & Constants
 * Centralized API endpoints and configuration
 */

// API Base URL (from environment or default)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Endpoints (for consistency and easy updates)
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Products/Services
  PRODUCTS: {
    LIST: '/services',
    GET: (id) => `/services/${id}`,
    CREATE: '/services',
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    GET: (id) => `/orders/${id}`,
    LIST: '/orders',
    UPDATE_STATUS: (id) => `/orders/${id}`,
    INVOICE: (id) => `/orders/${id}/invoice`,
  },

  // Payments
  PAYMENTS: {
    CHECKOUT: '/payments/checkout',
    INTENT: '/payments/intent',
    CONFIRM: '/payments/confirm',
    HISTORY: '/payments/history',
    REFUND: (id) => `/payments/${id}/refund`,
  },

  // Leads
  LEADS: {
    CREATE: '/leads',
    LIST: '/leads',
    GET: (id) => `/leads/${id}`,
    UPDATE: (id) => `/leads/${id}`,
    GENERATE_PROPOSAL: (id) => `/leads/${id}/auto-proposal`,
    SEND_PROPOSAL: (id) => `/leads/${id}/send-proposal`,
    SEND_FOLLOWUP: (id) => `/leads/${id}/send-followup`,
    HIGH_PRIORITY: '/leads/admin/high-priority',
    ANALYTICS: '/leads/admin/analytics',
  },
};

// Request timeout
export const API_TIMEOUT = 15000; // 15 seconds

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  EXPONENTIAL_BACKOFF: true,
};

export default API_ENDPOINTS;
