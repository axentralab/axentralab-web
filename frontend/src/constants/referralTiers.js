/**
 * Referral Tier Levels and Benefits
 * Progressive system: earn more as you grow your network
 */

export const REFERRAL_TIERS = {
  BRONZE: {
    id: 'bronze',
    name: 'Bronze Partner',
    commission: 15,
    bounty: 0,
    clientsRequired: 0,
    clientsRequiredNext: 3,
    requirements: 'Get started immediately',
    features: [
      '15% commission on all referrals',
      'Basic tracking dashboard',
      'Email invitations',
      'Monthly payouts',
    ],
    badge: '🥉',
    color: '#CD7F32',
    accent: 'rgba(205, 127, 50, 0.1)',
  },
  SILVER: {
    id: 'silver',
    name: 'Silver Partner',
    commission: 17,
    bounty: 0,
    clientsRequired: 3,
    clientsRequiredNext: 6,
    requirements: '3+ successful referrals',
    features: [
      '17% commission on all referrals',
      'Advanced tracking dashboard',
      '⭐ Priority email support',
      'Bi-weekly payouts',
      'Marketing materials access',
    ],
    badge: '🥈',
    color: '#C0C0C0',
    accent: 'rgba(192, 192, 192, 0.1)',
  },
  GOLD: {
    id: 'gold',
    name: 'Gold Partner',
    commission: 20,
    bounty: 200,
    clientsRequired: 6,
    clientsRequiredNext: 10,
    requirements: '6+ successful referrals',
    features: [
      '20% commission on all referrals',
      '💰 $200 guaranteed bounty per high-ticket client ($1000+)',
      'Premium analytics dashboard',
      'Priority phone/email support',
      'Weekly payouts',
      'Co-promotion opportunities',
      'Custom tracking links',
    ],
    badge: '🥇',
    color: '#FFD700',
    accent: 'rgba(255, 215, 0, 0.15)',
  },
  VIP_ELITE: {
    id: 'vip_elite',
    name: 'VIP Elite Partner',
    commission: 25,
    bounty: 200,
    clientsRequired: 10,
    clientsRequiredNext: null,
    requirements: '10+ successful referrals',
    features: [
      '25% commission on all referrals (HIGHEST TIER)',
      '💎 $200 bounty per high-ticket client',
      '🎁 Exclusive monthly performance bonus pool ($500-$2000)',
      'Dedicated account manager',
      'Full white-label support',
      'API access for real-time tracking',
      'Weekly payouts guaranteed',
      'Priority feature requests',
      'Annual partner conference + travel',
      'Co-marketing & partnership opportunities',
      'Revenue share on partner initiatives',
    ],
    badge: '💎',
    color: '#9370DB',
    accent: 'rgba(147, 112, 219, 0.15)',
  },
};

export const TIER_LIST = [
  REFERRAL_TIERS.BRONZE,
  REFERRAL_TIERS.SILVER,
  REFERRAL_TIERS.GOLD,
  REFERRAL_TIERS.VIP_ELITE,
];

/**
 * Calculate user tier based on completed referral count
 * @param {number} completedReferrals - Number of completed referrals
 * @returns {object} Tier info with commission, bounty, etc.
 */
export const calculateTierByCount = (completedReferrals) => {
  if (completedReferrals >= 10) return REFERRAL_TIERS.VIP_ELITE;
  if (completedReferrals >= 6) return REFERRAL_TIERS.GOLD;
  if (completedReferrals >= 3) return REFERRAL_TIERS.SILVER;
  return REFERRAL_TIERS.BRONZE;
};

/**
 * Get tier progression info
 * Shows current tier and progress to next tier
 */
export const getTierProgress = (completedReferrals) => {
  const currentTier = calculateTierByCount(completedReferrals);
  const nextTierClients = currentTier.clientsRequiredNext;
  
  return {
    current: currentTier,
    completed: completedReferrals,
    nextTierAt: nextTierClients,
    progress: nextTierClients ? Math.min(100, (completedReferrals / nextTierClients) * 100) : 100,
    remainingToNext: nextTierClients ? Math.max(0, nextTierClients - completedReferrals) : 0,
    isMaxTier: currentTier.id === 'vip_elite',
  };
};

/**
 * Calculate earnings projection
 */
export const calculateProjectedEarnings = (projectValue, tier) => {
  const commission = (projectValue * tier.commission) / 100;
  const bounty = projectValue >= 1000 && tier.bounty > 0 ? tier.bounty : 0;
  return {
    commission: Math.round(commission * 100) / 100,
    bounty,
    total: Math.round((commission + bounty) * 100) / 100,
  };
};
