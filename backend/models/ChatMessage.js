const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: String,
  
  // User Message
  userMessage: {
    content: String,
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed,
  },
  
  // AI Response
  aiResponse: {
    content: String,
    model: String,
    temperature: Number,
    tokens: {
      prompt: Number,
      completion: Number,
    },
    timestamp: { type: Date, default: Date.now },
  },
  
  // Conversation Context
  conversationStep: Number,
  
  // User Info (if provided)
  userEmail: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Lead conversion
  convertedToLead: Boolean,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  
  // Satisfaction
  userSatisfaction: {
    rating: Number, // 1-5
    feedback: String,
    timestamp: Date,
  },
  
}, { timestamps: true });

// Index for session queries
chatMessageSchema.index({ sessionId: 1 });
chatMessageSchema.index({ convertedToLead: 1 });
chatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
