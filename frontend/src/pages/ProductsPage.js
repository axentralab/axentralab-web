import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// demoUrl প্রতিটা product-এ নিজের real link দিয়ে replace করো

const PRODUCTS = [
  { id:'p1', name:'WP Shield', tag:'WordPress Security', desc:'Enterprise-grade WordPress security scanner with real-time threat detection and automated malware removal.', features:['Malware scanning','Plugin vulnerability detection','Security header analysis','SSL certificate check','Automated fix suggestions'], price:19, billing:'monthly', color:'#8B5CF6', demoUrl:'https://wp-shield-pi.vercel.app/' },
  { id:'p2', name:'SiteGuard', tag:'Monitoring Platform', desc:'Continuous website security monitoring with instant alerts and automated incident responses.', features:['24/7 uptime monitoring','Threat intelligence feed','Auto IP blocking','Incident reports','Slack & email alerts'], price:49, billing:'monthly', color:'#3B82F6', demoUrl:'https://demo.axentralab.com/siteguard' },
  // { id:'p3', name:'API Scanner', tag:'API Security', desc:'Find and fix vulnerabilities in your APIs before attackers do. Covers OWASP API Top 10.', features:['OWASP API Top 10 coverage','Auth & rate limit testing','Detailed vulnerability report','CI/CD integration','Remediation guidance'], price:39, billing:'monthly', color:'#EF4444', demoUrl:'https://demo.axentralab.com/api-scanner' },
  // { id:'p4', name:'CloudArmor', tag:'Cloud Security', desc:'Full-spectrum cloud infrastructure security — audit your AWS, GCP or Azure setup against CIS benchmarks automatically.', features:['Multi-cloud support','CIS benchmark checks','IAM misconfiguration alerts','S3 / blob exposure scanner','Compliance PDF export'], price:69, billing:'monthly', color:'#A855F7', demoUrl:'https://demo.axentralab.com/cloudarmor' },
  // { id:'p5', name:'PenBot', tag:'Automated Pentesting', desc:'Simulated attacker that runs automated penetration tests on your web apps continuously, not just once a year.', features:['Continuous attack simulation','OWASP Top 10 coverage','Session & auth bypass tests','Custom scan schedules','Executive + dev reports'], price:89, billing:'monthly', color:'#F97316', demoUrl:'https://demo.axentralab.com/penbot' },
  // { id:'p6', name:'DataVault', tag:'Data Privacy', desc:'Discover, classify, and protect sensitive data across databases, file stores, and SaaS platforms automatically.', features:['PII/PHI auto-discovery','GDPR & CCPA mapping','Data lineage tracking','Breach risk scoring','One-click redaction'], price:59, billing:'monthly', color:'#06B6D4', demoUrl:'https://demo.axentralab.com/datavault' },
  // { id:'p7', name:'PhishNet', tag:'Email Security', desc:'AI-powered phishing detection and email threat intelligence that protects your team inbox before the damage is done.', features:['Real-time phishing detection','Spoofed domain alerts','DMARC/DKIM/SPF analysis','Employee risk scoring','Automated quarantine'], price:29, billing:'monthly', color:'#EC4899', demoUrl:'https://demo.axentralab.com/phishnet' },
  // { id:'p8', name:'LogSentinel', tag:'Log Management', desc:'Centralised log aggregation, anomaly detection, and real-time SIEM-lite alerting for web apps and servers.', features:['Multi-source log ingestion','Anomaly & spike detection','Real-time alert rules','Log retention (90 days)','CSV / JSON export'], price:45, billing:'monthly', color:'#14B8A6', demoUrl:'https://demo.axentralab.com/logsentinel' },
  // { id:'p9', name:'AutoFlow AI', tag:'AI Automation', desc:'No-code AI workflow builder — connect your apps, trigger actions on events, and automate repetitive ops tasks with GPT-4 intelligence.', features:['Drag-and-drop workflow builder','200+ app integrations','GPT-4 decision nodes','Webhook & cron triggers','Run history & audit log'], price:55, billing:'monthly', color:'#8B5CF6', demoUrl:'https://demo.axentralab.com/autoflow' },
  // { id:'p10', name:'BotShield', tag:'Bot Protection', desc:'Distinguish real users from malicious bots in real time. Stop credential stuffing, scraping, and fake signups at the edge.', features:['Behavioural fingerprinting','Credential stuffing defence','Scraper & crawler blocking','CAPTCHA-free challenge mode','Analytics dashboard'], price:35, billing:'monthly', color:'#F59E0B', demoUrl:'https://demo.axentralab.com/botshield' },
  // { id:'p11', name:'RankRadar', tag:'SEO Intelligence', desc:'AI-driven SEO auditor and keyword tracker that surfaces technical issues, monitors rankings, and suggests fixes automatically.', features:['Full technical SEO audit','Daily rank tracking','AI fix suggestions','Competitor gap analysis','Core Web Vitals monitor'], price:39, billing:'monthly', color:'#22D3EE', demoUrl:'https://demo.axentralab.com/rankradar' },
  // { id:'p12', name:'InboxAI', tag:'AI Email Marketing', desc:'AI-powered email campaign builder that writes, tests, and sends personalised sequences — with deliverability monitoring built in.', features:['GPT-4 email copywriter','A/B test automation','Send-time optimisation','Spam score checker','Unsubscribe & bounce mgmt'], price:49, billing:'monthly', color:'#FB7185', demoUrl:'https://demo.axentralab.com/inboxai' },
];

