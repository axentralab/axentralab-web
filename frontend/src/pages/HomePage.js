import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ProcessSection from '../components/sections/ProcessSection';
import BlogSection from '../components/sections/BlogSection';
import ReferralTierComparison from '../components/sections/ReferralTierComparison';
import { ReferralCtaBanner } from '../components/ui/ReferralPromoAd';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATS = [
  { value: 24,  suffix: '+', label: 'Projects Completed',    color: '#8B5CF6' },
  { value: 20,  suffix: '+', label: 'Happy Clients',         color: '#3B82F6' },
  { value: 99,  suffix: '%', label: 'Client Satisfaction',   color: '#A855F7' },
  { value: 24,  suffix: '/7', label: 'Security Monitoring',  color: '#F59E0B' },
];

// Terminal lines shown in the floating code widget


// AI Tool tab definitions
const AI_TABS = [
  { id: 'copy',  label: '✍️ Copywriter', icon: '✍️' },
  { id: 'email', label: '📧 Email',      icon: '📧' },
  { id: 'seo',   label: '🔍 SEO',        icon: '🔍' },
];

const TONES   = ['Professional', 'Casual', 'Bold', 'Friendly', 'Persuasive'];
const LENGTHS = ['Short', 'Medium', 'Long'];
const HERO_BG_IMAGE = process.env.REACT_APP_HOME_HERO_BG_IMAGE || '/images/home-hero-bg.png';

// Terminal animation lines for FloatingTerminal widget
const TERMINAL_LINES = [
  { text: '$ axentralab init --secure',         color: '#8B5CF6', delay: 200  },
  { text: '✔ Scanning dependencies…',           color: '#22D3EE', delay: 700  },
  { text: '✔ OWASP vulnerability scan: clean',  color: '#22C55E', delay: 1200 },
  { text: '✔ SSL/TLS certificate applied',      color: '#22C55E', delay: 1700 },
  { text: '✔ WAF rules loaded (247 rules)',      color: '#22C55E', delay: 2100 },
  { text: '$ deploying to production…',         color: '#F59E0B', delay: 2600 },
  { text: '🚀 Live → axentralab.com',           color: '#A855F7', delay: 3100 },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        let i = 0;
        const tick = setInterval(() => {
          i++;
          const ease = 1 - Math.pow(1 - i / steps, 3);
          setVal(Math.floor(target * ease));
          if (i >= steps) { setVal(target); clearInterval(tick); }
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [val, ref];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ stat }) {
  const [val, ref] = useCounter(stat.value);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '28px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 900, color: stat.color, letterSpacing: -1, lineHeight: 1 }}>
        {val}{stat.suffix}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase' }}>{stat.label}</div>
    </div>
  );
}

function Glow({ x, y, color = '#8B5CF6', size = 500 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      background: `radial-gradient(circle,${color}15 0%,transparent 70%)`,
      borderRadius: '50%', pointerEvents: 'none',
      transform: 'translate(-50%,-50%)', filter: 'blur(40px)',
    }} />
  );
}

// Animated headline that cycles through words
function AnimatedHeadline() {
  const words  = ['digital presence', 'secure systems', 'business growth'];
  const colors = ['#8B5CF6', '#3B82F6', '#F59E0B', '#A855F7'];
  const [idx, setIdx]     = useState(0);
  const [visible, setVis] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setVis(true); }, 350);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <span style={{
      color: colors[idx],
      display: 'inline-block',
      transition: 'opacity 0.35s, transform 0.35s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(10px)',
    }}>
      {words[idx]}
    </span>
  );
}

