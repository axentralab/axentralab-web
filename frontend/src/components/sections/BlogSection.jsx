import { Link } from 'react-router-dom';

export default function BlogSection() {
  return (
    <section style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>
              Latest from our blog
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 500, fontSize: 15, lineHeight: 1.7 }}>
              Deep dives into development, AI automation, and business growth.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 36 }}>
          {[
            { title: 'Building Scalable Web Applications', excerpt: 'Learn best practices for large-scale applications.', category: 'Web Dev', color: '#8B5CF6' },
            { title: 'AI Automation: Save 20 Hours Weekly', excerpt: 'Practical AI workflows that automate repetitive tasks.', category: 'AI', color: '#A855F7' },
            { title: 'Cybersecurity Checklist for Startups', excerpt: 'A comprehensive guide to protecting your web app.', category: 'Security', color: '#EF4444' },
          ].map((post, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: `${post.color}15`, border: `1px solid ${post.color}30`, color: post.color, fontSize: 10, fontWeight: 700, marginBottom: 12 }}>
                  {post.category}
                </div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: -0.3, lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/blog" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'Sora',sans-serif", textDecoration: 'none' }}>
            Read All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
