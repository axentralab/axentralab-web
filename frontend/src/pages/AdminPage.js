import { useState, useEffect, memo } from 'react';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { apiErrorMessage } from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminGuard from '../components/AdminGuard';
import Skeleton, { SkeletonList } from '../components/Skeleton';
import { STATUS_COLORS } from '../constants/statusColors';
// FIX: use status constants instead of hardcoded strings
import {
  ORDER_STATUS_OPTIONS,
  LEAD_STATUS_OPTIONS,
} from '../constants/orderStatus';

// CSV export helper
function exportCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  // FIX: properly quote fields that contain commas or quotes
  const escape = val => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
const OverviewTab = memo(function OverviewTab({ stats, leads, loading }) {
  if (loading) return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        <Skeleton variant="stat" /><Skeleton variant="stat" /><Skeleton variant="stat" /><Skeleton variant="stat" />
      </div>
    </div>
  );
  return (
    <div>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 28 }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        {[
          { icon: '👥', label: 'Total Users',   value: stats.totalUsers,   color: '#3B82F6' },
          { icon: '📦', label: 'Total Orders',  value: stats.totalOrders,  color: '#8B5CF6' },
          { icon: '💰', label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: '#F59E0B' },
          { icon: '📬', label: 'Leads',         value: leads.length,       color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 14 }}>Recent Leads</h3>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        {leads.slice(0, 5).map((lead, i) => (
          <div key={lead._id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px', gap: 12, padding: '14px 20px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{lead.name}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{lead.email}</div></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{lead.service || '—'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{lead.budget || '—'}</div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: `${STATUS_COLORS[lead.status]}15`, border: `1px solid ${STATUS_COLORS[lead.status]}30`, color: STATUS_COLORS[lead.status], fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textAlign: 'center' }}>
              {lead.status?.toUpperCase()}
            </span>
          </div>
        ))}
        {leads.length === 0 && <div style={{ padding: '24px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No leads yet</div>}
      </div>
    </div>
  );
});

// ── Leads Tab ─────────────────────────────────────────────────────────────────
const LeadsTab = memo(function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // FIX: AbortController prevents setState on unmounted component
    const controller = new AbortController();
    api.get('/leads', { signal: controller.signal })
      .then(r => setLeads(r.data.data))
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') {} })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}><SkeletonList count={5} variant="order-row" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 900, color: '#fff' }}>Leads ({leads.length})</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Hot (80+)', color: '#EF4444', count: leads.filter(l => (l.leadScore?.score || 0) >= 80).length },
          { label: 'Warm (60+)', color: '#F59E0B', count: leads.filter(l => { const s = l.leadScore?.score || 0; return s >= 60 && s < 80; }).length },
          { label: 'Cool (40+)', color: '#3B82F6', count: leads.filter(l => { const s = l.leadScore?.score || 0; return s >= 40 && s < 60; }).length },
          { label: 'Cold (<40)', color: '#8B5CF6', count: leads.filter(l => (l.leadScore?.score || 0) < 40).length },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, marginTop: 6 }}>{s.count}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 80px 1fr 100px 100px 120px', gap: 12, padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>
          <div>Contact</div><div>Score</div><div>Service</div><div>Budget</div><div>Status</div><div>Actions</div>
        </div>
        {leads.map((lead, i) => {
          const score = lead.leadScore?.score || 0;
          const scoreColor = score >= 80 ? '#EF4444' : score >= 60 ? '#F59E0B' : score >= 40 ? '#3B82F6' : '#8B5CF6';
          return (
            <div key={lead._id} style={{ padding: '16px 24px', borderBottom: i < leads.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 80px 1fr 100px 100px 120px', gap: 12, alignItems: 'center' }}>
              <div><div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{lead.name}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{lead.email}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: scoreColor, fontSize: 16 }}>{Math.round(score)}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>/100</div>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{lead.service || '—'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{lead.budget || '—'}</div>

              {/* FIX: async onChange with try/catch — server errors no longer silently update UI */}
              <select value={lead.status} onChange={async e => {
                const newStatus = e.target.value;
                try {
                  await api.put(`/leads/${lead._id}`, { status: newStatus });
                  setLeads(leads.map(l => l._id === lead._id ? { ...l, status: newStatus } : l));
                  toast.success(`Lead status updated to ${newStatus}`);
                } catch (err) {
                  toast.error(apiErrorMessage(err, 'Failed to update lead status'));
                }
              }} style={{ padding: '5px 8px', borderRadius: 6, background: `${STATUS_COLORS[lead.status]}15`, border: `1px solid ${STATUS_COLORS[lead.status]}30`, color: STATUS_COLORS[lead.status], fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", outline: 'none', cursor: 'pointer' }}>
                {/* FIX: use status constants instead of hardcoded strings */}
                {LEAD_STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#0F172A', color: '#fff' }}>{s.toUpperCase()}</option>)}
              </select>

              <div style={{ display: 'flex', gap: 6 }}>
                {/* FIX: both action buttons now have error handling */}
                <button onClick={async () => {
                  try {
                    await api.post(`/leads/${lead._id}/proposal`);
                    toast.success(`Proposal sent to ${lead.name}`);
                  } catch (e) {
                    toast.error(apiErrorMessage(e, 'Failed to send proposal'));
                  }
                }} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Propose</button>

                <button onClick={async () => {
                  try {
                    await api.post(`/leads/${lead._id}/followup`);
                    toast.success(`Follow-up sent to ${lead.name}`);
                  } catch (e) {
                    toast.error(apiErrorMessage(e, 'Failed to send follow-up'));
                  }
                }} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3B82F6', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Follow-up</button>
              </div>
            </div>
          );
        })}
        {leads.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No leads yet</div>}
      </div>
    </div>
  );
});

// ── Orders Tab ─────────────────────────────────────────────────────────────────
const OrdersTab = memo(function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();
    api.get('/orders', { signal: controller.signal })
      .then(r => setOrders(r.data.data))
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') {} })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleExportCSV = () => {
    const rows = orders.map(o => ({
      OrderNumber: o.orderNumber,
      Customer: o.user?.name || '',
      Email: o.user?.email || '',
      Items: o.items?.map(i => i.serviceTitle).join('; ') || '',
      Total: o.total,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));
    exportCSV(rows, `orders-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('CSV downloaded!');
  };

  if (loading) return <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}><SkeletonList count={5} variant="order-row" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 900, color: '#fff' }}>All Orders ({orders.length})</h1>
        {orders.length > 0 && (
          <button onClick={handleExportCSV} className="btn-outline" style={{ padding: '8px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            ↓ Export CSV
          </button>
        )}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        {orders.map((order, i) => (
          <div key={order._id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 140px', gap: 12, alignItems: 'center' }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#8B5CF6' }}>{order.orderNumber}</span>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{order.user?.name}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{order.user?.email}</div></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.items?.map(i => i.serviceTitle).join(', ')}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: '#8B5CF6', fontSize: 15 }}>${order.total?.toLocaleString()}</div>

            {/* FIX: async onChange with try/catch */}
            <select value={order.status} onChange={async e => {
              const newStatus = e.target.value;
              try {
                await api.put(`/orders/${order._id}/status`, { status: newStatus });
                setOrders(orders.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                toast.success('Order status updated');
              } catch (err) {
                toast.error(apiErrorMessage(err, 'Failed to update order status'));
              }
            }} style={{ padding: '5px 8px', borderRadius: 8, background: `${STATUS_COLORS[order.status]}15`, border: `1px solid ${STATUS_COLORS[order.status]}30`, color: STATUS_COLORS[order.status], fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", outline: 'none', cursor: 'pointer' }}>
              {/* FIX: use status constants instead of hardcoded strings */}
              {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#0F172A', color: '#fff' }}>{s.toUpperCase()}</option>)}
            </select>
          </div>
        ))}
        {orders.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No orders yet</div>}
      </div>
    </div>
  );
});

// ── Users Tab ─────────────────────────────────────────────────────────────────
const UsersTab = memo(function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();
    api.get('/users', { signal: controller.signal })
      .then(r => setUsers(r.data.data))
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') {} })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}><SkeletonList count={6} variant="order-row" /></div>;

  return (
    <div>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 24 }}>All Users ({users.length})</h1>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
        {users.map(u => (
          <div key={u._id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>{u.name?.[0]}</div>
              <div><div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{u.name}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{u.email}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)', border: u.role === 'admin' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(139,92,246,0.2)', color: u.role === 'admin' ? '#EF4444' : '#8B5CF6', fontFamily: "'Space Mono',monospace" }}>{u.role.toUpperCase()}</span>
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 999, background: u.isActive ? 'rgba(139,92,246,0.08)' : 'rgba(239,68,68,0.08)', color: u.isActive ? '#8B5CF6' : '#EF4444', fontFamily: "'Space Mono',monospace" }}>{u.isActive ? 'ACTIVE' : 'SUSPENDED'}</span>

              {/* FIX: toggle button with try/catch */}
              <button onClick={async () => {
                try {
                  await api.put(`/users/${u._id}/toggle`);
                  setUsers(users.map(us => us._id === u._id ? { ...us, isActive: !us.isActive } : us));
                  toast.info(`${u.name} ${u.isActive ? 'suspended' : 'activated'}`);
                } catch (err) {
                  toast.error(apiErrorMessage(err, 'Failed to update user status'));
                }
              }} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
                {u.isActive ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Main AdminPage ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]   = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // FIX: useMatch is route-aware and won't break on rename
  const isLeads  = useMatch('/admin/leads');
  const isOrders = useMatch('/admin/orders');
  const isUsers  = useMatch('/admin/users');
  const tab = isLeads ? 'leads' : isOrders ? 'orders' : isUsers ? 'users' : 'overview';

  useEffect(() => {
    if (tab !== 'overview') return;
    const controller = new AbortController();
    setOverviewLoading(true);
    Promise.all([
      api.get('/users/stats', { signal: controller.signal }),
      api.get('/leads',       { signal: controller.signal }),
    ])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes.data.data);
        setRecentLeads(leadsRes.data.data);
      })
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') {} })
      .finally(() => setOverviewLoading(false));
    return () => controller.abort();
  }, [tab]);

  const navItems = [
    { icon: '📊', label: 'Overview', path: '/admin' },
    { icon: '📬', label: 'Leads',    path: '/admin/leads' },
    { icon: '📦', label: 'Orders',   path: '/admin/orders' },
    { icon: '👥', label: 'Users',    path: '/admin/users' },
    { icon: '🌐', label: 'Website',  path: '/' },
  ];

  return (
    <AdminGuard>
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 64 }}>
        <Sidebar navItems={navItems} user={user} badge="ADMIN PANEL" onLogout={() => { logout(); navigate('/'); }} />
        <main style={{ flex: 1, padding: '36px 40px', overflow: 'auto' }}>
          {tab === 'overview' && <OverviewTab stats={stats} leads={recentLeads} loading={overviewLoading} />}
          {tab === 'leads'    && <LeadsTab />}
          {tab === 'orders'   && <OrdersTab />}
          {tab === 'users'    && <UsersTab />}
        </main>
      </div>
    </AdminGuard>
  );
}