const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  company: { type: String, default: '' },
  service: { type: String, default: '' },
  budget:  { type: String, default: '' },
  message: { type: String, required: true },
  
  // AI-Generated Fields
  aiEstimate: {
    estimatedCost: String,
    timeline: String,
    techStack: [String],
    confidence: Number,
    generatedAt: Date,
  },
  
  // Lead Scoring
  leadScore: {
    score: { type: Number, default: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    factors: mongoose.Schema.Types.Mixed,
    recommendation: String,
    scoredAt: Date,
  },
  
  // Proposal
  proposal: {
    proposalId: String,
    content: String,
    pdfUrl: String,
    generatedAt: Date,
    sentAt: Date,
  },
  
  // Lead Status & Tracking
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'proposal-sent', 'qualified', 'won', 'lost', 'nurturing'],
    default: 'new' 
  },
  source:  { type: String, default: 'website' },
  
  // Automation Tracking
  automationHistory: [{
    action: String,  // 'estimate_generated', 'proposal_sent', 'followup_sent', 'auto_contacted'
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed,
  }],
  
  followUpSent: { type: Boolean, default: false },
  followUpSentAt: Date,
  followUpCount: { type: Number, default: 0 },
  
  // Contact Tracking
  lastContactedAt: Date,
  responseReceived: { type: Boolean, default: false },
  responseDate: Date,
  
  // Sales
  convertedAt: Date,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  dealValue: Number,
  
}, { timestamps: true });

// Index for quick queries
leadSchema.index({ status: 1 });
leadSchema.index({ 'leadScore.priority': 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ 'leadScore.score': -1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
