/**
 * Konten contoh tambahan: produk, tim, FAQ, dan artikel.
 * Semua nama orang, produk, dan angka di sini FIKTIF — ganti lewat CMS.
 */
const U = 'https://images.unsplash.com/photo-';
const day = 24 * 60 * 60 * 1000;
const d = (s) => new Date(s);

export const products = [
  {
    name: 'Aruna GRC',
    slug: 'aruna-grc',
    tagline: 'Register risiko, temuan audit, dan kepatuhan dalam satu portal.',
    category: 'Tata kelola & kepatuhan',
    status: 'GA',
    summary:
      'Portal Governance, Risk & Compliance untuk bank, koperasi, dan perusahaan teregulasi. Menggantikan spreadsheet dengan alur kerja persetujuan, jejak audit, dan laporan siap regulator.',
    features: [
      'Register risiko dengan matriks dampak × kemungkinan',
      'Pelacakan temuan audit dan tenggat tindak lanjut',
      'Jejak audit yang tidak bisa diubah',
      'Laporan sesuai format regulator dalam satu klik',
      'Single sign-on dan kontrol akses berbasis peran',
    ],
    body: `Aruna GRC lahir dari proyek-proyek kepatuhan yang kami kerjakan untuk lembaga keuangan. Setiap klien punya masalah yang sama: data risiko tersebar di puluhan spreadsheet, dan menyusun laporan kuartalan memakan waktu berminggu-minggu.

## Untuk siapa
Tim manajemen risiko, kepatuhan, audit internal, dan IT governance di organisasi yang diatur ketat.

## Penerapan
Tersedia sebagai layanan cloud di region Jakarta atau dipasang di infrastruktur Anda sendiri.`,
    accent: '#0F7A6A',
    order: 1,
    image: `${U}1707157284454-553ef0a4ed0d`,
    imageAlt: 'Meja kerja dengan ponsel dan grafik keuangan',
    imageCredit: 'Jakub Żerdzicki',
    releases: [
      { version: '2.3', date: d('2026-10-14'), title: 'Dashboard eksekutif & ekspor laporan POJK', notes: ['Dashboard ringkasan risiko untuk direksi', 'Template ekspor laporan sesuai format POJK terbaru', 'Notifikasi tenggat via email dan Slack'] },
      { version: '2.0', date: d('2025-08-05'), title: 'Alur kerja persetujuan bertingkat', notes: ['Persetujuan hingga lima tingkat dengan delegasi', 'Jejak audit kriptografis untuk setiap perubahan', 'Antarmuka baru yang lebih cepat 3×'] },
      { version: '1.4', date: d('2024-11-20'), title: 'Integrasi single sign-on', notes: ['SSO dengan Google Workspace dan Microsoft Entra ID', 'Impor massal register risiko dari Excel'] },
      { version: '1.0', date: d('2024-03-12'), title: 'Rilis perdana', notes: ['Register risiko dan matriks penilaian', 'Pelacakan temuan audit', 'Peran pengguna: admin, pemilik risiko, auditor'] },
    ],
  },
  {
    name: 'Aruna Fleet',
    slug: 'aruna-fleet',
    tagline: 'Pelacakan armada dan bukti kirim digital, bahkan saat sinyal lemah.',
    category: 'Logistik',
    status: 'GA',
    summary:
      'Aplikasi pengemudi dan dashboard operasional untuk perusahaan logistik. Posisi armada real-time, bukti kirim berbasis foto dan GPS, serta peringatan keterlambatan otomatis.',
    features: [
      'Aplikasi pengemudi Android & iOS yang tetap jalan offline',
      'Bukti kirim dengan foto, tanda tangan, dan GPS',
      'Peta armada real-time dan geofencing',
      'Peringatan keterlambatan untuk tim operasional',
      'API untuk integrasi dengan sistem pemesanan',
    ],
    body: `Aruna Fleet dikembangkan dari proyek pelacakan armada untuk 1.200 truk. Kami menjadikannya produk agar perusahaan logistik lain bisa memakainya tanpa membangun dari nol.

## Cara kerja
Pengemudi memakai aplikasi di ponsel. Data tersimpan di perangkat saat sinyal hilang dan otomatis tersinkron begitu koneksi kembali.`,
    accent: '#2E4BD8',
    order: 2,
    image: `${U}1616432043562-3671ea2e5242`,
    imageAlt: 'Truk barang melaju di jalan raya',
    imageCredit: 'Caleb Ruiter',
    releases: [
      { version: '3.1', date: d('2026-09-02'), title: 'Optimasi rute multi-drop', notes: ['Saran urutan pengiriman berdasarkan lalu lintas', 'Estimasi waktu tiba untuk pelanggan akhir'] },
      { version: '3.0', date: d('2026-02-18'), title: 'Mode offline penuh', notes: ['Seluruh alur kirim bisa dijalankan tanpa sinyal', 'Sinkronisasi otomatis dengan resolusi konflik'] },
      { version: '2.0', date: d('2025-04-10'), title: 'Dashboard operasional baru', notes: ['Peta armada real-time', 'Geofencing gudang dan pelanggan'] },
    ],
  },
  {
    name: 'Aruna Kas',
    slug: 'aruna-kas',
    tagline: 'Kasir dan stok untuk toko dengan banyak cabang.',
    category: 'Ritel',
    status: 'BETA',
    summary:
      'Aplikasi kasir di tablet dan ponsel dengan stok yang tersinkron antar-cabang, pembayaran QRIS, dan laporan penjualan harian.',
    features: ['Kasir di tablet dan ponsel', 'Pembayaran QRIS dan tunai', 'Stok tersinkron antar-cabang', 'Laporan penjualan harian otomatis'],
    body: `Aruna Kas sedang dalam program beta bersama 40 toko di Jabodetabek. Daftar melalui halaman kontak jika toko Anda ingin ikut mencoba.`,
    accent: '#C2542D',
    order: 3,
    image: `${U}1512941937669-90a1b58e7e9c`,
    imageAlt: 'Ponsel pintar di atas meja',
    imageCredit: 'William Hook',
    releases: [
      { version: '0.9', date: d('2026-11-03'), title: 'Beta publik', notes: ['Pembayaran QRIS', 'Laporan penjualan harian via WhatsApp'] },
      { version: '0.5', date: d('2026-07-21'), title: 'Beta tertutup', notes: ['Kasir dan stok dasar untuk 10 toko percontohan'] },
    ],
  },
  {
    name: 'Aruna Insight',
    slug: 'aruna-insight',
    tagline: 'Tanya data perusahaan dalam bahasa sehari-hari.',
    category: 'Data & AI',
    status: 'SEGERA',
    summary:
      'Asisten analitik yang terhubung ke data warehouse Anda. Ajukan pertanyaan dalam Bahasa Indonesia dan dapatkan jawaban beserta grafik dan sumber datanya.',
    features: ['Pertanyaan dalam Bahasa Indonesia', 'Jawaban dengan grafik dan kueri yang bisa diperiksa', 'Kontrol akses per tabel', 'Log audit untuk setiap pertanyaan'],
    body: `Aruna Insight akan dirilis pada kuartal pertama 2027. Kami sedang menguji bersama tiga klien di sektor keuangan dan ritel.`,
    accent: '#7A3FA8',
    order: 4,
    image: `${U}1551288049-bebda4e38f71`,
    imageAlt: 'Grafik analitik kinerja di layar laptop',
    imageCredit: 'Luke Chesser',
    releases: [{ version: 'Pratinjau', date: d('2026-10-28'), title: 'Program pratinjau untuk klien terpilih', notes: ['Koneksi ke BigQuery dan PostgreSQL', 'Jawaban dengan grafik otomatis'] }],
  },
];

