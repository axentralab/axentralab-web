import { Link } from 'react-router-dom';

export default function ReferralPromoAd({ variant = 'default', style = {} }) {
  const ads = {
    default: {
      title: '💰 Earn 15% Commission',
      subtitle: 'Refer friends and earn passive income',
      cta: 'Start Earning',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgOpacity: 0.1,
    },
    vip: {
      title: '💎 VIP Tier Unlocked',
      subtitle: '15% commission + $200 bounty per high-ticket client',
      cta: 'Upgrade to VIP',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)',
      bgOpacity: 0.12,
    },
    elite: {
      title: '👑 Elite Status',
      subtitle: '20% commission + $500 bounty + dedicated support',
      cta: 'Join Elite',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      bgOpacity: 0.15,
    },
    compact: {
      title: '🎯 Earn 15% + $200 Bonus',
      subtitle: 'Refer high-ticket clients',
      cta: 'Refer Now',
      gradient: 'linear-gradient(135deg, #667eea 0%, #3b82f6 100%)',
      bgOpacity: 0.08,
    },
    minimal: {
      title: 'Earn 15% Commission',
      subtitle: 'Share your referral link',
      cta: 'Learn More',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgOpacity: 0.06,
    },
  };

  const ad = ads[variant] || ads.default;

  return (
    <div
      style={{
        background: ad.gradient,
        borderRadius: 12,
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        ...style,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          {ad.title}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          {ad.subtitle}
        </p>
      </div>

      {/* CTA Button */}
      <Link
        to="/referral"
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(255,255,255,0.95)',
          color: '#333',
          padding: '8px 20px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 13,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          cursor: 'pointer',
          border: 'none',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#fff';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.95)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        {ad.cta} →
      </Link>
    </div>
  );
}

export function ReferralPromoCard({ tier = 'standard' }) {
  const tiers = {
    standard: {
      icon: '⭐',
      title: 'Standard Tier',
      commission: '15%',
      bounty: 'Pay per referral',
      highlight: '15% commission on all referrals',
    },
    vip: {
      icon: '💎',
      title: 'VIP Tier',
      commission: '15% + $200',
      bounty: 'Per high-ticket client',
      highlight: `Unlock at 5+ referrals`,
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
    },
    elite: {
      icon: '👑',
      title: 'Elite Tier',
      commission: '20% + $500',
      bounty: 'Per high-ticket client',
      highlight: 'Achieve 20+ referrals for premium benefits',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
    },
  };

  const tierData = tiers[tier] || tiers.standard;

  return (
    <div
      style={{
        background: tierData.gradient || 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: 12,
        padding: 20,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{tierData.icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
        {tierData.title}
      </h3>
      <div style={{ fontSize: 24, fontWeight: 900, color: '#667eea', marginBottom: 8 }}>
        {tierData.commission}
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>
        {tierData.bounty}
      </p>
      <p style={{ fontSize: 12, color: '#667eea', fontWeight: 600, margin: 0 }}>
        {tierData.highlight}
      </p>
    </div>
  );
}

export function ReferralCtaBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: '32px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: -1 }}>
          🤝 Spread the Word, Earn More
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto 24px' }}>
          Join our referral program and earn 15% commission + bonuses for high-ticket clients. No limits on earning!
        </p>
        <Link
          to="/referral"
          style={{
            display: 'inline-block',
            background: '#fff',
            color: '#667eea',
            padding: '14px 32px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: -0.5,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Start Earning Today →
        </Link>
      </div>
    </div>
  );
}
