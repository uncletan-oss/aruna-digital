/**
 * Definisi form CMS per jenis konten.
 * type: text | textarea | markdown | number | checkbox | date | list | select | color | results
 */
const image = [
  { name: 'image', label: 'URL foto sampul', type: 'image', group: 'Foto', hint: 'Foto gratis: buka unsplash.com, pilih foto, klik kanan → Copy image address, lalu tempel di sini.' },
  { name: 'imageAlt', label: 'Deskripsi foto (alt)', type: 'text', group: 'Foto', hint: 'Penting untuk SEO dan pembaca layar.' },
  { name: 'imageCredit', label: 'Nama fotografer', type: 'text', group: 'Foto' },
];

const seo = [
  { name: 'seoTitle', label: 'Judul SEO', type: 'text', group: 'SEO', hint: 'Maks. 70 karakter. Kosongkan untuk memakai judul.', max: 70 },
  { name: 'seoDescription', label: 'Deskripsi SEO', type: 'textarea', group: 'SEO', hint: 'Maks. 170 karakter. Muncul di hasil pencarian Google.', max: 170 },
];

export const schemas = {
  services: {
    label: 'Layanan',
    singular: 'layanan',
    publicPath: '/layanan/',
    columns: [
      { name: 'title', label: 'Judul' },
      { name: 'order', label: 'Urutan' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'slug', label: 'Slug URL', type: 'text', hint: 'Kosongkan untuk dibuat otomatis dari judul.' },
      { name: 'summary', label: 'Ringkasan', type: 'textarea', required: true },
      { name: 'deliverables', label: 'Hasil kerja', type: 'list', hint: 'Satu item per baris.' },
      { name: 'body', label: 'Isi halaman', type: 'markdown' },
      { name: 'order', label: 'Urutan tampil', type: 'number' },
      { name: 'published', label: 'Tayang di situs', type: 'checkbox', default: true },
      ...image,
      ...seo,
    ],
  },
  projects: {
    label: 'Portofolio',
    singular: 'studi kasus',
    publicPath: '/portofolio/',
    columns: [
      { name: 'title', label: 'Judul' },
      { name: 'client', label: 'Klien' },
      { name: 'year', label: 'Tahun' },
      { name: 'featured', label: 'Unggulan', type: 'bool' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'slug', label: 'Slug URL', type: 'text', hint: 'Kosongkan untuk dibuat otomatis dari judul.' },
      { name: 'client', label: 'Klien', type: 'text', required: true },
      { name: 'industry', label: 'Industri', type: 'text' },
      { name: 'year', label: 'Tahun', type: 'number' },
      { name: 'services', label: 'Layanan terkait', type: 'list', hint: 'Satu per baris, tulis persis seperti judul layanan.' },
      { name: 'summary', label: 'Ringkasan', type: 'textarea', required: true },
      { name: 'challenge', label: 'Tantangan', type: 'textarea' },
      { name: 'solution', label: 'Solusi', type: 'textarea' },
      { name: 'results', label: 'Hasil terukur', type: 'results' },
      { name: 'body', label: 'Detail tambahan', type: 'markdown' },
      { name: 'accent', label: 'Warna aksen ilustrasi', type: 'color', default: '#2E4BD8' },
      { name: 'featured', label: 'Tampilkan di beranda', type: 'checkbox' },
      { name: 'order', label: 'Urutan tampil', type: 'number' },
      { name: 'published', label: 'Tayang di situs', type: 'checkbox', default: true },
      ...image,
      ...seo,
    ],
  },
  posts: {
    label: 'Wawasan',
    singular: 'artikel',
    publicPath: '/wawasan/',
    columns: [
      { name: 'title', label: 'Judul' },
      { name: 'author', label: 'Penulis' },
      { name: 'publishedAt', label: 'Terbit', type: 'date' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true },
      { name: 'slug', label: 'Slug URL', type: 'text', hint: 'Kosongkan untuk dibuat otomatis dari judul.' },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', required: true, max: 300 },
      { name: 'body', label: 'Isi artikel', type: 'markdown' },
      { name: 'author', label: 'Penulis', type: 'text', default: 'Tim Aruna Digital' },
      { name: 'tags', label: 'Topik', type: 'list', hint: 'Satu topik per baris, huruf kecil.' },
      { name: 'publishedAt', label: 'Tanggal terbit', type: 'date', hint: 'Tanggal di masa depan = terjadwal.' },
      { name: 'published', label: 'Tayang di situs', type: 'checkbox', default: true },
      ...image,
      ...seo,
    ],
  },
  jobs: {
    label: 'Karier',
    singular: 'lowongan',
    publicPath: '/karier/',
    columns: [
      { name: 'title', label: 'Posisi' },
      { name: 'department', label: 'Divisi' },
      { name: 'location', label: 'Lokasi' },
    ],
    fields: [
      { name: 'title', label: 'Posisi', type: 'text', required: true },
      { name: 'slug', label: 'Slug URL', type: 'text', hint: 'Kosongkan untuk dibuat otomatis dari posisi.' },
      { name: 'department', label: 'Divisi', type: 'text' },
      { name: 'location', label: 'Lokasi', type: 'text', default: 'Jakarta, Indonesia' },
      {
        name: 'employmentType',
        label: 'Jenis kerja',
        type: 'select',
        default: 'FULL_TIME',
        options: [
          ['FULL_TIME', 'Penuh waktu'],
          ['PART_TIME', 'Paruh waktu'],
          ['CONTRACTOR', 'Kontrak'],
          ['INTERN', 'Magang'],
        ],
      },
      { name: 'remote', label: 'Bisa remote', type: 'checkbox' },
      { name: 'summary', label: 'Ringkasan', type: 'textarea', required: true },
      { name: 'body', label: 'Deskripsi lengkap', type: 'markdown' },
      { name: 'validThrough', label: 'Ditutup pada', type: 'date' },
      { name: 'published', label: 'Tayang di situs', type: 'checkbox', default: true },
      ...image,
      ...seo,
    ],
  },
};

