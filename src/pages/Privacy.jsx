import Seo from '../components/Seo.jsx';
import { PageHead } from '../components/ui.jsx';
import { useSite } from '../lib/useSite.js';
import { photos } from '../site.js';

export default function Privacy() {
  const site = useSite();
  return (
    <>
      <Seo
        title="Kebijakan privasi"
        description={`Bagaimana ${site.name} mengumpulkan, menggunakan, dan melindungi data pribadi pengunjung situs.`}
        breadcrumbs={[{ name: 'Kebijakan privasi', path: '/kebijakan-privasi' }]}
      />
      <PageHead
        title="Kebijakan privasi"
        lead="Data apa yang kami kumpulkan, untuk apa, dan bagaimana kami melindunginya."
        crumbs={[{ name: 'Kebijakan privasi', path: '/kebijakan-privasi' }]}
        image={photos.privacy}
      />
      <div className="wrap article__body">
        <div className="prose">
          <p>
            Kebijakan ini menjelaskan data apa yang dikumpulkan {site.legalName} (“kami”) melalui situs {site.domain},
            untuk apa data itu dipakai, dan hak Anda sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data
            Pribadi.
          </p>
          <h2>Data yang kami kumpulkan</h2>
          <ul>
            <li>Data yang Anda isi di formulir kontak, lamaran kerja, dan newsletter: nama, email, telepon, perusahaan, dan isi pesan.</li>
            <li>Data teknis: alamat IP (untuk mencegah spam), jenis peramban, dan halaman yang dikunjungi.</li>
            <li>Jika Google Analytics aktif, data penggunaan anonim yang dikumpulkan melalui cookie.</li>
          </ul>
          <h2>Untuk apa data dipakai</h2>
          <ul>
            <li>Membalas pertanyaan dan menindaklanjuti permintaan proyek.</li>
            <li>Memproses lamaran kerja.</li>
            <li>Mengirim newsletter bila Anda berlangganan. Anda bisa berhenti kapan saja.</li>
            <li>Mengukur dan memperbaiki kinerja situs.</li>
          </ul>
          <h2>Penyimpanan dan keamanan</h2>
          <p>
            Data disimpan di infrastruktur cloud dengan enkripsi saat transit dan saat disimpan, serta hanya bisa diakses
            oleh tim yang berwenang. Data pesan disimpan paling lama dua tahun, data lamaran paling lama satu tahun.
          </p>
          <h2>Hak Anda</h2>
          <p>
            Anda berhak meminta salinan, perbaikan, atau penghapusan data pribadi Anda. Kirim permintaan ke{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> dan kami akan memprosesnya dalam 3×24 jam.
          </p>
          <p className="muted">Terakhir diperbarui: November 2026.</p>
        </div>
      </div>
      <div className="section--tight" />
    </>
  );
}
