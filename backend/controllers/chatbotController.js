const ChatMessage = require('../models/ChatMessage');
const Lead = require('../models/Lead');
const { generateChatbotResponse } = require('../utils/aiService');
const { v4: uuidv4 } = require('uuid');

/**
 * Send Message to Chatbot
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, userEmail, userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    const newSessionId = sessionId || uuidv4();

    // Generate AI response
    const aiResponse = await generateChatbotResponse(message, {
      sessionId: newSessionId,
      userEmail,
    });

    // Save to database
    const chatMessage = await ChatMessage.create({
      sessionId: newSessionId,
      userMessage: {
        content: message,
        timestamp: new Date(),
      },
      aiResponse: {
        content: aiResponse.message,
        model: process.env.AI_CHAT_MODEL || 'gpt-3.5-turbo',
        temperature: 0.7,
        tokens: aiResponse.usage,
      },
      userEmail,
      userId,
    });

    console.log(`💬 Chatbot: Message received from ${userEmail || 'anonymous'}`);

    res.json({
      success: true,
      data: {
        sessionId: newSessionId,
        message: aiResponse.message,
        chatId: chatMessage._id,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      fallback: 'I apologize, I encountered an issue. Please contact our team at contact@axentralab.com',
    });
  }
};

/**
 * Get Chat History
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId })
      .sort('createdAt')
      .limit(50);

    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Convert Chat Session to Lead
 */
exports.convertChatToLead = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { name, email, company, serviceInterest } = req.body;

    const messages = await ChatMessage.find({ sessionId }).sort('createdAt');
    if (!messages.length) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    // Compile conversation
    const conversationSummary = messages
      .map(m => `User: ${m.userMessage.content}\nAI: ${m.aiResponse.content}`)
      .join('\n\n');

    // Create lead
    const lead = await Lead.create({
      name,
      email,
      company,
      service: serviceInterest || 'Inquiry via Chat',
      message: conversationSummary,
      source: 'chatbot',
    });

    // Link chat to lead
    messages.forEach(msg => {
      msg.convertedToLead = true;
      msg.leadId = lead._id;
    });
    await ChatMessage.updateMany({ sessionId }, { convertedToLead: true, leadId: lead._id });

    console.log(`🔗 Chat Converted to Lead - Session: ${sessionId}, Lead: ${lead._id}`);

    res.json({
      success: true,
      message: 'Chat session converted to lead',
      data: lead,
    });
  } catch (error) {
    console.error('Chat to lead conversion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Rate Chat Response
 */
exports.rateChatResponse = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { rating, feedback } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1-5' });
    }

    const chatMessage = await ChatMessage.findByIdAndUpdate(
      chatId,
      {
        'userSatisfaction.rating': rating,
        'userSatisfaction.feedback': feedback,
        'userSatisfaction.timestamp': new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: chatMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Chat Analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const total = await ChatMessage.countDocuments();
    const converted = await ChatMessage.countDocuments({ convertedToLead: true });
    const avgRating = await ChatMessage.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$userSatisfaction.rating' },
        },
      },
    ]);

    const stats = {
      totalMessages: total,
      uniqueSessions: await ChatMessage.distinct('sessionId'),
      convertedToLeads: converted,
      conversionRate: ((converted / total) * 100).toFixed(2) + '%',
      averageRating: avgRating[0]?.avgRating || 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
