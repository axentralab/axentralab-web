/**
 * Skeleton — shimmer placeholder for loading states.
 *
 * Usage:
 *   <Skeleton width="100%" height={20} />
 *   <Skeleton variant="circle" size={40} />
 *   <Skeleton variant="card" />        ← blog card shape
 *   <Skeleton variant="stat" />        ← stat card shape
 *   <Skeleton variant="order-row" />   ← order list row shape
 */

const BASE = {
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
};

const SHIMMER = {
  content: '""',
};

export default function Skeleton({ variant, width, height, size, style = {} }) {
  const shimmerStyle = {
    ...BASE,
    width: width ?? '100%',
    height: height ?? 16,
    ...style,
  };

  const inner = (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
      backgroundSize: '400px 100%',
      animation: 'skshimmer 1.4s ease infinite',
    }} />
  );

  if (variant === 'circle') {
    return (
      <div style={{ ...BASE, width: size ?? 40, height: size ?? 40, borderRadius: '50%', flexShrink: 0 }}>
        {inner}
      </div>
    );
  }

  if (variant === 'card') {
    // Blog card shape
    return (
      <div style={{ ...BASE, padding: 0, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ padding: 24 }}>
          <Skeleton height={20} width="40%" style={{ marginBottom: 16 }} />
          <Skeleton height={18} width="90%" style={{ marginBottom: 8 }} />
          <Skeleton height={18} width="70%" style={{ marginBottom: 16 }} />
          <Skeleton height={13} width="55%" style={{ marginBottom: 8 }} />
          <Skeleton height={13} width="45%" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <Skeleton height={12} width="30%" />
            <Skeleton height={12} width="15%" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div style={{ ...BASE, padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
        <Skeleton variant="circle" size={32} style={{ marginBottom: 16 }} />
        <Skeleton height={30} width="50%" style={{ marginBottom: 8 }} />
        <Skeleton height={13} width="70%" />
      </div>
    );
  }

  if (variant === 'order-row') {
    return (
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Skeleton height={13} width="30%" style={{ marginBottom: 8 }} />
          <Skeleton height={15} width="60%" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="25%" />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Skeleton height={18} width={60} style={{ marginBottom: 8 }} />
          <Skeleton height={22} width={70} style={{ borderRadius: 999 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={shimmerStyle}>
      {inner}
      <style>{`
        @keyframes skshimmer {
          from { background-position: -400px 0; }
          to   { background-position: 400px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes skshimmer { from { opacity: 0.5; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}

/** Convenience: render N skeleton rows of a given variant */
export function SkeletonList({ count = 3, variant = 'order-row', ...props }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} {...props} />
      ))}
    </>
  );
}