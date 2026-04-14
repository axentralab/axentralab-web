import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import { TAG_COLORS } from '../constants/statusColors';
// FIX: shared utility — no longer duplicated here and in BlogPostPage
import { readingTime } from '../utils/readingTime';

const CATS = ['All', 'Cybersecurity', 'AI Automation', 'Web Dev', 'SaaS Dev', 'DevOps', 'General'];
const PER_PAGE = 9;

export default function BlogPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const navigate              = useNavigate();

  // FIX: AbortController prevents setState on unmounted component
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    api.get('/blog', { signal: controller.signal })
      .then(r => {
        if (r.data.data?.length) setPosts(r.data.data);
        else setError(true);
      })
      .catch(err => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = useMemo(() => {
    let list = posts;
    if (filter !== 'All') list = list.filter(p => p.category === filter);
    if (search.trim())    list = list.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [posts, filter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => {
    const c = { All: posts.length };
    CATS.slice(1).forEach(cat => { c[cat] = posts.filter(p => p.category === cat).length; });
    return c;
  }, [posts]);

  return (
    <div style={{ padding: '100px 5% 80px', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, border: '1px solid #06B6D440', background: '#06B6D412', color: '#06B6D4', fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Insights</span>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(28px,5vw,58px)', fontWeight: 900, color: '#fff', marginTop: 16, letterSpacing: -1.5 }}>Tech Blog</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 420, margin: '12px auto 0' }}>Expert articles on cybersecurity, AI and modern engineering.</p>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 560, margin: '0 auto 32px', position: 'relative' }}>
        <input type="text" placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '13px 20px 13px 48px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: "'Sora',sans-serif" }} />
        <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.35 }}>🔍</span>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
        {CATS.map(cat => {
          const active = filter === cat;
          const color  = TAG_COLORS[cat] || '#06B6D4';
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: "'Space Mono',monospace", cursor: 'pointer', transition: 'all 0.15s', background: active ? `${color}18` : 'rgba(255,255,255,0.04)', border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.08)', color: active ? color : 'rgba(255,255,255,0.45)' }}>
              {cat} ({counts[cat] ?? 0})
            </button>
          );
        })}
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 10 }}>Could not load posts</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Check your connection or try again shortly.</p>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ padding: '10px 24px' }}>Retry</button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {(search || filter !== 'All') && (
            <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace" }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            </div>
          )}

          {paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>No articles match your search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
              {paginated.map(p => {
                const color   = TAG_COLORS[p.category] || '#06B6D4';
                const minutes = readingTime(p.excerpt);
                return (
                  <div key={p._id} className="card"
                    style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s' }}
                    onClick={() => navigate(`/blog/${p._id}`)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}35`; e.currentTarget.style.boxShadow = `0 12px 32px ${color}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ height: 4, background: `linear-gradient(90deg,${color},transparent)` }} />
                    <div style={{ padding: 24 }}>
                      <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, border: `1px solid ${color}30`, background: `${color}10`, color, fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{p.category}</span>
                      <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', margin: '12px 0 10px', lineHeight: 1.4, letterSpacing: -0.2 }}>{p.title}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 16 }}>{p.excerpt}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                          {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                          {minutes} min read
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', cursor: page === 1 ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…'); acc.push(n); return acc; }, [])
                .map((n, i) => n === '…'
                  ? <span key={`e${i}`} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>…</span>
                  : <button key={n} onClick={() => setPage(n)} style={{ width: 38, height: 38, borderRadius: 10, background: page === n ? '#06B6D4' : 'rgba(255,255,255,0.04)', border: page === n ? 'none' : '1px solid rgba(255,255,255,0.09)', color: page === n ? '#000' : 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{n}</button>
                )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: page === totalPages ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', cursor: page === totalPages ? 'default' : 'pointer', fontSize: 13, fontWeight: 600 }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}