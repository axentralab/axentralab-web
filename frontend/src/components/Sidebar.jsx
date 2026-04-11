import { Link, useLocation } from 'react-router-dom';

/**
 * Shared sidebar component.
 *
 * Props:
 *  - navItems: [{ icon, label, path, external? }]
 *  - user: { name, role? }
 *  - badge: optional string shown above user name (e.g. "ADMIN PANEL")
 *  - onLogout: function
 */
export default function Sidebar({ navItems, user, badge, onLogout }) {
  const location = useLocation();

  return (
    <aside style={{
      width: 220,
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '28px 14px',
      flexShrink: 0,
      position: 'sticky',
      top: 64,
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header: badge + user name OR avatar */}
      <div style={{ padding: '0 8px', marginBottom: 28 }}>
        {badge ? (
          <>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#22C55E', letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>
              {badge}
            </div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {user?.name}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg,#22C55E,#16A34A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 16,
              color: '#000', flexShrink: 0,
            }}>
              {user?.name?.[0]}
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>
                {user?.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                {user?.role || 'Client'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const isHome = item.path === '/dashboard' || item.path === '/admin';
          const active = isHome
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path) && item.path !== '/';

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                border: active ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                color: active ? '#22C55E' : 'rgba(255,255,255,0.55)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                textDecoration: 'none', transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10, width: '100%',
          background: 'none', border: '1px solid transparent',
          color: 'rgba(255,255,255,0.35)', fontSize: 14,
          textAlign: 'left', marginTop: 8, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}