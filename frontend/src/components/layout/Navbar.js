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
  const navigate  = useNavigate();
  const location  = useLocation();

  const NAVBAR_H = 64;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/',          label: 'Home' },
    { to: '/about',     label: 'About' },
    { to: '/services',  label: 'Services' },
    { to: '/products',  label: 'Products' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/team',      label: 'Team' },
    { to: '/blog',      label: 'Blog' },
    { to: '/contact',   label: 'Contact' },
    { to: '/quote',     label: '💰 Quote', highlight: true },
  ];

  const active = (path) =>
    location.pathname === path ? '#8B5CF6' : 'rgba(255,255,255,0.65)';

  return (
    <>
      <style>{`
        @media (min-width: 900px) { .mobile-nav  { display: none !important; } }
        @media (max-width: 899px) { .desktop-nav { display: none !important; } }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: NAVBAR_H, padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(2,6,23,0.97)' : 'transparent',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.1)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img 
          src="https://res.cloudinary.com/dwrlbuej9/image/upload/v1775726329/Screenshot_2026-04-09_151038-removebg-preview_tsvt42.png"
          alt="AxentraLab Logo"
          style={{ 
            height: '40px', 
            width: 'auto',
            objectFit: 'contain'
          }}
        />      
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: -0.5 }}>
          AxentraLab
        </span>
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
              background: l.highlight ? 'rgba(139,92,246,0.15)' : 'transparent',
              border: l.highlight ? '1px solid rgba(139,92,246,0.3)' : 'none',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => {
                e.target.style.color = '#fff';
                if (l.highlight) e.target.style.background = 'rgba(139,92,246,0.25)';
              }}
              onMouseLeave={e => {
                e.target.style.color = l.highlight ? '#fff' : active(l.to);
                if (l.highlight) e.target.style.background = 'rgba(139,92,246,0.15)';
              }}>
              {l.label}
            </Link>
          ))}

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', marginLeft: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 18, textDecoration: 'none' }}>
            🛒
            {count > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: '#8B5CF6', borderRadius: '50%', fontSize: 10, fontWeight: 800, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative', marginLeft: 8 }}>
              <button onClick={() => setUserMenu(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF620', border: '1px solid #8B5CF640', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
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
                    <Link to="/admin" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#8B5CF6', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(139,92,246,0.08)'}
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
              <Link to="/register" style={{ padding: '8px 16px', borderRadius: 8, background: '#8B5CF6', fontWeight: 700, fontSize: 13, color: '#000', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="mobile-nav">
          <Link to="/cart" style={{ position: 'relative', fontSize: 20, textDecoration: 'none' }}>
            🛒
            {count > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: '#8B5CF6', borderRadius: '50%', fontSize: 9, color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
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
          top: NAVBAR_H,
          left: 0, right: 0, bottom: 0,
          zIndex: 999,
          background: 'rgba(2,6,23,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '24px 6%',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{ padding: '14px 20px', borderRadius: 12, fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: location.pathname === l.to ? '#8B5CF6' : 'rgba(255,255,255,0.8)', border: '1px solid transparent', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: '#8B5CF6', textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: 15, color: '#EF4444', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', fontWeight: 600, fontSize: 15, color: '#fff', textAlign: 'center', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ padding: '14px 20px', borderRadius: 12, background: '#8B5CF6', fontWeight: 700, fontSize: 15, color: '#000', textAlign: 'center', textDecoration: 'none' }}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}