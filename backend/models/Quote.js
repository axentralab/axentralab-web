const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  lead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lead',
  },
  
  // Form Input
  projectType: String,
  pages: Number,
  features: [String],
  securityLevel: String,
  deadline: String,
  
  // AI Generated Estimate
  estimatedCost: String,
  costBreakdown: mongoose.Schema.Types.Mixed,
  timeline: String,
  phases: [String],
  recommendedTechStack: [String],
  securityMeasures: [String],
  riskFactors: [String],
  confidence: Number,
  
  // Additional Estimates
  alternativeQuotes: [{
    name: String,
    cost: String,
    timeline: String,
    description: String,
  }],
  
  // Session Tracking
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  
  // Status
  status: { 
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'draft'
  },
  
  sentAt: Date,
  responseAt: Date,
  
  // Conversion
  convertedToLead: Boolean,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
