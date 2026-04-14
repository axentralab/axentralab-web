/**
 * Orders Service - Handles all order-related API calls
 * 
 * Usage:
 * import { orderService } from '../services/order.service';
 * const { data } = await orderService.getMyOrders();
 */

import api from './api';

export const orderService = {
  /**
   * Create new order
   * @param {Object} orderData - { items, total }
   */
  create: async (orderData) => {
    return api.post('/orders', orderData);
  },

  /**
   * Get user's orders
   * @param {Object} filters - { status, sortBy, page }
   */
  getMyOrders: async (filters = {}) => {
    return api.get('/orders/my-orders', { params: filters });
  },

  /**
   * Get single order details
   * @param {string} id - Order ID
   */
  getById: async (id) => {
    return api.get(`/orders/${id}`);
  },

  /**
   * Get all orders (Admin only)
   */
  getAllOrders: async (filters = {}) => {
    return api.get('/orders', { params: filters });
  },

  /**
   * Update order status (Admin only)
   * @param {string} id - Order ID
   * @param {string} status - New status
   */
  updateStatus: async (id, status) => {
    return api.put(`/orders/${id}`, { status });
  },

  /**
   * Download order invoice
   * @param {string} id - Order ID
   */
  downloadInvoice: async (id) => {
    return api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
  },
};

export default orderService;
