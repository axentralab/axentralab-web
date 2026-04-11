const sgMail = require('@sendgrid/mail');
const { Resend } = require('resend');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailFrom = process.env.EMAIL_FROM || 'noreply@axentralab.com';

/**
 * Send Email using SendGrid or Resend
 */
exports.sendEmail = async (to, subject, text, html = null) => {
  try {
    // Prefer SendGrid if available
    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to,
        from: emailFrom,
        subject,
        text,
        html: html || text,
      };

      await sgMail.send(msg);
      return { success: true, provider: 'sendgrid', messageId: msg.messageId };
    }
    // Fallback to Resend
    else if (resend) {
      const { data, error } = await resend.emails.send({
        from: emailFrom,
        to,
        subject,
        text,
        html: html || text,
      });

      if (error) throw error;
      return { success: true, provider: 'resend', messageId: data.id };
    }
    else {
      console.warn('No email service configured. Email not sent:', { to, subject });
      return { success: false, error: 'No email service configured' };
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

/**
 * Send Lead Confirmation Email
 */
exports.sendLeadConfirmation = async (lead) => {
  const html = `
    <h2>Thank You, ${lead.name}!</h2>
    <p>We received your inquiry for <strong>${lead.service}</strong>.</p>
    <p>Our team is analyzing your requirements and will send you a detailed proposal within 24 hours.</p>
    <p>In the meantime, feel free to check out our <a href="${process.env.CLIENT_URL}/portfolio">portfolio</a> or 
    <a href="${process.env.CLIENT_URL}/services">services</a>.</p>
    <p>Best regards,<br/>Axentralab Team</p>
  `;

  return exports.sendEmail(lead.email, 'We Received Your Inquiry!', 
    `Thank you for your inquiry, ${lead.name}. We'll be in touch soon!`, html);
};

/**
 * Send AI-Generated Proposal
 */
exports.sendProposal = async (lead, proposal) => {
  const html = `
    <h2>Your Project Proposal</h2>
    <p>Hi ${lead.name},</p>
    <p>Please find your customized project proposal below:</p>
    <hr />
    ${proposal.proposal.replace(/\n/g, '<br/>')}
    <hr />
    <p><a href="${process.env.CLIENT_URL}/dashboard">View in Dashboard</a></p>
  `;

  return exports.sendEmail(lead.email, `Project Proposal - ${lead.company}`, 
    proposal.proposal, html);
};

/**
 * Send Follow-up Email
 */
exports.sendFollowupEmail = async (lead, emailBody) => {
  const html = emailBody.replace(/\n/g, '<br/>');
  
  return exports.sendEmail(lead.email, `Following Up On Your ${lead.service} Inquiry`, 
    emailBody, html);
};

/**
 * Send Admin Notification
 */
exports.sendAdminNotification = async (adminEmail, title, content) => {
  const html = `
    <h2>${title}</h2>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${content.replace(/\n/g, '<br/>')}
    </div>
    <p><a href="${process.env.CLIENT_URL}/admin">View in Admin Panel</a></p>
  `;

  return exports.sendEmail(adminEmail, title, content, html);
};

/**
 * Send Newsletter
 */
exports.sendNewsletter = async (recipients, subject, content) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      ${content}
      <hr />
      <p style="color: #666; font-size: 12px;">
        You received this because you're subscribed to Axentralab updates.
        <a href="${process.env.CLIENT_URL}/unsubscribe">Unsubscribe</a>
      </p>
    </div>
  `;

  const promises = recipients.map(email => 
    exports.sendEmail(email, subject, content, html).catch(err => {
      console.error(`Failed to send to ${email}:`, err.message);
      return { email, error: err.message };
    })
  );

  const results = await Promise.all(promises);
  const successful = results.filter(r => r?.success).length;
  
  return {
    total: recipients.length,
    successful,
    failed: recipients.length - successful,
    details: results,
  };
};

/**
 * Send Verification Email
 */
exports.sendVerificationEmail = async (email, verificationLink) => {
  const html = `
    <h2>Verify Your Account</h2>
    <p>Click the link below to verify your email address:</p>
    <p><a href="${verificationLink}" style="background: #007bff; color: white; padding: 10px 20px; 
    text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
    <p>If you didn't create this account, you can ignore this email.</p>
  `;

  return exports.sendEmail(email, 'Verify Your Axentralab Account', 
    `Verify your account: ${verificationLink}`, html);
};

/**
 * Bulk send emails with template
 */
exports.sendTemplateEmail = async (recipients, templateName, templateData) => {
  const templates = {
    welcome: (name) => ({
      subject: `Welcome to Axentralab, ${name}!`,
      html: `<h2>Welcome, ${name}!</h2><p>We're excited to work with you.</p>`,
    }),
    orderConfirmation: (orderId) => ({
      subject: `Order Confirmed - #${orderId}`,
      html: `<h2>Order Confirmed</h2><p>Your order #${orderId} has been confirmed.</p>`,
    }),
    securityTip: () => ({
      subject: 'Weekly Security Tip',
      html: `<h2>Security Tip of the Week</h2><p>Check out our latest security insights.</p>`,
    }),
  };

  const template = templates[templateName];
  if (!template) throw new Error(`Template '${templateName}' not found`);

  const emailContent = template(templateData);
  return exports.sendNewsletter(recipients, emailContent.subject, emailContent.html);
};

module.exports = exports;
