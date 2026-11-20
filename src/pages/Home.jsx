import { Link } from 'react-router-dom';
import Seo, { organizationLd } from '../components/Seo.jsx';
import HeroArena from '../components/HeroArena.jsx';
import { ProjectTile, PostRow, CtaBand } from '../components/ui.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import { useSite } from '../lib/useSite.js';

const process = [
  { t: 'Discovery', d: 'Dua minggu memetakan masalah, pengguna, dan sistem yang sudah ada. Hasilnya arsitektur dan estimasi yang bisa Anda pegang.' },
  { t: 'Desain', d: 'Prototipe yang diuji ke pengguna sungguhan sebelum satu baris kode produksi ditulis.' },
  { t: 'Bangun', d: 'Sprint dua mingguan dengan demo di setiap akhir sprint. Anda melihat kemajuan, bukan laporan.' },
  { t: 'Rilis & rawat', d: 'Peluncuran bertahap, pemantauan 24/7, dan tim yang tetap ada setelah go-live.' },
];

const DEFAULT_TITLE = 'Kami membangun\nproduk digital yang\ndipakai setiap hari.';
const DEFAULT_LEAD =
  'Studio produk di Jakarta untuk perusahaan yang ingin bergerak cepat — aplikasi web, mobile, cloud, dan data, dirancang dan dirawat oleh satu tim.';

export default function Home({ data }) {
  const { siteUrl } = useSiteOpts();
  const site = useSite();
  const { services = [], projects = [], posts = [], openJobs = 0 } = data || {};
  const [lead, ...rest] = projects;
  // Judul hero dari CMS: setiap baris baru menjadi satu baris animasi.
  const heroLines = (site.heroTitle || DEFAULT_TITLE).split(/\n+/).filter(Boolean);

  return (
    <>
      <Seo
        description={site.description}
        jsonLd={[
          organizationLd(siteUrl, site),
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: siteUrl,
            name: site.name,
            inLanguage: 'id-ID',
            publisher: { '@id': `${siteUrl}/#organization` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: site.name,
            url: siteUrl,
            image: `${siteUrl}/og-default.png`,
            telephone: site.phone,
            priceRange: '$$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: site.address.street,
              addressLocality: site.address.locality,
              postalCode: site.address.postalCode,
              addressCountry: site.address.country,
            },
            geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
            openingHours: 'Mo-Fr 09:00-18:00',
            areaServed: 'ID',
          },
        ]}
      />

      <section className="hero">
        <div className="wrap hero__inner">
          <h1 className="hero__title">
            {heroLines.map((line, i) => (
              <span key={i} className="hero__line" style={{ '--d': i }}>
                {line}
              </span>
            ))}
          </h1>
          <div className="hero__aside">
            <p className="hero__lead">{site.heroLead || DEFAULT_LEAD}</p>
            <div className="row-actions">
              <Link to="/kontak" className="btn btn--lg">
                Diskusikan proyek
              </Link>
              <Link to="/portofolio" className="link-quiet">
                Lihat studi kasus
              </Link>
            </div>
          </div>
        </div>
        <HeroArena />
      </section>

      <section className="section" aria-labelledby="h-layanan">
        <div className="wrap split">
          <div className="split__head">
            <h2 id="h-layanan" className="h2">
              Yang kami kerjakan
            </h2>
            <p className="muted">Enam disiplin, satu tim. Anda tidak perlu mengoordinasikan beberapa vendor.</p>
            <Link to="/layanan" className="link-quiet">
              Semua layanan
            </Link>
          </div>
          <ul className="svc-list">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/layanan/${s.slug}`} className="svc-list__item">
                  <span className="svc-list__title">{s.title}</span>
                  <span className="svc-list__sum">{s.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {lead && (
        <section className="section section--tight" aria-labelledby="h-karya">
          <div className="wrap">
            <div className="section__head">
              <h2 id="h-karya" className="h2">
                Karya pilihan
              </h2>
              <Link to="/portofolio" className="link-quiet">
                Semua studi kasus
              </Link>
            </div>
            <div className="work-grid">
              <ProjectTile p={lead} large />
              {rest.map((p) => (
                <ProjectTile key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--ink" aria-labelledby="h-proses">
        <div className="wrap">
          <h2 id="h-proses" className="h2 h2--light">
            Cara kami bekerja
          </h2>
          <ol className="steps">
            {process.map((s, i) => (
              <li key={s.t} className="steps__item">
                <span className="steps__n">{i + 1}</span>
                <h3 className="steps__t">{s.t}</h3>
                <p className="steps__d">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section" aria-labelledby="h-wawasan">
          <div className="wrap">
            <div className="section__head">
              <h2 id="h-wawasan" className="h2">
                Wawasan terbaru
              </h2>
              <Link to="/wawasan" className="link-quiet">
                Semua artikel
              </Link>
            </div>
            <div className="postlist">
              {posts.map((p) => (
                <PostRow key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        text={
          openJobs > 0
            ? `Kami juga sedang membuka ${openJobs} posisi. Lihat halaman Karier jika Anda ingin bergabung.`
            : 'Balasan pertama dari kami dalam satu hari kerja.'
        }
      />
    </>
  );
}
