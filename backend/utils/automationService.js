const AutomationJob = require('../models/AutomationJob');
const Lead = require('../models/Lead');
const { 
  generateProposal, 
  generateFollowupEmail 
} = require('./aiService');
const { 
  sendProposal, 
  sendFollowupEmail,
  sendNewsletter,
} = require('./emailService');
const { scoreLead, getFollowupLeads } = require('./leadScoringService');
const { generateProposalPDF } = require('./proposalPDFGenerator');
const { notifyProposalSent } = require('./telegramService');
const { v4: uuidv4 } = require('uuid');

/**
 * Execute Automation Jobs
 * Run this on a schedule (e.g., every 5 minutes)
 */
exports.executeScheduledJobs = async () => {
  try {
    const jobs = await AutomationJob.find({
      status: 'pending',
      scheduledFor: { $lte: new Date() },
    }).limit(10);

    if (jobs.length === 0) return { executed: 0 };

    let executed = 0;

    for (const job of jobs) {
      try {
        await executeJob(job);
        executed++;
      } catch (error) {
        console.error(`Job execution error (${job._id}):`, error.message);
        job.status = 'failed';
        job.lastError = error.message;
        job.attempts++;
        
        // Retry logic
        if (job.attempts < job.maxAttempts) {
          job.status = 'pending';
          job.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000); // Retry in 5 min
        }
        
        job.executionLogs.push({
          timestamp: new Date(),
          status: 'error',
          error: error.message,
        });
        
        await job.save();
      }
    }

    console.log(`✅ Automation Jobs Executed: ${executed}`);
    return { executed };
  } catch (error) {
    console.error('Job scheduler error:', error);
    throw error;
  }
};

/**
 * Execute individual job
 */
async function executeJob(job) {
  job.status = 'executing';
  job.attempts++;
  await job.save();

  let result;

  switch (job.jobType) {
    case 'generate_proposal':
      result = await generateProposalJob(job);
      break;

    case 'send_proposal':
      result = await sendProposalJob(job);
      break;

    case 'send_followup':
      result = await sendFollowupJob(job);
      break;

    case 'score_leads':
      result = await scoreLeadsJob(job);
      break;

    case 'auto_respond_inquiry':
      result = await autoRespondJob(job);
      break;

    case 'send_newsletter':
      result = await sendNewsletterJob(job);
      break;

    default:
      throw new Error(`Unknown job type: ${job.jobType}`);
  }

  job.status = 'completed';
  job.result = result;
  job.completedAt = new Date();
  job.executionLogs.push({
    timestamp: new Date(),
    status: 'success',
    output: result,
  });

  await job.save();
  return result;
}

/**
 * Auto-Generate Proposal for Lead
 */
async function generateProposalJob(job) {
  const lead = await Lead.findById(job.targetId);
  if (!lead) throw new Error('Lead not found');

  if (lead.proposal?.proposalId) {
    return { skipped: true, reason: 'Proposal already exists' };
  }

  const proposal = await generateProposal(lead, lead.aiEstimate || {});
  const pdf = await generateProposalPDF(lead, lead.aiEstimate || {}, proposal);

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
  await notifyProposalSent(lead, proposalId);

  return { proposalId, pdfFile: pdf.filename };
}

/**
 * Send Proposal Email
 */
async function sendProposalJob(job) {
  const lead = await Lead.findById(job.targetId);
  if (!lead || !lead.proposal?.content) {
    throw new Error('Lead or proposal not found');
  }

  const emailResult = await sendProposal(lead, lead.proposal);

  lead.proposal.sentAt = new Date();
  lead.status = 'proposal-sent';
  lead.lastContactedAt = new Date();
  lead.automationHistory.push({
    action: 'proposal_sent',
    timestamp: new Date(),
    details: { emailProvider: emailResult.provider },
  });

  await lead.save();

  return { sent: true, email: lead.email };
}

/**
 * Send Follow-up Email
 */
async function sendFollowupJob(job) {
  const lead = await Lead.findById(job.targetId);
  if (!lead) throw new Error('Lead not found');

  const emailContent = await generateFollowupEmail(lead, lead.proposal);
  const emailResult = await sendFollowupEmail(lead, emailContent.emailBody);

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

  return { sent: true, followupNumber: lead.followUpCount };
}

/**
 * Score All Leads
 */
async function scoreLeadsJob(job) {
  const leads = await Lead.find({ 'leadScore.score': { $exists: false } });

  let scored = 0;
  for (const lead of leads) {
    lead.leadScore = scoreLead(lead);
    await lead.save();
    scored++;
  }

  return { leadsScored: scored };
}

/**
 * Auto-respond to New Inquiry
 */
async function autoRespondJob(job) {
  // Implementation depends on your requirements
  // This could send an initial acknowledgment email
  return { acknowledged: true };
}

/**
 * Send Newsletter
 */
async function sendNewsletterJob(job) {
  const { subject, content, recipients } = job.config;
  const result = await sendNewsletter(recipients, subject, content);
  return result;
}

/**
 * Schedule Auto-Follow-ups for Qualified Leads
 */
exports.scheduleAutoFollowups = async () => {
  try {
    const leads = await Lead.find({
      status: 'proposal-sent',
      followUpSent: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Older than 24 hours
    });

    for (const lead of leads) {
      // Check if job already scheduled
      const existingJob = await AutomationJob.findOne({
        jobType: 'send_followup',
        targetId: lead._id,
        status: { $nin: ['completed', 'failed'] },
      });

      if (!existingJob && lead.followUpCount < 3) {
        await AutomationJob.create({
          jobType: 'send_followup',
          targetId: lead._id,
          targetModel: 'Lead',
          scheduledFor: new Date(),
          frequency: 'once',
        });
      }
    }

    console.log(`📅 Follow-ups Scheduled: ${leads.length}`);
    return { scheduled: leads.length };
  } catch (error) {
    console.error('Schedule follow-ups error:', error);
    throw error;
  }
};

/**
 * Schedule Auto-Proposal Generation for High-Score Leads
 */
exports.scheduleAutoProposals = async () => {
  try {
    const leads = await Lead.find({
      'leadScore.score': { $gte: 70 },
      'proposal.proposalId': { $exists: false },
    }).limit(20);

    for (const lead of leads) {
      const existingJob = await AutomationJob.findOne({
        jobType: 'generate_proposal',
        targetId: lead._id,
        status: { $nin: ['completed', 'failed'] },
      });

      if (!existingJob) {
        await AutomationJob.create({
          jobType: 'generate_proposal',
          targetId: lead._id,
          targetModel: 'Lead',
          scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // Schedule in 30 min
          frequency: 'once',
        });
      }
    }

    console.log(`📋 Auto-Proposals Scheduled: ${leads.length}`);
    return { scheduled: leads.length };
  } catch (error) {
    console.error('Schedule proposals error:', error);
    throw error;
  }
};

/**
 * Get Job Statistics
 */
exports.getJobStats = async () => {
  try {
    const stats = {
      pending: await AutomationJob.countDocuments({ status: 'pending' }),
      executing: await AutomationJob.countDocuments({ status: 'executing' }),
      completed: await AutomationJob.countDocuments({ status: 'completed' }),
      failed: await AutomationJob.countDocuments({ status: 'failed' }),
      byType: await AutomationJob.aggregate([
        {
          $group: {
            _id: '$jobType',
            count: { $sum: 1 },
            successful: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
      ]),
    };

    return stats;
  } catch (error) {
    console.error('Job stats error:', error);
    throw error;
  }
};

module.exports = exports;
