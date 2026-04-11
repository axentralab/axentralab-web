const express = require('express');
const router = express.Router();
const { createCheckoutSession, createPaymentIntent, webhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/checkout',       protect, createCheckoutSession);
router.post('/intent',         protect, createPaymentIntent);
router.post('/webhook',        webhook); // raw body, no auth

module.exports = router;
