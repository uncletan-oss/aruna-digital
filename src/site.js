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
