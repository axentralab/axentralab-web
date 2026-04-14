import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReferralPromoAd from '../components/ui/ReferralPromoAd';

// ─── Design tokens (mirrors site palette) ────────────────────────────────────
const GREEN  = '#8B5CF6';
const BLUE   = '#3B82F6';
const PURPLE = '#A855F7';
const AMBER  = '#F59E0B';
const CYAN   = '#06B6D4';
const HERO_BG_IMAGE = process.env.REACT_APP_HERO_BG_IMAGE || '/images/hero-bg.png';

// ─── Service Packs ────────────────────────────────────────────────────────────
const PACKS = [
  // ── Web Development ─────────────────────────────────────────────────────────
  {
    id: 'startup',
    badge: 'Entry Point',
    label: 'Startup Pack',
    tagline: 'Perfect for new businesses & MVPs',
    price: '$160 / ৳20,000',
    priceMax: '$500 / ৳50,000',
    delivery: '7–10 days',
    support: '1 month post-launch',
    pages: '1–3 responsive pages',
    tech: 'WordPress / HTML + CSS',
    color: GREEN,
    icon: '🚀',
    category: 'webdev',
    features: [
      'Mobile-friendly responsive design',
      'Basic on-page SEO setup',
      'Contact form integration',
      'Social media links & icons',
      'Clean, professional UI',
      'Hosting setup guidance',
    ],
    addons: ['Extra page +৳5,000', 'Logo design +৳8,000', 'Domain setup +৳2,000'],
    popular: false,
  },
  {
    id: 'sme',
    badge: 'Most Popular',
    label: 'SME Pack',
    tagline: 'For growing businesses & brands',
    price: '$400 / ৳50,000',
    priceMax: '$1,200 / ৳1,50,000',
    delivery: '10–20 days',
    support: '3 months post-launch',
    pages: '4–10 pages + blog',
    tech: 'WordPress + custom JS / Next.js',
    color: BLUE,
    icon: '⚡',
    category: 'webdev',
    features: [
      'Custom design & UI/UX system',
      'Full on-page SEO optimization',
      'Core Web Vitals & PageSpeed tuning',
      'Blog / news integration',
      'Email subscription & newsletter setup',
      'Basic analytics & tracking setup',
      'Advanced custom JS features',
    ],
    addons: ['eCommerce +$500', 'CRM integration +৳20,000', 'Maintenance contract'],
    popular: true,
  },
  {
    id: 'enterprise',
    badge: 'Full Power',
    label: 'Enterprise Pack',
    tagline: 'Custom platforms, SaaS & dashboards',
    price: '$1,500 / ৳1,50,000',
    priceMax: null,
    delivery: '20+ days',
    support: '6 months + optional contract',
    pages: 'Unlimited / custom scope',
    tech: 'React / Next.js + Node.js / WordPress',
    color: PURPLE,
    icon: '🛡️',
    category: 'webdev',
    features: [
      'Custom eCommerce / POS system',
      'Admin dashboards & analytics',
      'Advanced UI/UX with animations',
      'Full SEO + performance optimization',
      'Payment gateway integrations',
      'API, CRM & third-party integrations',
      'Reporting & data dashboards',
      'Ongoing maintenance contract option',
    ],
    addons: ['Mobile app (React Native)', 'AI feature integrations', 'White-label solution'],
    popular: false,
  },

  // ── Cybersecurity ────────────────────────────────────────────────────────────
  {
    id: 'sec-audit',
    badge: 'Core Security',
    label: 'Security Audit',
    tagline: 'Full scan, OWASP-based vulnerability report',
    price: '$200 / ৳22,000',
    priceMax: '$600 / ৳65,000',
    delivery: '3–7 days',
    support: 'Report + 2-week follow-up',
    pages: 'Full site / app coverage',
    tech: 'OWASP / Custom tools',
    color: AMBER,
    icon: '🔐',
    category: 'security',
    features: [
      'Website security full scan',
      'OWASP Top 10 vulnerability check',
      'Detailed PDF report with fixes',
      'Malware & backdoor detection',
      'SSL / HTTPS configuration review',
      'Admin panel security hardening tips',
    ],
    addons: ['Penetration testing +$300', 'WAF setup +৳15,000', 'Monthly monitoring +৳8,000/mo'],
    popular: false,
  },
  {
    id: 'sec-premium',
    badge: '🔥 High Value',
    label: 'Business Security Pack',
    tagline: 'Full protection for live businesses',
    price: '$500 / ৳55,000',
    priceMax: '$1,500 / ৳1,50,000',
    delivery: '7–14 days',
    support: '3 months monitoring',
    pages: 'Full infrastructure',
    tech: 'WAF + Linux + Cloud',
    color: AMBER,
    icon: '🛡️',
    category: 'security',
    features: [
      'Malware removal & full cleanup',
      'Web Application Firewall (WAF) setup',
      'Server security hardening (Linux/Cloud)',
      'Penetration testing (Basic/Advanced)',
      'API & SaaS security testing',
      'Threat monitoring & alert system',
      'Monthly security report',
    ],
    addons: ['24/7 monitoring +৳10,000/mo', 'SaaS security testing +$200', 'NDA included'],
    popular: true,
  },

  // ── Automation ───────────────────────────────────────────────────────────────
  {
    id: 'automation',
    badge: 'Hidden Gold 💎',
    label: 'Automation Pack',
    tagline: 'Save time, increase efficiency',
    price: '$300 / ৳33,000',
    priceMax: '$2,000 / ৳2,00,000',
    delivery: '5–15 days',
    support: '2 months',
    pages: 'Process / workflow scope',
    tech: 'Zapier / Make / Node.js',
    color: CYAN,
    icon: '⚙️',
    category: 'automation',
    features: [
      'Business process automation',
      'CRM setup & integration',
      'API integration (3rd party)',
      'Chatbot development',
      'Workflow automation (Zapier, Make)',
      'Custom reporting & alerts',
    ],
    addons: ['AI chatbot upgrade +$200', 'Custom CRM +৳25,000', 'Ongoing automation support'],
    popular: false,
  },

  // ── White-Label ──────────────────────────────────────────────────────────────
  {
    id: 'whitelabel',
    badge: 'Best for Agencies 🔥',
    label: 'White-Label Partner',
    tagline: 'Scale your agency without hiring',
    price: '$500 / mo',
    priceMax: '$5,000 / mo',
    delivery: 'Ongoing retainer',
    support: 'Dedicated dev/security expert',
    pages: 'Unlimited projects',
    tech: 'Full stack + Security',
    color: PURPLE,
    icon: '💼',
    category: 'whitelabel',
    features: [
      'Full web dev outsourcing',
      'Cybersecurity support for agencies',
      'Emergency bug fix team (48h SLA)',
      'Dedicated developer on demand',
      'Dedicated security expert on demand',
      'NDA & white-label delivery',
      'BDT & USD invoicing',
    ],
    addons: ['Priority SLA +$200/mo', 'Extra dev seat +$300/mo', 'Monthly strategy call'],
    popular: false,
  },

  // ── Retainer Plans ───────────────────────────────────────────────────────────
  {
    id: 'retainer-web',
    badge: 'Recurring 💸',
    label: 'Website Maintenance',
    tagline: 'Keep your site fast, safe & updated',
    price: '$50 / mo',
    priceMax: '$300 / mo',
    delivery: 'Ongoing',
    support: 'Monthly updates + backups',
    pages: '1 website',
    tech: 'WordPress / Custom',
    color: GREEN,
    icon: '🔧',
    category: 'retainer',
    features: [
      'Plugin & theme updates',
      'Daily/weekly backups',
      'Bug fixes & small edits',
      'Uptime monitoring',
      'Performance checks',
      'Monthly status report',
    ],
    addons: ['SEO retainer +৳8,000/mo', 'Security monitoring +$100/mo', 'Priority support'],
    popular: false,
  },
  {
    id: 'retainer-sec',
    badge: 'Recurring 💸',
    label: 'Security Monitoring',
    tagline: '24/7 threat detection & response',
    price: '$100 / mo',
    priceMax: '$500 / mo',
    delivery: 'Ongoing',
    support: '24/7 threat alerts',
    pages: 'Full infrastructure',
    tech: 'WAF + SIEM tools',
    color: AMBER,
    icon: '👁️',
    category: 'retainer',
    features: [
      '24/7 automated monitoring',
      'Real-time threat alerts',
      'Monthly security report',
      'Firewall rule updates',
      'Incident response support',
      'Vulnerability patch notifications',
    ],
    addons: ['Manual pen test +$200/qtr', 'Compliance reporting +$100/mo', 'SLA guarantee'],
    popular: false,
  },

  // ── Combo High-Ticket ────────────────────────────────────────────────────────
  {
    id: 'combo-startup',
    badge: '🥇 Combo Deal',
    label: 'Startup Growth Package',
    tagline: 'Website + Security + Speed — all-in-one',
    price: '$500 / ৳55,000',
    priceMax: '$1,500 / ৳1,50,000',
    delivery: '10–18 days',
    support: '2 months',
    pages: '1–5 pages',
    tech: 'WordPress / Next.js',
    color: GREEN,
    icon: '📦',
    category: 'combo',
    features: [
      'Business website build (3–5 pages)',
      'Basic security audit & hardening',
      'Website speed optimization',
      'On-page SEO setup',
      'Contact form & social integration',
      'Post-launch bug fix support',
    ],
    addons: ['Logo design +৳8,000', 'Maintenance plan +$50/mo', 'Domain setup +৳2,000'],
    popular: false,
  },
  {
    id: 'combo-biz',
    badge: '🥈 Combo Deal',
    label: 'Business Protection Pack',
    tagline: 'Full audit + cleanup + firewall',
    price: '$300 / ৳33,000',
    priceMax: '$1,200 / ৳1,20,000',
    delivery: '5–12 days',
    support: '1 month',
    pages: 'Full site',
    tech: 'WAF + OWASP',
    color: BLUE,
    icon: '🔒',
    category: 'combo',
    features: [
      'Full security audit (OWASP)',
      'Malware removal & cleanup',
      'Web Application Firewall setup',
      'SSL & server config hardening',
      'Vulnerability fix recommendations',
      'Post-fix verification scan',
    ],
    addons: ['Penetration test +$300', 'Monthly monitoring +$100/mo', 'Compliance report'],
    popular: false,
  },
  {
    id: 'combo-premium',
    badge: '🥇🥇 All-in-One',
    label: 'Premium All-in-One',
    tagline: 'Website + Security + Maintenance — total control',
    price: '$1,000 / ৳1,00,000',
    priceMax: null,
    delivery: 'Custom timeline',
    support: '6 months + contract option',
    pages: 'Unlimited',
    tech: 'React / Next.js + WAF + Node',
    color: PURPLE,
    icon: '🏆',
    category: 'combo',
    features: [
      'Full custom website / web app build',
      'Complete security audit & hardening',
      'WAF + 24/7 security monitoring',
      'Monthly maintenance & updates',
      'SEO + performance optimization',
      'Payment gateway & API integrations',
      'Admin dashboard & analytics',
      'Priority support & dedicated team',
    ],
    addons: ['Mobile app (React Native)', 'AI feature integrations', 'White-label delivery'],
    popular: true,
  },
];

