import Seo from '../components/Seo.jsx';
import { PageHead, CtaBand } from '../components/ui.jsx';
import { site, photos } from '../site.js';
import Photo from '../components/Photo.jsx';

const principles = [
  {
    t: 'Tim kecil, tanggung jawab penuh',
    d: 'Setiap proyek dipegang tim lintas fungsi yang sama dari discovery sampai setelah rilis. Tidak ada serah terima ke tim lain di tengah jalan.',
  },
  {
    t: 'Tunjukkan, jangan laporkan',
    d: 'Demo setiap dua minggu dengan perangkat lunak yang benar-benar berjalan. Anda bisa mengubah arah sebelum terlambat.',
  },
  {
    t: 'Aman sejak baris pertama',
    d: 'Banyak klien kami diatur ketat. Jejak audit, kontrol akses, dan pengujian keamanan masuk ke rencana sejak awal.',
  },
  {
    t: 'Kode milik Anda',
    d: 'Repositori, infrastruktur, dan dokumentasi ada di akun Anda. Anda bebas melanjutkan dengan tim internal kapan saja.',
  },
];

const milestones = [
  { y: '2019', d: 'Didirikan di Jakarta oleh tiga engineer dan satu desainer.' },
  { y: '2021', d: 'Proyek perbankan pertama; membentuk praktik keamanan & kepatuhan TI.' },
  { y: '2023', d: 'Tim tumbuh menjadi 40 orang; membuka praktik Data & AI.' },
  { y: '2025', d: 'Lebih dari 60 produk dirilis untuk klien di 9 industri.' },
];

export default function About() {
  return (
    <>
      <Seo
        title="Tentang kami"
        description={`${site.name} adalah studio produk digital di Jakarta sejak ${site.founded}. Kenali cara kerja, prinsip, dan perjalanan kami.`}
        breadcrumbs={[{ name: 'Tentang', path: '/tentang' }]}
      />
      <PageHead
        title="Kami tim engineer dan desainer yang lebih suka merilis daripada presentasi."
        crumbs={[{ name: 'Tentang', path: '/tentang' }]}
        image={photos.team}
      />

      <section className="wrap about-intro">
        <p className="lead">
          {site.name} berdiri pada {site.founded} karena kami lelah melihat proyek digital yang menghabiskan anggaran
          untuk dokumen, bukan produk. Hari ini kami membantu bank, perusahaan logistik, penyedia layanan kesehatan,
          dan startup membangun perangkat lunak yang dipakai setiap hari. Nama kami diambil dari <em>aruna</em>,
          fajar: titik ketika sesuatu yang baru mulai terlihat.
        </p>
        <dl className="facts">
          <div>
            <dt>Berdiri</dt>
            <dd>{site.founded}</dd>
          </div>
          <div>
            <dt>Tim</dt>
            <dd>48 orang</dd>
          </div>
          <div>
            <dt>Produk dirilis</dt>
            <dd>60+</dd>
          </div>
          <div>
            <dt>Kantor</dt>
            <dd>Jakarta</dd>
          </div>
        </dl>
      </section>

      <section className="section section--ink">
        <div className="wrap">
          <h2 className="h2 h2--light">Prinsip kerja</h2>
          <div className="principles">
            {principles.map((p) => (
              <article key={p.t} className="principles__item">
                <h3 className="principles__t">{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="split__head">
            <h2 className="h2">Perjalanan</h2>
            <Photo src={photos.jakarta.src} alt={photos.jakarta.alt} credit={photos.jakarta.credit} ratio={4 / 5} sizes="(min-width: 900px) 30vw, 100vw" className="photo--side" />
          </div>
          <ol className="timeline">
            {milestones.map((m) => (
              <li key={m.y} className="timeline__item">
                <span className="timeline__y">{m.y}</span>
                <p>{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Kenali orang-orang di balik Aruna." text="Engineer, desainer, data scientist, dan spesialis keamanan yang akan bekerja bersama Anda." to="/tim" label="Lihat tim kami" />
    </>
  );
}
