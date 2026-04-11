const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const chatbotController = require('../controllers/chatbotController');

/**
 * Public Routes
 */

// Send message to chatbot
router.post('/message', chatbotController.sendMessage);

// Get chat history
router.get('/history/:sessionId', chatbotController.getChatHistory);

// Rate chat response
router.post('/:chatId/rate', chatbotController.rateChatResponse);

// Convert chat to lead
router.post('/convert/:sessionId', chatbotController.convertChatToLead);

/**
 * Admin Routes
 */

// Get analytics
router.get('/admin/analytics', auth, adminOnly, chatbotController.getAnalytics);

module.exports = router;
