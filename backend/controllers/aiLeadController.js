const Lead = require('../models/Lead');
const { generateProposal, generateFollowupEmail } = require('../utils/aiService');
const { sendProposal, sendFollowupEmail, sendAdminNotification } = require('../utils/emailService');
const { scoreLead, getFollowupLeads, scoreAndSortLeads } = require('../utils/leadScoringService');
const { generateProposalPDF } = require('../utils/proposalPDFGenerator');
const { notifyNewLeadAlert, notifyProposalSent } = require('../utils/telegramService');
const { v4: uuidv4 } = require('uuid');

/**
 * Create Lead with AI Processing
 */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // Score the lead
    const leadScore = scoreLead(lead);
    lead.leadScore = leadScore;
    lead.automationHistory = [{
      action: 'lead_created',
      timestamp: new Date(),
      details: { source: lead.source },
    }];
    await lead.save();

    // Notify admin via Telegram
    await notifyNewLeadAlert(lead, leadScore);

    console.log(`✅ Lead Created - ID: ${lead._id}, ${leadScore.priority.toUpperCase()} PRIORITY`);

    res.status(201).json({
      success: true,
      data: lead,
      leadScore,
    });
  } catch (err) {
    console.error('Lead creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get All Leads
 */
exports.getLeads = async (req, res) => {
  try {
    const { status, priority, sortBy = 'createdAt' } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter['leadScore.priority'] = priority;

    const leads = await Lead.find(filter)
      .sort(`-${sortBy}`)
      .populate('orderId');

    // Apply scoring if not already scored
    const scored = leads.map(lead => ({
      ...lead.toObject(),
      leadScore: lead.leadScore?.score 
        ? lead.leadScore 
        : scoreLead(lead),
    }));

    res.json({
      success: true,
      data: scored,
      count: scored.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Single Lead
 */
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('orderId');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Auto-Generate Proposal for Lead
 */
exports.autoGenerateProposal = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if proposal already exists
    if (lead.proposal?.proposalId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal already generated for this lead',
        proposalId: lead.proposal.proposalId,
      });
    }

    // Generate AI proposal
    const proposal = await generateProposal(lead, lead.aiEstimate);

    // Generate PDF
    const pdf = await generateProposalPDF(lead, lead.aiEstimate || {}, proposal);

    // Save proposal to lead
    const proposalId = uuidv4();
    lead.proposal = {
      proposalId,
      content: proposal.proposal,
      pdfUrl: pdf.url,
      generatedAt: new Date(),
    };

    lead.automationHistory.push({
      action: 'proposal_generated',
      timestamp: new Date(),
      details: { proposalId, pdfFile: pdf.filename },
    });

    await lead.save();

    // Notify admin
    await notifyProposalSent(lead, proposalId);

    console.log(`📄 Proposal Generated - Lead: ${lead._id}, PDF: ${pdf.filename}`);

    res.json({
      success: true,
      message: 'Proposal generated successfully',
      data: {
        proposalId,
        content: proposal.proposal,
        pdfUrl: pdf.url,
      },
    });
  } catch (error) {
    console.error('Proposal generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Proposal Email
 */
exports.sendProposalEmail = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.proposal?.content) {
      return res.status(404).json({ success: false, message: 'Lead or proposal not found' });
    }

    // Send email
    const emailResult = await sendProposal(lead, lead.proposal);

    // Update lead
    lead.proposal.sentAt = new Date();
    lead.status = 'proposal-sent';
    lead.lastContactedAt = new Date();
    lead.automationHistory.push({
      action: 'proposal_sent',
      timestamp: new Date(),
      details: { emailProvider: emailResult.provider },
    });
    await lead.save();

    console.log(`📧 Proposal Sent - Lead: ${lead._id} (${lead.email})`);

    res.json({
      success: true,
      message: 'Proposal email sent',
      data: emailResult,
    });
  } catch (error) {
    console.error('Proposal email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send Auto Follow-up Email
 */
exports.sendFollowup = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Generate follow-up email
    const emailContent = await generateFollowupEmail(lead, lead.proposal);

    // Send email
    const emailResult = await sendFollowupEmail(lead, emailContent.emailBody);

    // Update lead
    lead.followUpSent = true;
    lead.followUpSentAt = new Date();
    lead.followUpCount = (lead.followUpCount || 0) + 1;
    lead.lastContactedAt = new Date();
    lead.automationHistory.push({
      action: 'followup_sent',
      timestamp: new Date(),
      details: { followupNumber: lead.followUpCount },
    });
    await lead.save();

    console.log(`📋 Follow-up Sent - Lead: ${lead._id}, Count: ${lead.followUpCount}`);

    res.json({
      success: true,
      message: 'Follow-up email sent',
      data: {
        emailBody: emailContent.emailBody,
        ...emailResult,
      },
    });
  } catch (error) {
    console.error('Follow-up error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Lead
 */
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Re-score if needed
    if (req.body.budget || req.body.company) {
      lead.leadScore = scoreLead(lead);
      await lead.save();
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete Lead
 */
exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get High-Priority Leads
 */
exports.getHighPriorityLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      'leadScore.priority': { $in: ['high', 'urgent'] },
      status: 'new',
    })
      .sort('-leadScore.score')
      .limit(10);

    res.json({
      success: true,
      data: leads,
      count: leads.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Leads Ready for Follow-up
 */
exports.getFollowupCandidates = async (req, res) => {
  try {
    const leads = await Lead.find({
      status: 'new',
      followUpSent: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Older than 24 hours
    }).limit(50);

    const followupLeads = getFollowupLeads(leads);

    res.json({
      success: true,
      data: followupLeads,
      count: followupLeads.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get Lead Scoring Report
 */
exports.getLeadAnalytics = async (req, res) => {
  try {
    const allLeads = await Lead.find().populate('orderId');

    const stats = {
      total: allLeads.length,
      byPriority: {
        urgent: allLeads.filter(l => l.leadScore?.priority === 'urgent').length,
        high: allLeads.filter(l => l.leadScore?.priority === 'high').length,
        medium: allLeads.filter(l => l.leadScore?.priority === 'medium').length,
        low: allLeads.filter(l => l.leadScore?.priority === 'low').length,
      },
      byStatus: {
        new: allLeads.filter(l => l.status === 'new').length,
        contacted: allLeads.filter(l => l.status === 'contacted').length,
        proposalSent: allLeads.filter(l => l.status === 'proposal-sent').length,
        qualified: allLeads.filter(l => l.status === 'qualified').length,
        won: allLeads.filter(l => l.status === 'won').length,
        lost: allLeads.filter(l => l.status === 'lost').length,
      },
      conversions: {
        total: allLeads.filter(l => l.convertedAt).length,
        totalValue: allLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0),
      },
      proposals: {
        generated: allLeads.filter(l => l.proposal?.proposalId).length,
        sent: allLeads.filter(l => l.proposal?.sentAt).length,
      },
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = exports;