// ─── Case Studies ─────────────────────────────────────────────────────────────
const CASES = [
  {
    name: 'FoodExpress POS',
    client: 'Local Restaurant Chain · Dhaka',
    challenge: 'Slow legacy POS, manual inventory tracking, zero online ordering capability.',
    solution: 'Built a Next.js admin dashboard with real-time inventory, integrated online ordering, and automated reporting.',
    metrics: [
      { label: 'Page load', before: '5.2s', after: '1.4s', icon: '⚡' },
      { label: 'Order processing', delta: '↓ 50%', icon: '📦' },
      { label: 'Monthly active users', delta: '↑ 200%', icon: '👥' },
    ],
    stack: ['Next.js', 'React', 'PostgreSQL', 'TailwindCSS', 'Stripe'],
    demo: 'foodexpress.vercel.app',
    color: GREEN,
    icon: '🍔',
    pack: 'Enterprise Pack',
  },
  {
    name: 'LexFirm BD',
    client: 'Law Firm · Chittagong',
    challenge: 'No web presence, clients contacting via WhatsApp only, no appointment system.',
    solution: 'Delivered a polished WordPress site with custom booking integration, blog, and SEO-optimized service pages.',
    metrics: [
      { label: 'Organic traffic', delta: '↑ 320%', icon: '🔍' },
      { label: 'Inquiries / month', delta: '↑ 8×', icon: '📩' },
      { label: 'PageSpeed score', before: '42', after: '94', icon: '🚀' },
    ],
    stack: ['WordPress', 'Custom CSS', 'Yoast SEO', 'Calendly API'],
    demo: 'lexfirmbd.com',
    color: BLUE,
    icon: '⚖️',
    pack: 'SME Pack',
  },
  {
    name: 'CryptoWatch Pro',
    client: 'FinTech Startup · Remote',
    challenge: 'Needed a real-time crypto analytics dashboard with portfolio tracking and alert system.',
    solution: 'Built a full-stack SaaS dashboard using React + Node.js with WebSocket live data, custom charting, and a Stripe subscription model.',
    metrics: [
      { label: 'Real-time latency', before: '3s polling', after: '<80ms WS', icon: '⚡' },
      { label: 'Paying subscribers', delta: '↑ 150% (3mo)', icon: '💳' },
      { label: 'Uptime', delta: '99.9%', icon: '🛡️' },
    ],
    stack: ['React', 'Node.js', 'WebSocket', 'CoinGecko API', 'Stripe', 'MongoDB'],
    demo: 'cryptowatch.vercel.app',
    color: PURPLE,
    icon: '📈',
    pack: 'Enterprise Pack',
  },
  {
    name: 'PaySecure BD',
    client: 'FinTech Startup · Dhaka',
    challenge: 'Live payment platform with critical OWASP vulnerabilities — SQL injection, broken auth, exposed API keys.',
    solution: 'Ran full penetration test, patched all critical CVEs, deployed WAF rules, and set up 24/7 threat monitoring.',
    metrics: [
      { label: 'Vulnerabilities fixed', before: '23', after: '0 critical', icon: '🔐' },
      { label: 'Audit compliance', delta: '✅ Passed', icon: '📋' },
      { label: 'Security score', before: '41', after: '96', icon: '🛡️' },
    ],
    stack: ['OWASP ZAP', 'ModSecurity WAF', 'Fail2Ban', 'Linux Hardening', 'SSL/TLS'],
    demo: 'paysecurebd.com',
    color: AMBER,
    icon: '🔐',
    pack: 'Business Security Pack',
  },
  {
    name: 'RetailBot Auto',
    client: 'E-commerce Brand · Remote',
    challenge: 'Manual order processing, inventory sync, and customer follow-up costing 20+ hrs/week.',
    solution: 'Built end-to-end automation using Zapier + Make — auto-invoicing, inventory alerts, CRM sync, and customer email flows.',
    metrics: [
      { label: 'Manual hours saved', delta: '↓ 85%', icon: '⏱️' },
      { label: 'Order errors', delta: '↓ 96%', icon: '📦' },
      { label: 'Revenue tracked/mo', delta: '↑ 3×', icon: '💰' },
    ],
    stack: ['Zapier', 'Make (Integromat)', 'WooCommerce API', 'Notion CRM', 'Mailchimp'],
    demo: 'retailbot.vercel.app',
    color: CYAN,
    icon: '⚙️',
    pack: 'Automation Pack',
  },
];

