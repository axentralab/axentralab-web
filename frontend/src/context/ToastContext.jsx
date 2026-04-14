import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
const COLORS = {
  success: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  text: '#22C55E' },
  error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  text: '#EF4444' },
  info:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', text: '#3B82F6' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#F59E0B' },
};

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: 'rgba(10,13,26,0.95)',
        border: `1px solid ${c.border}`,
        borderLeft: `3px solid ${c.text}`,
        borderRadius: 12, padding: '12px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: 340, width: '100%',
        animation: 'toastIn 0.3s ease both',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{ICONS[toast.type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }}
      >×</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback((message, type = 'info', options = {}) => {
    const id = ++idCounter;
    const toast = { id, message, type, title: options.title, duration: options.duration ?? 4000 };
    setToasts(t => [...t.slice(-4), toast]); // max 5 toasts
    if (toast.duration > 0) {
      timers.current[id] = setTimeout(() => remove(id), toast.duration);
    }
    return id;
  }, [remove]);

  // Convenience helpers
  const toast = {
    success: (msg, opts) => show(msg, 'success', opts),
    error:   (msg, opts) => show(msg, 'error',   opts),
    info:    (msg, opts) => show(msg, 'info',     opts),
    warning: (msg, opts) => show(msg, 'warning',  opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes toastIn { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>
      {/* Toast container — fixed bottom-right */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}