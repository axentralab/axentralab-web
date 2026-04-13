import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        @keyframes fadeUpIn   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes scaleIn    { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes glowPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 50%{box-shadow:0 0 0 20px rgba(99,102,241,0)} }
        @keyframes glowFloat  { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.75;transform:scale(1.05)} }

        .anim-0 { animation: scaleIn  0.6s 0s    cubic-bezier(0.34,1.56,0.64,1) both; }
        .anim-1 { animation: fadeUpIn 0.55s 0.15s ease both; }
        .anim-2 { animation: fadeUpIn 0.55s 0.25s ease both; }
        .anim-3 { animation: fadeUpIn 0.55s 0.35s ease both; }
        .anim-4 { animation: fadeUpIn 0.55s 0.44s ease both; }

        @media (prefers-reduced-motion: reduce) {
          .anim-0,.anim-1,.anim-2,.anim-3,.anim-4 { animation: none; opacity: 1; transform: none; }
        }

        .success-btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg,${PRIMARY},${ACCENT});
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Sora',sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 18px rgba(99,102,241,0.4);
          transition: all 0.2s;
        }
        .success-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.5); }

        .success-btn-outline {
          padding: 13px 28px;
          background: transparent;
          color: ${PRIMARY2};
          border: 1px solid ${PRIMARY}40;
          border-radius: 12px;
          font-family: 'Sora',sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }
        .success-btn-outline:hover { background: ${PRIMARY}12; transform: translateY(-2px); }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5%', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'fixed', top: '20%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)', pointerEvents: 'none', animation: 'glowFloat 6s ease-in-out infinite' }} />
        <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)', pointerEvents: 'none' }} />

        {/* Emoji with ring */}
        <div className="anim-0" style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg,${PRIMARY}22,${ACCENT}18)`, border: `2px solid ${PRIMARY}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, animation: 'glowPulse 2.5s infinite', margin: '0 auto' }}>
            🎉
          </div>
        </div>

        <h1 className="anim-1" style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 14, lineHeight: 1.1 }}>
          {t('order_success.title')}
        </h1>

        <p className="anim-2" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 420, marginBottom: 12, lineHeight: 1.75 }}>
          {t('order_success.confirmation_message')}
        </p>

        <p className="anim-2" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, maxWidth: 380, marginBottom: 40, lineHeight: 1.7 }}>
          {t('order_success.details_message')}
        </p>

        {/* Steps */}
        <div className="anim-3" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40, maxWidth: 600 }}>
          {[
            { icon: '📧', label: t('order_success.steps.confirmation_email') },
            { icon: '📋', label: t('order_success.steps.scope_call') },
            { icon: '🚀', label: t('order_success.steps.build_starts') },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20`, borderRadius: 12 }}>
              <span style={{ fontSize: 16 }}>{step.icon}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: "'Space Mono',monospace", fontWeight: 600 }}>{step.label}</span>
            </div>
          ))}
        </div>

        <div className="anim-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard/orders" className="success-btn-primary">{t('order_success.orders_button')}</Link>
          <Link to="/services" className="success-btn-outline">{t('order_success.browse_button')}</Link>
        </div>
      </div>
    </>
  );
}