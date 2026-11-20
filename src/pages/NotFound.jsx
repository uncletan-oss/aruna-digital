import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Photo from '../components/Photo.jsx';
import { photos } from '../site.js';

export default function NotFound() {
  return (
    <>
      <Seo title="Halaman tidak ditemukan" noindex />
      <section className="notfound">
        <Photo src={photos.notFound.src} alt="" credit={photos.notFound.credit} sizes="100vw" seed="404" className="notfound__photo" />
        <div className="wrap notfound__inner">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 className="h2">Halaman ini belum terbit.</h1>
        <p className="lead">Tautan mungkin sudah usang atau alamatnya salah ketik. Coba salah satu halaman berikut.</p>
        <div className="row-actions">
          <Link className="btn btn--dawn" to="/">
            Ke beranda
          </Link>
          <Link className="btn btn--light" to="/portofolio">
            Lihat portofolio
          </Link>
          <Link className="btn btn--light" to="/kontak">
            Hubungi kami
          </Link>
        </div>
        </div>
      </section>
    </>
  );
}
