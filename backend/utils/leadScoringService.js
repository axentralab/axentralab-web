/**
 * Lead Scoring System
 * Automatically ranks leads based on multiple factors
 */

const budgetScores = {
  '0-1000': 10,
  '1000-3000': 40,
  '3000-5000': 70,
  '5000-10000': 85,
  '10000+': 100,
};

const companyTypeScores = {
  startup: 30,
  'small-business': 50,
  solopreneur: 20,
  'mid-size': 70,
  enterprise: 100,
};

const serviceTypeScores = {
  'website-design': 30,
  'web-development': 50,
  saas: 80,
  'security-audit': 75,
  'ai-integration': 85,
  maintenance: 20,
  consulting: 40,
};

/**
 * Calculate Lead Score
 * Returns score 0-100 and priority level
 */
exports.scoreLead = (lead) => {
  let score = 0;
  const factors = {};

  // 1. Budget Score (25 points max)
  const budgetScore = calculateBudgetScore(lead.budget);
  factors.budget = budgetScore;
  score += budgetScore * 0.25;

  // 2. Company Type Score (20 points max)
  const companyScore = companyTypeScores[lead.companyType] || 30;
  factors.companyType = companyScore;
  score += companyScore * 0.2;

  // 3. Service Type Score (20 points max)
  const serviceScore = serviceTypeScores[lead.service] || 40;
  factors.serviceType = serviceScore;
  score += serviceScore * 0.2;

  // 4. Email Quality (15 points max)
  const emailScore = isBusinessEmail(lead.email) ? 100 : 50;
  factors.emailQuality = emailScore;
  score += emailScore * 0.15;

  // 5. Message Quality (15 points max)
  const messageScore = calculateMessageQuality(lead.message);
  factors.messageQuality = messageScore;
  score += messageScore * 0.15;

  // 6. Time-based (5 points max) - Recent leads score higher
  const daysOld = Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24));
  const timeScore = Math.max(0, 100 - daysOld * 5);
  factors.recency = timeScore;
  score += timeScore * 0.05;

  // Determine priority
  const priority = determinePriority(score);

  return {
    score: Math.round(score),
    priority,
    factors,
    recommendation: getRecommendation(score, lead),
  };
};

/**
 * Calculate budget score (0-100)
 */
function calculateBudgetScore(budget) {
  if (!budget) return 40; // Unknown budget gets mid score

  const budgetStr = budget.toLowerCase();

  // Exact ranges
  for (const [range, score] of Object.entries(budgetScores)) {
    if (budgetStr.includes(range)) return score;
  }

  // Extract numbers from string
  const numbers = budgetStr.match(/\d+/g);
  if (!numbers) return 40;

  const amount = parseInt(numbers[0]) * (budgetStr.includes('k') ? 1000 : 1);

  if (amount < 1000) return 10;
  if (amount < 3000) return 40;
  if (amount < 5000) return 70;
  if (amount < 10000) return 85;
  return 100;
}

/**
 * Check if email is business email
 */
function isBusinessEmail(email) {
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
  const domain = email.split('@')[1];
  return !freeProviders.includes(domain);
}

/**
 * Score message quality (0-100)
 */
function calculateMessageQuality(message) {
  if (!message) return 0;

  let score = 50;

  // Longer messages = more serious inquiry
  if (message.length > 200) score += 20;
  if (message.length > 500) score += 15;

  // Specific keywords = higher intent
  const keywords = ['timeline', 'budget', 'requirement', 'deadline', 'asap', 'urgent', 'project', 'feature'];
  const contains = keywords.filter(kw => message.toLowerCase().includes(kw)).length;
  score += contains * 5;

  // Professional tone
  if (message.includes('?')) score += 10; // Questions show engagement
  if (message.match(/[.,]/g)?.length > message.length / 50) score += 5; // Good punctuation

  return Math.min(100, score);
}

/**
 * Determine priority based on score
 */
function determinePriority(score) {
  if (score >= 80) return 'urgent';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Get recommendation for this lead
 */
function getRecommendation(score, lead) {
  if (score >= 80) {
    return 'Send proposal immediately. High-value lead - schedule call ASAP.';
  }
  if (score >= 60) {
    return 'Send detailed proposal. Good potential lead - follow up within 24 hours.';
  }
  if (score >= 40) {
    return 'Send introduction email with case studies. Follow up in 3-5 days.';
  }
  return 'Nurture with email sequence. May need additional qualification.';
}

/**
 * Score multiple leads and sort by priority
 */
exports.scoreAndSortLeads = (leads) => {
  const scored = leads.map(lead => ({
    ...lead.toObject ? lead.toObject() : lead,
    leadScore: exports.scoreLead(lead),
  }));

  // Priority order
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

  return scored.sort((a, b) => {
    const priorityDiff = 
      priorityOrder[a.leadScore.priority] - priorityOrder[b.leadScore.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.leadScore.score - a.leadScore.score;
  });
};

/**
 * Get leads above threshold
 */
exports.getQualifiedLeads = (leads, minScore = 50) => {
  return leads
    .map(lead => ({
      ...lead.toObject ? lead.toObject() : lead,
      leadScore: exports.scoreLead(lead),
    }))
    .filter(lead => lead.leadScore.score >= minScore)
    .sort((a, b) => b.leadScore.score - a.leadScore.score);
};

/**
 * Get leads ready for follow-up
 */
exports.getFollowupLeads = (leads) => {
  return leads.filter(lead => {
    const score = exports.scoreLead(lead);
    const daysSinceCreated = Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24));
    
    // Only follow up leads that:
    // 1. Are at least 1 day old (gave them time to read first email)
    // 2. Haven't been followed up yet
    // 3. Status is still 'new'
    const shouldFollowUp = 
      daysSinceCreated >= 1 && 
      lead.status === 'new' && 
      !lead.followUpSent &&
      score.score >= 30; // Only qualified leads
    
    return shouldFollowUp;
  });
};

module.exports = exports;
