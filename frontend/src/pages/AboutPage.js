import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const C = {
  bg: '#050A14', bgCard: 'rgba(255,255,255,0.028)', border: 'rgba(255,255,255,0.07)',
  blue: '#0EA5E9', green: '#10B981', purple: '#8B5CF6', amber: '#F59E0B',
  text: '#F1F5F9', muted: 'rgba(241,245,249,0.42)', faint: 'rgba(241,245,249,0.18)',
};
const HERO_BG_IMAGE = process.env.REACT_APP_ABOUT_HERO_BG_IMAGE || '/images/about-hero-bg.png';

const TEAM = [
  { name: 'Nazat Hossain Adi',    role: 'CEO & Lead Architect',   emoji: '🧠', color: C.blue   },
  { name: 'Arifin Hasan',   role: 'Head of Cybersecurity',  emoji: '🛡️', color: C.green  },
  { name: 'Tanvir Ahmed',  role: 'AI/ML Engineer',         emoji: '🤖', color: C.purple },
  { name: 'Shakil Ahmed',role: 'DevOps Lead',            emoji: '☁️', color: C.amber  },
];

const VALUES = [
  { icon: '🎯', title: 'Precision',    desc: 'Every line of code and every security control is crafted with exactness.'    },
  { icon: '🔒', title: 'Trust',        desc: 'NDA on day one. SOC 2 processes by default. Transparency always.'            },
  { icon: '⚡', title: 'Speed',        desc: 'Project kickoff within 24 hours. Weekly updates. Zero surprise delays.'      },
  { icon: '🌍', title: 'Global Reach', desc: 'Dhaka-based team delivering world-class tech to 40+ countries.'             },
];

