import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { PageHead } from '../components/ui.jsx';
import { Empty } from '../components/States.jsx';
import { useSite } from '../lib/useSite.js';
import Photo from '../components/Photo.jsx';
import { photos } from '../site.js';

export const TYPE_LABEL = { FULL_TIME: 'Penuh waktu', PART_TIME: 'Paruh waktu', CONTRACTOR: 'Kontrak', INTERN: 'Magang' };

const perks = [
  'Kerja hibrida: dua hari di kantor Sudirman, sisanya dari mana saja',
  'Anggaran belajar Rp10 juta per tahun untuk kursus, buku, dan konferensi',
  'Asuransi kesehatan untuk Anda dan keluarga inti',
  'Laptop pilihan Anda dan tunjangan peralatan kerja',
];

export default function Careers({ data = [] }) {
  const site = useSite();
  return (
    <>
      <Seo
        title="Karier"
        description="Lowongan kerja di Aruna Digital, Jakarta: engineering, desain, dan produk. Kerja hibrida, anggaran belajar, dan proyek yang berdampak."
        breadcrumbs={[{ name: 'Karier', path: '/karier' }]}
      />
      <PageHead
        title="Karier"
        lead="Kami mencari orang yang senang merilis, peduli pada detail, dan nyaman bertanya ‘kenapa’."
        crumbs={[{ name: 'Karier', path: '/karier' }]}
      />

      <div className="wrap wide-photo">
        <Photo src={photos.careers.src} alt={photos.careers.alt} credit={photos.careers.credit} ratio={21 / 9} priority />
      </div>

      <section className="wrap split">
        <div className="split__head">
          <h2 className="h3">Yang kami tawarkan</h2>
          <ul className="checklist">
            {perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="h3">Posisi terbuka</h2>
          {data.length === 0 ? (
            <Empty title="Belum ada posisi terbuka saat ini.">
              Kirim CV Anda ke <a href={`mailto:${site.careersEmail}`}>{site.careersEmail}</a>; kami akan menghubungi saat ada
              posisi yang cocok.
            </Empty>
          ) : (
            <ul className="jobs">
              {data.map((j) => (
                <li key={j.slug}>
                  <Link to={`/karier/${j.slug}`} className="jobs__item">
                    <span className="jobs__title">{j.title}</span>
                    <span className="jobs__meta">
                      {[j.department, j.location, TYPE_LABEL[j.employmentType], j.remote ? 'Bisa remote' : null]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <div className="section--tight" />
    </>
  );
}
