const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const quoteController = require('../controllers/quoteController');

/**
 * Public Routes
 */

// Calculate quote (AI-powered)
router.post('/', quoteController.calculateQuote);

// Get quote by ID
router.get('/:id', quoteController.getQuote);

/**
 * Admin Routes
 */

// List all quotes
router.get('/', protect, adminOnly, quoteController.listQuotes);

// Convert quote to lead
router.post('/:id/convert', protect, adminOnly, quoteController.convertToLead);

// Delete quote
router.delete('/:id', protect, adminOnly, quoteController.deleteQuote);

// Get analytics
router.get('/admin/analytics', protect, adminOnly, quoteController.getAnalytics);

module.exports = router;
