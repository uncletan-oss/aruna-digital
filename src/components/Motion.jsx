import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ease = [0.22, 1, 0.36, 1];

/**
 * Muncul saat masuk viewport (sekali). Server merender konten terlihat penuh,
 * jadi tetap terbaca tanpa JavaScript dan oleh mesin pencari.
 */
export function Reveal({ children, delay = 0, y = 24, as = 'div', className, ...rest }) {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    // Hanya animasikan elemen yang awalnya di bawah layar.
    const r = ref.current?.getBoundingClientRect();
    if (r && r.top > window.innerHeight * 0.92) setArmed(true);
  }, []);
  const M = motion[as];
  return (
    <M
      ref={ref}
      className={className}
      initial={false}
      animate={armed && !reduce ? undefined : { opacity: 1, y: 0 }}
      whileInView={armed && !reduce ? { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay } } : undefined}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      style={armed && !reduce ? { opacity: 0, y } : undefined}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Angka yang menghitung naik saat terlihat. Server merender angka akhirnya. */
export function CountUp({ value, suffix = '', duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (!reduce && r && r.top > window.innerHeight) {
      setArmed(true);
      setShown(0);
    }
  }, [reduce]);

  useEffect(() => {
    if (!armed || !inView) return;
    const c = animate(0, value, { duration, ease, onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [armed, inView, value, duration]);

  return (
    <span ref={ref}>
      {shown.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
}