// ─── Portfolio items ──────────────────────────────────────────────────────────
const PORTFOLIO = [
  { name: 'Travel Agency',     cat: 'Startup',    icon: '✈️', color: CYAN,      tech: 'MERN',            desc: 'Tour booking site with custom itinerary builder.' },
  { name: 'AgroTech BD',       cat: 'Startup',    icon: '🌾', color: GREEN,     tech: 'WordPress',       desc: 'Agricultural marketplace for rural Bangladesh farmers.' },
  { name: 'MediConnect',       cat: 'SME',        icon: '🏥', color: BLUE,      tech: 'Next.js',         desc: 'Doctor appointment booking platform with telemedicine.' },
  { name: 'EduFlow LMS',       cat: 'Enterprise', icon: '📚', color: PURPLE,    tech: 'React + Node.js', desc: 'Full learning management system with live classes.' },
  { name: 'ShopNow BD',        cat: 'SME',        icon: '🛍️', color: AMBER,     tech: 'WooCommerce',     desc: 'Multi-vendor eCommerce for Dhaka boutiques.' },
  { name: 'TradeBot AI',       cat: 'Enterprise', icon: '🤖', color: CYAN,      tech: 'React + Python',  desc: 'Automated crypto trading bot with analytics dashboard.' },
  { name: 'BeautyHub',         cat: 'Startup',    icon: '💄', color: '#EC4899', tech: 'WordPress',       desc: 'Booking & portfolio site for a beauty salon chain.' },
  { name: 'SecureBank BD',     cat: 'Security',   icon: '🔐', color: AMBER,     tech: 'WAF + OWASP',     desc: 'Full security audit & firewall for a fintech startup.' },
  { name: 'LegalShield Audit', cat: 'Security',   icon: '🛡️', color: AMBER,     tech: 'Pen Testing',     desc: 'Penetration testing & hardening for a law firm portal.' },
  { name: 'RetailBot CRM',     cat: 'Automation', icon: '⚙️', color: CYAN,      tech: 'Zapier + Make',   desc: 'End-to-end order & inventory automation for e-commerce.' },
  { name: 'HRFlow Auto',       cat: 'Automation', icon: '🔄', color: CYAN,      tech: 'Node.js + API',   desc: 'Automated onboarding workflow for an HR SaaS company.' },
];

