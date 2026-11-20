import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

/**
 * Transisi antar-halaman yang tenang: halaman lama memudar ke atas,
 * halaman baru masuk dari bawah, dengan garis progres tipis di atas layar.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div className="page">
      <motion.div
        className="route-bar"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{
          scaleX: 1,
          opacity: 0,
          transition: { scaleX: { duration: 0.55, ease }, opacity: { delay: 0.5, duration: 0.3 } },
        }}
        exit={{ opacity: 0, transition: { duration: 0 } }}
      />
      <motion.main
        id="konten"
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.22, ease: 'easeIn' } }}
      >
        {children}
      </motion.main>
    </motion.div>
  );
}
