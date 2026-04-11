import { useState, useEffect } from 'react';
import { Link, useNavigate, useMatch } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { apiErrorMessage } from '../services/api';
import Sidebar from '../components/Sidebar';
import Skeleton, { SkeletonList } from '../components/Skeleton';
import { STATUS_COLORS } from '../constants/statusColors';
import { PAID_STATUSES } from '../constants/orderStatus';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';

function StatCard({ icon, label, value, color = PRIMARY2, delay = 0 }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, position: 'relative', overflow: 'hidden', animation: `dashFadeUp 0.45s ${delay}s ease both`, transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.boxShadow = `0 8px 24px ${color}12`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 900, color, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function downloadInvoice(order) {
  const items = order.items?.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.serviceTitle || i.plan}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${i.price?.toLocaleString()}</td></tr>`
  ).join('') || '';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.orderNumber}</title>
  <style>body{font-family:sans-serif;max-width:600px;margin:40px auto;color:#111}h1{font-size:24px}table{width:100%;border-collapse:collapse}.total{font-size:18px;font-weight:bold}</style>
  </head><body>
  <h1>Invoice</h1>
  <p><strong>Order:</strong> ${order.orderNumber}<br><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br><strong>Status:</strong> ${order.status?.toUpperCase()}</p>
  <table><thead><tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #333">Service</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #333">Price</th></tr></thead>
  <tbody>${items}</tbody></table>
  <p class="total" style="text-align:right;margin-top:16px">Total: $${order.total?.toLocaleString()}</p>
  <p style="margin-top:40px;font-size:12px;color:#888">Axentralab · axentralab.com</p>
  </body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `invoice-${order.orderNumber}.html`; a.click();
  URL.revokeObjectURL(url);
}

function OrdersTab({ orders, loading }) {
  const toast = useToast();
  if (loading) return (
    <div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 24 }}>My Orders</div>
      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <SkeletonList count={4} variant="order-row" />
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 24 }}>My Orders</h2>
      {orders.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '56px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 10 }}>No orders yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28, maxWidth: 320, margin: '0 auto 28px' }}>Browse our services to get started.</p>
          <Link to="/services" className="btn-primary" style={{ padding: '12px 28px', textDecoration: 'none' }}>Browse Services →</Link>
        </div>
      ) : (
        <div>
          {orders.map((order, idx) => (
            <div key={order._id}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 12, overflow: 'hidden', position: 'relative', animation: `dashFadeUp 0.35s ${idx * 0.05}s ease both`, transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${PRIMARY}30`; e.currentTarget.style.boxShadow = `0 4px 16px ${PRIMARY}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: `linear-gradient(180deg,${PRIMARY},${ACCENT})` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingLeft: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: PRIMARY2, letterSpacing: 1, marginBottom: 6 }}>{order.orderNumber}</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>
                    {order.items?.map(i => i.serviceTitle || i.plan).join(', ')}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18, color: PRIMARY2 }}>${order.total?.toLocaleString()}</div>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: `${STATUS_COLORS[order.status]}15`, border: `1px solid ${STATUS_COLORS[order.status]}30`, color: STATUS_COLORS[order.status], fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5 }}>
                    {order.status?.toUpperCase()}
                  </span>
                  {PAID_STATUSES.includes(order.status) && (
                    <button onClick={() => { downloadInvoice(order); toast.success('Invoice downloaded!'); }}
                      style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: "'Space Mono',monospace", transition: 'all 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${PRIMARY}18`; e.currentTarget.style.color = PRIMARY2; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${PRIMARY}08`; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                      ↓ Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const { user }  = useAuth();
  const toast     = useToast();
  const [form, setForm]         = useState({ name: user?.name || '', company: user?.company || '', phone: user?.phone || '' });
  const [pwForm, setPwForm]     = useState({ currentPassword: '', newPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (user) setForm({ name: user.name || '', company: user.company || '', phone: user.phone || '' });
  }, [user]);

  const validateProfile  = () => { const e = {}; if (!form.name.trim()) e.name = 'Name is required'; return e; };
  const validatePassword = () => { const e = {}; if (!pwForm.currentPassword) e.currentPassword = 'Current password required'; if (pwForm.newPassword.length < 6) e.newPassword = 'Minimum 6 characters'; return e; };

  const handleProfile = async (e) => {
    e.preventDefault();
    const errs = validateProfile(); if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    try { await api.put('/auth/profile', form); toast.success('Profile updated!'); }
    catch (err) { toast.error(apiErrorMessage(err, 'Failed to update profile')); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    const errs = validatePassword(); if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    try { await api.put('/auth/password', pwForm); toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '' }); }
    catch (err) { toast.error(apiErrorMessage(err, 'Failed to change password')); }
  };

  const inputStyle = (field) => ({
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${fieldErrors[field] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: 'all 0.2s',
  });

  const FieldError = ({ field }) => fieldErrors[field]
    ? <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{fieldErrors[field]}</div>
    : null;

  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 24 }}>My Profile</h2>

      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`, margin: '-24px -24px 20px' }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 18 }}>Personal Info</h3>
        <form onSubmit={handleProfile}>
          {[{ key: 'name', label: 'Name' }, { key: 'company', label: 'Company' }, { key: 'phone', label: 'Phone' }].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
              <input style={inputStyle(f.key)} type="text" value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                onFocus={e => { e.target.style.borderColor = PRIMARY + '55'; e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}12`; }}
                onBlur={e => { e.target.style.borderColor = fieldErrors[f.key] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <FieldError field={f.key} />
            </div>
          ))}
          <button type="submit"
            style={{ padding: '10px 24px', background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: 'pointer', marginTop: 4, boxShadow: `0 4px 14px ${PRIMARY}35`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            Save Changes
          </button>
        </form>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, overflow: 'hidden' }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${ACCENT},${PRIMARY})`, margin: '-24px -24px 20px' }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 18 }}>Change Password</h3>
        <form onSubmit={handlePassword}>
          {[{ key: 'currentPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password (min. 6 chars)' }].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5, fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
              <input style={inputStyle(f.key)} type="password" value={pwForm[f.key]}
                onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                onFocus={e => { e.target.style.borderColor = PRIMARY + '55'; e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}12`; }}
                onBlur={e => { e.target.style.borderColor = fieldErrors[f.key] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
              <FieldError field={f.key} />
            </div>
          ))}
          <button type="submit"
            style={{ padding: '10px 24px', background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: 'pointer', marginTop: 4, boxShadow: `0 4px 14px ${PRIMARY}35`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [orders, setOrders]           = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const isOrders  = useMatch('/dashboard/orders');
  const isProfile = useMatch('/dashboard/profile');
  const tab = isOrders ? 'orders' : isProfile ? 'profile' : 'overview';

  useEffect(() => {
    const controller = new AbortController();
    api.get('/orders/mine', { signal: controller.signal })
      .then(r => setOrders(r.data.data))
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') {} })
      .finally(() => setOrdersLoading(false));
    return () => controller.abort();
  }, []);

  const paid       = orders.filter(o => PAID_STATUSES.includes(o.status));
  const totalSpent = paid.reduce((s, o) => s + (o.total || 0), 0);

  const navItems = [
    { icon: '📊', label: 'Overview',  path: '/dashboard' },
    { icon: '📦', label: 'My Orders', path: '/dashboard/orders' },
    { icon: '👤', label: 'Profile',   path: '/dashboard/profile' },
    { icon: '�', label: 'Referral',  path: '/referral' },
    { icon: '�🛒', label: 'Shop',      path: '/services' },
  ];

  return (
    <>
      <style>{`
        @keyframes dashFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes glowFloat  { 0%,100%{opacity:0.35} 50%{opacity:0.65} }
        .dash-overview { animation: dashFadeUp 0.4s ease both; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', top: '30%', right: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'glowFloat 6s ease-in-out infinite' }} />

        <Sidebar navItems={navItems} user={user} onLogout={() => { logout(); navigate('/'); }} />

        <main style={{ flex: 1, padding: '40px 5%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          {tab === 'overview' && (
            <div className="dash-overview">
              <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 6 }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontSize: 14 }}>Here's an overview of your account activity.</p>

              {ordersLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 40 }}>
                  <Skeleton variant="stat" /><Skeleton variant="stat" /><Skeleton variant="stat" />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 40 }}>
                  <StatCard icon="📦" label="Total Orders"    value={orders.length}                         color={PRIMARY2}  delay={0} />
                  <StatCard icon="✅" label="Active Services" value={paid.length}                           color="#3B82F6"   delay={0.07} />
                  <StatCard icon="💰" label="Total Spent"     value={`$${totalSpent.toLocaleString()}`}    color={ACCENT}    delay={0.13} />
                </div>
              )}

              <div style={{ background: `linear-gradient(135deg,${PRIMARY}08,${ACCENT}06)`, border: `1px solid ${PRIMARY}20`, borderRadius: 18, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${PRIMARY},${ACCENT})` }} />
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', marginBottom: 5 }}>Need something new?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>Browse our full service catalog and add to cart.</div>
                </div>
                <Link to="/services"
                  style={{ padding: '10px 24px', background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, color: '#fff', borderRadius: 10, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: `0 4px 14px ${PRIMARY}35`, transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  Browse Services →
                </Link>
              </div>
            </div>
          )}
          {tab === 'orders'  && <OrdersTab orders={orders} loading={ordersLoading} />}
          {tab === 'profile' && <ProfileTab />}
        </main>
      </div>
    </>
  );
}