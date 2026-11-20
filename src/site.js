/**
 * Identitas perusahaan & navigasi — satu sumber untuk frontend dan server
 * (SEO, sitemap, JSON-LD). Ubah di sini untuk mengganti nama/kontak.
 */
export const site = {
  name: 'Aruna Digital',
  legalName: 'PT Aruna Bumi Digital',
  domain: 'aruna-digital.com',
  url: (typeof process !== 'undefined' && process.env?.SITE_URL) || 'https://aruna-digital.com',
  tagline: 'Studio produk digital di Jakarta',
  description:
    'Aruna Digital merancang dan membangun aplikasi web, mobile, dan platform cloud untuk perusahaan yang ingin bergerak cepat tanpa mengorbankan kualitas.',
  locale: 'id_ID',
  lang: 'id',
  email: 'halo@aruna-digital.com',
  careersEmail: 'karier@aruna-digital.com',
  phone: '+62 21 5000 1234',
  whatsapp: '6281200001234',
  address: {
    street: 'Jl. Jend. Sudirman Kav. 52–53',
    locality: 'Jakarta Selatan',
    region: 'DKI Jakarta',
    postalCode: '12190',
    country: 'ID',
  },
  geo: { lat: -6.2253, lng: 106.8089 },
  hours: 'Senin–Jumat, 09.00–18.00 WIB',
  founded: '2019',
  social: {
    linkedin: 'https://www.linkedin.com/company/aruna-digital',
    instagram: 'https://www.instagram.com/arunadigital.id',
    github: 'https://github.com/uncletan-oss',
  },
};

/**
 * Foto untuk halaman statis — gratis dari Unsplash (unsplash.com/license:
 * boleh dipakai komersial tanpa izin). Ganti URL di sini bila perlu.
 */
export const photos = {
  hero: {
    src: 'https://images.unsplash.com/photo-1710956394316-0e9fc5312aab',
    alt: 'Matahari di atas gedung-gedung tinggi Jakarta',
    credit: 'David Kristianto',
  },
  services: {
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    alt: 'Ruang rapat kantor modern dengan meja dan kursi',
    credit: 'Nastuh Abootalebi',
  },
  portfolio: {
    src: 'https://images.unsplash.com/photo-1696832204235-5676c7ee9105',
    alt: 'Gedung-gedung tinggi di tepi perairan',
    credit: 'Ache Dipro',
  },
  insights: {
    src: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3',
    alt: 'Layar laptop menampilkan kode berwarna',
    credit: 'Mohammad Rahmani',
  },
  contact: {
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    alt: 'Lorong kantor dengan pintu kaca',
    credit: 'Nastuh Abootalebi',
  },
  privacy: {
    src: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3',
    alt: 'Layar laptop menyala dari dekat',
    credit: 'Philipp Katzenberger',
  },
  partnership: {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
    alt: 'Dua orang berjabat tangan',
    credit: 'Cytonn Photography',
  },
  notFound: {
    src: 'https://images.unsplash.com/photo-1666884257245-7bfcf6e4fc1e',
    alt: 'Kaki langit kota pada malam hari',
    credit: 'Fahrul Razi',
  },
  studio: {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    alt: 'Tim bekerja bersama di depan laptop',
    credit: 'Annie Spratt',
  },
  team: {
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    alt: 'Presentasi tim di ruang rapat',
    credit: 'Campaign Creators',
  },
  jakarta: {
    src: 'https://images.unsplash.com/photo-1600481017849-4e1c1346ea2f',
    alt: 'Gedung-gedung tinggi di Jakarta pada siang hari',
    credit: 'Helen G',
  },
  careers: {
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    alt: 'Rekan kerja berdiskusi di sekitar meja',
    credit: 'Annie Spratt',
  },
};

export const nav = [
  { to: '/layanan', label: 'Layanan' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/wawasan', label: 'Wawasan' },
  { to: '/karier', label: 'Karier' },
];

/** Halaman statis untuk sitemap (path, prioritas, frekuensi). */
export const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/layanan', priority: 0.9, changefreq: 'monthly' },
  { path: '/portofolio', priority: 0.9, changefreq: 'weekly' },
  { path: '/tentang', priority: 0.7, changefreq: 'monthly' },
  { path: '/wawasan', priority: 0.8, changefreq: 'daily' },
  { path: '/karier', priority: 0.7, changefreq: 'weekly' },
  { path: '/kontak', priority: 0.8, changefreq: 'yearly' },
  { path: '/kebijakan-privasi', priority: 0.2, changefreq: 'yearly' },
];
