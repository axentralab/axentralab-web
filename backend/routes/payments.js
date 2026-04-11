const express = require('express');
const router = express.Router();
const { createCheckoutSession, createPaymentIntent, webhook, confirmPayment, getPaymentHistory, refundPayment } = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/checkout',       protect, createCheckoutSession);
router.post('/intent',         protect, createPaymentIntent);
router.post('/confirm',        protect, confirmPayment);
router.get('/history',         protect, getPaymentHistory);
router.post('/:id/refund',     protect, adminOnly, refundPayment);
router.post('/webhook',        webhook); // raw body, no auth

module.exports = router;
