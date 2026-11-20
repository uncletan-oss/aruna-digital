import { Link } from 'react-router-dom';

export function PageLoading() {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="state__bar" aria-hidden="true" />
      <span className="sr-only">Memuat halaman…</span>
    </div>
  );
}

export function PageError() {
  return (
    <div className="wrap state state--error">
      <h1 className="h2">Halaman ini belum bisa dimuat</h1>
      <p className="lead">Koneksi ke server terputus. Muat ulang halaman, atau kembali ke beranda.</p>
      <div className="row-actions">
        <button className="btn" type="button" onClick={() => window.location.reload()}>
          Muat ulang
        </button>
        <Link className="btn btn--ghost" to="/">
          Ke beranda
        </Link>
      </div>
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {children && <p>{children}</p>}
    </div>
  );
}