export const members = [
  { name: 'Adi Nugroho', role: 'CEO & Co-founder', department: 'Kepemimpinan', leadership: true, order: 1, bio: 'Lima belas tahun membangun sistem perbankan dan pembayaran sebelum mendirikan Aruna pada 2019.' },
  { name: 'Ratna Wijaya', role: 'CTO & Co-founder', department: 'Kepemimpinan', leadership: true, order: 2, bio: 'Memimpin arsitektur dan praktik engineering. Sebelumnya membangun platform logistik dengan jutaan pengiriman per bulan.' },
  { name: 'Bima Santoso', role: 'Head of Design', department: 'Kepemimpinan', leadership: true, order: 3, bio: 'Percaya desain yang baik terasa jelas, bukan sekadar indah. Memimpin riset pengguna dan design system.' },
  { name: 'Sari Kusuma', role: 'Head of Security & Compliance', department: 'Kepemimpinan', leadership: true, order: 4, bio: 'Auditor TI bersertifikasi yang membantu klien teregulasi siap menghadapi audit sejak hari pertama.' },
  { name: 'Raka Pratama', role: 'Principal Engineer', department: 'Engineering', order: 10, bio: 'Spesialis cloud dan sistem terdistribusi. Penulis beberapa artikel Wawasan tentang Cloud Run dan Kubernetes.' },
  { name: 'Nadia Putri', role: 'Senior Product Designer', department: 'Desain', order: 20, bio: 'Merancang alur aplikasi kesehatan dan pendidikan yang dipakai puluhan ribu orang.' },
  { name: 'Dewi Lestari', role: 'Lead Data Scientist', department: 'Data & AI', order: 30, bio: 'Membangun model prediksi dan fitur AI generatif dengan evaluasi kualitas yang terukur.' },
  { name: 'Yusuf Hidayat', role: 'Senior Mobile Engineer', department: 'Engineering', order: 11, bio: 'Flutter sejak versi beta. Memimpin pengembangan aplikasi pengemudi Aruna Fleet.' },
  { name: 'Maya Anggraini', role: 'Product Manager', department: 'Produk', order: 40, bio: 'Menjembatani kebutuhan bisnis dan tim engineering. Pengelola produk Aruna GRC.' },
  { name: 'Fajar Ramadhan', role: 'DevOps Engineer', department: 'Engineering', order: 12, bio: 'Mengubah rilis dari ritual menegangkan menjadi rutinitas harian lewat CI/CD dan observability.' },
  { name: 'Intan Permata', role: 'UX Researcher', department: 'Desain', order: 21, bio: 'Sudah mewawancarai lebih dari 400 pengguna — dari pengemudi truk sampai direktur bank.' },
  { name: 'Hendra Wibowo', role: 'Security Engineer', department: 'Keamanan', order: 50, bio: 'Menguji penetrasi aplikasi web dan mobile, lalu membantu tim memperbaikinya.' },
];

