import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function ReferralPage() {
  const { user } = useAuth();
  const { request } = useApi();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await request('/api/referrals/my-referrals', 'GET');
      if (response.success) {
        setReferralData(response);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!newEmail) {
      setMessage('Please enter an email address');
      return;
    }

    setInviting(true);
    try {
      const response = await request('/api/referrals/create-referral', 'POST', {
        refereeEmail: newEmail,
      });

      if (response.success) {
        setMessage('Referral invitation sent successfully!');
        setNewEmail('');
        setTimeout(() => {
          fetchReferralData();
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Error sending invitation');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: '#666' }}>Loading referral data...</div>
      </div>
    );
  }

  const stats = referralData?.statistics || {};
  const referrals = referralData?.referrals || [];
  const referralLink = referralData?.referralLink || '';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: 0, marginBottom: 10 }}>
            🎯 Referral Program
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            Earn 10% commission for every successful referral
          </p>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
          {/* Stats Cards */}
          <StatCard title="Total Referrals" value={stats.totalReferrals || 0} icon="👥" />
          <StatCard title="Active Referrals" value={stats.activeReferrals || 0} icon="✅" />
          <StatCard title="Completed" value={stats.completedReferrals || 0} icon="🎉" />
          <StatCard title="Total Earnings" value={`$${(stats.totalCommission || 0).toFixed(2)}`} icon="💰" />
        </div>

        {/* Referral Link Section */}
        <div style={{ background: 'white', borderRadius: 16, padding: 30, marginBottom: 30, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20, color: '#333' }}>
            Your Referral Link
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={referralLink}
              readOnly
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'monospace',
                fontWeight: 500,
              }}
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              style={{
                padding: '12px 24px',
                background: copied ? '#10b981' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Invite Form */}
        <div style={{ background: 'white', borderRadius: 16, padding: 30, marginBottom: 30, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20, color: '#333' }}>
            Invite Friends
          </h2>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: 12 }}>
            <input
              type="email"
              placeholder="Enter friend's email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              disabled={inviting}
              style={{
                padding: '12px 24px',
                background: inviting ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: inviting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {inviting ? 'Sending...' : 'Invite'}
            </button>
          </form>
          {message && (
            <div style={{ marginTop: 12, padding: 12, background: '#f0f9ff', borderLeft: '4px solid #667eea', borderRadius: 4, color: '#333' }}>
              {message}
            </div>
          )}
        </div>

        {/* Referrals Table */}
        <div style={{ background: 'white', borderRadius: 16, padding: 30, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20, color: '#333' }}>
            Your Referrals
          </h2>
          {referrals.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              <p style={{ fontSize: 16 }}>No referrals yet. Start inviting friends!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Referee</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Order Value</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Commission</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', color: '#333' }}>
                      {ref.referee?.name || ref.refereeEmail}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: ref.status === 'completed' ? '#d1fae5' : ref.status === 'activated' ? '#bfdbfe' : '#fef3c7',
                          color: ref.status === 'completed' ? '#047857' : ref.status === 'activated' ? '#1e40af' : '#b45309',
                        }}
                      >
                        {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#333' }}>
                      ${(ref.orderValue || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: '#667eea', fontWeight: 600 }}>
                      ${(ref.commissionAmount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: '#666', fontSize: 14 }}>
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: '#999', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#333' }}>{value}</div>
    </div>
  );
}
