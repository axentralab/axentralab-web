const mongoose = require('mongoose');

const automationJobSchema = new mongoose.Schema({
  // Job Type
  jobType: {
    type: String,
    enum: [
      'generate_quote',
      'generate_proposal',
      'send_proposal',
      'send_followup',
      'send_newsletter',
      'send_daily_summary',
      'score_leads',
      'generate_blog_ideas',
      'auto_respond_inquiry',
    ],
  },
  
  // Job Configuration
  targetId: mongoose.Schema.Types.ObjectId,  // Lead ID, Newsletter ID, etc.
  targetModel: String,  // 'Lead', 'Newsletter', etc.
  
  // Job Details
  config: mongoose.Schema.Types.Mixed,
  
  // Scheduling
  scheduledFor: Date,
  executeAt: Date,
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly', 'custom'],
    default: 'once',
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'executing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  
  // Execution History
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  
  executionLogs: [{
    timestamp: { type: Date, default: Date.now },
    status: String,
    error: String,
    output: mongoose.Schema.Types.Mixed,
  }],
  
  completedAt: Date,
  
  // Retry Logic
  nextRetryAt: Date,
  lastError: String,
  
  // Result
  result: mongoose.Schema.Types.Mixed,
  
}, { timestamps: true });

// Index for job queries
automationJobSchema.index({ status: 1, scheduledFor: 1 });
automationJobSchema.index({ jobType: 1 });
automationJobSchema.index({ targetId: 1 });
automationJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AutomationJob', automationJobSchema);
