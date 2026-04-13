import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total, count } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast    = useToast();

  const handleRemove = (serviceId, plan, title) => {
    removeFromCart(serviceId, plan);
    toast.info(`"${title}" ${t('cart.remove')}d from cart`);
  };

  const handleClear = () => { clearCart(); toast.info(t('cart.empty')); };

  if (count === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5%' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{t('cart.empty')}</h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>{t('services.description')}</p>
      <button onClick={() => navigate('/services')} className="btn-primary" style={{ padding: '12px 28px' }}>{t('services.all_services')} →</button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUpCart { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes glowFloat  { 0%,100%{opacity:0.4} 50%{opacity:0.7} }

        .cart-item { animation: fadeUpCart 0.35s ease both; transition: border-color 0.2s, box-shadow 0.2s; }
        .cart-item:hover { border-color: rgba(99,102,241,0.25) !important; box-shadow: 0 4px 20px rgba(99,102,241,0.08); }
        .cart-qty-btn { transition: all 0.18s; cursor: pointer; }
        .cart-qty-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .cart-remove-btn { transition: all 0.18s; cursor: pointer; }
        .cart-remove-btn:hover { background: rgba(239,68,68,0.2) !important; }
        .cart-checkout-btn { transition: all 0.2s; }
        .cart-checkout-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .cart-grid {
          display: grid;
          grid-template-columns: minmax(0,2fr) minmax(0,1fr);
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 720px) {
          .cart-grid { grid-template-columns: 1fr; }
          .cart-summary-sticky { position: static !important; top: unset !important; }
        }
        @media (max-width: 420px) {
          .cart-item-row { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      <div style={{ padding: '100px 5% 80px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', top: '20%', left: '-5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'glowFloat 5s ease-in-out infinite' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>{t('cart.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 36, fontFamily: "'Space Mono',monospace" }}>{count} {t('cart.item')}{count !== 1 ? 's' : ''} · ${total.toLocaleString()} {t('cart.total')}</p>

          <div className="cart-grid">

            {/* Items */}
            <div>
              {cart.map((item, i) => (
                <div key={i} className="cart-item cart-item-row"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', animationDelay: `${i * 0.06}s` }}>
                  {/* Color bar */}
                  <div style={{ width: 4, height: 48, borderRadius: 4, background: `linear-gradient(180deg,${PRIMARY},${ACCENT})`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.serviceTitle}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 6, background: `${PRIMARY}15`, border: `1px solid ${PRIMARY}30`, color: PRIMARY2, fontFamily: "'Space Mono',monospace" }}>{item.plan}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontFamily: "'Space Mono',monospace" }}>
                        {item.billing === 'monthly' ? '/ month' : item.billing === 'yearly' ? '/ year' : 'one-time'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(item.serviceId, item.plan, -1)} className="cart-qty-btn"
                      style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14, color: '#fff', minWidth: 22, textAlign: 'center' }}>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.serviceId, item.plan, 1)} className="cart-qty-btn"
                      style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>

                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18, color: '#A78BFA', minWidth: 70, textAlign: 'right' }}>
                    ${(item.price * (item.quantity || 1)).toLocaleString()}
                  </div>
                  <button onClick={() => handleRemove(item.serviceId, item.plan, item.serviceTitle)} className="cart-remove-btn"
                    style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                </div>
              ))}
              <button onClick={handleClear}
                style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontFamily: "'Space Mono',monospace" }}>
                {t('common.cancel')}
              </button>
            </div>

            {/* Summary */}
            <div>
              <div className="cart-summary-sticky" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${PRIMARY}20`, borderRadius: 20, padding: 28, position: 'sticky', top: 80, overflow: 'hidden' }}>
                {/* Top gradient bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`, margin: '-28px -28px 24px' }} />

                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>{t('checkout.order_summary')}</h3>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.serviceTitle} ({item.plan}) ×{item.quantity || 1}</span>
                    <span style={{ flexShrink: 0 }}>${(item.price * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontSize: 20, fontWeight: 900, fontFamily: "'Sora',sans-serif", color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
                  <span>{t('cart.total')}</span>
                  <span style={{ background: `linear-gradient(135deg,${PRIMARY2},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${total.toLocaleString()}</span>
                </div>

                {isAuthenticated ? (
                  <button onClick={() => navigate('/checkout')} className="cart-checkout-btn"
                    style={{ width: '100%', padding: '14px', fontSize: 15, background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, border: 'none', borderRadius: 12, color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 18px ${PRIMARY}40`, marginTop: 4 }}>
                    {t('cart.proceed_checkout')} →
                  </button>
                ) : (
                  <div>
                    <button onClick={() => navigate('/login', { state: { from: '/checkout' } })} className="cart-checkout-btn"
                      style={{ width: '100%', padding: '14px', fontSize: 14, background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, border: 'none', borderRadius: 12, color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 18px ${PRIMARY}40`, marginBottom: 10, marginTop: 4 }}>
                      {t('auth.login')} {t('cart.checkout')} →
                    </button>
                    <button onClick={() => navigate('/register')}
                      style={{ width: '100%', padding: '12px', fontSize: 13, background: 'transparent', border: `1px solid ${PRIMARY}35`, borderRadius: 12, color: PRIMARY2, fontFamily: "'Sora',sans-serif", fontWeight: 700, cursor: 'pointer', transition: 'all 0.18s' }}
                      onMouseEnter={e => e.currentTarget.style.background = `${PRIMARY}12`}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {t('auth.sign_up')}
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 20, padding: 14, background: `${PRIMARY}06`, border: `1px solid ${PRIMARY}15`, borderRadius: 12 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontFamily: "'Space Mono',monospace" }}>
                    🔒 Secure checkout via Stripe<br />
                    💳 All major cards accepted<br />
                    ✅ Money-back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}