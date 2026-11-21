import { Link } from 'react-router-dom';
import Seo, { organizationLd } from '../components/Seo.jsx';
import ServiceList from '../components/ServiceList.jsx';
import { Reveal, CountUp } from '../components/Motion.jsx';
import { StatusBadge } from './Products.jsx';
import { fmtDate } from '../components/ui.jsx';
import Photo from '../components/Photo.jsx';
import { photos } from '../site.js';
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
  const { services = [], projects = [], posts = [], openJobs = 0, products = [], stats = {} } = data || {};
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
        <Photo
          src={photos.hero.src}
          alt={photos.hero.alt}
          credit={photos.hero.credit}
          sizes="100vw"
          priority
          seed="hero"
          className="hero__photo"
        />
        <div className="wrap hero__inner">
          <h1 className="hero__title">
            {heroLines.map((line, i) => (
              <span key={i} className="hero__line" style={{ '--d': i }}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__lead">{site.heroLead || DEFAULT_LEAD}</p>
          <div className="row-actions hero__actions">
            <Link to="/kontak" className="btn btn--dawn btn--lg">
              Diskusikan proyek
            </Link>
            <Link to="/portofolio" className="btn btn--light btn--lg">
              Lihat studi kasus
            </Link>
          </div>
        </div>
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
          <ServiceList services={services} />
        </div>
      </section>

      <section className="stats-band" aria-label="Aruna dalam angka">
        <div className="wrap stats-band__grid">
          <div>
            <p className="stats-band__n">
              <CountUp value={stats.projects || 0} suffix="+" />
            </p>
            <p className="stats-band__l">studi kasus terpublikasi</p>
          </div>
          <div>
            <p className="stats-band__n">
              <CountUp value={stats.releases || 0} />
            </p>
            <p className="stats-band__l">rilis produk sejak 2024</p>
          </div>
          <div>
            <p className="stats-band__n">
              <CountUp value={stats.members || 0} />
            </p>
            <p className="stats-band__l">orang di tim inti</p>
          </div>
          <div>
            <p className="stats-band__n">
              <CountUp value={new Date().getFullYear() - Number(site.founded)} suffix="+" />
            </p>
            <p className="stats-band__l">tahun membangun produk</p>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section" aria-labelledby="h-produk">
          <div className="wrap">
            <div className="section__head">
              <div>
                <h2 id="h-produk" className="h2">
                  Produk kami
                </h2>
                <p className="section__lead">Perangkat lunak siap pakai yang lahir dari proyek klien.</p>
              </div>
              <Link to="/produk" className="link-quiet">
                Semua produk
              </Link>
            </div>
            <div className="prod-cards">
              {products.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.1}>
                  <Link to={`/produk/${p.slug}`} className="prod-card" style={{ '--accent': p.accent }}>
                    <div className="prod-card__media">
                      <Photo src={p.image} alt="" ratio={16 / 10} sizes="(min-width: 960px) 33vw, 100vw" seed={p.slug} accent={p.accent} />
                    </div>
                    <div className="prod-card__body">
                      <p className="prod-row__meta">
                        <StatusBadge status={p.status} />
                      </p>
                      <h3 className="prod-card__name">{p.name}</h3>
                      <p className="prod-card__tagline">{p.tagline}</p>
                      {p.latest && (
                        <p className="prod-card__latest">
                          <span className="prod-row__ver">v{p.latest.version}</span> {fmtDate(p.latest.date)}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="studio" aria-labelledby="h-studio">
        <Photo src={photos.studio.src} alt={photos.studio.alt} credit={photos.studio.credit} sizes="100vw" className="studio__photo" />
        <div className="wrap studio__text">
          <h2 id="h-studio" className="h2 h2--light">
            Satu tim dari ide sampai produk berjalan.
          </h2>
          <p>
            Product manager, desainer, dan engineer kami duduk di meja yang sama — begitu juga dengan tim Anda selama
            proyek berlangsung.
          </p>
          <Link to="/tim" className="btn btn--dawn">
            Kenali tim kami
          </Link>
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
