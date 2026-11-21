/**
 * Isi database dengan konten contoh.
 *   npm run seed          → hanya mengisi koleksi yang masih kosong
 *   npm run seed:reset    → hapus konten (layanan, portofolio, artikel, lowongan) lalu isi ulang
 * Semua klien & studi kasus di sini FIKTIF — ganti lewat panel /admin.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import { config } from './config.js';
import { Service, Project, Post, Job, User, Product, Member, Faq } from './models.js';
import { products, members, faqs, morePosts } from './seed-extra.js';

const services = [
  {
    title: 'Pengembangan Aplikasi Web',
    slug: 'pengembangan-aplikasi-web',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    imageAlt: 'Layar laptop menampilkan kode program',
    imageCredit: 'Arnold Francisca',
    summary: 'Portal pelanggan, dashboard internal, dan platform transaksi yang cepat, aman, dan mudah dirawat.',
    deliverables: ['Arsitektur & estimasi teknis', 'Frontend React / Next.js', 'Backend Node.js & API', 'Integrasi sistem inti', 'Dokumentasi & serah terima'],
    body: `Kami membangun aplikasi web yang dipakai setiap hari — bukan sekadar prototipe.

## Cara kami bekerja
Setiap proyek dimulai dengan **discovery dua minggu**: memetakan proses bisnis, pengguna, dan sistem yang sudah ada. Hasilnya adalah arsitektur, backlog terprioritas, dan estimasi yang bisa Anda pegang.

Setelah itu tim kecil lintas fungsi (product, desain, engineering, QA) bekerja dalam sprint dua mingguan dengan demo di setiap akhir sprint.

## Teknologi yang biasa kami pakai
- React, Next.js, TypeScript
- Node.js, NestJS, Go
- PostgreSQL, MongoDB, Redis
- Google Cloud, AWS, Docker, Kubernetes`,
    order: 1,
  },
  {
    title: 'Aplikasi Mobile',
    slug: 'aplikasi-mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    imageAlt: 'Ponsel pintar di atas meja',
    imageCredit: 'William Hook',
    summary: 'Aplikasi iOS dan Android dengan satu basis kode Flutter atau React Native, siap rilis ke store.',
    deliverables: ['Aplikasi Flutter / React Native', 'Desain antarmuka mobile', 'Push notification & deep link', 'Rilis App Store & Play Store', 'Monitoring crash & performa'],
    body: `Satu basis kode, dua platform, tanpa kompromi pada pengalaman pengguna.

## Yang kami tangani
Mulai dari desain alur, pengembangan, pengujian di perangkat nyata, hingga proses review di App Store dan Google Play.

## Setelah rilis
Kami memantau crash, performa, dan ulasan pengguna, lalu merencanakan iterasi berikutnya bersama tim Anda.`,
    order: 2,
  },
  {
    title: 'Cloud & DevOps',
    slug: 'cloud-devops',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    imageAlt: 'Kabel jaringan di rak server',
    imageCredit: 'Taylor Vick',
    summary: 'Migrasi ke cloud, pipeline CI/CD, dan infrastruktur sebagai kode supaya rilis jadi rutinitas, bukan risiko.',
    deliverables: ['Assessment & rencana migrasi', 'Infrastruktur sebagai kode (Terraform)', 'CI/CD otomatis', 'Observability & alerting', 'Optimasi biaya cloud'],
    body: `Kami membantu tim Anda merilis lebih sering dengan lebih sedikit kejutan.

## Fokus kami
- **Migrasi** aplikasi lama ke Google Cloud Run, GKE, atau AWS
- **Pipeline** build–test–deploy otomatis
- **Observability**: log, metrik, dan tracing yang benar-benar dibaca
- **FinOps**: tagihan cloud yang bisa dijelaskan baris per baris`,
    order: 3,
  },
  {
    title: 'Data & AI',
    slug: 'data-ai',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    imageAlt: 'Grafik analitik kinerja di layar laptop',
    imageCredit: 'Luke Chesser',
    summary: 'Pipeline data, dashboard analitik, dan fitur AI yang menjawab pertanyaan bisnis nyata.',
    deliverables: ['Data warehouse & pipeline ETL', 'Dashboard analitik', 'Model prediksi & rekomendasi', 'Integrasi LLM yang aman', 'Tata kelola data'],
    body: `Data yang rapi lebih berharga daripada model yang canggih. Kami mulai dari sana.

## Dari data ke keputusan
Kami merancang pipeline data ke BigQuery atau warehouse pilihan Anda, membangun dashboard yang dipakai manajemen, lalu menambahkan model prediksi di tempat yang paling berdampak.

## AI generatif
Asisten internal, pencarian dokumen, dan otomasi layanan pelanggan berbasis LLM — dengan kontrol akses, audit log, dan evaluasi kualitas jawaban.`,
    order: 4,
  },
  {
    title: 'Desain UI/UX',
    slug: 'desain-ui-ux',
    image: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715',
    imageAlt: 'Desainer membuat sketsa wireframe di kertas',
    imageCredit: 'Amélie Mourichon',
    summary: 'Riset pengguna, desain antarmuka, dan design system yang membuat produk mudah dipahami sejak klik pertama.',
    deliverables: ['Riset & wawancara pengguna', 'Arsitektur informasi', 'Prototipe interaktif', 'Design system & komponen', 'Uji usabilitas'],
    body: `Desain yang baik terasa jelas, bukan sekadar indah.

## Proses
Wawancara pengguna → peta perjalanan → wireframe → prototipe → uji usabilitas → design system yang diserahkan ke tim engineering dalam bentuk komponen siap pakai.`,
    order: 5,
  },
  {
    title: 'Keamanan & Kepatuhan TI',
    slug: 'keamanan-kepatuhan-ti',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    imageAlt: 'Panel lampu LED biru kehijauan',
    imageCredit: 'Adi Goldstein',
    summary: 'Penilaian risiko, hardening aplikasi, dan kesiapan audit untuk industri yang diatur ketat seperti perbankan.',
    deliverables: ['Penilaian risiko TI', 'Secure code review', 'Hardening & pengujian keamanan', 'Kesiapan audit (POJK, ISO 27001)', 'Portal GRC internal'],
    body: `Untuk bank, fintech, dan perusahaan teregulasi, keamanan adalah fitur utama.

## Layanan
- Penilaian risiko TI dan pemetaan kontrol
- Secure SDLC dan code review
- Pengujian penetrasi aplikasi web dan mobile
- Pendampingan kesiapan audit sesuai POJK dan ISO/IEC 27001
- Pengembangan portal Governance, Risk & Compliance (GRC) internal`,
    order: 6,
  },
];

const projects = [
  {
    title: 'Pelacakan armada real-time untuk 1.200 truk',
    slug: 'sentra-logistik-pelacakan-armada',
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242',
    imageAlt: 'Truk barang melaju di jalan raya',
    imageCredit: 'Caleb Ruiter',
    client: 'Sentra Logistik Nusantara',
    industry: 'Logistik',
    year: 2025,
    services: ['Pengembangan Aplikasi Web', 'Aplikasi Mobile', 'Cloud & DevOps'],
    summary: 'Dashboard operasional dan aplikasi pengemudi yang memangkas waktu konfirmasi pengiriman dari jam menjadi menit.',
    challenge: 'Status pengiriman dilaporkan lewat telepon dan spreadsheet. Tim operasional baru tahu ada keterlambatan setelah pelanggan mengeluh.',
    solution: 'Kami membangun aplikasi pengemudi Flutter dengan bukti kirim berbasis foto dan GPS, serta dashboard web yang menampilkan posisi armada dan peringatan keterlambatan secara langsung.',
    body: `## Pendekatan
Discovery dilakukan langsung di tiga gudang untuk memahami cara kerja pengemudi. Aplikasi dirancang agar tetap bisa dipakai saat sinyal lemah — data disimpan lokal dan disinkronkan otomatis.

## Teknologi
Flutter, Node.js, PostgreSQL + PostGIS, Google Cloud Run, Pub/Sub.`,
    results: [
      { value: '87%', label: 'lebih cepat konfirmasi pengiriman' },
      { value: '1.200', label: 'armada terpantau langsung' },
      { value: '−32%', label: 'komplain keterlambatan' },
    ],
    accent: '#2E4BD8',
    featured: true,
    order: 1,
  },
  {
    title: 'Portal GRC untuk tim risiko dan kepatuhan',
    slug: 'koperasi-mekar-jaya-portal-grc',
    image: 'https://images.unsplash.com/photo-1707157284454-553ef0a4ed0d',
    imageAlt: 'Meja kerja dengan ponsel dan grafik keuangan',
    imageCredit: 'Jakub Żerdzicki',
    client: 'Koperasi Mekar Jaya',
    industry: 'Jasa Keuangan',
    year: 2025,
    services: ['Keamanan & Kepatuhan TI', 'Pengembangan Aplikasi Web'],
    summary: 'Satu portal untuk register risiko, temuan audit, dan pemantauan tindak lanjut — menggantikan puluhan spreadsheet.',
    challenge: 'Temuan audit tersebar di email dan spreadsheet. Menyusun laporan untuk regulator memakan waktu dua minggu setiap kuartal.',
    solution: 'Portal web dengan alur kerja persetujuan, jejak audit lengkap, dan laporan yang bisa dibuat dengan satu klik.',
    body: `## Fitur utama
- Register risiko dengan matriks dampak × kemungkinan
- Pelacakan temuan audit dan tenggat tindak lanjut
- Jejak audit yang tidak bisa diubah
- Ekspor laporan sesuai format regulator`,
    results: [
      { value: '2 minggu → 1 hari', label: 'waktu penyusunan laporan' },
      { value: '100%', label: 'temuan audit terlacak' },
    ],
    accent: '#0F7A6A',
    featured: true,
    order: 2,
  },
  {
    title: 'Telekonsultasi untuk jaringan 40 klinik',
    slug: 'rumah-sehat-kita-telekonsultasi',
    image: 'https://images.unsplash.com/photo-1758691463203-cce9d415b2b5',
    imageAlt: 'Dua dokter melihat tablet bersama',
    imageCredit: 'Vitaly Gariev',
    client: 'Rumah Sehat Kita',
    industry: 'Kesehatan',
    year: 2024,
    services: ['Aplikasi Mobile', 'Desain UI/UX'],
    summary: 'Aplikasi pasien untuk janji temu, konsultasi video, dan resep digital yang dirancang bersama dokter dan pasien lansia.',
    challenge: 'Antrean klinik panjang dan banyak pasien lansia kesulitan memakai aplikasi yang ada.',
    solution: 'Kami melakukan uji usabilitas dengan 24 pasien lansia, lalu merancang ulang alur janji temu menjadi tiga langkah dengan teks besar dan bantuan suara.',
    results: [
      { value: '4,8', label: 'rating di Play Store' },
      { value: '−45%', label: 'waktu tunggu di klinik' },
    ],
    accent: '#C2542D',
    featured: true,
    order: 3,
  },
  {
    title: 'Marketplace hasil tani langsung dari petani',
    slug: 'pasar-tani-marketplace',
    image: 'https://images.unsplash.com/photo-1616140799962-4d548b0aaad5',
    imageAlt: 'Cabai merah dan hijau di pasar',
    imageCredit: 'Falaq Lazuardi',
    client: 'Pasar Tani',
    industry: 'Agrikultur',
    year: 2024,
    services: ['Pengembangan Aplikasi Web', 'Data & AI'],
    summary: 'Marketplace B2B yang mempertemukan 3.000 petani dengan restoran dan hotel, lengkap dengan prediksi harga mingguan.',
    challenge: 'Harga di tingkat petani tidak transparan dan pembeli kesulitan memastikan pasokan.',
    solution: 'Platform web dengan katalog stok harian, pembayaran tempo, dan model prediksi harga berbasis data historis serta cuaca.',
    results: [
      { value: '3.000+', label: 'petani terdaftar' },
      { value: '18%', label: 'kenaikan pendapatan petani' },
    ],
    accent: '#5E7A1F',
    order: 4,
  },
  {
    title: 'Platform belajar adaptif untuk sekolah menengah',
    slug: 'arunika-edu-belajar-adaptif',
    image: 'https://images.unsplash.com/photo-1758270705290-62b6294dd044',
    imageAlt: 'Siswa berkumpul di sekitar laptop',
    imageCredit: 'Vitaly Gariev',
    client: 'Arunika Edu',
    industry: 'Pendidikan',
    year: 2023,
    services: ['Data & AI', 'Desain UI/UX', 'Cloud & DevOps'],
    summary: 'Latihan soal yang menyesuaikan tingkat kesulitan per siswa, dipakai 60.000 siswa di 120 sekolah.',
    challenge: 'Guru tidak punya waktu menyiapkan latihan berbeda untuk setiap siswa.',
    solution: 'Mesin rekomendasi soal berbasis item response theory dan dashboard guru yang menunjukkan topik mana yang perlu diulang.',
    results: [
      { value: '60.000', label: 'siswa aktif' },
      { value: '+21%', label: 'rata-rata nilai ujian' },
    ],
    accent: '#7A3FA8',
    order: 5,
  },
];

const day = 24 * 60 * 60 * 1000;
const posts = [
  {
    title: 'Kapan sebaiknya memilih Cloud Run dibanding Kubernetes?',
    slug: 'cloud-run-atau-kubernetes',
    image: 'https://images.unsplash.com/photo-1584169417032-d34e8d805e8b',
    imageAlt: 'Lorong ruang server dengan rak peralatan',
    imageCredit: 'İsmail Enes Ayhan',
    excerpt: 'Cloud Run cukup untuk sebagian besar aplikasi web. Berikut tanda-tanda kapan Anda benar-benar butuh GKE.',
    tags: ['cloud', 'devops'],
    author: 'Raka Pratama',
    publishedAt: new Date(Date.now() - 6 * day),
    body: `Banyak tim langsung memilih Kubernetes karena terdengar "siap skala". Padahal untuk sebagian besar aplikasi web, **Cloud Run** sudah lebih dari cukup.

## Pilih Cloud Run jika
- Aplikasi Anda stateless dan berbasis HTTP
- Trafik naik-turun dan Anda ingin bayar sesuai pemakaian
- Tim tidak punya engineer platform khusus

## Pertimbangkan GKE jika
- Anda menjalankan puluhan layanan yang saling berkomunikasi intensif
- Butuh GPU, workload stateful, atau kontrol jaringan yang sangat spesifik
- Sudah ada tim yang siap merawat cluster

## Kesimpulan
Mulailah dengan yang paling sederhana. Migrasi dari Cloud Run ke GKE nanti relatif mudah karena keduanya memakai container yang sama.`,
  },
  {
    title: 'Lima pertanyaan sebelum menambahkan AI ke produk Anda',
    slug: 'lima-pertanyaan-sebelum-menambahkan-ai',
    image: 'https://images.unsplash.com/photo-1757466762489-52fea38071ad',
    imageAlt: 'Gelombang partikel biru bercahaya',
    imageCredit: 'jonakoh',
    excerpt: 'Fitur AI yang berhasil dimulai dari masalah yang jelas, data yang siap, dan cara mengukur kualitas jawaban.',
    tags: ['ai', 'produk'],
    author: 'Dewi Lestari',
    publishedAt: new Date(Date.now() - 14 * day),
    body: `Sebelum menulis satu baris kode, jawab lima pertanyaan ini bersama tim.

1. **Masalah apa yang diselesaikan?** Tulis dalam satu kalimat dari sudut pandang pengguna.
2. **Bagaimana masalah itu diselesaikan hari ini?** Ini menjadi pembanding kualitas.
3. **Data apa yang dibutuhkan, dan siapa pemiliknya?**
4. **Apa yang terjadi jika AI salah?** Rancang jalan keluar untuk pengguna.
5. **Bagaimana kita mengukur keberhasilan?** Tentukan metrik sebelum peluncuran, bukan sesudahnya.

Jika salah satu belum terjawab, mulailah dari sana.`,
  },
  {
    title: 'Design system kecil yang benar-benar dipakai',
    slug: 'design-system-kecil-yang-dipakai',
    image: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742',
    imageAlt: 'Tangan memegang iPad di samping tanaman',
    imageCredit: 'Faizur Rehman',
    excerpt: 'Anda tidak perlu 200 komponen. Mulai dari tipografi, warna, jarak, dan lima komponen yang paling sering muncul.',
    tags: ['desain', 'produk'],
    author: 'Nadia Putri',
    publishedAt: new Date(Date.now() - 27 * day),
    body: `Design system sering gagal karena terlalu ambisius di awal.

## Mulai dari fondasi
Skala tipografi, palet warna dengan kontras yang lolos WCAG, dan skala jarak. Tiga hal ini saja sudah membuat produk terasa konsisten.

## Lalu lima komponen
Tombol, input, kartu, modal, dan tabel. Bangun di kode, bukan hanya di Figma, dan pakai di fitur yang sedang dikerjakan minggu ini.`,
  },
  {
    title: 'Menyiapkan aplikasi untuk audit keamanan bank',
    slug: 'menyiapkan-aplikasi-untuk-audit-keamanan-bank',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7',
    imageAlt: 'Gembok merah di atas papan ketik',
    imageCredit: 'FlyD',
    excerpt: 'Checklist praktis untuk tim engineering yang membangun aplikasi untuk lembaga keuangan di Indonesia.',
    tags: ['keamanan', 'kepatuhan'],
    author: 'Raka Pratama',
    publishedAt: new Date(Date.now() - 41 * day),
    body: `Audit keamanan tidak harus menegangkan jika persiapannya dilakukan sejak awal.

## Checklist
- Autentikasi berlapis untuk akses admin
- Jejak audit untuk setiap perubahan data penting
- Enkripsi data saat transit dan saat disimpan
- Manajemen rahasia (tidak ada kredensial di repositori)
- Hasil pengujian penetrasi dan bukti perbaikannya
- Rencana pemulihan bencana yang pernah diuji`,
  },
];

const jobs = [
  {
    title: 'Senior Frontend Engineer (React)',
    slug: 'senior-frontend-engineer-react',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa',
    imageAlt: 'Monitor dan laptop menampilkan kode program',
    imageCredit: 'Safar Safarov',
    department: 'Engineering',
    location: 'Jakarta, Indonesia',
    employmentType: 'FULL_TIME',
    remote: true,
    summary: 'Bangun antarmuka web yang cepat dan mudah diakses untuk klien perbankan, logistik, dan kesehatan.',
    body: `## Yang akan Anda kerjakan
- Membangun fitur dengan React dan TypeScript bersama desainer dan backend engineer
- Menjaga performa, aksesibilitas, dan kualitas kode
- Membimbing engineer yang lebih junior

## Yang kami cari
- 4+ tahun pengalaman membangun aplikasi web produksi
- Paham React, state management, dan pengujian
- Peduli pada detail desain dan pengalaman pengguna`,
  },
  {
    title: 'Backend Engineer (Node.js)',
    slug: 'backend-engineer-nodejs',
    image: 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1',
    imageAlt: 'Laptop di atas meja kayu gelap',
    imageCredit: 'AltumCode',
    department: 'Engineering',
    location: 'Jakarta, Indonesia',
    employmentType: 'FULL_TIME',
    remote: false,
    summary: 'Rancang API dan integrasi sistem untuk aplikasi dengan jutaan transaksi per bulan.',
    body: `## Yang akan Anda kerjakan
- Merancang dan membangun API dengan Node.js
- Integrasi dengan sistem inti klien dan layanan pihak ketiga
- Menulis pengujian dan menjaga observability

## Yang kami cari
- 3+ tahun pengalaman backend
- Paham MongoDB atau PostgreSQL, serta desain API
- Pengalaman di Google Cloud atau AWS menjadi nilai tambah`,
  },
  {
    title: 'Product Designer',
    slug: 'product-designer',
    image: 'https://images.unsplash.com/photo-1531547977107-a5f0f32d6d87',
    imageAlt: 'Dua perempuan bekerja di ruang kerja',
    imageCredit: 'Mimi Thian',
    department: 'Desain',
    location: 'Jakarta, Indonesia',
    employmentType: 'FULL_TIME',
    remote: true,
    summary: 'Pimpin riset dan desain produk dari wawancara pengguna sampai komponen siap pakai.',
    body: `## Yang akan Anda kerjakan
- Melakukan riset pengguna dan uji usabilitas
- Merancang alur, wireframe, dan antarmuka akhir
- Mengembangkan design system bersama engineer

## Yang kami cari
- Portofolio yang menunjukkan proses, bukan hanya hasil akhir
- Fasih di Figma dan prototyping
- Mampu menjelaskan keputusan desain kepada klien`,
  },
];

async function seedCollection(Model, docs, reset) {
  if (reset) await Model.deleteMany({});
  if ((await Model.estimatedDocumentCount()) > 0) {
    console.log(`  ${Model.modelName}: dilewati (sudah berisi data)`);
    return;
  }
  // .create() memicu hook (slug, markdown → HTML, waktu baca)
  for (const d of docs) await Model.create(d);
  console.log(`  ${Model.modelName}: ${docs.length} dokumen`);
}

async function main() {
  const reset = process.argv.includes('--reset');
  await connectDB();
  console.log(reset ? '[seed] Mode reset' : '[seed] Mengisi koleksi kosong');
  await seedCollection(Service, services, reset);
  await seedCollection(Project, projects, reset);
  await seedCollection(Post, [...posts, ...morePosts], reset);
  await seedCollection(Job, jobs, reset);
  await seedCollection(Product, products, reset);
  await seedCollection(Member, members, reset);
  await seedCollection(Faq, faqs, reset);

  if (config.adminEmail && config.adminPassword && !(await User.exists({ email: config.adminEmail.toLowerCase() }))) {
    await User.create({
      email: config.adminEmail,
      name: 'Administrator',
      passwordHash: await bcrypt.hash(config.adminPassword, 12),
    });
    console.log(`  User admin: ${config.adminEmail}`);
  }
  await mongoose.disconnect();
  console.log('[seed] Selesai');
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
