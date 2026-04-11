import { Link } from 'react-router-dom';

export default function ReferralBanner({ style = {} }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        ...style,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>
          💰 Earn Money Referring Friends
        </h3>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          Get 10% commission on every successful referral. Share your link and start earning today!
        </p>
      </div>
      <Link
        to="/referral"
        style={{
          background: 'white',
          color: '#667eea',
          padding: '10px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 14,
          whiteSpace: 'nowrap',
          marginLeft: 20,
          transition: 'transform 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Start Earning →
      </Link>
    </div>
  );
}
