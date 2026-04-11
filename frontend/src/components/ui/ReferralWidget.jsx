import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

export default function ReferralWidget() {
  const { user } = useAuth();
  const { request } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await request('/api/referrals/my-referrals', 'GET');
      if (response.success) {
        setStats(response.statistics);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
        border: '1px solid rgba(102,126,234,0.2)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#333' }}>
        📊 Referral Stats
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <StatItem label="Total Referrals" value={stats?.totalReferrals || 0} />
        <StatItem label="Active" value={stats?.activeReferrals || 0} />
        <StatItem label="Completed" value={stats?.completedReferrals || 0} />
        <StatItem label="Earnings" value={`$${(stats?.totalCommission || 0).toFixed(2)}`} />
      </div>

      <a
        href="/referral"
        style={{
          display: 'block',
          textAlign: 'center',
          background: '#667eea',
          color: 'white',
          padding: '10px 16px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.background = '#5568d3')}
        onMouseLeave={(e) => (e.target.style.background = '#667eea')}
      >
        View Full Referral Program →
      </a>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>{value}</div>
    </div>
  );
}