const ENTERPRISE_FEATURES = [
  { 
    icon:'🏗️', 
    title:'Custom Integrations', 
    desc:'SSO (Google, Azure AD), SAML, REST API, এবং custom webhook দিয়ে আপনার existing tools (CRM, ERP, internal dashboard) এর সাথে seamless integration করা যায়।' 
  },
  { 
    icon:'🛡️', 
    title:'Dedicated Security Support', 
    desc:'প্রতি সপ্তাহে একজন security specialist আপনার রিপোর্ট review করে, risk explain করে এবং actionable fix guideline দেয়।' 
  },
  { 
    icon:'📊', 
    title:'Team-Wide Access', 
    desc:'Developer, DevOps, এবং management—সবার জন্য access। আলাদা করে per-user charge নেই, পুরো team collaborate করতে পারে।' 
  },
  { 
    icon:'📝', 
    title:'Compliance-Ready Reports', 
    desc:'SOC 2, ISO 27001, PCI-DSS এর জন্য structured report generate করা যায়, audit preparation অনেক easy হয়ে যায়।' 
  },
  { 
    icon:'⚡', 
    title:'Fast Response SLA', 
    desc:'Critical issue detect হলে দ্রুত notify করা হয় এবং priority basis এ resolve support দেয়া হয়।' 
  },
  { 
    icon:'🔒', 
    title:'Private Deployment Option', 
    desc:'আপনার own server, VPS, বা VPC তে deploy করার option আছে—data পুরোপুরি আপনার control এ থাকে।' 
  },
];

