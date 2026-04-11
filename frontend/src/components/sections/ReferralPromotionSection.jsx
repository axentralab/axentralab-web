import { Link } from 'react-router-dom';

export default function ReferralPromotionSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
      borderTop: '1px solid rgba(102, 126, 234, 0.2)',
      borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 40,
          alignItems: 'center',
        }}>
          {/* Left: Text content */}
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: '#667eea',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              💰 Passive Income
            </div>

            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 42px)',
              fontWeight: 900,
              color: '#fff',
              marginBottom: 20,
              lineHeight: 1.2,
              letterSpacing: -1,
            }}>
              Earn Money<br />
              <span style={{ color: '#667eea' }}>Referring Friends</span>
            </h2>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 450,
            }}>
              Get 10% commission on every successful referral. It's easy, passive, and rewarding. 
              Share your unique referral link and start earning today!
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 24,
            }}>
              <BenefitBadge icon="✓" text="10% Commission" />
              <BenefitBadge icon="✓" text="Lifetime Earnings" />
              <BenefitBadge icon="✓" text="Easy Tracking" />
            </div>

            <Link
              to="/referral"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: -0.5,
                transition: 'all 0.3s',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
              }}
            >
              Start Earning Now →
            </Link>
          </div>

          {/* Right: Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            <StatBox number="10%" label="Commission Rate" gradient="#667eea" />
            <StatBox number="∞" label="Lifetime Earnings" gradient="#a855f7" />
            <StatBox number="0$" label="Setup Cost" gradient="#f59e0b" />
            <StatBox number="24/7" label="Tracking Dashboard" gradient="#3b82f6" />
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 80 }}>
          <h3 style={{
            fontSize: 24,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 40,
            textAlign: 'center',
          }}>
            How It Works
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
          }}>
            <ProcessStep
              number="1"
              title="Share Your Link"
              description="Get your unique referral link from your dashboard"
            />
            <ProcessStep
              number="2"
              title="Friends Sign Up"
              description="Your friends use your link to register"
            />
            <ProcessStep
              number="3"
              title="They Make a Purchase"
              description="When they make a purchase, you earn commission"
            />
            <ProcessStep
              number="4"
              title="Withdraw Earnings"
              description="Withdraw your earnings to your account"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitBadge({ icon, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(102, 126, 234, 0.1)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      padding: '8px 14px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      color: '#667eea',
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      {text}
    </div>
  );
}

function StatBox({ number, label, gradient }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: 24,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${gradient}, transparent)`,
      }} />
      <div style={{
        fontSize: 36,
        fontWeight: 900,
        background: `linear-gradient(135deg, ${gradient}, ${gradient}dd)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 8,
      }}>
        {number}
      </div>
      <div style={{
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: 24,
      position: 'relative',
      textAlign: 'center',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 900,
        color: '#fff',
        margin: '0 auto 16px',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
      }}>
        {number}
      </div>
      <h4 style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 8,
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  );
}
