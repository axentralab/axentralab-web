import { useState } from 'react';
import api from '../services/api';



const SERVICES = ['AI Automation','Web Development','Cybersecurity','DevOps & Cloud','SaaS Development','IT Consulting','Other'];
const BUDGETS  = ['Under $5k','$5k – $15k','$15k – $50k','$50k+','Let\'s discuss'];

const TRUST_POINTS = [
  { icon:'⚡', label:'24hr Response',   sub:'Guaranteed reply within one business day' },
  { icon:'🔒', label:'NDA on Request',  sub:'Your project details stay strictly private' },
  { icon:'🌍', label:'Local + Remote',  sub:'Based in Dhaka, serving clients worldwide' },
  { icon:'💯', label:'Results-Driven',  sub:'We focus on delivery, not just promises' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', company:'', service:'', budget:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [focused, setFocused]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/leads', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = (k) => ({
    width: '100%',
    background: focused === k ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === k ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 10,
    padding: '11px 14px',
    color: '#fff',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    boxShadow: focused === k ? '0 0 0 3px rgba(34,197,94,0.08)' : 'none',
  });

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.35)',
    display: 'block',
    marginBottom: 6,
    fontFamily: "'Space Mono', monospace",
    letterSpacing: 1,
    textTransform: 'uppercase',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800;900&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes scan   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .contact-input::placeholder { color: rgba(255,255,255,0.18); }
        .contact-input option { background: #0a0f1a; color: #fff; }
        .trust-card:hover  { border-color: rgba(34,197,94,0.25) !important; transform: translateY(-2px); }
        .submit-btn:hover:not(:disabled) { background: #16a34a !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.25) !important; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Responsive Layout ── */
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.45fr;
          gap: 32px;
          align-items: start;
        }
        .contact-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .contact-trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .contact-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
        }
        .contact-footer-links {
          display: flex;
          gap: 20px;
        }

        @media (max-width: 860px) {
          .contact-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 520px) {
          .contact-form-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .contact-trust-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .contact-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .contact-footer-links {
            flex-wrap: wrap;
            gap: 14px;
          }
        }

        @media (max-width: 360px) {
          .contact-trust-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ minHeight:'100vh', padding:'clamp(70px,10vw,90px) 0 0', position:'relative', overflow:'hidden' }}>

        {/* bg scanline sweep */}
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.06),transparent)', animation:'scan 8s linear infinite' }} />
        </div>

        {/* bg glow blobs */}
        <div style={{ position:'fixed', top:'15%', left:'-8%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,197,94,0.055) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'fixed', bottom:'10%', right:'-5%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:1160, margin:'0 auto', padding:'0 clamp(16px,5%,5%)' }}>

          {/* ── Page Header ── */}
          <div style={{ textAlign:'center', marginBottom:'clamp(36px,6vw,64px)' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:999, border:'1px solid rgba(34,197,94,0.25)', background:'rgba(34,197,94,0.06)', marginBottom:18 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'blink 1.4s ease-in-out infinite' }} />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#22C55E', letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Secure Channel Open</span>
            </div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(32px,5.5vw,64px)', fontWeight:900, color:'#fff', letterSpacing:-2, lineHeight:1.05, margin:'0 0 16px' }}>
              Let's Build<br />
              <span style={{ WebkitTextStroke:'1px rgba(34,197,94,0.6)', color:'transparent' }}>Something</span>
              {' '}<span style={{ color:'#22C55E' }}>Real</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:15, maxWidth:400, margin:'0 auto', lineHeight:1.8, fontFamily:"'DM Sans',sans-serif" }}>
              Tell us about your project. We respond within 24 hours with a tailored proposal — no generic templates.
            </p>
          </div>

          {/* ── Main Grid ── */}
          <div className="contact-main-grid">

            {/* ── LEFT PANEL ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Terminal info card */}
              <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, overflow:'hidden' }}>
                <div style={{ padding:'12px 18px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#EF4444','#F59E0B','#22C55E'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.7 }} />)}
                  </div>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:1 }}>axentralab — contact.sh</span>
                </div>
                <div style={{ padding:'20px 18px', fontFamily:"'Space Mono',monospace", fontSize:12, lineHeight:2 }}>
                  {[
                    { prompt:'>', cmd:'init contact_session', color:'#22C55E' },
                    { prompt:'>', cmd:'channel: encrypted ✓', color:'rgba(255,255,255,0.5)' },
                    { prompt:'>', cmd:'response_time: < 24h', color:'rgba(255,255,255,0.5)' },
                    { prompt:'>', cmd:'nda: available_on_request', color:'rgba(255,255,255,0.5)' },
                    { prompt:'>', cmd:'status: ready_to_build ▋', color:'#22C55E' },
                  ].map((l,i) => (
                    <div key={i} style={{ display:'flex', gap:10, animation:`fadeUp 0.4s ease ${i*0.1}s both` }}>
                      <span style={{ color:'rgba(34,197,94,0.5)' }}>{l.prompt}</span>
                      <span style={{ color:l.color }}>{l.cmd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact details */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { icon:'📧', label:'Email',    val:'axentralab@gmail.com',       color:'#22C55E' },
                  { icon:'📞', label:'Phone',    val:'01322695162 / 01329478744',   color:'#3B82F6' },
                  { icon:'📍', label:'Location', val:'Dhaka, Bangladesh',           color:'#A855F7' },
                ].map((c,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, transition:'all 0.2s', cursor:'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=`${c.color}30`; e.currentTarget.style.background='rgba(255,255,255,0.035)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`${c.color}12`, border:`1px solid ${c.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:3 }}>{c.label}</div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>{c.val}</div>
                    </div>
                    <span style={{ marginLeft:'auto', fontSize:14, color:'rgba(255,255,255,0.15)' }}>→</span>
                  </div>
                ))}
              </div>

              {/* Trust grid */}
              <div className="contact-trust-grid">
                {TRUST_POINTS.map((t,i) => (
                  <div key={i} className="trust-card" style={{ padding:'16px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, transition:'all 0.2s', cursor:'default' }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{t.icon}</div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, color:'#fff', marginBottom:4 }}>{t.label}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', lineHeight:1.5, fontFamily:"'DM Sans',sans-serif" }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: FORM ── */}
            <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, overflow:'hidden' }}>
              {/* Form header bar */}
              <div style={{ padding:'16px 28px', background:'rgba(255,255,255,0.025)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:800, color:'#fff' }}>Send a Message</span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'blink 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:1 }}>ENCRYPTED</span>
                </div>
              </div>

              <div style={{ padding:'clamp(18px,4vw,28px)' }}>
                {submitted ? (
                  <div style={{ textAlign:'center', padding:'48px 0', animation:'fadeUp 0.5s ease' }}>
                    <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.1)', border:'2px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 20px' }}>✅</div>
                    <h2 style={{ fontFamily:"'Sora',sans-serif", color:'#22C55E', fontSize:22, fontWeight:900, marginBottom:10, letterSpacing:-0.5 }}>Message Received!</h2>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", maxWidth:320, margin:'0 auto' }}>
                      We'll reach out within 24 hours with a personalised proposal tailored to your project.
                    </p>
                    <div style={{ marginTop:28, padding:'12px 20px', background:'rgba(34,197,94,0.05)', border:'1px solid rgba(34,197,94,0.15)', borderRadius:12, display:'inline-block' }}>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(34,197,94,0.7)' }}>ref_id: AXL-{Math.floor(Math.random()*90000+10000)}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#EF4444', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:8 }}>
                        <span>⚠️</span> {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

                      {/* Name + Email */}
                      <div className="contact-form-grid-2">
                        {[{ k:'name', l:'Your Name', ph:'John Smith', type:'text', req:true }, { k:'email', l:'Email Address', ph:'john@company.com', type:'email', req:true }].map(f => (
                          <div key={f.k}>
                            <label style={labelStyle}>{f.l}</label>
                            <input className="contact-input" type={f.type} placeholder={f.ph} required={f.req}
                              value={form[f.k]} onChange={e => set(f.k, e.target.value)}
                              onFocus={() => setFocused(f.k)} onBlur={() => setFocused('')}
                              style={inputStyle(f.k)} />
                          </div>
                        ))}
                      </div>

                      {/* Company */}
                      <div>
                        <label style={labelStyle}>Company <span style={{ color:'rgba(255,255,255,0.2)', fontWeight:400 }}>(optional)</span></label>
                        <input className="contact-input" placeholder="Acme Inc." value={form.company}
                          onChange={e => set('company', e.target.value)}
                          onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                          style={inputStyle('company')} />
                      </div>

                      {/* Service + Budget */}
                      <div className="contact-form-grid-2">
                        {[{ k:'service', l:'Service Needed', opts:SERVICES }, { k:'budget', l:'Budget Range', opts:BUDGETS }].map(f => (
                          <div key={f.k}>
                            <label style={labelStyle}>{f.l}</label>
                            <select className="contact-input" value={form[f.k]}
                              onChange={e => set(f.k, e.target.value)}
                              onFocus={() => setFocused(f.k)} onBlur={() => setFocused('')}
                              style={{ ...inputStyle(f.k), cursor:'pointer' }}>
                              <option value="">Select…</option>
                              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>

                      {/* Message */}
                      <div>
                        <label style={labelStyle}>Project Details</label>
                        <textarea className="contact-input" rows={5} placeholder="Tell us what you're building, the problem you're solving, and any technical context that would help us scope the work…"
                          required value={form.message} onChange={e => set('message', e.target.value)}
                          onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                          style={{ ...inputStyle('message'), resize:'none' }} />
                      </div>

                      {/* Submit */}
                      <button type="submit" disabled={loading} className="submit-btn"
                        style={{ padding:'14px', background:'#22C55E', color:'#000', border:'none', borderRadius:12, fontSize:15, fontWeight:800, fontFamily:"'Sora',sans-serif", cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:10, letterSpacing:-0.3 }}>
                        {loading
                          ? <><span style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.3)', borderTopColor:'#000', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Encrypting & Sending…</>
                          : <><span>Send Message</span><span style={{ fontSize:18 }}>→</span></>
                        }
                      </button>

                      <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'Space Mono',monospace", letterSpacing:0.5, marginTop:2 }}>
                        🔒 Your data is encrypted in transit · No spam ever
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom strip ── */}
          <div className="contact-footer" style={{ marginTop:'clamp(40px,6vw,72px)', paddingBottom:80, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:36 }}>
            <div>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:16, color:'#fff', letterSpacing:-0.4 }}>Axentralab</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.2)', marginLeft:12, letterSpacing:1 }}>© 2025 · All rights reserved</span>
            </div>
            <div className="contact-footer-links">
              {['Privacy Policy','Terms of Service','Security'].map((l,i) => (
                <span key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontFamily:"'DM Sans',sans-serif", cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}>{l}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}