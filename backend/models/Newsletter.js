const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
  },
  
  name: String,
  
  // Subscription Details
  subscribed: { type: Boolean, default: true },
  subscriptionDate: { type: Date, default: Date.now },
  unsubscribeDate: Date,
  unsubscribeReason: String,
  
  // Preferences
  preferences: {
    securityTips: { type: Boolean, default: true },
    businessUpdates: { type: Boolean, default: true },
    caseStudies: { type: Boolean, default: true },
    newFeatures: { type: Boolean, default: true },
  },
  
  // Engagement
  emailsReceived: { type: Number, default: 0 },
  emailsOpened: { type: Number, default: 0 },
  linksClicked: { type: Number, default: 0 },
  unsubscribeLink: String,
  
  // Lead Association
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Last Activity
  lastEmailDate: Date,
  lastOpenDate: Date,
  
  // Source
  source: { 
    type: String,
    enum: ['lead_form', 'contact_form', 'checkout', 'manual', 'website'],
    default: 'website'
  },
  
}, { timestamps: true });

newsletterSchema.index({ email: 1 });
newsletterSchema.index({ subscribed: 1 });
newsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
