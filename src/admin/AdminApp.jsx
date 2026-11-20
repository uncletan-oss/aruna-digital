import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './api.js';
import { schemas } from './schemas.js';
import { LogoMark } from '../components/Logo.jsx';
import { ContentList, ContentEditor } from './ContentPages.jsx';
import { Messages, Subscribers, Settings, Users, Account } from './OtherPages.jsx';
import './admin.css';

/* ---------- Toast ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

function ToastHost({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((text, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, text, tone }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="adm-toasts" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              className={`adm-toast adm-toast--${t.tone}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Auth ---------- */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      onLogin(await api('/login', { method: 'POST', body: { email, password } }));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="adm-login">
      <motion.form
        className="adm-login__card"
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <LogoMark size={44} />
        <h1>Masuk ke CMS</h1>
        <p className="adm-muted">Kelola konten situs Aruna Digital.</p>
        <label>
          Email
          <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Kata sandi
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && (
          <p className="adm-error" role="alert">
            {err}
          </p>
        )}
        <button className="adm-btn adm-btn--primary" disabled={busy}>
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>
        <a href="/" className="adm-link">
          Kembali ke situs
        </a>
      </motion.form>
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    api('/stats').then(setStats).catch(() => {});
    api('/messages?unread=1').then((m) => setRecent(m.slice(0, 5))).catch(() => {});
  }, []);
  const cards = [
    ['Pesan belum dibaca', stats?.unread, '/admin/pesan'],
    ['Layanan', stats?.services, '/admin/konten/services'],
    ['Studi kasus', stats?.projects, '/admin/konten/projects'],
    ['Artikel', stats?.posts, '/admin/konten/posts'],
    ['Lowongan', stats?.jobs, '/admin/konten/jobs'],
    ['Pelanggan newsletter', stats?.subscribers, '/admin/newsletter'],
  ];
  return (
    <>
      <header className="adm-head">
        <h1>Ringkasan</h1>
        <a className="adm-btn" href="/" target="_blank" rel="noreferrer">
          Lihat situs
        </a>
      </header>
      <div className="adm-stats">
        {cards.map(([label, n, to]) => (
          <Link key={label} to={to} className="adm-stat">
            <span className="adm-stat__n">{n ?? '—'}</span>
            <span className="adm-stat__l">{label}</span>
          </Link>
        ))}
      </div>
      <section className="adm-panel">
        <h2>Pesan terbaru yang belum dibaca</h2>
        {recent.length === 0 ? (
          <p className="adm-muted">Semua pesan sudah dibaca.</p>
        ) : (
          <ul className="adm-recent">
            {recent.map((m) => (
              <li key={m._id}>
                <Link to="/admin/pesan">
                  <strong>{m.name}</strong> — {m.topic || (m.kind === 'application' ? 'Lamaran' : 'Pesan')}
                  <span className="adm-muted"> {m.message.slice(0, 90)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="adm-panel">
        <h2>Pintasan</h2>
        <div className="adm-actions">
          <Link className="adm-btn adm-btn--primary" to="/admin/konten/posts/baru">
            Tulis artikel
          </Link>
          <Link className="adm-btn" to="/admin/konten/projects/baru">
            Tambah studi kasus
          </Link>
          <Link className="adm-btn" to="/admin/konten/jobs/baru">
            Buka lowongan
          </Link>
          <a className="adm-btn" href="/sitemap.xml" target="_blank" rel="noreferrer">
            Cek sitemap
          </a>
        </div>
      </section>
    </>
  );
}

/* ---------- Shell ---------- */
function Shell({ user, onLogout }) {
  const [navOpen, setNavOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const load = () => api('/stats').then((s) => setUnread(s.unread)).catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const link = (to, label, extra) => (
    <NavLink to={to} end={to === '/admin'} className="adm-nav__link" onClick={() => setNavOpen(false)}>
      {label}
      {extra}
    </NavLink>
  );

  return (
    <div className={`adm${navOpen ? ' adm--nav' : ''}`}>
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand">
          <LogoMark size={28} />
          <span>Aruna CMS</span>
        </Link>
        <nav className="adm-nav" aria-label="Menu CMS">
          {link('/admin', 'Ringkasan')}
          {link('/admin/pesan', 'Kotak masuk', unread > 0 && <span className="adm-badge">{unread}</span>)}
          <p className="adm-nav__group">Konten</p>
          {Object.entries(schemas).map(([key, s]) => link(`/admin/konten/${key}`, s.label))}
          <p className="adm-nav__group">Lainnya</p>
          {link('/admin/newsletter', 'Newsletter')}
          {user.role === 'owner' && link('/admin/pengaturan', 'Pengaturan situs')}
          {user.role === 'owner' && link('/admin/pengguna', 'Akun admin')}
          {link('/admin/akun', 'Akun saya')}
        </nav>
        <div className="adm-user">
          <span>{user.name || user.email}</span>
          <button type="button" className="adm-link" onClick={onLogout}>
            Keluar
          </button>
        </div>
      </aside>
      <button type="button" className="adm-burger" aria-expanded={navOpen} onClick={() => setNavOpen((v) => !v)}>
        {navOpen ? 'Tutup menu' : 'Menu'}
      </button>
      <main className="adm-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="pesan" element={<Messages onChange={setUnread} />} />
          <Route path="konten/:resource" element={<ContentList />} />
          <Route path="konten/:resource/:id" element={<ContentEditor />} />
          <Route path="newsletter" element={<Subscribers />} />
          <Route path="pengaturan" element={<Settings />} />
          <Route path="pengguna" element={<Users />} />
          <Route path="akun" element={<Account />} />
          <Route path="*" element={<p>Halaman CMS tidak ditemukan.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    api('/me').then(setUser).catch(() => setUser(null));
    const onUnauth = () => setUser(null);
    window.addEventListener('admin:unauthorized', onUnauth);
    return () => window.removeEventListener('admin:unauthorized', onUnauth);
  }, []);

  async function logout() {
    await api('/logout', { method: 'POST', body: {} }).catch(() => {});
    setUser(null);
    navigate('/admin');
  }

  if (user === undefined) return <div className="adm-boot">Memeriksa sesi…</div>;
  return (
    <ToastHost>
      <AuthCtx.Provider value={user}>
        {user ? <Shell user={user} onLogout={logout} /> : <Login onLogin={setUser} />}
      </AuthCtx.Provider>
    </ToastHost>
  );
}
