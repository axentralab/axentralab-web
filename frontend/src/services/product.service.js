/**
 * Products Service - Handles all product/service API calls
 * 
 * Usage:
 * import { productService } from '../services/product.service';
 * const { data } = await productService.getAll();
 */

import api from './api';

export const productService = {
  /**
   * Get all products/services
   * @param {Object} filters - { category, sortBy, page, limit }
   */
  getAll: async (filters = {}) => {
    return api.get('/services', { params: filters });
  },

  /**
   * Get single product by slug/id
   * @param {string} id - Product ID or slug
   */
  getById: async (id) => {
    return api.get(`/services/${id}`);
  },

  /**
   * Create new product (Admin only)
   * @param {Object} productData
   */
  create: async (productData) => {
    return api.post('/services', productData);
  },

  /**
   * Update product (Admin only)
   * @param {string} id - Product ID
   * @param {Object} productData
   */
  update: async (id, productData) => {
    return api.put(`/services/${id}`, productData);
  },

  /**
   * Delete product (Admin only)
   * @param {string} id - Product ID
   */
  delete: async (id) => {
    return api.delete(`/services/${id}`);
  },
};

export default productService;
