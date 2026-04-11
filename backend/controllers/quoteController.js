const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const { generateQuoteEstimate } = require('../utils/aiService');
const { telegramService } = require('../utils/telegramService');

/**
 * Calculate AI Quote from Form
 */
exports.calculateQuote = async (req, res) => {
  try {
    const { projectType, pages, features, securityLevel, deadline, sessionId } = req.body;

    // Validate input
    if (!projectType) {
      return res.status(400).json({ success: false, message: 'Project type required' });
    }

    // Generate AI estimate
    const aiEstimate = await generateQuoteEstimate({
      projectType,
      pages,
      features,
      security: securityLevel,
      deadline,
    });

    if (aiEstimate.error) {
      return res.status(500).json({ success: false, message: 'AI estimate failed', error: aiEstimate.error });
    }

    // Save quote
    const quote = await Quote.create({
      projectType,
      pages,
      features,
      securityLevel,
      deadline,
      ...aiEstimate,
      sessionId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Log automation event
    console.log(`📊 Quote Generated - ID: ${quote._id}, Type: ${projectType}, Cost: ${aiEstimate.estimatedCost}`);

    res.status(201).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Quote calculation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Quote by ID
 */
exports.getQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('leadId');
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List All Quotes
 */
exports.listQuotes = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Quote.countDocuments(filter);

    res.json({
      success: true,
      data: quotes,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Convert Quote to Lead
 */
exports.convertToLead = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    const { name, email, company, message } = req.body;

    // Create lead
    const lead = await Lead.create({
      name,
      email,
      company,
      service: quote.projectType,
      budget: parseFloat(quote.estimatedCost?.replace(/[^0-9]/g, '')) || undefined,
      message: message || `Quote generated for ${quote.projectType} project`,
      aiEstimate: {
        estimatedCost: quote.estimatedCost,
        timeline: quote.timeline,
        techStack: quote.recommendedTechStack,
        confidence: quote.confidence,
        generatedAt: quote.createdAt,
      },
      source: 'quote-calculator',
    });

    // Update quote
    quote.convertedToLead = true;
    quote.leadId = lead._id;
    quote.status = 'converted';
    await quote.save();

    // Log automation event
    console.log(`🔗 Quote Converted to Lead - Quote: ${quote._id}, Lead: ${lead._id}`);

    res.json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    console.error('Quote conversion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Quote
 */
exports.deleteQuote = async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quote deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Quote Analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const stats = {
      totalQuotes: await Quote.countDocuments(),
      convertedToLeads: await Quote.countDocuments({ convertedToLead: true }),
      averageCost: await Quote.aggregate([
        {
          $group: {
            _id: null,
            avgCost: { $avg: '$estimatedCost' },
          },
        },
      ]),
      byProjectType: await Quote.aggregate([
        {
          $group: {
            _id: '$projectType',
            count: { $sum: 1 },
            avgCost: { $avg: '$confidence' },
          },
        },
      ]),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
