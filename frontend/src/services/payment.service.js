/**
 * Payment Service - Handles Stripe and payment-related API calls
 * 
 * Usage:
 * import { paymentService } from '../services/payment.service';
 * const { data } = await paymentService.createCheckoutSession(items);
 */

import api from './api';

export const paymentService = {
  /**
   * Create Stripe checkout session
   * @param {Array} items - Cart items
   * @param {string} orderId - Optional order ID
   */
  createCheckoutSession: async (items, orderId = null) => {
    return api.post('/payments/checkout', { items, orderId });
  },

  /**
   * Create payment intent for custom payment UI
   * @param {number} amount - Amount in USD
   */
  createPaymentIntent: async (amount) => {
    return api.post('/payments/intent', { amount });
  },

  /**
   * Confirm payment after checkout
   * @param {string} sessionId - Stripe session ID
   */
  confirmPayment: async (sessionId) => {
    return api.post('/payments/confirm', { sessionId });
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async () => {
    return api.get('/payments/history');
  },

  /**
   * Refund payment (Admin only)
   * @param {string} paymentId - Payment ID
   */
  refund: async (paymentId) => {
    return api.post(`/payments/${paymentId}/refund`);
  },
};

export default paymentService;
