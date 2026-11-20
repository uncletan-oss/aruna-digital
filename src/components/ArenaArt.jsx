/**
 * Ilustrasi generatif untuk studi kasus — deterministik dari slug,
 * diwarnai dengan aksen proyek. Tidak butuh upload gambar.
 */
function hash(str = '') {
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
  const rnd = hash(seed);
  const cx = 160 + rnd() * 280;
  const cy = 210 + rnd() * 80;
  const tilt = 0.22 + rnd() * 0.2;
  const rings = 5 + Math.floor(rnd() * 4);
  const sunX = 80 + rnd() * 440;
  const sunY = 60 + rnd() * 70;
  const sunR = 22 + rnd() * 26;

  return (
    <svg
      className={`art ${className}`}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <rect width="600" height="400" fill={accent} />
      <rect width="600" height="400" fill="url(#artShade)" />
      <defs>
        <linearGradient id="artShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <circle cx={sunX} cy={sunY} r={sunR} fill="var(--dawn)" />
      {Array.from({ length: rings }, (_, i) => {
        const rx = 40 + i * (340 / rings) * 1.25;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy + i * 6}
            rx={rx}
            ry={rx * tilt}
            fill="none"
            stroke="#fff"
            strokeOpacity={0.85 - i * (0.6 / rings)}
            strokeWidth={i === 0 ? 2.5 : 1.5}
            strokeDasharray={i % 2 ? '2 7' : undefined}
          />
        );
      })}
    </svg>
  );
}
