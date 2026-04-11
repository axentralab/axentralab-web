/**
 * Lead Service - Handles leads and quotes API calls
 * 
 * Usage:
 * import { leadService } from '../services/lead.service';
 * const { data } = await leadService.submitLead(leadData);
 */

import api from './api';

export const leadService = {
  /**
   * Submit new lead/inquiry
   * @param {Object} leadData - { name, email, company, service, budget, message }
   */
  submitLead: async (leadData) => {
    return api.post('/leads', leadData);
  },

  /**
   * Get all leads (Admin only)
   * @param {Object} filters - { status, priority, sortBy }
   */
  getAllLeads: async (filters = {}) => {
    return api.get('/leads', { params: filters });
  },

  /**
   * Get single lead (Admin only)
   * @param {string} id - Lead ID
   */
  getLeadById: async (id) => {
    return api.get(`/leads/${id}`);
  },

  /**
   * Update lead (Admin only)
   * @param {string} id - Lead ID
   * @param {Object} data - Updated lead data
   */
  updateLead: async (id, data) => {
    return api.put(`/leads/${id}`, data);
  },

  /**
   * Generate proposal for lead (Admin only)
   * @param {string} id - Lead ID
   */
  generateProposal: async (id) => {
    return api.post(`/leads/${id}/auto-proposal`);
  },

  /**
   * Send proposal to lead (Admin only)
   * @param {string} id - Lead ID
   */
  sendProposal: async (id) => {
    return api.post(`/leads/${id}/send-proposal`);
  },

  /**
   * Send follow-up email (Admin only)
   * @param {string} id - Lead ID
   */
  sendFollowup: async (id) => {
    return api.post(`/leads/${id}/send-followup`);
  },

  /**
   * Get high priority leads (Admin only)
   */
  getHighPriorityLeads: async () => {
    return api.get('/leads/admin/high-priority');
  },

  /**
   * Get analytics (Admin only)
   */
  getAnalytics: async () => {
    return api.get('/leads/admin/analytics');
  },
};

export default leadService;