function Glow({ color, style }) {
  return (
    <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', background: `radial-gradient(circle, ${color}15 0%, transparent 65%)`, filter: 'blur(50px)', ...style }} />
  );
}

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes gridScroll { 0%{background-position:0 0} 100%{background-position:60px 60px} }

        .about-badge {
          display:inline-flex; align-items:center; gap:8px; padding:4px 14px; border-radius:999px;
          font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px;
          text-transform:uppercase; font-weight:500;
        }
        .about-card {
          background: ${C.bgCard}; border: 1px solid ${C.border}; border-radius:20px;
          padding: 32px 28px; transition: all 0.3s; position: relative; overflow: hidden;
        }
        .about-card:hover { border-color: rgba(14,165,233,0.25); transform: translateY(-4px); }
        .about-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; border-radius:20px 20px 0 0; }

        .team-card {
          background: ${C.bgCard}; border: 1px solid ${C.border}; border-radius:20px;
          padding:28px; text-align:center; transition: all 0.3s;
        }
        .team-card:hover { transform: translateY(-5px); }

        @media (max-width:992px) {
          .about-mission-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .about-mission-card { padding: 28px !important; }
        }
        @media (max-width:768px) {
          .about-hero-grid { min-height: 64vh !important; padding: 130px 5% 90px !important; background-size: 40px 40px !important; }
          .about-hero-title { letter-spacing: -1px !important; line-height: 1.1 !important; }
          .about-hero-sub { font-size: 15px !important; line-height: 1.75 !important; }
          .about-section { padding: 72px 5% !important; }
          .about-values-grid { grid-template-columns: 1fr 1fr !important; }
          .about-team-grid   { grid-template-columns: 1fr 1fr !important; }
          .about-badge { font-size: 9px !important; letter-spacing: 1.2px !important; }
        }
        @media (max-width:480px) {
          .about-hero-grid { min-height: 58vh !important; padding: 118px 5% 78px !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
          .about-team-grid   { grid-template-columns: 1fr 1fr !important; }
          .about-mission-card { padding: 22px !important; border-radius: 18px !important; }
          .about-cta-buttons { flex-direction: column !important; }
          .about-cta-buttons a { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "'Outfit',sans-serif", minHeight: '100vh' }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="about-hero-grid" style={{
          padding: '170px 5% 130px', minHeight: '78vh', textAlign: 'center', position: 'relative', overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(5,10,20,0.9) 0%, rgba(5,10,20,0.72) 48%, rgba(5,10,20,0.9) 100%)' }} />
          <Glow color={C.blue}   style={{ width: 600, height: 600, top: '-20%', left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', animation: 'fadeUp 0.7s ease both' }}>
            <span className="about-badge" style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}28`, color: C.purple, marginBottom: 24 }}>
              Our Story
            </span>
            <h1 className="about-hero-title" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(36px,5vw,68px)', fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, color: C.text, marginBottom: 22 }}>
              Built by engineers.<br />
              <span style={{ color: C.blue }}>Trusted by teams worldwide.</span>
            </h1>
            <p className="about-hero-sub" style={{ color: C.muted, fontSize: 17, lineHeight: 1.85, maxWidth: 560, margin: '0 auto' }}>
              Universe Soft Tech was founded in Dhaka with a single mission: deliver enterprise-grade technology without the enterprise overhead. From cybersecurity to AI — we build things that matter.
            </p>
          </div>
        </section>

        {/* ── MISSION ─────────────────────────────────────────── */}
        <section className="about-section" style={{ padding: '90px 5%', position: 'relative' }}>
          <Glow color={C.green} style={{ width: 500, height: 500, top: '10%', right: '-10%' }} />
          <div className="about-mission-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="about-badge" style={{ background: `${C.green}10`, border: `1px solid ${C.green}28`, color: C.green, marginBottom: 18 }}>Mission & Vision</span>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, letterSpacing: -1.2, color: C.text, marginBottom: 20, lineHeight: 1.15 }}>
                Technology that<br />serves humanity.
              </h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.9, marginBottom: 18 }}>
                We believe great software should be accessible to businesses of all sizes. From early-stage startups to established enterprises, we bring the same rigor, craft, and care to every project.
              </p>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.9 }}>
                Our vision is a world where every organization can protect itself, automate intelligently, and scale confidently — regardless of geography or budget.
              </p>
            </div>
            {/* Stats panel */}
            <div className="about-mission-card" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.blue}, ${C.purple})` }} />
              {[
                ['2019', 'Founded in Dhaka'],
                ['40+', 'Countries served'],
                ['150+', 'Projects delivered'],
                ['98%', 'Client retention rate'],
              ].map(([v, l]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.muted, fontSize: 14 }}>{l}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 20, color: C.blue }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUES ─────────────────────────────────────────── */}
        <section className="about-section" style={{ padding: '90px 5%', position: 'relative' }}>
          <Glow color={C.purple} style={{ width: 500, height: 500, bottom: '0%', left: '-10%' }} />
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="about-badge" style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}28`, color: C.blue, marginBottom: 16 }}>Core Values</span>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, letterSpacing: -1.2, color: C.text }}>
                What drives us every day.
              </h2>
            </div>
            <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
              {VALUES.map((v, i) => {
                const colors = [C.blue, C.green, C.amber, C.purple];
                const c = colors[i];
                return (
                  <div key={i} className="about-card" style={{ '--ac': c }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c, borderRadius: '20px 20px 0 0' }} />
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c}15`, border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
                      {v.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 10 }}>{v.title}</h3>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75 }}>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TEAM ───────────────────────────────────────────── */}
        <section className="about-section" style={{ padding: '90px 5%', position: 'relative', borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="about-badge" style={{ background: `${C.amber}10`, border: `1px solid ${C.amber}28`, color: C.amber, marginBottom: 16 }}>The Team</span>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, letterSpacing: -1.2, color: C.text }}>
                The people behind the code.
              </h2>
            </div>
            <div className="about-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
              {TEAM.map((m, i) => (
                <div key={i} className="team-card" style={{ borderColor: `${m.color}20` }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${m.color}18`, border: `2px solid ${m.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 18px' }}>
                    {m.emoji}
                  </div>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>{m.name}</h3>
                  <p style={{ fontSize: 12, color: m.color, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5 }}>{m.role}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/team" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.blue, textDecoration: 'none', letterSpacing: 0.5 }}>
                Meet the full team →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="about-section" style={{ padding: '90px 5%', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800, letterSpacing: -1, color: C.text, marginBottom: 16 }}>
            Want to work with us?
          </h2>
          <p style={{ color: C.muted, fontSize: 16, marginBottom: 32 }}>We'd love to hear about your project.</p>
          <div className="about-cta-buttons" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 12, background: C.blue, color: '#fff', fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: `0 0 24px ${C.blue}40`, transition: 'all 0.2s' }}>
              Get in touch →
            </Link>
            <Link to="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'transparent', color: C.text, border: `1px solid ${C.border}`, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}>
              View our work
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}