const TESTIMONIALS = [
  { 
    name:'Arif Hasan', 
    role:'CTO, ByteCraft Solutions', 
    avatar:'AH', 
    color:'#8B5CF6', 
    quote:'আমাদের WordPress site একবার হ্যাক হওয়ার পর WP Shield use করি। এখন automatic malware detect হয়ে যায়, manually check করার ঝামেলা নাই। peace of mind পাই।' 
  },
  { 
    name:'Nusrat Jahan', 
    role:'Founder, EcomBoost BD', 
    avatar:'NJ', 
    color:'#3B82F6', 
    quote:'SiteGuard setup করার পর brute-force login attempt almost zero হয়ে গেছে। আগে daily issue আসতো, এখন properly secured মনে হয়।' 
  },
  { 
    name:'Rakib Ahmed', 
    role:'DevOps Engineer, CloudNest', 
    avatar:'RA', 
    color:'#A855F7', 
    quote:'CloudArmor দিয়ে audit করে দেখি কয়েকটা open config ছিল যেগুলা আমরা miss করছিলাম। Report clear ছিল, fix করতে easy হয়েছে।' 
  },
  { 
    name:'Tanvir Hossain', 
    role:'Founder, CodeCrafters Lab', 
    avatar:'TH', 
    color:'#F97316', 
    quote:'PenBot staging environment এ test চালিয়ে একটা auth issue ধরছে যেটা আমরা overlook করছিলাম। live যাওয়ার আগে fix করতে পারছি।' 
  },
  { 
    name:'Sadia Rahman', 
    role:'Operations Manager, FinEdge BD', 
    avatar:'SR', 
    color:'#8B5CF6', 
    quote:'AutoFlow AI use করে repetitive কাজ automate করেছি। team workload কমেছে, productivity noticeably improve করেছে।' 
  },
  { 
    name:'Imran Chowdhury', 
    role:'Marketing Lead, GrowthGrid', 
    avatar:'IC', 
    color:'#22D3EE', 
    quote:'RankRadar use করার পর SEO direction clear হয়েছে। random guess না করে data-based decision নিতে পারছি। traffic steadily বাড়তেছে।' 
  },
];

const FAQS = [
  { q:'Is there a free trial available?', a:'Yes — every product includes a 14-day free trial with no credit card required. You get full access to all features during the trial period.' },
  { q:'Can I cancel anytime?', a:'Absolutely. All plans are month-to-month with no lock-in contracts. Cancel from your dashboard with one click and you\'ll never be charged again.' },
  { q:'Do you offer annual billing discounts?', a:'Yes, switching to annual billing saves you 20% across all plans. You can toggle this on your subscription settings page.' },
  { q:'Is my data secure with Axentralab?', a:"We're SOC 2 Type II certified and all data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never sell or share your data with third parties." },
  { q:'Can I use multiple products together?', a:'Yes, and they integrate natively. Add any products to your cart and manage everything from a single unified dashboard.' },
  { q:'Do you support on-premise deployments?', a:'On-premise and private VPC deployments are available on the Enterprise plan. Contact our sales team for a custom quote.' },
];

const STATS = [
  { value:'2,500+', label:'Security Scans Completed', color:'#8B5CF6' },
  { value:'99.9%', label:'System Uptime', color:'#3B82F6' },
  { value:'120+', label:'Active Clients', color:'#A855F7' },
  { value:'< 10 min', label:'Avg Issue Response Time', color:'#F97316' },
];

const CATEGORIES = ['All', 'Cybersecurity', 'AI / Automation', 'SEO & Marketing'];
const HERO_BG_IMAGE = process.env.REACT_APP_HERO_BG_IMAGE || '/images/hero-bg.png';