export const faqs = [
  { category: 'Kerja sama', order: 1, question: 'Berapa biaya membangun aplikasi bersama Aruna Digital?', answer: 'Tergantung ruang lingkup. Sebagai gambaran, proyek aplikasi web atau mobile biasanya berada di kisaran Rp250 juta hingga Rp2 miliar. Kami memberikan estimasi tertulis setelah discovery dua minggu, sehingga angka yang Anda pegang didasarkan pada kebutuhan nyata.' },
  { category: 'Kerja sama', order: 2, question: 'Berapa lama sebuah proyek berjalan?', answer: 'Versi pertama yang bisa dipakai pengguna umumnya rilis dalam 8–16 minggu setelah discovery. Setelah itu pengembangan dilanjutkan dalam sprint dua mingguan.' },
  { category: 'Kerja sama', order: 3, question: 'Apakah bisa menandatangani NDA sebelum diskusi?', answer: 'Bisa. Kirimkan draf NDA Anda melalui halaman kontak, atau minta templat NDA standar kami.' },
  { category: 'Kerja sama', order: 4, question: 'Bagaimana skema pembayarannya?', answer: 'Discovery dibayar di muka. Pengembangan dibayar per milestone atau per bulan sesuai ukuran tim, dengan termin 30 hari.' },
  { category: 'Teknis', order: 1, question: 'Siapa pemilik kode sumber setelah proyek selesai?', answer: 'Anda. Repositori, infrastruktur cloud, dan dokumentasi berada di akun Anda sejak awal proyek.' },
  { category: 'Teknis', order: 2, question: 'Teknologi apa yang biasa Aruna pakai?', answer: 'React dan Next.js untuk web, Flutter untuk mobile, Node.js dan Go untuk backend, serta Google Cloud atau AWS untuk infrastruktur. Kami menyesuaikan dengan standar teknologi di perusahaan Anda bila sudah ada.' },
  { category: 'Teknis', order: 3, question: 'Apakah aplikasi bisa di-hosting di data center kami sendiri?', answer: 'Bisa. Kami terbiasa menerapkan aplikasi di cloud publik, private cloud, maupun on-premise sesuai kebijakan TI dan regulasi Anda.' },
  { category: 'Teknis', order: 4, question: 'Apakah ada dukungan setelah aplikasi rilis?', answer: 'Ada. Paket dukungan mencakup pemantauan 24/7, perbaikan bug, pembaruan keamanan, dan pengembangan fitur lanjutan dengan SLA yang disepakati.' },
  { category: 'Keamanan', order: 1, question: 'Apakah Aruna berpengalaman dengan industri yang diatur ketat?', answer: 'Ya. Kami bekerja dengan bank, koperasi, dan penyedia layanan kesehatan, dan mendampingi kesiapan audit sesuai POJK dan ISO/IEC 27001.' },
  { category: 'Keamanan', order: 2, question: 'Bagaimana Aruna menjaga data klien selama proyek?', answer: 'Akses data mengikuti prinsip hak akses minimum, semua perangkat tim terenkripsi, dan data produksi tidak pernah disalin ke lingkungan pengembangan tanpa anonimisasi.' },
];

