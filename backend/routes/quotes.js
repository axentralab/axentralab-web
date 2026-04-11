const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
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
router.get('/', auth, adminOnly, quoteController.listQuotes);

// Convert quote to lead
router.post('/:id/convert', auth, adminOnly, quoteController.convertToLead);

// Delete quote
router.delete('/:id', auth, adminOnly, quoteController.deleteQuote);

// Get analytics
router.get('/admin/analytics', auth, adminOnly, quoteController.getAnalytics);

module.exports = router;
