/**
 * Grafis pengganti bila foto tidak tersedia: gradasi warna aksen dengan
 * busur cakrawala tipis dan matahari terbit — deterministik dari `seed`.
 */
function rng(str = '') {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

export default function ArenaArt({ seed, accent = '#2E4BD8', className = '', title }) {
  const r = rng(seed);
  const id = `g${Math.floor(r() * 1e6)}`;
  const cx = 360 + r() * 180;
  const sunR = 34 + r() * 18;
  return (
    <svg
      className={`art ${className}`}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor="#141A46" />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F2A541" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F2A541" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${id}b)`} />
      <circle cx={cx} cy="300" r={sunR * 3.2} fill={`url(#${id}s)`} />
      <circle cx={cx} cy="300" r={sunR} fill="#F2A541" />
      <rect y="300" width="600" height="100" fill="#141A46" fillOpacity="0.35" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={cx}
          cy="300"
          rx={90 + i * 90}
          ry={(90 + i * 90) * 0.18}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.32 - i * 0.05}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
