import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { PageHead, Prose, ProjectTile, CtaBand } from '../components/ui.jsx';
import { imageUrl } from '../components/Photo.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site, photos } from '../site.js';

export default function ServiceDetail({ data }) {
  const { siteUrl } = useSiteOpts();
  const { service: s, projects = [], others = [] } = data;
  const crumbs = [
    { name: 'Layanan', path: '/layanan' },
    { name: s.title, path: `/layanan/${s.slug}` },
  ];
  return (
    <>
      <Seo
        title={s.seoTitle || s.title}
        description={s.seoDescription || s.summary}
        breadcrumbs={crumbs}
        modified={s.updatedAt}
        image={s.image ? imageUrl(s.image, 1200, 630) : undefined}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.title,
            description: s.summary,
            serviceType: s.title,
            areaServed: { '@type': 'Country', name: 'Indonesia' },
            provider: { '@type': 'Organization', name: site.name, url: siteUrl },
            url: `${siteUrl}/layanan/${s.slug}`,
          },
        ]}
      />
      <PageHead
        title={s.title}
        lead={s.summary}
        crumbs={crumbs}
        image={{ src: s.image || photos.services.src, alt: s.imageAlt, credit: s.image ? s.imageCredit : photos.services.credit }}
      />

      <div className="wrap detail">
        <div className="detail__main">
          <Prose html={s.bodyHtml} />
        </div>
        <aside className="detail__side">
          <h2 className="side__h">Yang Anda terima</h2>
          <ul className="checklist">
            {(s.deliverables || []).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <Link to="/kontak" className="btn">
            Tanyakan layanan ini
          </Link>
        </aside>
      </div>

      {projects.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <h2 className="h2">Studi kasus terkait</h2>
            <div className="work-grid work-grid--three">
              {projects.map((p) => (
                <ProjectTile key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="wrap related-nav" aria-label="Layanan lain">
        <h2 className="side__h">Layanan lain</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link to={`/layanan/${o.slug}`}>{o.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <CtaBand />
    </>
  );
}
