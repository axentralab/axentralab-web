const {
  executeScheduledJobs,
  scheduleAutoFollowups,
  scheduleAutoProposals,
  getJobStats,
} = require('./automationService');

const automationIntervals = [];

/**
 * Initialize Automation Scheduler
 * Call this once when the server starts
 */
exports.initializeScheduler = () => {
  console.log('🤖 Initializing AI Automation Scheduler...');

  /**
   * Execute Jobs Every 5 Minutes
   */
  const jobExecutor = setInterval(async () => {
    try {
      await executeScheduledJobs();
    } catch (error) {
      console.error('Job executor error:', error.message);
    }
  }, 5 * 60 * 1000); // 5 minutes

  automationIntervals.push(jobExecutor);

  /**
   * Schedule Follow-ups Every Hour
   */
  const followupScheduler = setInterval(async () => {
    try {
      await scheduleAutoFollowups();
    } catch (error) {
      console.error('Follow-up scheduler error:', error.message);
    }
  }, 60 * 60 * 1000); // 1 hour

  automationIntervals.push(followupScheduler);

  /**
   * Schedule Proposals Every 30 Minutes
   */
  const proposalScheduler = setInterval(async () => {
    try {
      await scheduleAutoProposals();
    } catch (error) {
      console.error('Proposal scheduler error:', error.message);
    }
  }, 30 * 60 * 1000); // 30 minutes

  automationIntervals.push(proposalScheduler);

  console.log('✅ Automation Scheduler initialized');
};

/**
 * Stop Scheduler
 */
exports.stopScheduler = () => {
  automationIntervals.forEach(interval => clearInterval(interval));
  console.log('🛑 Automation Scheduler stopped');
};

/**
 * Get Scheduler Status
 */
exports.getSchedulerStatus = async () => {
  const stats = await getJobStats();
  return {
    status: 'running',
    jobs: stats,
    timestamp: new Date(),
  };
};

module.exports = exports;
