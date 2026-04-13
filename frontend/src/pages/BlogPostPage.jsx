import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import { TAG_COLORS } from '../constants/statusColors';
import { readingTime } from '../utils/readingTime';

const PRIMARY  = '#6366F1';
const ACCENT   = '#8B5CF6';
const PRIMARY2 = '#A78BFA';
const SAVED_KEY = 'axentralab_saved_posts';

function generateBody(post) {
  return `${post.excerpt}\n\n## Overview\n\nThis article covers the essential aspects of ${post.title.toLowerCase()}. Whether you're a seasoned professional or just getting started, the insights here will help you make better decisions.\n\n## Key Takeaways\n\n- Understanding the core concepts is crucial before diving into implementation\n- Real-world examples provide context that documentation alone cannot offer\n- Continuous iteration and testing lead to better outcomes over time\n- Security and performance should never be afterthoughts\n\n## Deep Dive\n\nThe landscape of ${post.category} is evolving rapidly. At Axentralab, we've seen first-hand how the right approach can make or break a project.\n\n## Conclusion\n\nMastering ${post.category.toLowerCase()} is a journey, not a destination. Reach out if you need expert guidance.`;
}

function renderBody(text, accentColor) {
  const lines = text.split('\n');
  const elements = [];
  let listBuffer = [];
  const flush = () => {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`} style={{ paddingLeft: 20, margin: '0 0 12px' }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ color: 'rgba(255,255,255,0.62)', marginBottom: 8, lineHeight: 1.7 }}>
            <span style={{ color: accentColor, marginRight: 6 }}>▸</span>{item}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };
  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      flush();
      elements.push(
        <h2 key={i} style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', margin: '36px 0 14px', letterSpacing: -0.3, borderLeft: `3px solid ${accentColor}`, paddingLeft: 14 }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === '') {
      flush();
      elements.push(<div key={i} style={{ height: 10 }} />);
    } else {
      flush();
      elements.push(<p key={i} style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.9, marginBottom: 4 }}>{line}</p>);
    }
  });
  flush();
  return elements;
}

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { id }                = useParams();
  const navigate              = useNavigate();
  const toast                 = useToast();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);
  const [likes, setLikes]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('axentralab_likes') || '{}'); }
    catch { return {}; }
  });
  const [comments, setComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`blog_comments_${id}`) || '[]'); }
    catch { return []; }
  });
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
    catch { return []; }
  });

  const isLiked  = !!likes[id];
  const isSaved  = saved.includes(id);
  const likeCount = likes[`${id}_count`] || 0;

  useEffect(() => {
    localStorage.setItem('axentralab_likes', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem(`blog_comments_${id}`, JSON.stringify(comments));
  }, [comments, id]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setPost(null);
    // Re-load comments for new post
    try {
      setComments(JSON.parse(localStorage.getItem(`blog_comments_${id}`) || '[]'));
    } catch { setComments([]); }

    api.get(`/blog/${id}`, { signal: controller.signal })
      .then(r => {
        setPost(r.data.data);
        const all = r.data.allPosts || [];
        setRelated(all.filter(p => p.category === r.data.data.category && p._id !== id).slice(0, 3));
      })
      .catch(err => { if (err.name !== 'CanceledError' && err.name !== 'AbortError') setPost(null); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('Could not copy link'); }
  };

  const handleLike = () => {
    setLikes(prev => ({
      ...prev,
      [id]: !prev[id],
      [`${id}_count`]: (prev[`${id}_count`] || 0) + (prev[id] ? -1 : 1),
    }));
  };

  const handleToggleSave = () => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    toast.success(isSaved ? 'Removed from saved' : 'Article saved!');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: commentName.trim() || 'Anonymous',
      text: commentText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    toast.success('Comment posted!');
  };

  if (loading) return (
    <div style={{ padding: '100px 5% 80px', maxWidth: 760, margin: '0 auto' }}>
      <Skeleton height={13} width="20%" style={{ marginBottom: 32 }} />
      <Skeleton height={20} width="35%" style={{ marginBottom: 24 }} />
      <Skeleton height={42} width="90%" style={{ marginBottom: 8 }} />
      <Skeleton height={42} width="70%" style={{ marginBottom: 32 }} />
      <Skeleton height={16} width="100%" style={{ marginBottom: 8 }} />
      <Skeleton height={16} width="95%" style={{ marginBottom: 8 }} />
      <Skeleton height={16} width="80%" />
    </div>
  );

  if (!post) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 5%' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
      <h2 style={{ color: '#fff', fontFamily: "'Sora',sans-serif", marginBottom: 12 }}>Article not found</h2>
      <button onClick={() => navigate('/blog')} className="btn-primary" style={{ padding: '12px 28px' }}>← Back to Blog</button>
    </div>
  );

  const color      = TAG_COLORS[post.category] || PRIMARY;
  const hasRealBody = Boolean(post.body);
  const body       = post.body || generateBody(post);
  const minutes    = readingTime(body);

  return (
    <>
      <style>{`
        @keyframes fadeUpPost { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes glowFloat  { 0%,100%{opacity:0.4} 50%{opacity:0.75} }
        .post-article { animation: fadeUpPost 0.5s ease both; }
        .comment-input::placeholder { color: rgba(255,255,255,0.2); }
        .comment-input:focus { outline: none; border-color: ${PRIMARY}55 !important; box-shadow: 0 0 0 3px ${PRIMARY}15; }
        .like-btn { transition: all 0.18s; cursor: pointer; }
        .like-btn:hover { transform: scale(1.05); }
        .save-post-btn { transition: all 0.18s; cursor: pointer; }
        .save-post-btn:hover { transform: scale(1.05); }
        .related-card { transition: all 0.2s; cursor: pointer; }
        .related-card:hover { transform: translateY(-4px); }
        @media (max-width: 540px) {
          .post-share-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div style={{ padding: '100px 5% 80px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* BG glow */}
        <div style={{ position: 'fixed', top: '20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${color}10,transparent 70%)`, pointerEvents: 'none', zIndex: 0, animation: 'glowFloat 5s ease-in-out infinite' }} />

        <article className="post-article" style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Back */}
          <button onClick={() => navigate('/blog')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.38)', fontSize: 13, cursor: 'pointer', marginBottom: 32, padding: 0, fontFamily: "'Space Mono',monospace", transition: 'color 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.color = PRIMARY2}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}>
            ← Back to Blog
          </button>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, border: `1px solid ${color}30`, background: `${color}10`, color, fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{post.category}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>· {minutes} min read</span>
            {post.views > 0 && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>· {post.views.toLocaleString()} views</span>}
          </div>

          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(24px,4vw,42px)', fontWeight: 900, color: '#fff', margin: '0 0 24px', lineHeight: 1.2, letterSpacing: -1 }}>{post.title}</h1>

          <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 20, marginBottom: 36 }}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>{post.excerpt}</p>
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg,${color}50,${ACCENT}30,transparent)`, marginBottom: 36 }} />

          {!hasRealBody && (
            <div style={{ marginBottom: 20, padding: '10px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, fontSize: 12, color: 'rgba(245,158,11,0.8)', fontFamily: "'Space Mono',monospace" }}>
              ✏️ Full article coming soon — showing excerpt preview.
            </div>
          )}

          <div style={{ fontSize: 15, lineHeight: 1.9 }}>{renderBody(body, color)}</div>

          {/* Like + Save + Share */}
          <div className="post-share-row" style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Like button */}
              <button className="like-btn" onClick={handleLike}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: isLiked ? `${PRIMARY}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${isLiked ? PRIMARY+'40' : 'rgba(255,255,255,0.1)'}`, color: isLiked ? PRIMARY2 : 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'Space Mono',monospace", fontWeight: 600 }}>
                <span style={{ fontSize: 16 }}>{isLiked ? '❤️' : '🤍'}</span>
                <span>{likeCount > 0 ? likeCount : 'Like'}</span>
              </button>
              {/* Save button */}
              <button className="save-post-btn" onClick={handleToggleSave}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 999, background: isSaved ? `${ACCENT}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${isSaved ? ACCENT+'40' : 'rgba(255,255,255,0.1)'}`, color: isSaved ? PRIMARY2 : 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'Space Mono',monospace", fontWeight: 600 }}>
                <span style={{ fontSize: 15 }}>{isSaved ? '🔖' : '🏷️'}</span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', fontWeight: 700, transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${PRIMARY}18`; e.currentTarget.style.borderColor = `${PRIMARY}40`; e.currentTarget.style.color = PRIMARY2; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                𝕏
              </a>
              <a href={`https://linkedin.com/shareArticle?title=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', fontWeight: 700, transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${PRIMARY}18`; e.currentTarget.style.borderColor = `${PRIMARY}40`; e.currentTarget.style.color = PRIMARY2; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                in
              </a>
              <button onClick={handleCopyLink}
                style={{ height: 36, padding: '0 14px', borderRadius: 999, background: copied ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#8B5CF6' : 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: "'Space Mono',monospace", cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {copied ? '✓ Copied' : '🔗 Copy link'}
              </button>
            </div>
          </div>

          {/* ── Comments Section ── */}
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: -0.3 }}>
              💬 Comments ({comments.length})
            </h3>

            {/* Existing comments */}
            {comments.length > 0 && (
              <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {comments.map(c => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: PRIMARY2 }}>{c.name}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{c.date}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, margin: 0 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment form */}
            <form onSubmit={handleAddComment} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${PRIMARY}20`, borderRadius: 16, padding: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  className="comment-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: "'Sora',sans-serif", transition: 'all 0.2s' }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <textarea
                  placeholder="Share your thoughts…"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={3}
                  className="comment-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: "'Sora',sans-serif", resize: 'vertical', transition: 'all 0.2s' }}
                />
              </div>
              <button type="submit" disabled={!commentText.trim()}
                style={{ padding: '10px 24px', background: commentText.trim() ? `linear-gradient(135deg,${PRIMARY},${ACCENT})` : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, color: commentText.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: commentText.trim() ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: commentText.trim() ? `0 4px 14px ${PRIMARY}40` : 'none' }}>
                Post Comment →
              </button>
            </form>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ maxWidth: 760, margin: '64px auto 0', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: -0.3 }}>Related Articles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {related.map(r => {
                const rc = TAG_COLORS[r.category] || PRIMARY;
                return (
                  <div key={r._id} className="related-card" onClick={() => navigate(`/blog/${r._id}`)}
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${rc}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${rc}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg,${rc},${ACCENT},transparent)`, marginBottom: 14, borderRadius: 2, marginLeft: -20, marginRight: -20, marginTop: -20 }} />
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, border: `1px solid ${rc}30`, background: `${rc}10`, color: rc, fontSize: 9, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>{r.category}</span>
                    <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.4 }}>{r.title}</h4>
                    <span style={{ fontSize: 11, color: PRIMARY2, fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>Read →</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ maxWidth: 760, margin: '64px auto 0', position: 'relative', zIndex: 1 }}>
          <div style={{ background: `linear-gradient(135deg,${PRIMARY}10,${ACCENT}08,rgba(255,255,255,0.02))`, border: `1px solid ${PRIMARY}20`, borderRadius: 20, padding: '36px 32px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Need help with {post.category}?</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Our team at Axentralab is ready to help with a tailored solution.</p>
            <button onClick={() => navigate('/contact')}
              style={{ padding: '12px 28px', background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: 'pointer', boxShadow: `0 4px 18px ${PRIMARY}40`, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              Get in Touch →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}