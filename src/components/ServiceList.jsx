import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { imageUrl } from './Photo.jsx';

/**
 * Daftar layanan beranda. Di perangkat dengan mouse, foto layanan
 * mengikuti kursor saat baris disorot (gerak sebagai respons aksi pengguna).
 */
export default function ServiceList({ services }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  const current = services.find((s) => s.slug === active);

  return (
    <div className="svc-wrap" ref={ref} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <ul className="svc-list">
        {services.map((s) => (
          <li key={s.slug} onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(s.slug)}>
            <Link to={`/layanan/${s.slug}`} className="svc-list__item">
              <span className="svc-list__title">{s.title}</span>
              <span className="svc-list__sum">{s.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      <motion.div className="svc-preview" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {current?.image && (
            <motion.img
              key={current.slug}
              src={imageUrl(current.image, 520, 360)}
              alt=""
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
