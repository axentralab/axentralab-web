import React, { useState } from 'react';
import axios from 'axios';
import './QuoteCalculator.css';

const PROJECT_TYPES = [
  { label: 'Website Design & Development', icon: '🌐' },
  { label: 'SaaS Platform',                icon: '📦' },
  { label: 'Security Audit',               icon: '🛡️' },
  { label: 'Business Automation',          icon: '⚙️' },
  { label: 'AI Integration',               icon: '🤖' },
  { label: 'Mobile App',                   icon: '📱' },
];

const FEATURES = [
  'User Authentication',
  'Payment System',
  'Admin Dashboard',
  'API Integration',
  'Email Notifications',
  'Search Functionality',
  'Analytics Dashboard',
];

const SECURITY_OPTIONS = [
  { value: 'standard',   label: 'Standard',      desc: 'Basic security best practices'  },
  { value: 'high',       label: 'High Security', desc: 'Hardened + penetration tested'   },
  { value: 'enterprise', label: 'Enterprise',    desc: 'Full audit + compliance reports' },
];

const TIMELINE_OPTIONS = [
  { value: '',          label: 'Flexible timeline' },
  { value: 'ASAP',      label: 'ASAP (1–2 weeks)' },
  { value: '1-month',   label: '1 Month'           },
  { value: '2-months',  label: '2 Months'          },
  { value: '3-months',  label: '3+ Months'         },
];

const STEPS = ['Project Type', 'Customise', 'Your Quote'];

