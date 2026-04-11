import React, { useState } from 'react';
import axios from 'axios';
import './NewsletterSignup.css';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    securityTips: true,
    businessUpdates: true,
    caseStudies: true,
    newFeatures: true,
  });

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/newsletter/subscribe`,
        {
          email,
          name: name || 'Subscriber',
          preferences,
        }
      );

      setSuccess(true);
      setEmail('');
      setName('');

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-signup">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2>📬 Stay Updated</h2>
          <p>Get weekly tips on digital transformation, cybersecurity, and AI integration.</p>

          {success && (
            <div className="alert alert-success">
              🎉 Successfully subscribed! Check your email for confirmation.
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="preferences">
              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.securityTips}
                  onChange={() => handlePreferenceChange('securityTips')}
                />
                <span>🔐 Security Tips</span>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.businessUpdates}
                  onChange={() => handlePreferenceChange('businessUpdates')}
                />
                <span>💼 Business Updates</span>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.caseStudies}
                  onChange={() => handlePreferenceChange('caseStudies')}
                />
                <span>📊 Case Studies</span>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  checked={preferences.newFeatures}
                  onChange={() => handlePreferenceChange('newFeatures')}
                />
                <span>✨ New Features</span>
              </label>
            </div>

            <button
              type="submit"
              className="subscribe-btn"
              disabled={loading || !email}
            >
              {loading ? '⏳ Subscribing...' : '✉️ Subscribe Now'}
            </button>
          </form>

          <p className="privacy-notice">
            💌 We respect your privacy. Unsubscribe anytime. <a href="/privacy">Privacy Policy</a>
          </p>
        </div>

        <div className="newsletter-benefits">
          <h3>What You'll Get:</h3>
          <ul>
            <li>✓ Weekly industry insights</li>
            <li>✓ Expert tips & best practices</li>
            <li>✓ Case studies & success stories</li>
            <li>✓ Product updates & new features</li>
            <li>✓ Security alerts & warnings</li>
            <li>✓ Exclusive offers & discounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
