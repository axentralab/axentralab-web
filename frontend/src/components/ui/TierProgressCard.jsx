import { REFERRAL_TIERS } from '../../constants/referralTiers';

export default function TierProgressCard({ stats }) {
  if (!stats) return null;

  const currentTier = REFERRAL_TIERS[stats.currentTier.toUpperCase().replace('_', '_')];
  const tierMap = {
    'bronze': REFERRAL_TIERS.BRONZE,
    'silver': REFERRAL_TIERS.SILVER,
    'gold': REFERRAL_TIERS.GOLD,
    'vip_elite': REFERRAL_TIERS.VIP_ELITE,
  };
  
  const tier = tierMap[stats.currentTier] || tierMap.bronze;
  const remaining = stats.remainingToNextTier || 0;
  const progress = stats.progressPercent || 0;
  const isMaxTier = stats.isMaxTier || false;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${tier.color}10 0%, ${tier.color}05 100%)`,
        border: `2px solid ${tier.color}40`,
        borderRadius: 16,
        padding: 32,
        marginBottom: 32,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Accent top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${tier.color}, transparent)`,
        }}
      />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{tier.badge}</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: -0.5 }}>
              {tier.name}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {stats.completedReferrals} completed referral{stats.completedReferrals !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Earnings display */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Total Earnings</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: tier.color,
                letterSpacing: -1,
              }}
            >
              ${(stats.totalEarnings || 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatItem label="Commission Rate" value={`${stats.currentCommission}%`} color={tier.color} />
          {stats.currentBounty > 0 && (
            <StatItem label="Per High-Ticket Deal" value={`$${stats.currentBounty}`} color={tier.color} />
          )}
          <StatItem label="Active Referrals" value={stats.activeReferrals} color={tier.color} />
          <StatItem label="Avg. Earning/Ref" value={`$${stats.totalEarnings && stats.completedReferrals ? (stats.totalEarnings / stats.completedReferrals).toFixed(0) : 0}`} color={tier.color} />
        </div>

        {/* Progress bar */}
        {!isMaxTier && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                Progress to Next Tier
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {stats.completedReferrals} / {stats.nextTierAt}
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 12,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 999,
                overflow: 'hidden',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${tier.color}, ${tier.color}dd)`,
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                {remaining} more referral{remaining !== 1 ? 's' : ''} to unlock the next tier and earn <strong>{stats.currentCommission + 2}%+</strong> commission!
              </p>
            </div>
          </div>
        )}

        {isMaxTier && (
          <div
            style={{
              padding: 16,
              background: `linear-gradient(135deg, ${tier.color}15 0%, ${tier.color}05 100%)`,
              border: `1px solid ${tier.color}30`,
              borderRadius: 10,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tier.color }}>
              🎉 You've reached the maximum tier! Enjoy exclusive VIP Elite benefits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color, letterSpacing: -0.5 }}>
        {value}
      </div>
    </div>
  );
}