export const settingsFields = [
  { name: 'announcement', label: 'Pengumuman di atas header', type: 'text', group: 'Beranda', hint: 'Kosongkan untuk menyembunyikan.' },
  { name: 'heroTitle', label: 'Judul hero', type: 'textarea', group: 'Beranda', hint: 'Setiap baris baru tampil sebagai satu baris animasi. Kosongkan untuk default.' },
  { name: 'heroLead', label: 'Paragraf hero', type: 'textarea', group: 'Beranda' },
  { name: 'email', label: 'Email utama', type: 'text', group: 'Kontak' },
  { name: 'careersEmail', label: 'Email karier', type: 'text', group: 'Kontak' },
  { name: 'phone', label: 'Telepon', type: 'text', group: 'Kontak' },
  { name: 'whatsapp', label: 'Nomor WhatsApp', type: 'text', group: 'Kontak', hint: 'Format internasional tanpa +, mis. 6281200001234.' },
  { name: 'hours', label: 'Jam kerja', type: 'text', group: 'Kontak' },
  { name: 'street', label: 'Alamat jalan', type: 'text', group: 'Alamat' },
  { name: 'locality', label: 'Kota', type: 'text', group: 'Alamat' },
  { name: 'region', label: 'Provinsi', type: 'text', group: 'Alamat' },
  { name: 'postalCode', label: 'Kode pos', type: 'text', group: 'Alamat' },
  { name: 'linkedin', label: 'LinkedIn', type: 'text', group: 'Media sosial' },
  { name: 'instagram', label: 'Instagram', type: 'text', group: 'Media sosial' },
  { name: 'github', label: 'GitHub', type: 'text', group: 'Media sosial' },
];
