const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

let bot = null;

if (botToken) {
  bot = new TelegramBot(botToken, { polling: false });
}

/**
 * Send Telegram notification to admin
 */
exports.notifyAdmin = async (message, parseMode = 'HTML') => {
  if (!bot || !adminChatId) {
    console.warn('Telegram bot not configured');
    return { success: false, error: 'Bot not configured' };
  }

  try {
    const result = await bot.sendMessage(adminChatId, message, { parse_mode: parseMode });
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notify on new high-value lead
 */
exports.notifyNewLeadAlert = async (lead, score) => {
  const priorityEmoji = {
    urgent: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '⚪',
  };

  const message = `
${priorityEmoji[score.priority]} <b>NEW ${score.priority.toUpperCase()} LEAD</b>

<b>Name:</b> ${lead.name}
<b>Company:</b> ${lead.company || 'Not provided'}
<b>Email:</b> ${lead.email}
<b>Service:</b> ${lead.service || 'Not specified'}
<b>Budget:</b> ${lead.budget || 'Not specified'}
<b>Score:</b> ${score.score}/100

<b>Recommendation:</b>
${score.recommendation}

<b>Message:</b>
${lead.message}

<a href="${process.env.CLIENT_URL}/admin/leads">View in Dashboard</a>
  `;

  return exports.notifyAdmin(message);
};

/**
 * Notify when proposal is sent
 */
exports.notifyProposalSent = async (lead, proposalId) => {
  const message = `
✅ <b>PROPOSAL SENT</b>

<b>To:</b> ${lead.name}
<b>Company:</b> ${lead.company}
<b>Time:</b> ${new Date().toLocaleString()}

Proposal ID: <code>${proposalId}</code>
  `;

  return exports.notifyAdmin(message);
};

/**
 * Notify when lead status changes
 */
exports.notifyLeadStatusChange = async (lead, oldStatus, newStatus) => {
  const message = `
🔄 <b>LEAD STATUS UPDATED</b>

<b>Lead:</b> ${lead.name}
<b>Status:</b> ${oldStatus} → <b>${newStatus}</b>
<b>Time:</b> ${new Date().toLocaleString()}

<a href="${process.env.CLIENT_URL}/admin/leads">View Lead</a>
  `;

  return exports.notifyAdmin(message);
};

/**
 * Notify on conversion
 */
exports.notifyLeadConverted = async (lead, order) => {
  const message = `
🎉 <b>LEAD CONVERTED!</b>

<b>Lead:</b> ${lead.name}
<b>Company:</b> ${lead.company}
<b>Order Value:</b> $${order.amount || 'TBD'}
<b>Time:</b> ${new Date().toLocaleString()}

This lead was worth the effort! 💰

<a href="${process.env.CLIENT_URL}/admin/orders">View Order</a>
  `;

  return exports.notifyAdmin(message);
};

/**
 * Send scheduled daily summary
 */
exports.sendDailySummary = async (stats) => {
  const message = `
📊 <b>DAILY SUMMARY</b>

<b>New Leads:</b> ${stats.newLeads}
<b>Proposals Sent:</b> ${stats.proposalsSent}
<b>Conversions:</b> ${stats.conversions}
<b>Revenue:</b> $${stats.revenue || 0}

<b>Lead Quality:</b>
• Urgent: ${stats.urgent || 0}
• High: ${stats.high || 0}
• Medium: ${stats.medium || 0}

<b>Next Actions:</b>
${stats.followups || 0} follow-ups due

<a href="${process.env.CLIENT_URL}/admin">Full Dashboard</a>
  `;

  return exports.notifyAdmin(message);
};

/**
 * Send system error alert
 */
exports.alertError = async (errorType, errorMessage) => {
  const message = `
⚠️ <b>SYSTEM ALERT</b>

<b>Error Type:</b> ${errorType}
<b>Message:</b> ${errorMessage}
<b>Time:</b> ${new Date().toLocaleString()}

Please check the system logs.
  `;

  return exports.notifyAdmin(message);
};

/**
 * Manual send message (for testing)
 */
exports.sendMessage = async (text) => {
  if (!bot || !adminChatId) {
    return { success: false, error: 'Bot not configured' };
  }

  try {
    const result = await bot.sendMessage(adminChatId, text);
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { success: false, error: error.message };
  }
};

module.exports = exports;