// Floating terminal widget
function FloatingTerminal() {
  const [visibleLines, setVisibleLines] = useState([]);
  // loopKey increments to restart the animation cycle cleanly
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    setVisibleLines([]);
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    );
    const resetTimer = setTimeout(() => {
      setLoopKey(k => k + 1);
    }, TERMINAL_LINES[TERMINAL_LINES.length - 1].delay + 2400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
    };
  }, [loopKey]); // only re-runs when loopKey changes — no double-effect, no race

  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      fontFamily: "'Space Mono',monospace",
      fontSize: 13,
      minHeight: 240,
    }}>
      {/* Title bar */}
      <div style={{ padding: '12px 16px', background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.5 }}>axentralab — terminal</span>
      </div>
      {/* Lines */}
      <div style={{ padding: '18px 20px', minHeight: 200 }}>
        {TERMINAL_LINES.map((line, i) => (
          <div key={i} style={{
            color: visibleLines.includes(i) ? line.color : 'transparent',
            transition: 'color 0.3s, opacity 0.3s',
            marginBottom: 6,
            opacity: visibleLines.includes(i) ? 1 : 0,
            lineHeight: 1.6,
          }}>
            {line.text}
          </div>
        ))}
        {/* blinking cursor */}
        <span style={{ display: 'inline-block', width: 8, height: 14, background: '#8B5CF6', verticalAlign: 'middle', animation: 'blink 1s step-end infinite', marginLeft: 2 }} />
      </div>
    </div>
  );
}

// Scroll indicator arrow
function ScrollIndicator() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY < 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      opacity: show ? 1 : 0, transition: 'opacity 0.4s',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      animation: 'bounceY 2s ease-in-out infinite',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase' }}>scroll</span>
      <div style={{ width: 1, height: 36, background: 'linear-gradient(#8B5CF6, transparent)' }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />
    </div>
  );
}

// ─── Free AI Tool Section ──────────────────────────────────────────────────────

