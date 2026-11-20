import { Link } from 'react-router-dom';
import Photo from './Photo.jsx';

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Beranda</Link>
        </li>
        {items.map((it, i) =>
          i === items.length - 1 ? (
            <li key={it.path} aria-current="page">
              {it.name}
            </li>
          ) : (
            <li key={it.path}>
              <Link to={it.path}>{it.name}</Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}

/** Kepala halaman dalam: judul besar rata kiri + paragraf pembuka. */
export function PageHead({ title, lead, crumbs, children }) {
  return (
    <header className="pagehead wrap">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <h1 className="pagehead__title">{title}</h1>
      {lead && <p className="pagehead__lead">{lead}</p>}
      {children}
    </header>
  );
}

export function Prose({ html }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ProjectTile({ p, large = false, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <article className={`tile${large ? ' tile--large' : ''}`}>
      <Link to={`/portofolio/${p.slug}`} className="tile__link">
        <div className="tile__media">
          <Photo
            src={p.image}
            alt={p.imageAlt || ''}
            ratio={large ? 21 / 9 : 3 / 2}
            sizes={large ? '(min-width: 1280px) 1250px, 100vw' : '(min-width: 760px) 50vw, 100vw'}
            seed={p.slug}
            accent={p.accent}
          />
        </div>
        <div className="tile__body">
          <p className="tile__client">
            {p.client}
            {p.industry && <span className="tile__industry">{p.industry}</span>}
          </p>
          <H className="tile__title">{p.title}</H>
          {large && <p className="tile__summary">{p.summary}</p>}
          {large && p.results?.[0] && (
            <p className="tile__stat">
              <strong>{p.results[0].value}</strong> {p.results[0].label}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function PostRow({ post }) {
  return (
    <article className="postrow">
      <Link to={`/wawasan/${post.slug}`} className="postrow__link">
        <time className="postrow__date" dateTime={new Date(post.publishedAt).toISOString()}>
          {fmtDate(post.publishedAt)}
        </time>
        <div>
          <h3 className="postrow__title">{post.title}</h3>
          <p className="postrow__excerpt">{post.excerpt}</p>
        </div>
        <p className="postrow__meta">{post.readingMinutes} menit baca</p>
      </Link>
    </article>
  );
}

export function CtaBand({ title = 'Mari bicarakan apa yang ingin Anda bangun.', text, to = '/kontak', label = 'Jadwalkan diskusi' }) {
  return (
    <section className="ctaband">
      <div className="wrap ctaband__inner">
        <h2 className="ctaband__title">{title}</h2>
        <div>
          {text && <p className="ctaband__text">{text}</p>}
          <Link to={to} className="btn btn--dawn btn--lg">
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
