export default function ProcessSection() {
  return (
    <section style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>
            How we build
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 500, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            A clear, transparent process from day 1 to launch and beyond.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[
            { step: 1, title: 'Discovery & Planning', icon: '🔍', color: '#8B5CF6' },
            { step: 2, title: 'Design & Prototyping', icon: '🎨', color: '#3B82F6' },
            { step: 3, title: 'Development', icon: '⚙️', color: '#A855F7' },
            { step: 4, title: 'Testing & QA', icon: '✅', color: '#F59E0B' },
            { step: 5, title: 'Deployment & Launch', icon: '🚀', color: '#06B6D4' },
            { step: 6, title: 'Support & Growth', icon: '📈', color: '#EC4899' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}25`, borderRadius: 20, padding: '28px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: s.color, fontFamily: "'Space Mono',monospace", fontWeight: 600 }}>Step {s.step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
