import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { nav } from '../site.js';
import { useSite } from '../lib/useSite.js';

export default function Header() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`header${scrolled ? ' header--scrolled' : ''}${open ? ' header--open' : ''}${
        location.pathname === '/' ? ' header--over' : ''
      }`}
    >
      {site.announcement && !scrolled && (
        <p className="announce">
          <span className="wrap">{site.announcement}</span>
        </p>
      )}
      <div className="wrap header__bar">
        <Link to="/" className="header__logo" aria-label={`${site.name} — beranda`}>
          <Logo />
        </Link>

        <nav className="header__nav" aria-label="Navigasi utama">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="header__link">
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="header__dot"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link to="/kontak" className="btn btn--sm header__cta">
          Diskusikan proyek
        </Link>

        <button
          type="button"
          className="header__burger"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Tutup menu' : 'Buka menu'}</span>
          <span className="header__burger-line" />
          <span className="header__burger-line" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
          >
            <nav className="wrap mobile-menu__nav" aria-label="Navigasi seluler">
              {[...nav, { to: '/kontak', label: 'Kontak' }].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.15 + i * 0.05, duration: 0.5 } }}
                >
                  <NavLink to={item.to} className="mobile-menu__link">
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="wrap mobile-menu__foot">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
