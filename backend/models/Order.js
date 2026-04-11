const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  service:     { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceTitle: String,
  plan:        String,
  price:       Number,
  billing:     String,
  quantity:    { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items:       [orderItemSchema],
  total:       { type: Number, required: true },
  status:      { type: String, enum: ['pending', 'paid', 'active', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'stripe' },
  stripePaymentIntentId: { type: String, default: '' },
  stripeSessionId: { type: String, default: '' },
  notes:       { type: String, default: '' },
  invoiceUrl:  { type: String, default: '' },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'AX-' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
