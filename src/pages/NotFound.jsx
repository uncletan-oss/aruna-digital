import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Halaman tidak ditemukan" noindex />
      <section className="wrap notfound">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 className="h2">Halaman ini belum terbit.</h1>
        <p className="lead">Tautan mungkin sudah usang atau alamatnya salah ketik. Coba salah satu halaman berikut.</p>
        <div className="row-actions">
          <Link className="btn" to="/">
            Ke beranda
          </Link>
          <Link className="btn btn--ghost" to="/portofolio">
            Lihat portofolio
          </Link>
          <Link className="btn btn--ghost" to="/kontak">
            Hubungi kami
          </Link>
        </div>
      </section>
    </>
  );
}
