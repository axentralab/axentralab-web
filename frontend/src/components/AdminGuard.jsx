import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * AdminGuard — wraps admin-only UI.
 * Even if router-level guard is bypassed, this component
 * re-checks the user role before rendering children.
 */
export default function AdminGuard({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5%',
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🚫</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Access Denied
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
          You don't have permission to view this page.
        </p>
        <a href="/" className="btn-primary" style={{ padding: '12px 28px', textDecoration: 'none' }}>
          Go Home →
        </a>
      </div>
    );
  }

  return children;
}