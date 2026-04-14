const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const newsletterController = require('../controllers/newsletterController');

/**
 * Public Routes
 */

// Subscribe to newsletter
router.post('/subscribe', newsletterController.subscribe);

// Unsubscribe
router.post('/unsubscribe', newsletterController.unsubscribe);

/**
 * Admin Routes
 */

// Get subscribers
router.get('/', auth, adminOnly, newsletterController.getSubscribers);

// Send newsletter
router.post('/send', auth, adminOnly, newsletterController.sendNewsletter);

// Send template email
router.post('/send-template', auth, adminOnly, newsletterController.sendTemplateEmail);

// Update preferences
router.put('/:email/preferences', newsletterController.updatePreferences);

// Get analytics
router.get('/admin/analytics', auth, adminOnly, newsletterController.getAnalytics);

module.exports = router;
