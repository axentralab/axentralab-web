import { Link } from 'react-router-dom';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';

export default function NotFoundPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp404  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes floatNum   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glowPulse  { 0%,100%{opacity:0.5} 50%{opacity:1} }

        .n404-num   { animation: floatNum  3.5s ease-in-out infinite; }
        .n404-h1    { animation: fadeUp404 0.5s 0.1s ease both; }
        .n404-p     { animation: fadeUp404 0.5s 0.18s ease both; }
        .n404-btns  { animation: fadeUp404 0.5s 0.26s ease both; }

        .n404-btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg,${PRIMARY},${ACCENT});
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Sora',sans-serif; font-weight: 800; font-size: 14px;
          cursor: pointer; text-decoration: none; display: inline-block;
          box-shadow: 0 4px 18px rgba(99,102,241,0.4);
          transition: all 0.2s;
        }
        .n404-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.5); }

        .n404-btn-outline {
          padding: 13px 28px;
          background: transparent; color: ${PRIMARY2};
          border: 1px solid ${PRIMARY}35; border-radius: 12px;
          font-family: 'Sora',sans-serif; font-weight: 700; font-size: 14px;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: all 0.2s;
        }
        .n404-btn-outline:hover { background: ${PRIMARY}12; transform: translateY(-2px); }
      `}</style>

      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5%', position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${PRIMARY}12,transparent 70%)`, pointerEvents: 'none', animation: 'glowPulse 4s ease-in-out infinite' }} />

        <div className="n404-num" style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(80px,15vw,140px)', fontWeight: 900, background: `linear-gradient(135deg,${PRIMARY}28,${ACCENT}18)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, letterSpacing: -4, marginBottom: 8, filter: `drop-shadow(0 0 30px ${PRIMARY}30)` }}>
          404
        </div>

        <h1 className="n404-h1" style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Page Not Found</h1>
        <p className="n404-p" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 36, maxWidth: 340, lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="n404-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="n404-btn-primary">Go Home →</Link>
          <Link to="/contact" className="n404-btn-outline">Contact Us</Link>
        </div>
      </div>
    </>
  );
}