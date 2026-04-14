import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { apiErrorMessage } from '../services/api';
import { ReferralCtaBanner } from '../components/ui/ReferralPromoAd';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { cart, total, clearCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const toast      = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (cart.length === 0) navigate('/cart', { replace: true });
  }, [cart.length, navigate]);

  if (cart.length === 0) return null;

  const handleCheckout = async () => {
    setLoading(true); setError('');
    try {
      const orderRes = await api.post('/orders', {
        items: cart.map(item => ({
          service: item.serviceId,
          serviceTitle: item.serviceTitle,
          plan: item.plan,
          price: item.price,
          billing: item.billing,
          quantity: item.quantity || 1,
        })),
        total,
        paymentMethod: 'stripe',
      });
      const orderId = orderRes.data.data._id;
      const stripeRes = await api.post('/payments/checkout', { items: cart, orderId });
      clearCart();
      window.location.href = stripeRes.data.url;
    } catch (err) {
      const msg = apiErrorMessage(err, 'Checkout failed. Please try again.');
      setError(msg); toast.error(msg); setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUpCO { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes glowFloat { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .co-section { animation: fadeUpCO 0.4s ease both; }
        .co-section:nth-child(2) { animation-delay: 0.07s; }
        .co-section:nth-child(3) { animation-delay: 0.13s; }
        .co-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #fff; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr minmax(0,380px);
          gap: 28px;
        }
        .checkout-summary-sticky { position: sticky; top: 80px; }
        @media (max-width: 680px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .checkout-summary-sticky { position: static; top: unset; }
        }
      `}</style>

      <div style={{ padding: '100px 5% 80px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', top: '15%', right: '-5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'glowFloat 5s ease-in-out infinite' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>{t('checkout.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 36, fontFamily: "'Space Mono',monospace" }}>{t('checkout.subtitle')}</p>

          <div className="checkout-grid">
            {/* Left column */}
            <div>
              {/* Customer Details */}
              <div className="co-section" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 28, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`, margin: '-28px -28px 24px' }} />
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>👤 {t('checkout.customer_details')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{ label: t('auth.name'), val: user?.name }, { label: t('auth.email'), val: user?.email }, { label: t('common.company'), val: user?.company || '—' }].map(f => (
                    <div key={f.label} style={{ gridColumn: f.label === 'Email' ? 'span 2' : 'auto' }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginBottom: 5, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase' }}>{f.label}</div>
                      <div className="co-field">{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="co-section" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 28, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${ACCENT},${PRIMARY})`, margin: '-28px -28px 24px' }} />
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>📦 {t('checkout.order_items')}</h3>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{item.serviceTitle}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3, fontFamily: "'Space Mono',monospace" }}>
                        {item.plan} · {item.billing === 'monthly' ? t('checkout.monthly') : item.billing === 'yearly' ? t('checkout.yearly') : t('checkout.one_time')} · ×{item.quantity || 1}
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, color: PRIMARY2, fontSize: 16, flexShrink: 0 }}>
                      ${(item.price * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Email notice */}
              <div className="co-section" style={{ background: `${PRIMARY}06`, border: `1px solid ${PRIMARY}20`, borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>📧</span>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 4 }}>
                    {t('checkout.confirmation_sent')} {user?.email}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>
                    {t('checkout.confirmation_message')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment */}
            <div>
              <div className="checkout-summary-sticky" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${PRIMARY}20`, borderRadius: 18, padding: 28, overflow: 'hidden' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`, margin: '-28px -28px 24px' }} />
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>💳 {t('checkout.payment_summary')}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  <span>{t('checkout.subtotal')} ({cart.length} {t(cart.length > 1 ? 'cart.items' : 'cart.item')})</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  <span>{t('cart.tax')}</span><span style={{ fontSize: 11 }}>{t('checkout.at_checkout')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: '#fff' }}>
                  <span>{t('cart.total')}</span>
                  <span style={{ background: `linear-gradient(135deg,${PRIMARY2},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${total.toLocaleString()}</span>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444' }}>{error}</div>
                )}

                <button onClick={handleCheckout} disabled={loading}
                  style={{ width: '100%', padding: '14px', fontSize: 15, background: loading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${PRIMARY},${ACCENT})`, border: 'none', borderRadius: 12, color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 800, cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: loading ? 'none' : `0 4px 18px ${PRIMARY}40` }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                  {loading ? <><span className="spinner" /> {t('checkout.redirecting')}</> : '🔒 ' + t('checkout.pay_with_stripe')}
                </button>

                <div style={{ marginTop: 16, padding: 14, background: `${PRIMARY}05`, border: `1px solid ${PRIMARY}12`, borderRadius: 10 }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontFamily: "'Space Mono',monospace", margin: 0 }}>
                    {t('checkout.stripe_info')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── REFERRAL CTA BANNER ────────────────────────────────────────── */}
          <div style={{ marginTop: 60 }}>
            <ReferralCtaBanner />
          </div>
        </div>
      </div>
    </>
  );
}