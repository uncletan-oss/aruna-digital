import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { PageHead, PostRow } from '../components/ui.jsx';
import { Empty } from '../components/States.jsx';
import { photos } from '../site.js';

export default function Posts({ data }) {
  const { items = [], page = 1, pages = 1, tags = [] } = data || {};
  const [params] = useSearchParams();
  const tag = params.get('tag') || '';
  const href = (p, t = tag) => {
    const q = new URLSearchParams();
    if (t) q.set('tag', t);
    if (p > 1) q.set('page', String(p));
    const s = q.toString();
    return `/wawasan${s ? `?${s}` : ''}`;
  };

  return (
    <>
      <Seo
        title={tag ? `Wawasan: ${tag}` : 'Wawasan'}
        description="Artikel praktis tentang pengembangan produk, cloud, data & AI, desain, dan keamanan dari tim Aruna Digital."
        noindex={!!tag || page > 1}
        breadcrumbs={[{ name: 'Wawasan', path: '/wawasan' }]}
      />
      <PageHead
        title="Wawasan"
        lead="Catatan dari proyek nyata: apa yang berhasil, apa yang tidak, dan apa yang akan kami lakukan berbeda."
        crumbs={[{ name: 'Wawasan', path: '/wawasan' }]}
        image={page === 1 && !tag ? photos.insights : undefined}
      >
        {tags.length > 0 && (
          <nav className="filters" aria-label="Topik">
            <Link to={href(1, '')} className={`filters__btn${!tag ? ' is-active' : ''}`} aria-current={!tag ? 'page' : undefined}>
              <span className="filters__label">Semua topik</span>
            </Link>
            {tags.map((t) => (
              <Link
                key={t}
                to={href(1, t)}
                className={`filters__btn${tag === t ? ' is-active' : ''}`}
                aria-current={tag === t ? 'page' : undefined}
                preventScrollReset
              >
                <span className="filters__label">{t}</span>
              </Link>
            ))}
          </nav>
        )}
      </PageHead>

      <section className="wrap">
        {items.length === 0 ? (
          <Empty title="Belum ada artikel untuk topik ini.">Pilih topik lain di atas.</Empty>
        ) : (
          <div className="postlist">
            {items.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="pager" aria-label="Halaman artikel">
            {page > 1 ? <Link to={href(page - 1)}>Artikel lebih baru</Link> : <span />}
            <span className="pager__n">
              Halaman {page} dari {pages}
            </span>
            {page < pages ? <Link to={href(page + 1)}>Artikel lebih lama</Link> : <span />}
          </nav>
        )}
      </section>
      <div className="section--tight" />
    </>
  );
}
