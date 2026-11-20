import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ArenaArt from '../components/ArenaArt.jsx';
import { Breadcrumbs, Prose, CtaBand } from '../components/ui.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site } from '../site.js';

export default function ProjectDetail({ data }) {
  const { siteUrl } = useSiteOpts();
  const { project: p, next } = data;
  const crumbs = [
    { name: 'Portofolio', path: '/portofolio' },
    { name: p.client, path: `/portofolio/${p.slug}` },
  ];
  return (
    <>
      <Seo
        title={p.seoTitle || `${p.title} — ${p.client}`}
        description={p.seoDescription || p.summary}
        type="article"
        breadcrumbs={crumbs}
        modified={p.updatedAt}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: p.title,
            about: p.summary,
            dateCreated: p.year ? String(p.year) : undefined,
            creator: { '@type': 'Organization', name: site.name, url: siteUrl },
            url: `${siteUrl}/portofolio/${p.slug}`,
            keywords: (p.services || []).join(', '),
          },
        ]}
      />

      <header className="case-hero" style={{ '--accent': p.accent }}>
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <p className="case-hero__client">{p.client}</p>
          <h1 className="case-hero__title">{p.title}</h1>
          <dl className="case-hero__meta">
            {p.industry && (
              <div>
                <dt>Industri</dt>
                <dd>{p.industry}</dd>
              </div>
            )}
            {p.year && (
              <div>
                <dt>Tahun</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            {p.services?.length > 0 && (
              <div>
                <dt>Layanan</dt>
                <dd>{p.services.join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="case-hero__art">
          <ArenaArt seed={p.slug} accent={p.accent} title={`Ilustrasi proyek ${p.client}`} />
        </div>
      </header>

      {p.results?.length > 0 && (
        <section className="wrap results" aria-label="Hasil">
          {p.results.map((r) => (
            <div key={r.label} className="results__item">
              <p className="results__value">{r.value}</p>
              <p className="results__label">{r.label}</p>
            </div>
          ))}
        </section>
      )}

      <div className="wrap case-body">
        <p className="lead case-body__summary">{p.summary}</p>
        {p.challenge && (
          <section className="case-body__block">
            <h2 className="h3">Tantangan</h2>
            <p>{p.challenge}</p>
          </section>
        )}
        {p.solution && (
          <section className="case-body__block">
            <h2 className="h3">Solusi</h2>
            <p>{p.solution}</p>
          </section>
        )}
        {p.bodyHtml && <Prose html={p.bodyHtml} />}
      </div>

      {next && (
        <Link to={`/portofolio/${next.slug}`} className="next-case" style={{ '--accent': next.accent }}>
          <span className="wrap next-case__inner">
            <span className="next-case__label">Studi kasus berikutnya</span>
            <span className="next-case__title">{next.title}</span>
            <span className="next-case__client">{next.client}</span>
          </span>
        </Link>
      )}
      <CtaBand />
    </>
  );
}