export const morePosts = [
  {
    title: 'Mengukur kualitas jawaban chatbot sebelum dirilis',
    slug: 'mengukur-kualitas-jawaban-chatbot',
    excerpt: 'Tanpa evaluasi, setiap perubahan prompt adalah tebakan. Begini cara kami membangun set uji untuk asisten AI.',
    tags: ['ai', 'data'],
    author: 'Dewi Lestari',
    publishedAt: new Date(Date.now() - 3 * day),
    image: `${U}1757466762489-52fea38071ad`,
    imageAlt: 'Gelombang partikel biru bercahaya',
    imageCredit: 'jonakoh',
    body: `Asisten AI yang terlihat bagus saat demo sering mengecewakan di tangan pengguna. Penyebabnya hampir selalu sama: tidak ada cara mengukur kualitas jawaban secara konsisten.

## Mulai dari 100 pertanyaan nyata
Kumpulkan pertanyaan dari tiket layanan pelanggan, email, atau wawancara pengguna. Tulis jawaban ideal untuk masing-masing bersama pakar di tim Anda.

## Tentukan kriteria penilaian
- **Benar**: isi jawaban sesuai fakta di dokumen sumber
- **Lengkap**: semua bagian pertanyaan terjawab
- **Aman**: tidak membocorkan data yang tidak boleh dilihat pengguna
- **Jujur**: mengatakan "tidak tahu" bila informasinya memang tidak ada

## Jalankan di setiap perubahan
Perlakukan set uji seperti unit test. Setiap perubahan prompt, model, atau sumber data harus menunjukkan skor yang sama atau lebih baik sebelum dirilis.`,
  },
  {
    title: 'Pipeline CI/CD pertama Anda dalam satu hari',
    slug: 'pipeline-ci-cd-pertama-dalam-satu-hari',
    excerpt: 'Build, test, dan deploy otomatis tidak harus menunggu tim platform. Langkah minimum yang langsung terasa manfaatnya.',
    tags: ['devops', 'cloud'],
    author: 'Fajar Ramadhan',
    publishedAt: new Date(Date.now() - 9 * day),
    image: `${U}1558494949-ef010cbdcc31`,
    imageAlt: 'Kabel jaringan di rak server',
    imageCredit: 'Taylor Vick',
    body: `Banyak tim menunda otomatisasi rilis karena merasa harus merancang semuanya sekaligus. Padahal versi minimum bisa selesai dalam sehari.

## Langkah minimum
1. **Build** di setiap pull request — gagal build berarti tidak bisa digabung.
2. **Test** otomatis, walaupun baru sepuluh test.
3. **Deploy** otomatis ke lingkungan staging setiap kali \`main\` berubah.
4. **Promosi** ke produksi dengan satu tombol, bukan dengan SSH ke server.

## Setelah itu
Tambahkan pemindaian dependensi, pengujian keamanan, dan rilis bertahap. Satu langkah per minggu sudah cukup.`,
  },
  {
    title: 'Aplikasi yang tetap jalan saat sinyal hilang',
    slug: 'aplikasi-yang-tetap-jalan-saat-sinyal-hilang',
    excerpt: 'Pelajaran dari membangun aplikasi pengemudi untuk jalanan Indonesia: rancang offline lebih dulu, bukan belakangan.',
    tags: ['mobile', 'produk'],
    author: 'Yusuf Hidayat',
    publishedAt: new Date(Date.now() - 18 * day),
    image: `${U}1512941937669-90a1b58e7e9c`,
    imageAlt: 'Ponsel pintar di atas meja',
    imageCredit: 'William Hook',
    body: `Di jalan tol, di gudang, atau di pelosok, sinyal seluler tidak bisa diandalkan. Aplikasi yang berhenti bekerja tanpa internet akan ditinggalkan pengguna.

## Simpan dulu, kirim kemudian
Setiap aksi pengguna disimpan di database lokal perangkat terlebih dahulu, lalu dikirim ke server oleh antrean latar belakang.

## Tunjukkan status dengan jujur
Tampilkan dengan jelas data mana yang sudah tersinkron dan mana yang belum. Pengguna lebih tenang bila tahu apa yang sedang terjadi.

## Uji di kondisi nyata
Simulasi jaringan lambat di emulator membantu, tetapi tidak menggantikan uji coba di jalan bersama pengguna sungguhan.`,
  },
  {
    title: 'Riset pengguna dengan anggaran kecil',
    slug: 'riset-pengguna-dengan-anggaran-kecil',
    excerpt: 'Lima wawancara yang dirancang dengan baik sering mengungkap lebih banyak masalah daripada survei ke 500 orang.',
    tags: ['desain', 'produk'],
    author: 'Intan Permata',
    publishedAt: new Date(Date.now() - 33 * day),
    image: `${U}1576153192396-180ecef2a715`,
    imageAlt: 'Desainer membuat sketsa wireframe di kertas',
    imageCredit: 'Amélie Mourichon',
    body: `Riset pengguna tidak harus mahal. Yang penting adalah pertanyaan yang tepat dan kebiasaan melakukannya secara rutin.

## Lima wawancara per minggu
Lima orang sudah cukup untuk menemukan sebagian besar masalah besar dalam sebuah alur.

## Tanyakan masa lalu, bukan masa depan
"Ceritakan terakhir kali Anda melakukan…" menghasilkan jawaban yang jauh lebih jujur daripada "Apakah Anda akan memakai fitur ini?"

## Bagikan temuan dalam satu halaman
Tulis tiga temuan teratas dan satu rekomendasi. Dokumen panjang jarang dibaca.`,
  },
  {
    title: 'Menyusun register risiko TI yang benar-benar dipakai',
    slug: 'menyusun-register-risiko-ti',
    excerpt: 'Register risiko sering berakhir sebagai dokumen audit. Cara menjadikannya alat kerja harian tim TI.',
    tags: ['kepatuhan', 'keamanan'],
    author: 'Sari Kusuma',
    publishedAt: new Date(Date.now() - 48 * day),
    image: `${U}1707157284454-553ef0a4ed0d`,
    imageAlt: 'Meja kerja dengan ponsel dan grafik keuangan',
    imageCredit: 'Jakub Żerdzicki',
    body: `Register risiko yang hanya dibuka menjelang audit tidak melindungi siapa pun.

## Satu pemilik per risiko
Setiap risiko harus punya satu nama penanggung jawab, bukan nama divisi.

## Tautkan ke kontrol dan bukti
Untuk setiap risiko, catat kontrol yang mengurangi dampaknya dan di mana bukti kontrol itu bisa ditemukan.

## Tinjau bersama insiden
Setiap insiden adalah kesempatan memperbarui penilaian risiko. Jadikan peninjauan register bagian dari post-mortem.`,
  },
  {
    title: 'Menjaga tagihan cloud tetap masuk akal',
    slug: 'menjaga-tagihan-cloud-tetap-masuk-akal',
    excerpt: 'Tiga kebiasaan sederhana yang memangkas biaya cloud klien kami rata-rata 30% tanpa mengorbankan performa.',
    tags: ['cloud', 'devops'],
    author: 'Raka Pratama',
    publishedAt: new Date(Date.now() - 56 * day),
    image: `${U}1584169417032-d34e8d805e8b`,
    imageAlt: 'Lorong ruang server dengan rak peralatan',
    imageCredit: 'İsmail Enes Ayhan',
    body: `Tagihan cloud yang membengkak hampir selalu berasal dari hal yang sama: sumber daya yang lupa dimatikan dan ukuran mesin yang terlalu besar.

## Beri label semuanya
Setiap sumber daya diberi label tim dan proyek. Tanpa label, biaya tidak bisa dijelaskan.

## Matikan lingkungan non-produksi di luar jam kerja
Staging dan development jarang dipakai pada malam hari dan akhir pekan.

## Tinjau setiap bulan
Tiga puluh menit sebulan untuk melihat lima pos biaya terbesar sudah cukup untuk menemukan pemborosan.`,
  },
  {
    title: 'Dari spreadsheet ke dashboard yang dipercaya manajemen',
    slug: 'dari-spreadsheet-ke-dashboard',
    excerpt: 'Dashboard gagal bukan karena grafiknya jelek, tetapi karena angkanya tidak dipercaya. Mulailah dari definisi metrik.',
    tags: ['data', 'produk'],
    author: 'Dewi Lestari',
    publishedAt: new Date(Date.now() - 64 * day),
    image: `${U}1551288049-bebda4e38f71`,
    imageAlt: 'Grafik analitik kinerja di layar laptop',
    imageCredit: 'Luke Chesser',
    body: `Rapat yang dihabiskan untuk memperdebatkan angka mana yang benar adalah tanda dashboard belum siap.

## Sepakati definisi lebih dulu
Tuliskan definisi setiap metrik — misalnya "pelanggan aktif" — beserta sumber datanya, lalu minta pemilik bisnis menyetujuinya.

## Satu sumber kebenaran
Bangun tabel metrik di data warehouse, bukan di masing-masing spreadsheet.

## Tampilkan kapan data terakhir diperbarui
Kepercayaan tumbuh ketika pengguna tahu seberapa segar data yang mereka lihat.`,
  },
  {
    title: 'Aksesibilitas bukan fitur tambahan',
    slug: 'aksesibilitas-bukan-fitur-tambahan',
    excerpt: 'Kontras warna, ukuran teks, dan navigasi papan ketik membantu semua pengguna — bukan hanya penyandang disabilitas.',
    tags: ['desain', 'mobile'],
    author: 'Nadia Putri',
    publishedAt: new Date(Date.now() - 75 * day),
    image: `${U}1618788372246-79faff0c3742`,
    imageAlt: 'Tangan memegang iPad di samping tanaman',
    imageCredit: 'Faizur Rehman',
    body: `Pengguna lansia, pengguna di bawah terik matahari, dan pengguna dengan koneksi lambat semuanya diuntungkan oleh desain yang aksesibel.

## Kontras dan ukuran teks
Pastikan rasio kontras teks minimal 4,5:1 dan aplikasi tetap rapi saat ukuran huruf sistem diperbesar.

## Area sentuh yang cukup besar
Tombol minimal 44×44 poin memudahkan semua orang, terutama saat berjalan.

## Uji dengan pembaca layar
Lima menit memakai VoiceOver atau TalkBack akan menunjukkan banyak hal yang terlewat.`,
  },
];
