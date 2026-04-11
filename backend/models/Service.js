const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  billing:  { type: String, enum: ['one-time', 'monthly', 'yearly'], default: 'one-time' },
  features: [String],
  stripePriceId: { type: String, default: '' },
});

const serviceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  category:    { type: String, required: true },
  icon:        { type: String, default: '⚡' },
  color:       { type: String, default: '#22C55E' },
  description: { type: String, required: true },
  features:    [String],
  plans:       [planSchema],
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
