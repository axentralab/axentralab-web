import { TIER_LIST } from '../../constants/referralTiers';
import { Link } from 'react-router-dom';

export default function ReferralTierComparison() {
  return (
    <section
      style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 16px',
              letterSpacing: -1,
            }}
          >
            Choose Your Tier
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.5)',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Unlock higher commissions and bonuses as you grow your referral network
          </p>
        </div>



        {/* Benefits comparison */}
        <div style={{ marginTop: 80 }}>
          <h3
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#fff',
              marginBottom: 32,
              textAlign: 'center',
            }}
          >
            Tier Benefits Comparison
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(102, 126, 234, 0.2)' }}>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '16px',
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 600,
                      fontSize: 12,
                      textTransform: 'uppercase',
                    }}
                  >
                    Feature
                  </th>
                  {TIER_LIST.map((tier) => (
                    <th
                      key={tier.id}
                      style={{
                        textAlign: 'center',
                        padding: '16px',
                        color: tier.color,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {tier.badge} {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Commission Rate', standard: '15%', vip: '15%', elite: '20%' },
                  { name: 'Bounty per Client', standard: 'None', vip: '$200', elite: '$500' },
                  { name: 'Tracking Dashboard', standard: 'Basic', vip: 'Advanced', elite: 'Premium' },
                  { name: 'Support', standard: 'Email', vip: 'Priority', elite: 'Dedicated' },
                  { name: 'Payout Frequency', standard: 'Monthly', vip: 'Weekly', elite: 'Weekly + Bonus' },
                  { name: 'Marketing Materials', standard: '❌', vip: '✅', elite: '✅ + Co-marketing' },
                  { name: 'API Access', standard: '❌', vip: '❌', elite: '✅' },
                  { name: 'Conference Access', standard: '❌', vip: '❌', elite: '✅ Annual' },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                      background: idx % 2 === 0 ? 'rgba(102, 126, 234, 0.02)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '16px', color: '#fff', fontWeight: 500 }}>
                      {row.name}
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px', color: '#667eea' }}>
                      {row.standard}
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px', color: '#a855f7' }}>
                      {row.vip}
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px', color: '#f59e0b' }}>
                      {row.elite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <Link
            to="/referral"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              padding: '16px 40px',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: -0.5,
              transition: 'all 0.3s',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
            }}
          >
            Join the Referral Program →
          </Link>
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, isPopular, delay }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: isPopular
          ? '2px solid rgba(168, 85, 247, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
        transform: isPopular ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s',
        animation: `fadeInUp 0.5s ease ${delay * 0.1}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${tier.color}40`;
        e.currentTarget.style.boxShadow = `0 20px 40px ${tier.color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isPopular
          ? 'rgba(168, 85, 247, 0.5)'
          : 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: 20,
            background: tier.color,
            color: '#fff',
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Most Popular
        </div>
      )}

      {/* Top line accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${tier.color}, transparent)`,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Icon and title */}
        <div style={{ fontSize: 40, marginBottom: 16 }}>{tier.badge}</div>
        <h3
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 8px',
            letterSpacing: -0.5,
          }}
        >
          {tier.name}
        </h3>

        {/* Pricing */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: tier.color,
              marginBottom: 4,
              letterSpacing: -1,
            }}
          >
            {tier.commission}%
          </div>
          {tier.bounty > 0 && (
            <div
              style={{
                fontSize: 16,
                color: tier.color,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              +${tier.bounty} per high-ticket client
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.4)',
              fontStyle: 'italic',
            }}
          >
            {tier.requirements}
          </div>
        </div>

        {/* Features */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 28px',
          }}
        >
          {tier.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                fontSize: 13,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ color: tier.color, fontSize: 16 }}>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="/referral"
          style={{
            display: 'block',
            textAlign: 'center',
            background: isPopular ? tier.color : 'rgba(255, 255, 255, 0.05)',
            color: isPopular ? '#fff' : tier.color,
            padding: '12px 24px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 14,
            border: `1px solid ${isPopular ? 'transparent' : `${tier.color}40`}`,
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isPopular) {
              e.target.style.background = `${tier.color}15`;
              e.target.style.borderColor = `${tier.color}`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isPopular) {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = `${tier.color}40`;
            }
          }}
        >
          Get Started →
        </Link>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
