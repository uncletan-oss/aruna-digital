import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import Photo from '../components/Photo.jsx';
import { PageHead, CtaBand, fmtDate } from '../components/ui.jsx';
import { Reveal } from '../components/Motion.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { photos } from '../site.js';

export const STATUS = {
  GA: { label: 'Tersedia', tone: 'ga' },
  BETA: { label: 'Beta', tone: 'beta' },
  SEGERA: { label: 'Segera hadir', tone: 'soon' },
};

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.GA;
  return <span className={`badge badge--${s.tone}`}>{s.label}</span>;
}

function ProductRow({ p, index }) {
  const reduce = useReducedMotion();
  const flip = index % 2 === 1;
  return (
    <article className={`prod-row${flip ? ' prod-row--flip' : ''}`} style={{ '--accent': p.accent }}>
      <Link to={`/produk/${p.slug}`} className="prod-row__media" tabIndex={-1} aria-hidden="true">
        <motion.div
          className="prod-row__reveal"
          initial={reduce ? false : { clipPath: flip ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <Photo src={p.image} alt="" ratio={4 / 3} sizes="(min-width: 960px) 45vw, 100vw" seed={p.slug} accent={p.accent} />
        </motion.div>
      </Link>
      <Reveal className="prod-row__body" delay={0.15}>
        <p className="prod-row__meta">
          <StatusBadge status={p.status} />
          {p.category && <span>{p.category}</span>}
        </p>
        <h2 className="prod-row__name">
          <Link to={`/produk/${p.slug}`}>{p.name}</Link>
        </h2>
        <p className="prod-row__tagline">{p.tagline}</p>
        <p className="prod-row__summary">{p.summary}</p>
        {p.latest && (
          <p className="prod-row__latest">
            <span className="prod-row__ver">v{p.latest.version}</span>
            <span>
              {p.latest.title} · {fmtDate(p.latest.date)}
            </span>
          </p>
        )}
        <Link to={`/produk/${p.slug}`} className="btn btn--ghost">
          Pelajari {p.name}
        </Link>
      </Reveal>
    </article>
  );
}

export default function Products({ data = [] }) {
  const { siteUrl } = useSiteOpts();
  return (
    <>
      <Seo
        title="Produk"
        description="Produk perangkat lunak buatan Aruna Digital: Aruna GRC, Aruna Fleet, Aruna Kas, dan Aruna Insight — beserta catatan rilis terbarunya."
        breadcrumbs={[{ name: 'Produk', path: '/produk' }]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: data.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${siteUrl}/produk/${p.slug}`,
              name: p.name,
            })),
          },
        ]}
      />
      <PageHead
        title="Produk yang kami bangun dan rawat sendiri"
        lead="Lahir dari masalah yang berulang di proyek klien, lalu kami jadikan produk agar bisa dipakai lebih banyak perusahaan."
        crumbs={[{ name: 'Produk', path: '/produk' }]}
        image={photos.products}
      />
      <section className="wrap prod-list">
        {data.map((p, i) => (
          <ProductRow key={p.slug} p={p} index={i} />
        ))}
      </section>
      <CtaBand title="Butuh produk ini disesuaikan dengan proses Anda?" text="Semua produk Aruna bisa dikonfigurasi atau dikembangkan lebih lanjut untuk kebutuhan perusahaan Anda." />
    </>
  );
}
