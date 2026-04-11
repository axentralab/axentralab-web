const Newsletter = require('../models/Newsletter');
const Lead = require('../models/Lead');
const { sendNewsletter, sendTemplateEmail } = require('../utils/emailService');

/**
 * Subscribe to Newsletter
 */
exports.subscribe = async (req, res) => {
  try {
    const { email, name, preferences } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      // Re-subscribe if unsubscribed
      subscriber.subscribed = true;
      subscriber.subscriptionDate = new Date();
      subscriber.unsubscribeDate = null;
      if (preferences) subscriber.preferences = { ...subscriber.preferences, ...preferences };
    } else {
      subscriber = await Newsletter.create({
        email,
        name,
        preferences: preferences || {
          securityTips: true,
          businessUpdates: true,
          caseStudies: true,
          newFeatures: true,
        },
        source: 'website',
      });
    }

    await subscriber.save();

    console.log(`📬 Newsletter Subscription - ${email}`);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed!',
      data: subscriber,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Unsubscribe from Newsletter
 */
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      {
        subscribed: false,
        unsubscribeDate: new Date(),
        unsubscribeReason: req.body.reason || 'User requested',
      },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    console.log(`🔕 Newsletter Unsubscription - ${email}`);

    res.json({
      success: true,
      message: 'Unsubscribed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Newsletter to All Subscribers
 */
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, content, preferenceFilter } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content required' });
    }

    // Get active subscribers
    let subscribers = await Newsletter.find({ subscribed: true });

    // Filter by preferences if specified
    if (preferenceFilter) {
      subscribers = subscribers.filter(s => s.preferences[preferenceFilter] === true);
    }

    if (subscribers.length === 0) {
      return res.status(400).json({ success: false, message: 'No subscribers match criteria' });
    }

    const emails = subscribers.map(s => s.email);

    // Send newsletter
    const result = await sendNewsletter(emails, subject, content);

    // Update subscriber stats
    await Newsletter.updateMany(
      { email: { $in: emails } },
      {
        $set: { lastEmailDate: new Date() },
        $inc: { emailsReceived: 1 },
      }
    );

    console.log(`📧 Newsletter Sent - ${result.successful}/${result.total} recipients`);

    res.json({
      success: true,
      message: `Newsletter sent to ${result.successful} subscribers`,
      data: result,
    });
  } catch (error) {
    console.error('Newsletter sending error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Template Email
 */
exports.sendTemplateEmail = async (req, res) => {
  try {
    const { templateName, templateData, recipientFilter } = req.body;

    if (!templateName) {
      return res.status(400).json({ success: false, message: 'Template name required' });
    }

    // Get recipients
    let recipients = await Newsletter.find({ subscribed: true });

    // Filter if needed (e.g., by preference)
    if (recipientFilter) {
      recipients = recipients.filter(s => s.preferences[recipientFilter] === true);
    }

    if (recipients.length === 0) {
      return res.json({ success: false, message: 'No recipients found' });
    }

    const emails = recipients.map(s => s.email);

    // Send template
    const result = await sendTemplateEmail(emails, templateName, templateData);

    console.log(`📬 Template "${templateName}" sent to ${result.successful} recipients`);

    res.json({
      success: true,
      message: `Template sent to ${result.successful} subscribers`,
      data: result,
    });
  } catch (error) {
    console.error('Template email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Subscriber List
 */
exports.getSubscribers = async (req, res) => {
  try {
    const { subscribed = true, limit = 100, offset = 0 } = req.query;

    const filter = { subscribed: subscribed === 'true' };
    const subscribers = await Newsletter.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort('-createdAt');

    const total = await Newsletter.countDocuments(filter);

    res.json({
      success: true,
      data: subscribers,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Subscriber Preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const preferences = req.body;

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { preferences },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    res.json({ success: true, data: subscriber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Newsletter Analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ subscribed: true });
    const unsubscribed = await Newsletter.countDocuments({ subscribed: false });
    
    const engagement = await Newsletter.aggregate([
      {
        $match: { subscribed: true },
      },
      {
        $group: {
          _id: null,
          avgEmailsReceived: { $avg: '$emailsReceived' },
          avgEmailsOpened: { $avg: '$emailsOpened' },
          avgLinksClicked: { $avg: '$linksClicked' },
        },
      },
    ]);

    const stats = {
      totalSubscribers,
      unsubscribed,
      engagementRate: engagement[0]
        ? ((engagement[0].avgEmailsOpened / engagement[0].avgEmailsReceived) * 100).toFixed(2) + '%'
        : '0%',
      averageEmailsReceived: engagement[0]?.avgEmailsReceived || 0,
      bySource: await Newsletter.aggregate([
        {
          $match: { subscribed: true },
        },
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
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