function Stepper({ step }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const num    = i + 1;
        const done   = step > num;
        const active = step === num;
        return (
          <React.Fragment key={label}>
            <div className="stepper-item">
              <div className={`stepper-circle ${done ? 'done' : active ? 'active' : 'idle'}`}>
                {done ? '✓' : num}
              </div>
              <span className={`stepper-label ${active ? 'active' : 'idle'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`stepper-line ${step > i + 1 ? 'done' : 'idle'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function QuoteCalculator() {
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [quote, setQuote]       = useState(null);
  const [error, setError]       = useState('');
  const [showLead, setShowLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '' });

  const [formData, setFormData] = useState({
    projectType:   '',
    pages:         5,
    features:      [],
    securityLevel: 'standard',
    deadline:      '',
  });

  const handleFeatureToggle = (f) =>
    setFormData(p => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter(x => x !== f)
        : [...p.features, f],
    }));

  const handleChange = (e) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const generateQuote = async () => {
    if (!formData.projectType) { setError('Please select a project type'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/quotes`, formData);
      setQuote(res.data.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quote');
    } finally {
      setLoading(false);
    }
  };

  const convertToLead = async () => {
    if (!leadForm.name || !leadForm.email) { setError('Name and email are required'); return; }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/quotes/${quote._id}/convert`,
        { ...leadForm, message: `Quote for ${formData.projectType}` }
      );
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-page">
      <div className="quote-inner">

        {/* ── Header ── */}
        <div className="quote-header">
          <div className="quote-badge">💰 Instant Quote</div>
          <h1 className="quote-title">Smart Quote Calculator</h1>
          <p className="quote-subtitle">Get an AI-powered estimate for your project in under 60 seconds</p>
          <div className="quote-promo-nudge">
            <span>🎁</span>
            New clients get 50% off — code <strong>FIRST50</strong>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="quote-card">
          <div className="quote-card-bar" />
          <div className="quote-card-body">

            <Stepper step={step} />

            {error && <div className="quote-error">⚠️ {error}</div>}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="q-step">
                <p className="step-eyebrow">What are you building?</p>
                <div className="proj-grid">
                  {PROJECT_TYPES.map(({ label, icon }) => {
                    const active = formData.projectType === label;
                    return (
                      <button
                        key={label}
                        className={`proj-btn${active ? ' active' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, projectType: label }))}
                      >
                        <span className="proj-btn-icon">{icon}</span>
                        <span className="proj-btn-label">{label}</span>
                        {active && <span className="proj-btn-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="form-btns form-btns-right">
                  <button
                    className="btn-primary-dark"
                    onClick={() => { setError(''); setStep(2); }}
                    disabled={!formData.projectType}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="q-step">

                <div className="form-group">
                  <div className="range-row">
                    <label className="form-label no-mb">Number of Pages / Screens</label>
                    <span className="range-value">{formData.pages} pages</span>
                  </div>
                  <input
                    type="range"
                    className="q-range"
                    min="1" max="50"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                  />
                  <div className="range-hints">
                    <span className="range-hint">1</span>
                    <span className="range-hint">50</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Features</label>
                  <div className="feat-grid">
                    {FEATURES.map(f => {
                      const checked = formData.features.includes(f);
                      return (
                        <label key={f} className={`feat-chip${checked ? ' checked' : ''}`}>
                          <div className={`feat-checkbox-box${checked ? ' checked' : ''}`}>
                            {checked && <span className="feat-check-tick">✓</span>}
                          </div>
                          <span className="feat-chip-label">{f}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleFeatureToggle(f)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Security Level</label>
                  <div className="sec-grid">
                    {SECURITY_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`sec-opt${formData.securityLevel === opt.value ? ' active' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, securityLevel: opt.value }))}
                      >
                        <div className="sec-opt-label">{opt.label}</div>
                        <div className="sec-opt-desc">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Timeline</label>
                  <select
                    className="q-select"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  >
                    {TIMELINE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-btns">
                  <button className="btn-secondary-dark" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn-primary-dark"
                    onClick={generateQuote}
                    disabled={loading}
                  >
                    {loading ? '⏳ Generating…' : 'Get Estimate →'}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && quote && (
              <div className="q-step">

                <div className="quote-result-header">
                  <div className="quote-result-eyebrow">AI-Generated Estimate</div>
                  <h2 className="quote-result-title">Your Quote is Ready ✨</h2>
                </div>

                <div className="quote-hl">
                  {[
                    { icon: '💵', label: 'Estimated Cost', value: quote.estimatedCost     },
                    { icon: '📅', label: 'Timeline',       value: quote.timeline          },
                    { icon: '🎯', label: 'Confidence',     value: `${quote.confidence}%`  },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="hl-box">
                      <div className="hl-icon">{icon}</div>
                      <div className="hl-label">{label}</div>
                      <div className="hl-value">{value}</div>
                    </div>
                  ))}
                </div>

                {quote.costBreakdown && (
                  <div className="result-card">
                    <div className="result-card-title">📊 Cost Breakdown</div>
                    {Object.entries(quote.costBreakdown).map(([item, cost]) => (
                      <div key={item} className="breakdown-row">
                        <span className="breakdown-item">{item.replace(/_/g, ' ')}</span>
                        <span className="breakdown-cost">{cost}</span>
                      </div>
                    ))}
                  </div>
                )}

                {quote.recommendedTechStack && (
                  <div className="result-card">
                    <div className="result-card-title">🛠️ Recommended Stack</div>
                    <div className="tech-tags">
                      {quote.recommendedTechStack.map(t => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {quote.phases && (
                  <div className="result-card">
                    <div className="result-card-title">📌 Project Phases</div>
                    {quote.phases.map((phase, idx) => (
                      <div key={idx} className="phase-row">
                        <div className="phase-num">{idx + 1}</div>
                        <span className="phase-text">{phase}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!showLead ? (
                  <div className="form-btns">
                    <button
                      className="btn-secondary-dark"
                      onClick={() => { setStep(2); setQuote(null); }}
                    >
                      ← Adjust
                    </button>
                    <button
                      className="btn-primary-dark btn-flex"
                      onClick={() => setShowLead(true)}
                    >
                      Get Proposal & Consultation →
                    </button>
                  </div>
                ) : (
                  <div className="lead-capture">
                    <div className="lead-title">Almost there 🎉</div>
                    <div className="lead-subtitle">We'll send your detailed proposal within 24 hours.</div>
                    <div className="lead-fields">
                      {[
                        { name: 'name',    placeholder: 'Your Name *',        type: 'text'  },
                        { name: 'email',   placeholder: 'Work Email *',       type: 'email' },
                        { name: 'company', placeholder: 'Company (optional)', type: 'text'  },
                      ].map(({ name, placeholder, type }) => (
                        <input
                          key={name}
                          type={type}
                          placeholder={placeholder}
                          value={leadForm[name]}
                          onChange={e => setLeadForm(p => ({ ...p, [name]: e.target.value }))}
                          className="q-lead-input"
                        />
                      ))}
                    </div>
                    <button
                      className="btn-primary-dark full"
                      onClick={convertToLead}
                      disabled={loading}
                    >
                      {loading ? '⏳ Sending…' : 'Send My Proposal →'}
                    </button>
                  </div>
                )}

                <div className="quote-info-strip">
                  <span>💡</span>
                  Detailed proposal within 24 hours · NDA included by default
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Trust pills ── */}
        <div className="trust-pills">
          {['✓ Free estimate', '✓ No commitment', '✓ NDA on request', '🎁 50% off first project'].map((t, i) => (
            <span key={i} className={`trust-pill${i === 3 ? ' highlight' : ''}`}>{t}</span>
          ))}
        </div>

      </div>
    </div>
  );
}