// ─── Small hooks / utils ──────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Glow({ x, y, color = GREEN, size = 500 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      background: `radial-gradient(circle,${color}12 0%,transparent 70%)`,
      borderRadius: '50%', pointerEvents: 'none',
      transform: 'translate(-50%,-50%)', filter: 'blur(40px)',
    }} />
  );
}

function SectionLabel({ color, children }) {
  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: `1px solid ${color}40`, background: `${color}10`, color, fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
      {children}
    </span>
  );
}

// ─── Pack Card ────────────────────────────────────────────────────────────────
function PackCard({ pack, idx }) {
  const [ref, visible] = useInView();
  const [expanded, setExpanded] = useState(false);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(28px)',
      transition: `opacity 0.55s ${idx * 0.12}s, transform 0.55s ${idx * 0.12}s`,
      position: 'relative',
      background: pack.popular
        ? `linear-gradient(160deg, rgba(59,130,246,0.08), rgba(168,85,247,0.05))`
        : 'rgba(255,255,255,0.025)',
      border: pack.popular
        ? `1px solid ${pack.color}35`
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: 22,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${pack.color}45`;
      e.currentTarget.style.boxShadow   = `0 16px 50px ${pack.color}14`;
      e.currentTarget.style.transform   = 'translateY(-5px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = pack.popular ? `${pack.color}35` : 'rgba(255,255,255,0.07)';
      e.currentTarget.style.boxShadow   = 'none';
      e.currentTarget.style.transform   = 'none';
    }}>

      {/* top gradient bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${pack.color},transparent)` }} />

      {/* popular badge */}
      {pack.popular && (
        <div style={{ position: 'absolute', top: 20, right: 20, padding: '3px 11px', borderRadius: 999, background: `${pack.color}20`, border: `1px solid ${pack.color}40`, color: pack.color, fontSize: 10, fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: 0.5 }}>
          🔥 Most Popular
        </div>
      )}

      <div style={{ padding: '28px 28px 0' }}>
        {/* icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${pack.color}15`, border: `1px solid ${pack.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{pack.icon}</div>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: pack.color, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>{pack.badge}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{pack.label}</div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22, lineHeight: 1.65 }}>{pack.tagline}</p>

        {/* price */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Starting at</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 32, fontWeight: 900, color: pack.color, letterSpacing: -1 }}>{pack.price}</span>
            {pack.priceMax && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace" }}>– {pack.priceMax}</span>}
            {!pack.priceMax && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace" }}>+</span>}
          </div>
        </div>

        {/* meta chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {[
            { icon: '📄', text: pack.pages },
            { icon: '⚙️', text: pack.tech },
            { icon: '📅', text: pack.delivery },
            { icon: '🛠️', text: pack.support },
          ].map((m, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Mono',monospace" }}>
              {m.icon} {m.text}
            </span>
          ))}
        </div>

        {/* features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {pack.features.map((f, fi) => (
            <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${pack.color}18`, border: `1px solid ${pack.color}38`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: pack.color, flexShrink: 0, marginTop: 1 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* add-ons toggle */}
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', color: `${pack.color}99`, fontSize: 11, fontFamily: "'Space Mono',monospace", cursor: 'pointer', padding: '0 0 18px', letterSpacing: 0.3 }}>
          {expanded ? '▲ Hide add-ons' : '▼ View optional add-ons'}
        </button>

        {expanded && (
          <div style={{ padding: '14px 16px', background: `${pack.color}06`, border: `1px solid ${pack.color}18`, borderRadius: 12, marginBottom: 18 }}>
            {pack.addons.map((a, i) => (
              <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '4px 0', fontFamily: "'Space Mono',monospace", borderBottom: i < pack.addons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                + {a}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 'auto', padding: '0 28px 28px' }}>
        <Link to="/contact" style={{
          display: 'block', textAlign: 'center',
          padding: '13px 24px', borderRadius: 12,
          background: pack.popular ? `linear-gradient(135deg,${pack.color},${PURPLE})` : `${pack.color}18`,
          border: pack.popular ? 'none' : `1px solid ${pack.color}35`,
          color: pack.popular ? '#fff' : pack.color,
          fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14,
          textDecoration: 'none',
          boxShadow: pack.popular ? `0 4px 20px ${pack.color}35` : 'none',
          transition: 'filter 0.18s, transform 0.18s',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}>
          Get Started →
        </Link>
      </div>
    </div>
  );
}

// ─── Case Study Card ──────────────────────────────────────────────────────────
function CaseCard({ c, idx }) {
  const [ref, visible] = useInView();

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(28px)',
      transition: `opacity 0.55s ${idx * 0.14}s, transform 0.55s ${idx * 0.14}s`,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 22,
      overflow: 'hidden',
    }}>
      {/* top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${c.color},transparent)` }} />

      <div style={{ padding: 28 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${c.color}15`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon}</div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: -0.3 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{c.client}</div>
            </div>
          </div>
          <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 999, background: `${c.color}12`, border: `1px solid ${c.color}30`, color: c.color, fontFamily: "'Space Mono',monospace", fontWeight: 600, flexShrink: 0, letterSpacing: 0.3 }}>{c.pack}</span>
        </div>

        {/* challenge + solution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
            <div style={{ fontSize: 10, color: '#EF4444', fontFamily: "'Space Mono',monospace", fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>🔴 Challenge</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{c.challenge}</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: `${c.color}06`, border: `1px solid ${c.color}18` }}>
            <div style={{ fontSize: 10, color: c.color, fontFamily: "'Space Mono',monospace", fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>✅ Solution</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{c.solution}</p>
          </div>
        </div>

        {/* metrics */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {c.metrics.map((m, i) => (
            <div key={i} style={{ flex: '1 1 auto', minWidth: 90, padding: '12px 14px', background: `${c.color}08`, border: `1px solid ${c.color}18`, borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 13, color: c.color, marginBottom: 2 }}>
                {m.delta ? m.delta : `${m.before} → ${m.after}`}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* stack */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {c.stack.map((s, i) => (
            <span key={i} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Mono',monospace" }}>{s}</span>
          ))}
        </div>

        {/* demo link */}
        <a href={`https://${c.demo}`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: c.color, fontFamily: "'Space Mono',monospace", textDecoration: 'none', fontWeight: 600, opacity: 0.75, transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}>
          🔗 {c.demo} →
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('pricing');
  const [portfolioCat, setPortfolioCat] = useState('All');
  const [packCat, setPackCat] = useState('all');
  const [heroRef, heroVisible] = useInView(0.05);

  const filteredPortfolio = portfolioCat === 'All'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.cat === portfolioCat);

  const filteredPacks = packCat === 'all'
    ? PACKS
    : PACKS.filter(p => p.category === packCat);

  const CATS_PORT = ['All', 'Startup', 'SME', 'Enterprise', 'Security', 'Automation'];

  const PACK_CATS = [
    { id: 'all',        label: '🌐 All Services' },
    { id: 'webdev',     label: '💻 Web Dev' },
    { id: 'security',   label: '🔐 Cybersecurity' },
    { id: 'automation', label: '⚙️ Automation' },
    { id: 'whitelabel', label: '💼 White-Label' },
    { id: 'retainer',   label: '🔁 Retainer' },
    { id: 'combo',      label: '📦 Combo Deals' },
  ];

  return (
    <>
      <style>{`
        @keyframes glowFloat { 0%,100%{opacity:0.45;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.06)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes shimmer   { from{background-position:200% 0} to{background-position:-200% 0} }

        .services-tab {
          padding: 9px 20px;
          border-radius: 999px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
          border: 1px solid transparent;
        }
        .services-tab.active  { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.18); color: #fff; }
        .services-tab.inactive{ background: transparent; border-color: rgba(255,255,255,0.07); color: rgba(255,255,255,0.38); }
        .services-tab.inactive:hover { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.65); }

        .port-item {
          transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s;
          cursor: default;
        }
        .port-item:hover {
          transform: translateY(-4px);
        }

        @media (max-width: 900px) {
          .packs-grid { grid-template-columns: 1fr !important; }
          .cases-grid { grid-template-columns: 1fr !important; }
          .case-split  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .port-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ padding: '100px 5% 80px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

        {/* Background glows */}
        <div style={{ position: 'fixed', top: '15%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${GREEN}10,transparent 68%)`, pointerEvents: 'none', animation: 'glowFloat 7s ease-in-out infinite', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '20%', right: '-8%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${BLUE}09,transparent 68%)`, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── HERO ────────────────────────────────────────────────────────── */}
          <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, marginBottom: 56, padding: '56px 20px' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(6,8,15,0.9) 0%, rgba(6,8,15,0.72) 48%, rgba(6,8,15,0.9) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
            <div ref={heroRef} style={{
              textAlign: 'center',
              position: 'relative',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}>
              <SectionLabel color={GREEN}>Services & Pricing</SectionLabel>
              <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,6vw,64px)', fontWeight: 900, color: '#fff', marginTop: 18, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>
                Transparent pricing.<br />
                <span style={{ color: GREEN }}>Real results.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.75 }}>
                From startup landing pages to full-stack SaaS platforms — fixed-price packages with no hidden fees. Based in Dhaka, serving clients worldwide.
              </p>

              {/* trust chips */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['✓ Free consultation', '✓ Fixed-price quotes', '✓ NDA on request', '✓ BDT & USD accepted'].map((t, i) => (
                  <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>{t}</span>
                ))}
              </div>
            </div>
          </section>

          {/* ── TAB NAV ─────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 52 }}>
            {[
              { id: 'pricing',   label: '💰 Pricing Packages' },
              { id: 'portfolio', label: '🖼️ Portfolio' },
              { id: 'cases',     label: '📊 Case Studies' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`services-tab ${activeTab === t.id ? 'active' : 'inactive'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── PRICING TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'pricing' && (
            <>
              {/* ── Category Filter ── */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                {PACK_CATS.map(cat => {
                  const active = packCat === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setPackCat(cat.id)}
                      style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: "'Space Mono',monospace", cursor: 'pointer', transition: 'all 0.15s', background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.07)', color: active ? '#fff' : 'rgba(255,255,255,0.38)' }}>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="packs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, maxWidth: 1140, margin: '0 auto 48px' }}>
                {filteredPacks.map((pack, i) => <PackCard key={pack.id} pack={pack} idx={i} />)}
              </div>

              {/* entry-level / hook offers */}
              <div style={{ maxWidth: 1140, margin: '32px auto 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <SectionLabel color={GREEN}>⚡ Entry-Level Offers</SectionLabel>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 900, color: '#fff', marginTop: 12, letterSpacing: -0.5 }}>Client magnets — easy entry, easy trust</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                  {[
                    { icon: '⚡', label: 'Website Speed Fix',    price: '$50 – $150',    desc: 'Fast turnaround. Big impact.',      color: GREEN },
                    { icon: '🔍', label: 'Quick Security Scan',  price: 'Free / Low cost', desc: 'Identify risks before they hit.',  color: AMBER },
                    { icon: '🐛', label: 'Bug Fix / Small Task', price: 'From $30',       desc: 'Quick & clean. No hassle.',         color: BLUE },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${a.color}40`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <span style={{ fontSize: 28 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: '#fff' }}>{a.label}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: a.color, marginTop: 2 }}>{a.price}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* comparison callout */}
              <div style={{ maxWidth: 840, margin: '0 auto', padding: '28px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 5 }}>Not sure which pack is right for you?</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>Book a free 30-minute consultation — we'll scope your project and recommend the best fit.</p>
                </div>
                <Link to="/contact" style={{ padding: '13px 26px', background: `linear-gradient(135deg,${GREEN},${BLUE})`, color: '#000', borderRadius: 12, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Book Free Call →
                </Link>
              </div>

              {/* add-ons section */}
              <div style={{ maxWidth: 1140, margin: '48px auto 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <SectionLabel color={AMBER}>Add-Ons</SectionLabel>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(20px,3vw,32px)', fontWeight: 900, color: '#fff', marginTop: 14, letterSpacing: -0.8 }}>Extend any package</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 14 }}>
                  {[
                    { icon: '📄', label: 'Extra Pages',          price: '৳5,000 / page',   color: GREEN },
                    { icon: '🎨', label: 'Logo Design',           price: '৳8,000',           color: CYAN },
                    { icon: '🛒', label: 'eCommerce Module',      price: '৳30,000+',         color: BLUE },
                    { icon: '🔗', label: 'API Integration',       price: '৳15,000+',         color: PURPLE },
                    { icon: '🛡️', label: 'Security Hardening',    price: '৳12,000',          color: AMBER },
                    { icon: '🔧', label: 'Monthly Maintenance',   price: '৳5,000 / mo',      color: GREEN },
                    { icon: '📈', label: 'SEO Retainer',          price: '৳8,000 / mo',      color: BLUE },
                    { icon: '📱', label: 'React Native App',      price: 'Custom quote',     color: PURPLE },
                    { icon: '🔐', label: 'Penetration Testing',   price: '$300 / ৳33,000',   color: AMBER },
                    { icon: '👁️', label: '24/7 Monitoring',       price: '$100 / mo',        color: AMBER },
                    { icon: '🤖', label: 'AI Chatbot',            price: '$200 / ৳22,000',   color: CYAN },
                    { icon: '🔄', label: 'Workflow Automation',   price: '৳20,000+',         color: CYAN },
                    { icon: '💼', label: 'White-Label Delivery',  price: 'Custom quote',     color: PURPLE },
                    { icon: '📊', label: 'Analytics Dashboard',   price: '৳18,000+',         color: BLUE },
                    { icon: '🌐', label: 'Domain + Hosting Setup','price': '৳2,000',         color: GREEN },
                    { icon: '📋', label: 'NDA Agreement',         price: 'Free',             color: '#6B7280' },
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${a.color}35`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                      <span style={{ fontSize: 22 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: '#fff' }}>{a.label}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: a.color, marginTop: 2 }}>{a.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PORTFOLIO TAB ────────────────────────────────────────────────── */}
          {activeTab === 'portfolio' && (
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>
              {/* category filter */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
                {CATS_PORT.map(cat => {
                  const active = portfolioCat === cat;
                  return (
                    <button key={cat} onClick={() => setPortfolioCat(cat)}
                      style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: "'Space Mono',monospace", cursor: 'pointer', transition: 'all 0.15s', background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.07)', color: active ? '#fff' : 'rgba(255,255,255,0.38)' }}>
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="port-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
                {filteredPortfolio.map((p, i) => (
                  <div key={i} className="port-item" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', opacity: 1, transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}35`; e.currentTarget.style.boxShadow = `0 12px 38px ${p.color}12`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>

                    {/* thumbnail */}
                    <div style={{ height: 90, background: `linear-gradient(135deg,${p.color}18,${p.color}06)`, borderBottom: `1px solid ${p.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: 40 }}>{p.icon}</span>
                      <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, padding: '2px 9px', borderRadius: 6, background: `${p.color}18`, border: `1px solid ${p.color}30`, color: p.color, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{p.cat}</span>
                    </div>

                    <div style={{ padding: '18px 20px 20px' }}>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 6, letterSpacing: -0.2 }}>{p.name}</div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>
                      <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.38)', fontFamily: "'Space Mono',monospace" }}>{p.tech}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 44, padding: '24px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18 }}>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, marginBottom: 16, fontFamily: "'Space Mono',monospace" }}>Interested in working together?</p>
                <Link to="/contact" className="btn-primary" style={{ padding: '12px 28px', background: GREEN, color: '#000', borderRadius: 12, textDecoration: 'none', fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14 }}>
                  Start a Project →
                </Link>
              </div>
            </div>
          )}

          {/* ── CASE STUDIES TAB ─────────────────────────────────────────────── */}
          {activeTab === 'cases' && (
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: "'Space Mono',monospace" }}>Real projects · measurable impact · honest metrics</p>
              </div>
              <div className="cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
                {CASES.map((c, i) => <CaseCard key={i} c={c} idx={i} />)}
              </div>

              {/* CTA callout */}
              <div style={{ marginTop: 48, textAlign: 'center', padding: '36px 28px', background: `linear-gradient(135deg,rgba(139,92,246,0.05),rgba(59,130,246,0.05))`, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>📋</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: -0.5, marginBottom: 10 }}>Want a case study for your project?</h3>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.7 }}>We document results for every enterprise project — you'll have real proof of ROI to share with stakeholders.</p>
                <Link to="/contact" style={{ padding: '13px 28px', background: `linear-gradient(135deg,${GREEN},${BLUE})`, color: '#000', borderRadius: 12, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                  Discuss Your Project →
                </Link>
              </div>
            </div>
          )}

          {/* ── REFERRAL PROMO ──────────────────────────────────────────────── */}
          <div style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 20px' }}>
            <ReferralPromoAd variant="vip" style={{ marginBottom: 40 }} />
          </div>
        </div>
      </div>
    </>
  );
}