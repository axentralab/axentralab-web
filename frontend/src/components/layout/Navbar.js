import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [userMenu, setUserMenu]       = useState(false);
  const [promoBanner, setPromoBanner] = useState(true);
  const navigate  = useNavigate();
  const location  = useLocation();

  const NAVBAR_H = 64;
  const BANNER_H = promoBanner ? 44 : 0;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/services',  label: 'Services' },
    { to: '/products',  label: 'Products' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/team',      label: 'Team' },
    { to: '/blog',      label: 'Blog' },
    { to: '/contact',   label: 'Contact' },
    { to: '/quote',     label: '💰 Quote', highlight: true },
  ];

  const active = (path) =>
    location.pathname === path ? '#22C55E' : 'rgba(255,255,255,0.65)';

  return (
    <>
      <style>{`
        @keyframes navShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes navPulse {
          0%,100% { opacity:.5; transform:scale(1); }
          50%      { opacity:1; transform:scale(1.08); }
        }
        .promo-shimmer-nav {
          background: linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.15) 50%, transparent 100%);
          background-size: 400px 100%;
          animation: navShimmer 2.5s infinite linear;
        }
        .promo-dot { animation: navPulse 2s infinite; }
        .promo-sep { display: inline-block; }
        @media (max-width: 768px) { .promo-sep { display: none !important; } }
        @media (min-width: 900px) { .mobile-nav  { display: none !important; } }
        @media (max-width: 899px) { .desktop-nav { display: none !important; } }
      `}</style>

      {/* ── Promo Banner ── */}
      {promoBanner && (
        <div style={{
          position: 'fixed',
          top: NAVBAR_H,
          left: 0, right: 0,
          zIndex: 999,
          height: BANNER_H,
          background: 'linear-gradient(90deg,#78350f,#92400e,#b45309,#92400e,#78350f)',
          borderBottom: '1px solid rgba(251,191,36,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10,
          padding: '0 48px 0 5%',
          overflow: 'hidden',
        }}>
          <div className="promo-shimmer-nav" style={{ position:'absolute', inset:0, pointerEvents:'none' }} />
          <span className="promo-dot" style={{ width:7, height:7, borderRadius:'50%', background:'#FCD34D', display:'inline-block', flexShrink:0, position:'relative' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'center', position:'relative' }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#FCD34D', letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, whiteSpace:'nowrap' }}>
              Limited Offer
            </span>
            <span className="promo-sep" style={{ width:3, height:3, borderRadius:'50%', background:'rgba(251,191,36,0.5)', display:'inline-block' }} />
            <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, color:'#fff', whiteSpace:'nowrap' }}>
              🎁 Get <span style={{ color:'#FCD34D' }}>50% OFF</span> your first project
            </span>
            <span className="promo-sep" style={{ width:3, height:3, borderRadius:'50%', background:'rgba(251,191,36,0.5)', display:'inline-block' }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(253,230,138,0.7)', whiteSpace:'nowrap' }}>
              Code: <strong style={{ color:'#FCD34D', letterSpacing:1 }}>FIRST50</strong>
            </span>
          </div>
          <Link to="/contact" style={{
            position: 'relative',
            padding: '4px 14px',
            background: '#F59E0B',
            color: '#000',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            fontFamily: "'Sora',sans-serif",
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Claim →
          </Link>
          <button
            onClick={() => setPromoBanner(false)}
            aria-label="Dismiss"
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              color: 'rgba(253,230,138,0.55)', fontSize: 18,
              cursor: 'pointer', lineHeight: 1, padding: '4px 6px',
            }}
          >×</button>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: NAVBAR_H, padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(2,6,23,0.97)' : 'transparent',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(34,197,94,0.1)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#000' }}>A</div>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: -0.5 }}>Axentralab</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              color: l.highlight ? '#fff' : active(l.to),
              background: l.highlight ? 'rgba(34,197,94,0.15)' : 'transparent',
              border: l.highlight ? '1px solid rgba(34,197,94,0.3)' : 'none',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => {
                e.target.style.color = '#fff';
                if (l.highlight) e.target.style.background = 'rgba(34,197,94,0.25)';
              }}
              onMouseLeave={e => {
                e.target.style.color = l.highlight ? '#fff' : active(l.to);
                if (l.highlight) e.target.style.background = 'rgba(34,197,94,0.15)';
              }}>
              {l.label}
            </Link>
          ))}

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', marginLeft: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 18, textDecoration: 'none' }}>
            🛒
            {count > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: '#22C55E', borderRadius: '50%', fontSize: 10, fontWeight: 800, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative', marginLeft: 8 }}>
              <button onClick={() => setUserMenu(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#22C55E20', border: '1px solid #22C55E40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </span>
                {user?.name?.split(' ')[0]}
              </button>
              {userMenu && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 8, minWidth: 180, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 100 }}>
                  <Link to="/dashboard" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    📊 Dashboard
                  </Link>
                  <Link to="/dashboard/orders" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    📦 My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#22C55E', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(34,197,94,0.08)'}
                      onMouseLeave={e => e.target.style.background = 'none'}>
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: '#EF4444', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.target.style.background = 'none'}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
              <Link to="/login"    style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ padding: '8px 16px', borderRadius: 8, background: '#22C55E', fontWeight: 700, fontSize: 13, color: '#000', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="mobile-nav">
          <Link to="/cart" style={{ position: 'relative', fontSize: 20, textDecoration: 'none' }}>
            🛒
            {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: '#22C55E', borderRadius: '50%', fontSize: 9, color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
          </Link>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 22, height: 2, background: 'rgba(255,255,255,0.7)', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? (i===0?'rotate(45deg) translate(5px,5px)':i===2?'rotate(-45deg) translate(5px,-5px)':'scaleX(0)') : 'none' }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: NAVBAR_H + BANNER_H,
          left: 0, right: 0, bottom: 0,
          zIndex: 999,
          background: 'rgba(2,6,23,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '24px 6%',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{ padding: '14px 20px', borderRadius: 12, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: location.pathname === l.to ? '#22C55E' : 'rgba(255,255,255,0.8)', border: '1px solid transparent', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: '#22C55E', textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: 15, color: '#EF4444', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 15, color: '#fff', textAlign: 'center', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ padding: '14px 20px', borderRadius: 12, background: '#22C55E', fontWeight: 700, fontSize: 15, color: '#000', textAlign: 'center', textDecoration: 'none' }}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}