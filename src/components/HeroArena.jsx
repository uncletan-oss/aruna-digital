import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const RINGS = [90, 160, 235, 310, 390, 470, 560];

/**
 * Elemen khas beranda: arena bertingkat yang tergambar ring demi ring
 * (CSS, jalan tanpa JavaScript), lalu matahari terbit di atasnya.
 * Saat digulir, arena memipih dan matahari terus naik.
 */
export default function HeroArena() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const flatten = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const sunY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <div className="arena" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax meet" className="arena__svg">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--dawn)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--dawn)" stopOpacity="0" />
          </radialGradient>
          <clipPath id="aboveHorizon">
            <rect x="0" y="0" width="1200" height="400" />
          </clipPath>
        </defs>

        <motion.g style={reduce ? undefined : { y: sunY }} clipPath="url(#aboveHorizon)">
          <g className="arena__sun">
            <circle cx="600" cy="300" r="150" fill="url(#sunGlow)" />
            <circle cx="600" cy="300" r="64" fill="var(--dawn)" />
          </g>
        </motion.g>

        <motion.g style={reduce ? undefined : { scaleY: flatten, originY: 0.72, originX: 0.5 }}>
          {RINGS.map((rx, i) => (
            <ellipse
              key={rx}
              className="arena__ring"
              style={{ '--i': i }}
              cx="600"
              cy="400"
              rx={rx}
              ry={rx * 0.3}
              pathLength="1"
            />
          ))}
          {RINGS.slice(2).map((rx, i) => (
            <ellipse
              key={`seat-${rx}`}
              className="arena__seats"
              style={{ '--i': i + 2 }}
              cx="600"
              cy="400"
              rx={rx - 30}
              ry={(rx - 30) * 0.3}
            />
          ))}
          <ellipse className="arena__floor" cx="600" cy="400" rx="60" ry="18" />
        </motion.g>
      </svg>
    </div>
  );
}