function FreeAITool() {
  const [tab, setTab]       = useState('copy');
  const [tone, setTone]     = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [topic, setTopic]   = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [chars, setChars]     = useState(0);

  const PROMPTS = {
    copy: (t, tone, length) =>
      `Write a compelling marketing copy for: "${t}". Tone: ${tone}. Length: ${length}. Return only the copy, no explanations.`,
    email: (t, tone, length) =>
      `Write a professional email about: "${t}". Tone: ${tone}. Length: ${length}. Include subject line. Return only the email.`,
    seo: (t, tone, length) =>
      `Write an SEO-optimised meta description and title tag for: "${t}". Tone: ${tone}. Length hint: ${length}. Format clearly.`,
  };

  const PLACEHOLDERS = {
    copy: 'e.g. AI automation tool for small businesses',
    email: 'e.g. Follow-up after a product demo',
    seo:  'e.g. Cybersecurity services for startups',
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput('');
    setCopied(false);
    try {
      // FIX: Route through backend — never expose Anthropic API key in the browser.
      // Your backend /ai/generate endpoint should forward to Anthropic with the key
      // stored securely in server env vars (ANTHROPIC_API_KEY).
      const res  = await api.post('/ai/generate', {
        tab,
        prompt: PROMPTS[tab](topic, tone, length),
      });
      const text = res.data?.text || res.data?.content || 'No output.';
      setOutput(text);
      setChars(text.length);
    } catch (err) {
      setOutput('⚠️ Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section style={{ padding: '100px 5%', background: 'rgba(139,92,246,0.02)', borderTop: '1px solid rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(139,92,246,0.08)', position: 'relative', overflow: 'hidden' }}>
      {/* bg glow */}
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, border: '1px solid #8B5CF640', background: '#8B5CF610', color: '#8B5CF6', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', animation: 'pulse 2s infinite' }} />
            Free AI Tool — No login required
          </span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 14 }}>
            Generate content with AI<br />
            <span style={{ color: '#8B5CF6' }}>in seconds.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            Powered by Claude. Pick a tool, set your tone, and generate.
          </p>
        </div>

        {/* Tool card */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)', padding: '0 4px' }}>
            {AI_TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setOutput(''); }}
                style={{
                  flex: 1, padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
                  color: tab === t.id ? '#8B5CF6' : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t.id ? '2px solid #8B5CF6' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px 28px 32px' }}>
            {/* Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Topic / Subject
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder={PLACEHOLDERS[tab]}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                  padding: '13px 18px', color: '#fff', fontSize: 14, outline: 'none',
                  fontFamily: "'Sora',sans-serif", boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Selectors row */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
              {/* Tone */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Tone</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      style={{
                        padding: '5px 12px', borderRadius: 8, border: tone === t ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        background: tone === t ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                        color: tone === t ? '#8B5CF6' : 'rgba(255,255,255,0.4)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: "'Space Mono',monospace",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Length</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {LENGTHS.map(l => (
                    <button key={l} onClick={() => setLength(l)}
                      style={{
                        padding: '5px 14px', borderRadius: 8, border: length === l ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        background: length === l ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                        color: length === l ? '#3B82F6' : 'rgba(255,255,255,0.4)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: "'Space Mono',monospace",
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: loading || !topic.trim() ? 'rgba(139,92,246,0.25)' : '#8B5CF6',
                color: loading || !topic.trim() ? 'rgba(0,0,0,0.4)' : '#000',
                border: 'none', fontSize: 15, fontWeight: 800, cursor: loading || !topic.trim() ? 'default' : 'pointer',
                fontFamily: "'Sora',sans-serif", letterSpacing: -0.3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s',
              }}>
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Generating…
                </>
              ) : '⚡ Generate with AI'}
            </button>

            {/* Output */}
            {output && (
              <div style={{ marginTop: 24, position: 'relative', animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5 }}>
                    OUTPUT · {chars} chars
                  </span>
                  <button onClick={handleCopy}
                    style={{
                      padding: '4px 12px', borderRadius: 8,
                      background: copied ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${copied ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      color: copied ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
                      fontSize: 11, fontFamily: "'Space Mono',monospace", cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {copied ? '✓ Copied' : '⧉ Copy'}
                  </button>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '18px 20px',
                  color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', maxHeight: 320, overflowY: 'auto',
                  fontFamily: "'Sora',sans-serif",
                }}>
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nudge */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono',monospace" }}>
          Want custom AI tools for your business? <Link to="/contact" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 700 }}>Let's talk →</Link>
        </p>
      </div>
    </section>
  );
}

// ─── New Section Data ─────────────────────────────────────────────────────────

const TOOLS_GRID = [
  { icon: '🌐', name: 'Business Website',      tag: 'Web Development',    desc: 'Clean, fast and professional websites for businesses, corporates and startups — responsive, SEO-ready and conversion-focused.',         features: ['5+ pages', 'Mobile responsive', 'SEO setup'],         price: 10000, tier: 'From ৳', color: '#8B5CF6' },
  { icon: '🛒', name: 'E-commerce Store',      tag: 'Online Shop',        desc: 'Full-featured online stores with product management, cart, checkout and local payment gateway (bKash/Nagad/Stripe) integration.',         features: ['Product filters', 'Cart & checkout', 'Admin panel'],  price: 30000, tier: 'From ৳', color: '#3B82F6' },
  { icon: '⚙️', name: 'Custom Web System',     tag: 'POS / SaaS / Custom',desc: 'Tailor-made web apps — POS systems, courier platforms, SaaS dashboards built for your specific workflow.',                            features: ['Custom logic', 'Role-based access', 'Dashboard'],      price: 50000, tier: 'From ৳', color: '#A855F7' },
  { icon: '🔐', name: 'Security Audit',        tag: 'Cybersecurity',      desc: 'Full OWASP-based vulnerability scan, malware detection, WAF setup and server hardening — before threats cost you money.',              features: ['OWASP scan', 'WAF setup', 'Pen testing'],              price: 22000, tier: 'From ৳', color: '#F59E0B' },
  { icon: '🤖', name: 'Business Automation',   tag: 'Automation & AI',    desc: 'Automate your business processes — CRM setup, API integrations, chatbots and workflow automation using Zapier & Make.',                features: ['CRM setup', 'Chatbot', 'Workflow auto'],               price: 33000, tier: 'From ৳', color: '#06B6D4' },
  { icon: '💼', name: 'White-Label Services',  tag: 'Agency Partner',     desc: 'Scale your agency without hiring — outsource web dev, cybersecurity support and emergency bug fixes under your brand.',                  features: ['Dev outsourcing', 'Security support', 'NDA included'], price: 500,   tier: 'From $', color: '#EC4899' },
];

const CORE_SERVICES = [
  {
    icon: '🌐', title: 'Web Development', label: 'Websites · eCommerce · SaaS',
    color: '#8B5CF6', price: '$100 / ৳10,000+',
    desc: 'We build fast, modern websites that actually convert visitors into customers — from simple landing pages to full-stack SaaS platforms.',
    features: ['Business & corporate sites', 'E-commerce (Shopify/WooCommerce)', 'Custom web apps & SaaS dashboards', 'Landing pages (conversion-focused)', 'Speed optimization & SEO-ready setup', 'Bug fixing & performance improvement'],
  },
  {
    icon: '🔐', title: 'Cybersecurity', label: 'Audit · WAF · Pen Testing',
    color: '#F59E0B', price: '$200 / ৳22,000+',
    desc: 'We protect your business from real-world cyber threats before they cost you money — full audits, malware removal, and 24/7 monitoring.',
    features: ['Website security audit (OWASP)', 'Malware removal & cleanup', 'Web Application Firewall (WAF) setup', 'Penetration testing (Basic/Advanced)', 'Server hardening (Linux/Cloud)', 'API & SaaS security testing'],
  },
  {
    icon: '⚙️', title: 'Automation & AI', label: 'Workflows · CRM · Chatbots',
    color: '#06B6D4', price: '$300 / ৳33,000+',
    desc: 'We automate your business processes to save time and increase efficiency — CRM setup, API integrations, chatbots, and workflow automation.',
    features: ['Business process automation', 'CRM setup & integration', 'API integration (3rd party)', 'Chatbot development', 'Workflow automation (Zapier, Make)', 'Custom reporting & alerts'],
  },
];

const DIGITAL_PRODUCTS = [
  {
    icon: '🌐', name: 'Startup Growth Package', tag: 'Combo Deal',
    desc: 'Website build + basic security + speed optimization. Everything a new business needs to go live fast.',
    includes: ['3–5 pages', 'Security audit', 'Speed fix', 'SEO setup'],
    price: 55000, originalPrice: 75000, badge: 'Popular', color: '#8B5CF6',
    priceUnit: '৳',
  },
  {
    icon: '🔒', name: 'Business Protection Pack', tag: 'Cybersecurity',
    desc: 'Full security audit + malware removal + WAF setup. Protect your live site from real-world threats.',
    includes: ['OWASP audit', 'Malware fix', 'WAF setup', 'Report'],
    price: 33000, originalPrice: null, badge: 'New', color: '#F59E0B',
    priceUnit: '৳',
  },
  {
    icon: '🏆', name: 'Premium All-in-One', tag: 'Full Package',
    desc: 'Website + Security + Maintenance — total control of your online presence. We handle everything.',
    includes: ['Full web build', 'Security hardening', 'Monthly maintenance', 'Priority support'],
    price: 100000, originalPrice: null, badge: null, color: '#A855F7',
    priceUnit: '৳',
  },
  {
    icon: '⚙️', name: 'Automation Starter', tag: 'Automation',
    desc: 'Business process automation with CRM setup, API integrations and workflow automation using Zapier/Make.',
    includes: ['CRM setup', 'API integration', 'Workflow auto', 'Chatbot'],
    price: 33000, originalPrice: 45000, badge: null, color: '#06B6D4',
    priceUnit: '৳',
  },
];

// ─── Dashboard Preview Component ──────────────────────────────────────────────

const DASH_NAV = [
  { icon: '📊', label: 'Overview',  active: true },
  { icon: '🤖', label: 'Automations', active: false },
  { icon: '📦', label: 'Orders',    active: false },
  { icon: '🛡️', label: 'Security',  active: false },
  { icon: '👤', label: 'Profile',   active: false },
];

const DASH_METRICS = [
  { label: 'Tasks Automated', value: '2,418', delta: '+14%', color: '#8B5CF6' },
  { label: 'Revenue MRR',     value: '$8,340', delta: '+8.2%', color: '#3B82F6' },
  { label: 'Active Bots',     value: '7',      delta: '+2',    color: '#F59E0B' },
  { label: 'Threats Blocked', value: '1,103',  delta: '↓ 3%',  color: '#EF4444' },
];

const DASH_TOOLS = [
  { name: 'AutoFlow AI',  status: 'running', uptime: '99.9%',  color: '#8B5CF6', runs: '1,244 runs today' },
  { name: 'RankRadar',    status: 'running', uptime: '100%',   color: '#22D3EE', runs: 'Crawling 8 URLs' },
  { name: 'WP Shield',    status: 'idle',    uptime: '99.4%',  color: '#EF4444', runs: 'Last scan 2h ago' },
  { name: 'BotShield',    status: 'running', uptime: '99.8%',  color: '#F59E0B', runs: '47 threats blocked' },
];

function DashboardPreview() {
  const [activeNav, setActiveNav] = useState(0);
  const [tick, setTick] = useState(0);

  // simulate live metric updates
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const liveMetrics = DASH_METRICS.map((m, i) => ({
    ...m,
    value: i === 0 ? `${(2418 + tick * 3).toLocaleString()}` :
           i === 3 ? `${(1103 + tick).toLocaleString()}` : m.value,
  }));

  return (
    <section style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.06)', color: '#8B5CF6', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6', animation: 'pulse 2s infinite' }} />
            Live Dashboard Preview
          </span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>Your control center.</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 400, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>Everything in one place — bots, metrics, security and orders. Real-time, always.</p>
        </div>

        {/* Browser chrome wrapper */}
        <div style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          {/* Browser bar */}
          <div style={{ padding: '12px 18px', background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#8B5CF6' }} />
            <div style={{ flex: 1, margin: '0 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 12px', fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              app.axentralab.com/dashboard
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['🔒','⟳'].map((i, x) => <span key={x} style={{ fontSize: 12, opacity: 0.3 }}>{i}</span>)}
            </div>
          </div>

          {/* Dashboard layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 480 }}>
            {/* Sidebar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
              <div style={{ padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: -0.3 }}>Axentralab</div>
                <div style={{ fontSize: 10, color: '#8B5CF6', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>● Pro Plan</div>
              </div>
              {DASH_NAV.map((n, i) => (
                <button key={i} onClick={() => setActiveNav(i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: activeNav === i ? 'rgba(139,92,246,0.1)' : 'none', border: 'none', borderLeft: activeNav === i ? '2px solid #8B5CF6' : '2px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 14 }}>{n.icon}</span>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: activeNav === i ? 700 : 500, color: activeNav === i ? '#8B5CF6' : 'rgba(255,255,255,0.45)' }}>{n.label}</span>
                </button>
              ))}
              <div style={{ margin: '20px 16px 0', padding: '12px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>STORAGE</div>
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg,#8B5CF6,#3B82F6)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontFamily: "'Space Mono',monospace" }}>6.2 / 10 GB</div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ padding: '24px 24px 28px', overflow: 'hidden' }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: -0.3 }}>Good morning, Alex 👋</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", marginTop: 3 }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>🔔</div>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>A</div>
                </div>
              </div>

              {/* Metric cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 22 }}>
                {liveMetrics.map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 14px 12px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' }}>{m.label}</div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18, color: m.color, letterSpacing: -0.5, transition: 'all 0.4s' }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: m.delta.startsWith('+') ? '#8B5CF6' : m.delta.startsWith('↓') ? '#EF4444' : 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", marginTop: 4 }}>{m.delta} this month</div>
                  </div>
                ))}
              </div>

              {/* Active tools */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Active Tools</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {DASH_TOOLS.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.status === 'running' ? '#8B5CF6' : '#F59E0B', flexShrink: 0, animation: t.status === 'running' ? 'pulse 2s infinite' : 'none' }} />
                      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', flex: 1 }}>{t.name}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace' " }}>{t.runs}</span>
                      <span style={{ fontSize: 11, color: t.color, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{t.uptime}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", background: t.status === 'running' ? 'rgba(139,92,246,0.12)' : 'rgba(245,158,11,0.12)', border: `1px solid ${t.status === 'running' ? 'rgba(139,92,246,0.3)' : 'rgba(245,158,11,0.3)'}`, color: t.status === 'running' ? '#8B5CF6' : '#F59E0B' }}>
                        {t.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono',monospace" }}>
          Ready to see the real thing? <Link to="/contact" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 700 }}>Book a live demo →</Link>
        </p>
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes bounceY { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:none} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:none} }
        @keyframes scrollMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .hero-left  { animation: slideInLeft  0.7s 0.1s ease both; }
        .hero-badge { animation: fadeUp 0.6s 0s ease both; }
        .hero-h1    { animation: fadeUp 0.6s 0.15s ease both; }
        .hero-sub   { animation: fadeUp 0.6s 0.25s ease both; }
        .hero-ctas  { animation: fadeUp 0.6s 0.35s ease both; }
        .hero-trust { animation: fadeUp 0.6s 0.45s ease both; }

        .service-card:hover { transform:translateY(-6px) !important; }
        .blog-card:hover    { transform:translateY(-4px) !important; }

        .marquee-track { display:flex; gap:48px; animation:scrollMarquee 22s linear infinite; white-space:nowrap; }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .service-grid { grid-template-columns: 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 5% 80px', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Hero background image (Cloudinary URL via env) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${HERO_BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'saturate(0.95) contrast(1.05)',
          }}
        />
        {/* dark overlays for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.7) 45%, rgba(2,6,23,0.88) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 28%, rgba(168,85,247,0.15), transparent 42%), radial-gradient(circle at 80% 14%, rgba(139,92,246,0.18), transparent 40%)' }} />

        {/* subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 60, alignItems: 'center' }}>

            {/* Left */}
            <div className="hero-left">
              <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, border: '1px solid rgba(168,85,247,0.45)', background: 'rgba(168,85,247,0.14)', marginBottom: 24, backdropFilter: 'blur(6px)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A855F7', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: '#C4B5FD', fontWeight: 600, letterSpacing: 0.5 }}>Byte Shield Digital</span>
              </div>

              <h1 className="hero-h1" style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(34px,5.5vw,66px)', fontWeight: 900, color: '#fff', letterSpacing: -2, lineHeight: 1.06, margin: '0 0 22px' }}>
                WE BUILD.<br />
                WE SECURE.<br />
                <span style={{ color: '#8B5CF6' }}>YOU SCALE.</span>
              </h1>

              <p className="hero-sub" style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 36, maxWidth: 420 }}>
                Elite web development &amp; cybersecurity solutions that are fast, secure, and built to dominate.
              </p>

              <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <Link to="/contact" className="btn-primary"
                  style={{ padding: '15px 32px', background: '#7C3AED', color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 12px 28px rgba(124,58,237,0.35)' }}>
                  LAUNCH A PROJECT →
                </Link>
                <Link to="/services"
                  style={{ padding: '15px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                  VIEW SERVICES
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="stats-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map(s => <StatCard key={s.label} stat={s} />)}
        </div>
      </section>

      {/* ── FREE AI TOOL ──────────────────────────────────────────────────── */}
      <FreeAITool />

      {/* ── TOOLS GRID ───────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #A855F740', background: '#A855F710', color: '#A855F7', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Our Services</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>Build. Secure. Scale.</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 460, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>Web development, cybersecurity and automation — everything your business needs, all under one roof.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18, maxWidth: 1100, margin: '0 auto' }}>
          {TOOLS_GRID.map((tool, i) => (
            <div key={i}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 24px 20px', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${tool.color}40`; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${tool.color}14`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              {/* color stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${tool.color},${tool.color}50,transparent)` }} />
              {/* header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tool.color}15`, border: `1px solid ${tool.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{tool.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: -0.2 }}>{tool.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", marginTop: 1 }}>{tool.tag}</div>
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5,
                  background: tool.tier === 'Free' ? 'rgba(139,92,246,0.12)' : 'rgba(251,191,36,0.12)',
                  border: tool.tier === 'Free' ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(251,191,36,0.3)',
                  color: tool.tier === 'Free' ? '#8B5CF6' : '#FCD34D',
                }}>
                  {tool.tier === 'Free' ? '⊙ FREE' : '★ PRO'}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, marginBottom: 16 }}>{tool.desc}</p>
              {/* feature pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {tool.features.map((f, fi) => (
                  <span key={fi} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono',monospace" }}>{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 900, color: tool.color }}>
                  {tool.tier} {tool.price.toLocaleString()}
                </span>
                <button style={{ padding: '7px 16px', borderRadius: 9, background: `${tool.color}18`, border: `1px solid ${tool.color}35`, color: tool.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace", transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${tool.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${tool.color}18`; }}>
                  Get Quote →
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/services" style={{ fontSize: 14, color: '#A855F7', fontWeight: 700, textDecoration: 'none', fontFamily: "'Space Mono',monospace" }}>View all products →</Link>
        </div>
      </section>

      {/* ── SERVICES (3-card focused) ─────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Core Services</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, color: '#fff', letterSpacing: -1.2, marginBottom: 14 }}>3 services. Unlimited impact.</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 440, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>Web development, cybersecurity and automation — each one custom-built, production-ready and ROI-positive.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 22, maxWidth: 1080, margin: '0 auto' }}>
          {CORE_SERVICES.map((s, i) => (
            <div key={i}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: '30px 28px 26px', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}45`; e.currentTarget.style.boxShadow = `0 20px 60px ${s.color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {/* bg glow */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle,${s.color}10,transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
              {/* icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: -0.3 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: s.color, fontFamily: "'Space Mono',monospace", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              {/* feature list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.features.map((f, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: s.color, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {/* pricing + CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>Starting at</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 20, color: s.color }}>{s.price}</div>
                </div>
                <Link to="/contact" style={{ padding: '11px 22px', borderRadius: 11, background: s.color, color: ['#8B5CF6','#F59E0B'].includes(s.color) ? '#000' : '#fff', fontSize: 13, fontWeight: 800, fontFamily: "'Sora',sans-serif", textDecoration: 'none', transition: 'opacity 0.15s', display: 'inline-block' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Get Started →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

 

      {/* ── DASHBOARD PREVIEW ─────────────────────────────────────────────── */}
      {/* <DashboardPreview /> */}

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── PROCESS SECTION ────────────────────────────────────────────────── */}
      <ProcessSection />

      {/* ── BLOG SECTION ──────────────────────────────────────────────────── */}
      <BlogSection />
      {/* ── REFERRAL TIER COMPARISON ──────────────────────────────────────── */}
      <ReferralTierComparison />
      {/* ── MAIN CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #8B5CF640', background: '#8B5CF610', color: '#8B5CF6', fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Get Started Today</span>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '18px auto 16px', letterSpacing: -1.5, lineHeight: 1.08 }}>
            Ready to build, secure<br /><span style={{ color: '#8B5CF6' }}>&amp; scale your business?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 20, lineHeight: 1.7 }}>Tell us what you need — we'll respond within 24 hours with a clear proposal and honest pricing. No hidden fees. No BS.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 12, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.07)', marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: '#C4B5FD', fontWeight: 700 }}>Based in Dhaka, Bangladesh · Serving local & remote clients</span>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ padding: '15px 36px', background: '#8B5CF6', color: '#000', fontSize: 15, fontWeight: 800, border: 'none', borderRadius: 12, textDecoration: 'none', fontFamily: "'Sora',sans-serif" }}>
              🔍 Get Free Security Audit →
            </Link>
            <Link to="/contact" style={{ padding: '15px 28px', fontSize: 15, borderRadius: 12, textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontFamily: "'Sora',sans-serif", fontWeight: 700 }}>
              📞 Book a Free Consultation
            </Link>
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['✓ Free consultation', '✓ Fixed-price quotes', '✓ NDA on request', '✓ BDT & USD accepted'].map((t, i) => (
              <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono',monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}