import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import Seo from '../components/Seo.jsx';
import Photo, { imageUrl } from '../components/Photo.jsx';
import { Breadcrumbs, Prose, CtaBand, fmtDate } from '../components/ui.jsx';
import { Reveal } from '../components/Motion.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site } from '../site.js';
import { StatusBadge } from './Products.jsx';

/** Timeline rilis: garis terisi mengikuti gulir, setiap rilis muncul saat terlihat. */
function ReleaseTimeline({ releases, accent }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <ol className="timeline-rel" ref={ref} style={{ '--accent': accent }}>
      <span className="timeline-rel__track" aria-hidden="true">
        <motion.span className="timeline-rel__fill" style={{ scaleY: reduce ? 1 : fill }} />
      </span>
      {releases.map((r, i) => (
        <Reveal as="li" key={`${r.version}-${i}`} className="timeline-rel__item" y={32}>
          <span className="timeline-rel__dot" aria-hidden="true" />
          <div className="timeline-rel__head">
            <span className="timeline-rel__ver">{/^\d/.test(r.version) ? `v${r.version}` : r.version}</span>
            <time dateTime={new Date(r.date).toISOString()}>{fmtDate(r.date)}</time>
            {i === 0 && <span className="badge badge--new">Terbaru</span>}
          </div>
          <h3 className="timeline-rel__title">{r.title}</h3>
          {r.notes?.length > 0 && (
            <ul className="timeline-rel__notes">
              {r.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

export default function ProductDetail({ data }) {
  const { siteUrl } = useSiteOpts();
  const { product: p, others = [] } = data;
  const crumbs = [
    { name: 'Produk', path: '/produk' },
    { name: p.name, path: `/produk/${p.slug}` },
  ];
  const latest = p.releases?.[0];
  return (
    <>
      <Seo
        title={p.seoTitle || `${p.name} — ${p.tagline}`}
        description={p.seoDescription || p.summary}
        image={p.image ? imageUrl(p.image, 1200, 630) : undefined}
        breadcrumbs={crumbs}
        modified={p.updatedAt}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: p.name,
            description: p.summary,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, Android, iOS',
            ...(latest ? { softwareVersion: latest.version, datePublished: new Date(latest.date).toISOString() } : {}),
            publisher: { '@type': 'Organization', name: site.name, url: siteUrl },
            url: `${siteUrl}/produk/${p.slug}`,
            image: p.image ? imageUrl(p.image, 1200, 630) : undefined,
          },
        ]}
      />

      <header className="wrap prod-hero" style={{ '--accent': p.accent }}>
        <Breadcrumbs items={crumbs} />
        <div className="prod-hero__grid">
          <div className="prod-hero__text">
            <p className="prod-row__meta">
              <StatusBadge status={p.status} />
              {p.category && <span>{p.category}</span>}
            </p>
            <h1 className="prod-hero__name">{p.name}</h1>
            <p className="prod-hero__tagline">{p.tagline}</p>
            <p className="lead">{p.summary}</p>
            <div className="row-actions">
              <Link to="/kontak" className="btn btn--lg">
                {p.status === 'SEGERA' ? 'Daftar program pratinjau' : 'Minta demo'}
              </Link>
              {p.releases?.length > 0 && (
                <a href="#rilis" className="link-quiet">
                  Lihat catatan rilis
                </a>
              )}
            </div>
          </div>
          <div className="prod-hero__media">
            <Photo src={p.image} alt={p.imageAlt || ''} credit={p.imageCredit} ratio={4 / 5} sizes="(min-width: 960px) 40vw, 100vw" seed={p.slug} accent={p.accent} priority />
          </div>
        </div>
      </header>

      {p.features?.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <h2 className="h2">Fitur utama</h2>
            <ul className="feature-grid">
              {p.features.map((f, i) => (
                <Reveal as="li" key={f} className="feature-grid__item" delay={i * 0.06}>
                  <span className="feature-grid__mark" aria-hidden="true" />
                  {f}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {p.bodyHtml && (
        <section className="wrap prod-body">
          <Prose html={p.bodyHtml} />
        </section>
      )}

      {p.releases?.length > 0 && (
        <section className="section section--paper" id="rilis" aria-labelledby="h-rilis">
          <div className="wrap split">
            <div className="split__head">
              <h2 id="h-rilis" className="h2">
                Catatan rilis
              </h2>
              <p className="muted">
                {p.releases.length} rilis sejak {fmtDate(p.releases[p.releases.length - 1].date)}.
              </p>
            </div>
            <ReleaseTimeline releases={p.releases} accent={p.accent} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <h2 className="h2">Produk lainnya</h2>
            <div className="mini-grid">
              {others.map((o) => (
                <Link key={o.slug} to={`/produk/${o.slug}`} className="mini-card" style={{ '--accent': o.accent }}>
                  <Photo src={o.image} alt="" ratio={16 / 10} sizes="(min-width: 760px) 33vw, 100vw" seed={o.slug} accent={o.accent} />
                  <span className="mini-card__name">{o.name}</span>
                  <span className="mini-card__text">{o.tagline}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
