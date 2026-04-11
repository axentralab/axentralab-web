/**
 * Authentication Service - Handles all auth-related API calls
 * 
 * Usage:
 * import { authService } from '../services/auth.service';
 * const { data } = await authService.register(email, password);
 */

import api from './api';

export const authService = {
  /**
   * Register new user
   * @param {Object} userData - { name, email, password, company }
   */
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    return api.get('/auth/me');
  },

  /**
   * Update user profile
   * @param {Object} profileData - { name, company, phone }
   */
  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  /**
   * Change password
   * @param {Object} data - { currentPassword, newPassword }
   */
  changePassword: async (data) => {
    return api.post('/auth/change-password', data);
  },

  /**
   * Logout (clear token from localStorage)
   */
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;
