import { motion } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1];

/**
 * Transisi antar-halaman: tirai indigo naik menutup halaman lama,
 * lalu tersibak ke atas memperlihatkan halaman baru.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div className="page">
      <motion.div
        className="curtain curtain--in"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.6, ease, delay: 0.05 } }}
        exit={{ scaleY: 0 }}
      />
      <motion.div
        className="curtain curtain--out"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.5, ease } }}
      />
      <motion.main
        id="konten"
        tabIndex={-1}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 } }}
        exit={{ opacity: 1, y: -24, transition: { duration: 0.5, ease } }}
      >
        {children}
      </motion.main>
    </motion.div>
  );
}
