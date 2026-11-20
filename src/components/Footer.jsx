import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LogoMark } from './Logo.jsx';
import { nav } from '../site.js';
import { useSite } from '../lib/useSite.js';
import { postJSON } from '../lib/data.jsx';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', msg: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', msg: '' });
    try {
      await postJSON('/api/subscribe', { email });
      setState({ status: 'done', msg: 'Terdaftar. Artikel berikutnya akan kami kirim ke email Anda.' });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', msg: err.message });
    }
  }

  return (
    <form className="newsletter" onSubmit={submit} noValidate>
      <label htmlFor="nl-email" className="newsletter__label">
        Terima artikel Wawasan terbaru, sebulan sekali.
      </label>
      <div className="newsletter__row">
        <input
          id="nl-email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="nl-msg"
        />
        <button className="btn btn--dawn" type="submit" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Mendaftarkan…' : 'Daftar'}
        </button>
      </div>
      <p id="nl-msg" className={`newsletter__msg newsletter__msg--${state.status}`} aria-live="polite">
        {state.msg}
      </p>
    </form>
  );
}

export default function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__lead">
          <p className="footer__headline">Punya produk yang perlu dibangun atau dibenahi?</p>
          <Link to="/kontak" className="footer__mail">
            Ceritakan ke kami
          </Link>
        </div>
        <Newsletter />
      </div>

      <div className="wrap footer__grid">
        <div>
          <LogoMark size={40} className="footer__mark" />
          <p className="footer__legal">{site.legalName}</p>
          <address className="footer__addr">
            {site.address.street}
            <br />
            {site.address.locality}, {site.address.region} {site.address.postalCode}
          </address>
        </div>
        <nav aria-label="Navigasi footer">
          <p className="footer__h">Jelajahi</p>
          <ul>
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/kontak">Kontak</Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="footer__h">Hubungi</p>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
            </li>
            <li>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li className="footer__muted">{site.hours}</li>
          </ul>
        </div>
        <div>
          <p className="footer__h">Ikuti</p>
          <ul>
            <li>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="/rss.xml">RSS Wawasan</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__base">
        <p>
          © {year} {site.legalName}
        </p>
        <p>
          <Link to="/kebijakan-privasi">Kebijakan privasi</Link>
          <a href="/sitemap.xml">Peta situs</a>
        </p>
      </div>
    </footer>
  );
}
