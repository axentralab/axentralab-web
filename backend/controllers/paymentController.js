const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// Create Stripe Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.serviceTitle} — ${item.plan}`,
          description: item.billing === 'monthly' ? 'Monthly subscription' : 'One-time payment',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/orders?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart?cancelled=1`,
      customer_email: req.user.email,
      metadata: { orderId: orderId || '', userId: req.user._id.toString() },
    });

    // Save session id to order
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { stripeSessionId: session.id });
    }

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create Payment Intent (for custom card UI)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // in dollars
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ success: true, clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Stripe Webhook
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
      });
    }
  }

  res.json({ received: true });
};
