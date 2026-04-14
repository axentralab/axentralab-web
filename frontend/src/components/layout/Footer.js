import { Link } from 'react-router-dom';
import NewsletterSignup from '../common/NewsletterSignup';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 5% 28px', background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto 48px' }}>
        <NewsletterSignup />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 36, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000' }}>A</div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: '#fff' }}>Axentralab</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 260 }}>AI automation, secure development and cloud infrastructure for modern companies.</p>
        </div>
        {[
          { title: 'Services', links: [{ to:'/services', l:'AI Automation'},{to:'/services',l:'Cybersecurity'},{to:'/services',l:'Web Development'},{to:'/services',l:'DevOps'}] },
          { title: 'Products', links: [{to:'/products',l:'WP Shield'},{to:'/products',l:'SiteGuard'},{to:'/products',l:'API Scanner'}] },
          { title: 'Company',  links: [{to:'/portfolio',l:'Portfolio'},{to:'/blog',l:'Blog'},{to:'/careers',l:'Careers'},{to:'/contact',l:'Contact'}] },
          { title: 'Account',  links: [{to:'/login',l:'Login'},{to:'/register',l:'Sign Up'},{to:'/dashboard',l:'Dashboard'},{to:'/cart',l:'Cart'}] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 14 }}>{col.title}</div>
            {col.links.map((l,i) => (
              <Link key={i} to={l.to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 9, transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>{l.l}</Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: '36px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>© 2025 Axentralab. All rights reserved.</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Privacy · Terms · Security</span>
      </div>
    </footer>
  );
}