const getCat = (tag) => {
  if (['WordPress Security','Monitoring Platform','API Security','Cloud Security','Automated Pentesting','Data Privacy','Email Security','Log Management','Bot Protection'].includes(tag)) return 'Cybersecurity';
  if (['AI Automation','AI Email Marketing'].includes(tag)) return 'AI / Automation';
  if (['SEO Intelligence'].includes(tag)) return 'SEO & Marketing';
  return 'Cybersecurity';
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCat, setActiveCat] = useState('All');

  const isInCart = (id) => cart.some(i => i.serviceId === id);

  const handleBuy = (p) => {
    if (!isAuthenticated) { navigate('/register'); return; }
    addToCart(
      { _id: p.id, title: p.name },
      { name: 'Monthly', price: p.price, billing: p.billing }
    );
    navigate('/cart');
  };

  const filtered = activeCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => getCat(p.tag) === activeCat);

  return (
    <>
      <div style={{ padding:'108px 5% 0', minHeight:'100vh' }}>
        <style>{`
          @media (max-width: 640px) {
            .cat-bar { flex-wrap: wrap !important; gap: 8px !important; }
            .cat-bar button { flex: 1 1 calc(50% - 8px) !important; }
            .prod-grid { grid-template-columns: 1fr !important; }
            .ent-inner { padding: 36px 22px !important; }
            .cta-inner  { padding: 40px 24px !important; }
            .step-grid  { grid-template-columns: 1fr !important; border-radius: 16px !important; }
            .step-grid > div { border-radius: 12px !important; border-left: 1px solid rgba(255,255,255,0.06) !important; margin-bottom: 1px; }
          }
          @media (max-width: 900px) {
            .ent-flex { flex-direction: column !important; }
          }
        `}</style>

        {/* ── Hero ── */}
        <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, marginBottom: 48, padding: '56px 20px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(6,8,15,0.9) 0%, rgba(6,8,15,0.72) 48%, rgba(6,8,15,0.9) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
          <div style={{ textAlign:'center', position: 'relative' }}>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #3B82F640', background:'#3B82F612', color:'#3B82F6', fontSize:11, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>SaaS Products</span>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(28px,5vw,58px)', fontWeight:900, color:'#fff', marginTop:16, letterSpacing:-1.5 }}>
              Security Tools Built by<br /><span style={{ color:'#8B5CF6' }}>Axentralab</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, maxWidth:440, margin:'14px auto 0' }}>
              Plug-and-play security, automation, and growth products — start in minutes.
            </p>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <div style={{ maxWidth:1100, margin:'0 auto 56px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:1, background:'rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)' }}>
          {STATS.map((s,i) => (
            <div key={i} style={{ padding:'28px 24px', background:'rgba(10,10,15,0.9)', textAlign:'center' }}>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:32, fontWeight:900, color:s.color, letterSpacing:-1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4, fontFamily:"'Space Mono',monospace", letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Category Filter ── */}
        <div className="cat-bar" style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:36, flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{ padding:'8px 20px', borderRadius:10, border: activeCat===cat ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)', background: activeCat===cat ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', color: activeCat===cat ? '#8B5CF6' : 'rgba(255,255,255,0.45)', fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.18s' }}>
              {cat}
              <span style={{ marginLeft:7, padding:'1px 7px', borderRadius:999, background: activeCat===cat ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)', fontSize:10, color: activeCat===cat ? '#8B5CF6' : 'rgba(255,255,255,0.3)', fontFamily:"'Space Mono',monospace" }}>
                {cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => getCat(p.tag) === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Product Cards ── */}
        <div className="prod-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24, maxWidth:1100, margin:'0 auto' }}>
          {filtered.map((p) => (
            <div key={p.id}
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden', transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${p.color}35`; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${p.color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ height:5, background:`linear-gradient(90deg,${p.color},transparent)` }} />
              <div style={{ padding:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                  <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:999, border:`1px solid ${p.color}30`, background:`${p.color}10`, color:p.color, fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:0.5, textTransform:'uppercase', fontWeight:600 }}>{p.tag}</span>
                  <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:22, color:p.color }}>${p.price}<span style={{ fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.4)' }}>/mo</span></span>
                </div>
                <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:900, color:'#fff', margin:'12px 0 10px', letterSpacing:-0.6 }}>{p.name}</h2>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:22 }}>{p.desc}</p>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 26px' }}>
                  {p.features.map((f,j) => (
                    <li key={j} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color:p.color, fontSize:13 }}>✓</span>
                      <span style={{ fontSize:14, color:'rgba(255,255,255,0.65)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => handleBuy(p)} className="btn-primary" style={{ flex:1, padding:'12px', background:isInCart(p.id)?'rgba(139,92,246,0.15)':p.color, color:isInCart(p.id)?p.color:'#000', border:isInCart(p.id)?`1px solid ${p.color}40`:'none', fontSize:14 }}>
                    {isInCart(p.id) ? '✓ Added to Cart' : isAuthenticated ? '🛒 Start Free Trial' : 'Get Started →'}
                  </button>
                  <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline"
                    style={{ padding:'12px 16px', fontSize:13, textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Compare Table ── */}
        <div style={{ maxWidth:1100, margin:'72px auto 0' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #ffffff15', background:'#ffffff08', color:'rgba(255,255,255,0.5)', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Feature Matrix</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#fff', marginTop:12, letterSpacing:-0.5 }}>Compare All Plans</h2>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginTop:8 }}>Security products only — scroll horizontally on mobile</p>
          </div>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, overflow:'auto' }}>
            <div style={{ minWidth:780 }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr repeat(6,1fr)', padding:'14px 24px', background:'rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.06)', gap:8 }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:1 }}>FEATURE</span>
                {PRODUCTS.slice(0,6).map(p => (
                  <span key={p.id} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:p.color, letterSpacing:0.5, textAlign:'center' }}>{p.name.toUpperCase()}</span>
                ))}
              </div>
              {[
                ['Real-time scanning',     true,  true,  true,  true,  true,  true ],
                ['Auto remediation',       false, true,  false, false, true,  false],
                ['API endpoint testing',   false, false, true,  false, true,  false],
                ['Dashboard & reports',    true,  true,  true,  true,  true,  true ],
                ['Slack / email alerts',   false, true,  true,  true,  true,  true ],
                ['CI/CD integration',      false, false, true,  false, true,  false],
                ['Cloud infra scanning',   false, false, false, true,  false, false],
                ['PII/PHI data discovery', false, false, false, false, false, true ],
                ['Pen test simulation',    false, false, false, false, true,  false],
                ['Compliance export',      false, false, false, true,  false, true ],
                ['White-label option',     false, true,  false, false, false, false],
              ].map(([label, ...vals], i, arr) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr repeat(6,1fr)', padding:'12px 24px', borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.04)':'none', background:i%2===0?'transparent':'rgba(255,255,255,0.01)', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>{label}</span>
                  {vals.map((v,j) => (
                    <span key={j} style={{ textAlign:'center', fontSize:15 }}>{v ? '✅' : '❌'}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Enterprise Section ── */}
        <div style={{ maxWidth:1100, margin:'80px auto 0' }}>
          <div className="ent-inner" style={{ background:'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(59,130,246,0.06) 100%)', border:'1px solid rgba(168,85,247,0.2)', borderRadius:24, padding:'56px 48px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-60, right:-60, width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
            <div className="ent-flex" style={{ display:'flex', flexWrap:'wrap', gap:40, alignItems:'flex-start', position:'relative' }}>
              <div style={{ flex:'1 1 340px' }}>
                <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #A855F740', background:'#A855F712', color:'#A855F7', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Enterprise</span>
                <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(24px,4vw,38px)', fontWeight:900, color:'#fff', margin:'16px 0 14px', letterSpacing:-1 }}>
                  Built for Teams<br />That Can't Afford<br /><span style={{ color:'#A855F7' }}>to Be Breached</span>
                </h2>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, lineHeight:1.8, maxWidth:380, marginBottom:28 }}>
                  Everything in all plans plus dedicated support, on-premise deployments, unlimited seats, and a named security engineer on your account.
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <button className="btn-primary" style={{ padding:'13px 28px', background:'#A855F7', color:'#fff', fontSize:14, border:'none' }}>Talk to Sales →</button>
                  <button className="btn-outline" style={{ padding:'13px 22px', fontSize:14 }}>View Case Studies</button>
                </div>
              </div>
              <div style={{ flex:'1 1 340px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16 }}>
                {ENTERPRISE_FEATURES.map((f,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'18px 16px' }}>
                    <div style={{ fontSize:24, marginBottom:10 }}>{f.icon}</div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:'#fff', marginBottom:6 }}>{f.title}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div style={{ maxWidth:1100, margin:'80px auto 0' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #ffffff15', background:'#ffffff08', color:'rgba(255,255,255,0.5)', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Testimonials</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#fff', marginTop:12, letterSpacing:-0.5 }}>Trusted by Security-First Teams</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:28, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${t.color}30`; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='none'; }}>
                <div style={{ fontSize:28, color:t.color, fontFamily:'Georgia,serif', lineHeight:1, marginBottom:14, opacity:0.7 }}>"</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.75, marginBottom:22 }}>{t.quote}</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:`${t.color}20`, border:`1px solid ${t.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:12, color:t.color }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:'#fff' }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div style={{ maxWidth:1100, margin:'80px auto 0' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #8B5CF640', background:'#8B5CF610', color:'#8B5CF6', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Process</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#fff', marginTop:12, letterSpacing:-0.5 }}>Up & Running in 3 Steps</h2>
          </div>
          <div className="step-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
            {[
              { step:'01', icon:'🛒', title:'Pick Your Plan',      desc:'Choose one or more products and add them to your cart. Bundle for maximum coverage.' },
              { step:'02', icon:'⚙️', title:'Connect in Minutes',  desc:'Follow the guided setup wizard. Most integrations take under 5 minutes — no DevOps required.' },
              { step:'03', icon:'🛡️', title:'Stay Protected 24/7', desc:'Your dashboard goes live immediately. Get real-time alerts, weekly reports, and continuous scans.' },
            ].map((s,i) => (
              <div key={i} style={{ padding:'36px 32px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:i===0?'16px 0 0 16px':i===2?'0 16px 16px 0':'0', borderLeft:i>0?'none':undefined }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.2)', letterSpacing:2, marginBottom:16 }}>{s.step}</div>
                <div style={{ fontSize:32, marginBottom:14 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:800, color:'#fff', marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ maxWidth:720, margin:'80px auto 0' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #ffffff15', background:'#ffffff08', color:'rgba(255,255,255,0.5)', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>FAQ</span>
            <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#fff', marginTop:12, letterSpacing:-0.5 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((f,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${openFaq===i ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius:14, overflow:'hidden', transition:'border-color 0.2s' }}>
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                  style={{ width:'100%', padding:'18px 22px', background:'transparent', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:700, color:'#fff', textAlign:'left' }}>{f.q}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)', fontSize:18, flexShrink:0, transition:'transform 0.2s', transform: openFaq===i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq===i && (
                  <div style={{ padding:'0 22px 18px' }}>
                    <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.8, margin:0 }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ maxWidth:1100, margin:'80px auto 0', paddingBottom:100 }}>
          <div className="cta-inner" style={{ background:'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.08) 100%)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:24, padding:'64px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />
            <div style={{ position:'relative' }}>
              <span style={{ display:'inline-block', padding:'3px 12px', borderRadius:999, border:'1px solid #8B5CF640', background:'#8B5CF610', color:'#8B5CF6', fontSize:10, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Get Protected Today</span>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,4vw,44px)', fontWeight:900, color:'#fff', margin:'20px auto 16px', letterSpacing:-1, maxWidth:600 }}>
                Your Next Security Incident<br />Could Be Your Last
              </h2>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, maxWidth:480, margin:'0 auto 32px', lineHeight:1.7 }}>
                14-day free trial. No credit card required. Cancel anytime. Join 4,200+ teams already protected by Axentralab.
              </p>
              <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="btn-primary" style={{ padding:'15px 36px', background:'#8B5CF6', color:'#000', fontSize:15, border:'none', fontWeight:700 }}>Start Free Trial →</button>
                <button className="btn-outline" style={{ padding:'15px 28px', fontSize:15 }}>Book a Demo</button>
              </div>
              <div style={{ marginTop:24, display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap' }}>
                {['✓ No credit card','✓ 14-day free trial','✓ Cancel anytime'].map((t,i) => (
                  <span key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontFamily:"'Space Mono',monospace" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}