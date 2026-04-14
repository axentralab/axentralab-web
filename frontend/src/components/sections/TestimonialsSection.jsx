import { useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    name: 'Samiul Islam',
    role: 'CEO, TechStart Bangladesh',
    avatar: 'SI',
    color: '#8B5CF6',
    company: 'TechStart Bangladesh',
    quote: 'Axentralab built our entire product from scratch. Amazing communication, delivered on time, and the code quality is production-ready. Best decision we made.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samiul',
  },
  {
    name: 'Naimul Hasan',
    role: 'Founder, E-Commerce Store',
    avatar: 'NH',
    color: '#3B82F6',
    company: 'Local Shop BD',
    quote: 'They converted my shop to online in 3 weeks. The platform runs smoothly, checkout works perfectly, and they handle all updates. Highly recommend!',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naimul',
  },
  {
    name: 'Farida Rahman',
    role: 'Director, Digital Marketing Agency',
    avatar: 'FR',
    color: '#A855F7',
    company: 'Digital Ventures',
    quote: 'Working with Axentralab was seamless. Their team understands business needs, not just tech. They built a custom automation platform that saves us 20 hours weekly.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farida',
  },
  {
    name: 'Karim Ahmed',
    role: 'Business Owner, Retail Chain',
    avatar: 'KA',
    color: '#F59E0B',
    company: 'Karim Retail Group',
    quote: 'Best investment in our business. The POS system is intuitive, reporting is accurate, and their support is always there when we need help.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
  },
  {
    name: 'Nasrin Akter',
    role: 'Startup Founder, SaaS',
    avatar: 'NA',
    color: '#06B6D4',
    company: 'CloudSync Solutions',
    quote: 'Exceptional team. They didn\'t just build what I asked for — they suggested improvements that made the product 10x better. True partners, not just vendors.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin',
  },
  {
    name: 'Rashid Uddin',
    role: 'CTO, FinTech Startup',
    avatar: 'RU',
    color: '#EC4899',
    company: 'PayFlow Bangladesh',
    quote: 'Security audit and infrastructure setup with Axentralab. Their expertise in cybersecurity and cloud architecture gave us confidence to scale.',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashid',
  },
];

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  return (
    <section style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '50%', right: '-20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.08)', color: '#A855F7', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
            Trusted by 6+ Companies
          </span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>
            What our clients say
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 480, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Real feedback from real clients who trusted us to build their digital products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 36 }}>
          {TESTIMONIALS.map((testimonial, i) => {
            const color = testimonial.color;
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${color}25`,
                  borderRadius: 20,
                  padding: '24px 24px 20px',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}50`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 48px ${color}12`;
                  setAutoplay(false);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${color}25`;
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  setAutoplay(true);
                }}
              >
                {/* Top stripe */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${color},transparent)` }} />

                {/* Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color, fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, background: `${color}12`, border: `1px solid ${color}28`, color, fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 600, textTransform: 'uppercase' }}>Verified</span>
                </div>

                {/* Quote */}
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: `linear-gradient(90deg,${color}20,transparent)`, margin: '0 0 18px' }} />

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: `${color}20`,
                    border: `2px solid ${color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 900,
                    color,
                    flexShrink: 0,
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: -0.2 }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
          {[
            { value: '6+', label: 'Happy Clients', color: '#8B5CF6' },
            { value: '15+', label: 'Projects Done', color: '#3B82F6' },
            { value: '98%', label: 'Satisfaction', color: '#A855F7' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 900, color: stat.color, letterSpacing: -0.5, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace" }}>
            Ready to start your project? <a href="/contact" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 700 }}>Get in touch →</a>
          </span>
        </div>
      </div>
    </section>
  );
}
