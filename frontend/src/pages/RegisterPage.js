import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { icon:'📋', title:'Tell us about your project',  desc:'We scope it out and send a fixed-price proposal.' },
  { icon:'✍️', title:'Sign the contract + NDA',      desc:'E-sign in one click. Legally protected from day one.' },
  { icon:'⚙️', title:'We build, you review',         desc:'Weekly demos on staging. You give feedback; we iterate.' },
  { icon:'🚀', title:'Launch & full handover',        desc:'Source code, docs, and optional retainer support.' },
];

const LOGOS = ['FinNova','BankCo','LearnLoop','Carrgo','Medify','Vaultify'];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', company:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9!@#$%]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['','Weak','Fair','Good','Strong'][strength];
  const strengthColor = ['','#EF4444','#F59E0B','#3B82F6','#22C55E'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters.');
    const result = await register(form.name, form.email, form.password, form.company);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800;900&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes glow    { 0%,100%{opacity:0.45} 50%{opacity:0.85} }
        @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .reg-input {
          width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:13px 16px; color:#fff; font-size:14px;
          font-family:'DM Sans',sans-serif; outline:none; transition:all 0.2s;
        }
        .reg-input:focus {
          border-color:rgba(59,130,246,0.5);
          background:rgba(59,130,246,0.04);
          box-shadow:0 0 0 3px rgba(59,130,246,0.08);
        }
        .reg-input::placeholder { color:rgba(255,255,255,0.2); }
        .reg-submit {
          width:100%; padding:14px; background:#3B82F6; color:#fff; border:none;
          border-radius:12px; font-family:'Sora',sans-serif; font-weight:900;
          font-size:15px; letter-spacing:-0.3px; cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .reg-submit:hover:not(:disabled) { background:#2563eb; transform:translateY(-1px); box-shadow:0 8px 28px rgba(59,130,246,0.35); }
        .reg-submit:disabled { opacity:0.6; cursor:not-allowed; }
        .step-item { transition:all 0.2s; }
        .step-item:hover { transform:translateX(4px); }

        /* Layout */
        .reg-outer {
          min-height:100vh;
          display:grid;
          grid-template-columns:1fr 1fr;
        }
        @media (max-width:900px) {
          .reg-outer { grid-template-columns:1fr !important; }
          .reg-left  { display:none !important; }
          .reg-right { padding:clamp(40px,8vw,80px) clamp(20px,6vw,48px) !important; }
        }
        @media (max-width:420px) {
          .reg-right { padding:32px 18px !important; }
        }
      `}</style>

      <div className="reg-outer">

        {/* ── LEFT VISUAL PANEL ── */}
        <div className="reg-left" style={{ position:'relative', background:'#070B12', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 52px' }}>

          {/* diagonal stripe bg */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg,rgba(59,130,246,0.03) 0px,rgba(59,130,246,0.03) 1px,transparent 1px,transparent 28px)', pointerEvents:'none' }} />

          {/* glow blobs */}
          <div style={{ position:'absolute', top:'-5%', right:'-10%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)', animation:'glow 5s ease-in-out infinite', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'10%', left:'-8%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 65%)', pointerEvents:'none' }} />

          {/* Logo */}
          <div style={{ position:'relative', zIndex:1 }}>
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#22C55E,#16A34A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#000', fontFamily:"'Sora',sans-serif" }}>A</div>
              <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:900, fontSize:18, color:'#fff', letterSpacing:-0.3 }}>Axentralab</span>
            </Link>
          </div>

          {/* Center headline + steps */}
          <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'36px 0' }}>
            <div style={{ marginBottom:36 }}>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:900, color:'#fff', letterSpacing:-1, lineHeight:1.1, margin:'0 0 12px' }}>
                From idea to launch —<br />
                <span style={{ color:'#3B82F6' }}>we've done it 120+ times.</span>
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.38)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.7, maxWidth:340 }}>
                Create your account and get a tailored proposal within 24 hours. No fluff, just execution.
              </p>
            </div>

            {/* Process steps */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {STEPS.map((s,i) => (
                <div key={i} className="step-item" style={{ display:'flex', alignItems:'flex-start', gap:14, animation:`fadeUp 0.4s ease ${i*0.08}s both` }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, color:'#fff', marginBottom:2 }}>{s.title}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontFamily:"'DM Sans',sans-serif" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: client logos ticker */}
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Trusted by</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ display:'flex', animation:'ticker 16s linear infinite', width:'max-content', gap:0 }}>
                {[...LOGOS,...LOGOS].map((l,i) => (
                  <span key={i} style={{ padding:'6px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:999, marginRight:8, fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:11, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: REGISTER FORM ── */}
        <div className="reg-right" style={{ background:'#0A0D16', display:'flex', alignItems:'center', padding:'clamp(40px,5vw,72px) clamp(24px,6vw,72px)', overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:440, margin:'0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:999, border:'1px solid rgba(59,130,246,0.25)', background:'rgba(59,130,246,0.07)', marginBottom:24 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#3B82F6', display:'inline-block' }} />
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#3B82F6', letterSpacing:2, textTransform:'uppercase' }}>New Account</span>
              </div>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:'clamp(26px,4vw,36px)', fontWeight:900, color:'#fff', letterSpacing:-1.2, lineHeight:1.1, margin:'0 0 10px' }}>
                Create your<br />account<span style={{ color:'#3B82F6' }}>.</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:14, fontFamily:"'DM Sans',sans-serif", lineHeight:1.7, margin:0 }}>
                Start building with Axentralab — your first proposal is free.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#EF4444', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:8, animation:'fadeUp 0.3s ease' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Name + Email */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:7, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Full Name</label>
                  <input className="reg-input" type="text" placeholder="John Smith" required
                    value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:7, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Email</label>
                  <input className="reg-input" type="email" placeholder="you@co.com" required
                    value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:7, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>
                  Company <span style={{ color:'rgba(255,255,255,0.18)', fontWeight:400, fontSize:10 }}>(optional)</span>
                </label>
                <input className="reg-input" type="text" placeholder="Acme Corp"
                  value={form.company} onChange={e => setForm({ ...form, company:e.target.value })} />
              </div>

              {/* Password */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:7, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input className="reg-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" required
                    value={form.password} onChange={e => setForm({ ...form, password:e.target.value })}
                    style={{ paddingRight:44 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ flex:1, height:3, borderRadius:99, background: n<=strength ? strengthColor : 'rgba(255,255,255,0.08)', transition:'all 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize:10, color:strengthColor, fontFamily:"'Space Mono',monospace", letterSpacing:0.5 }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.32)', marginBottom:7, fontFamily:"'Space Mono',monospace", letterSpacing:1, textTransform:'uppercase' }}>Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <input className="reg-input" type={showCf ? 'text' : 'password'} placeholder="••••••••" required
                    value={form.confirm} onChange={e => setForm({ ...form, confirm:e.target.value })}
                    style={{ paddingRight:44, borderColor: form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.5)' : form.confirm && form.confirm === form.password ? 'rgba(34,197,94,0.4)' : undefined }} />
                  <button type="button" onClick={() => setShowCf(!showCf)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}>
                    {showCf ? '🙈' : '👁️'}
                  </button>
                  {form.confirm && (
                    <span style={{ position:'absolute', right:44, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>
                      {form.confirm === form.password ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                <div style={{ width:17, height:17, borderRadius:5, border:'1px solid rgba(255,255,255,0.14)', background:'rgba(255,255,255,0.03)', flexShrink:0, marginTop:1 }} />
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.6 }}>
                  I agree to the{' '}
                  <span style={{ color:'#3B82F6', cursor:'pointer' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color:'#3B82F6', cursor:'pointer' }}>Privacy Policy</span>
                </span>
              </label>

              <button type="submit" className="reg-submit" disabled={loading}>
                {loading
                  ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Creating account…</>
                  : <><span>Create Account</span><span style={{ fontSize:18 }}>→</span></>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>OR</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }} />
            </div>

            <button style={{ width:'100%', padding:'13px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, color:'rgba(255,255,255,0.6)', fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}>
              <span style={{ fontSize:18 }}>🔗</span> Continue with Google
            </button>

            <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'rgba(255,255,255,0.35)', fontFamily:"'DM Sans',sans-serif" }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#3B82F6', fontWeight:700, textDecoration:'none' }}>Sign in →</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}