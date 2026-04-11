/**
 * api.js — axios instance with global error interceptor.
 *
 * Handles:
 *  - 401 → redirect to /login
 *  - 429 → "Too many attempts" message surfaced via event
 *  - Network errors → friendly message
 *
 * Usage: import api from '../services/api'
 * Toast integration: listen to 'api:error' custom event in ToastProvider,
 * OR use the exported apiErrorMessage(err) helper in catch blocks.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

// ── Request interceptor: attach token ────────────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: global error handling ──────────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    const status  = err.response?.status;
    const message = err.response?.data?.message;

    // Rate limited
    if (status === 429) {
      const retryAfter = err.response?.headers?.['retry-after'];
      const detail = retryAfter ? ` Try again in ${retryAfter}s.` : '';
      window.dispatchEvent(new CustomEvent('api:error', {
        detail: { type: 'warning', message: `Too many attempts.${detail}` },
      }));
    }

    // Unauthorized — token expired or invalid
    if (status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      const authPages = ['/login', '/register'];
      if (!authPages.some(p => window.location.pathname.startsWith(p))) {
        window.location.href = '/login';
      }
    }

    // Network error (no response)
    if (!err.response) {
      window.dispatchEvent(new CustomEvent('api:error', {
        detail: { type: 'error', message: 'Network error. Please check your connection.' },
      }));
    }

    return Promise.reject(err);
  }
);

/**
 * Extract a human-readable error message from an axios error.
 * Use this in local catch blocks where you want a specific message.
 */
export function apiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.status === 429) return 'Too many attempts. Please wait a moment.';
  if (err.response?.status === 401) return 'Session expired. Please log in again.';
  if (!err.response) return 'Network error. Please check your connection.';
  return err.response?.data?.message || fallback;
}

export default api;