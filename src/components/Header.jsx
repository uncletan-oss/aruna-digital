import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import { nav, flatNav } from '../site.js';
import { useSite } from '../lib/useSite.js';

function ActiveDot() {
  return <motion.span layoutId="nav-dot" className="header__dot" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />;
}

/** Menu turun "Perusahaan": terbuka saat hover/fokus/klik, tertutup dengan Escape. */
function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timer = useRef();
  const location = useLocation();
  const active = item.children.some((c) => location.pathname.startsWith(c.to));

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClick);
    };
  }, [open]);

  const enter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="dd" ref={ref} onPointerEnter={(e) => e.pointerType === 'mouse' && enter()} onPointerLeave={leave}>
      <button
        type="button"
        className={`header__link dd__btn${active ? ' active' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <span className={`dd__chev${open ? ' is-open' : ''}`} aria-hidden="true" />
        {active && <ActiveDot />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="dd__panel"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.children.map((c) => (
              <NavLink key={c.to} to={c.to} className="dd__item">
                <span className="dd__label">{c.label}</span>
                <span className="dd__text">{c.text}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          {nav.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <NavLink key={item.to} to={item.to} className="header__link">
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <ActiveDot />}
                  </>
                )}
              </NavLink>
            )
          )}
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
              {[...flatNav, { to: '/kontak', label: 'Kontak' }].map((item, i) => (
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
