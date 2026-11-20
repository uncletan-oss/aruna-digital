import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { PageHead, CtaBand } from '../components/ui.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { site } from '../site.js';

export default function Services({ data = [] }) {
  const { siteUrl } = useSiteOpts();
  return (
    <>
      <Seo
        title="Layanan"
        description="Pengembangan aplikasi web dan mobile, cloud & DevOps, data & AI, desain UI/UX, serta keamanan dan kepatuhan TI."
        breadcrumbs={[{ name: 'Layanan', path: '/layanan' }]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: data.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${siteUrl}/layanan/${s.slug}`,
              name: s.title,
            })),
          },
        ]}
      />
      <PageHead
        title="Layanan"
        lead={`Dari ide sampai produk yang berjalan di produksi. Pilih satu disiplin, atau minta ${site.name} menangani semuanya.`}
        crumbs={[{ name: 'Layanan', path: '/layanan' }]}
      />
      <section className="wrap svc-index">
        {data.map((s) => (
          <article key={s.slug} className="svc-index__item">
            <h2 className="svc-index__title">
              <Link to={`/layanan/${s.slug}`}>{s.title}</Link>
            </h2>
            <p className="svc-index__sum">{s.summary}</p>
            <ul className="taglist" aria-label={`Hasil kerja ${s.title}`}>
              {(s.deliverables || []).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <CtaBand title="Belum yakin layanan mana yang Anda butuhkan?" text="Ceritakan masalahnya. Kami bantu memetakan langkah pertama." />
    </>
  );
}
