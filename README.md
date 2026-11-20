# Aruna Digital — website company + CMS

Website resmi **PT Aruna Bumi Digital** ([aruna-digital.com](https://aruna-digital.com)).
React (SSR) + Node.js/Express + MongoDB, dikemas satu container untuk **Google Cloud Run**.

## Fitur

**Situs publik**
- Beranda, Layanan (+ detail), Portofolio/studi kasus (+ filter industri & detail), Tentang, Wawasan/blog (+ topik, paginasi, detail), Karier (+ detail & formulir lamaran), Kontak, Kebijakan privasi, 404.
- Desain khas: cakrawala bertingkat dengan matahari terbit (*aruna* = fajar) yang tergambar saat halaman dibuka, transisi tirai antar-halaman, ilustrasi generatif per studi kasus (tanpa perlu upload gambar), indikator progres baca, menu seluler animasi. Menghormati `prefers-reduced-motion`.
- Font di-host sendiri (Fontsource) — tidak bergantung pada Google Fonts.

**SEO**
- **Server-side rendering** penuh: HTML lengkap (konten + meta) untuk setiap URL, data diambil langsung dari MongoDB; React lalu meng-hydrate.
- Title, meta description, canonical, `hreflang`, Open Graph, Twitter Card per halaman; bisa diubah per konten lewat CMS (judul & deskripsi SEO, dengan pratinjau hasil Google).
- JSON-LD: `Organization`, `WebSite`, `ProfessionalService`, `Service`, `CreativeWork`, `BlogPosting`, `JobPosting` (masuk Google Jobs), `ContactPage`, `BreadcrumbList`, `ItemList`.
- `/sitemap.xml` dinamis (dengan `lastmod`), `/robots.txt`, `/rss.xml`, `/site.webmanifest`, status HTTP 404 asli untuk halaman yang tidak ada, halaman filter/paginasi `noindex`.
- Opsional: Google Analytics 4 (`GA_MEASUREMENT_ID`) dan verifikasi Search Console (`GOOGLE_SITE_VERIFICATION`).

**CMS (`/admin`)**
- Login aman (bcrypt + JWT di cookie httpOnly, SameSite=Strict, rate limit).
- Ringkasan statistik, kotak masuk pesan kontak & lamaran (tandai dibaca, balas via email, hapus).
- Kelola Layanan, Portofolio, Wawasan, Karier: buat/ubah/hapus, tayang/draf, editor Markdown dengan toolbar + pratinjau, penjadwalan artikel (tanggal terbit di masa depan), pengaturan SEO.
- Pengaturan situs tanpa deploy ulang: teks hero, pengumuman, email, telepon, WhatsApp, alamat, media sosial.
- Newsletter (unduh CSV), manajemen akun admin dengan peran **Owner** / **Editor**, ganti kata sandi.

**Keamanan**: Helmet + CSP ketat, HSTS, sanitasi HTML Markdown, honeypot & rate limit di formulir publik, validasi input, cookie admin `Secure` di production.

## Struktur

```
server/            Express: API, CMS API, SSR, sitemap/robots/rss, model Mongoose, seed
  index.js         entry server (dev: Vite middleware, prod: dist/)
  content.js       fungsi baca konten — dipakai API & SSR
  routes/          public-api.js, admin-api.js, seo.js
src/               React
  site.js          identitas perusahaan & navigasi (default; bisa ditimpa dari CMS)
  routes.jsx       tabel rute + URL data per rute
  pages/           halaman publik
  components/      header, footer, transisi, SEO, formulir, dll.
  admin/           CMS (dimuat terpisah, hanya di browser)
public/            favicon, ikon, gambar Open Graph
Dockerfile, cloudbuild.yaml
```

## Menjalankan lokal

Butuh Node.js 20+ dan MongoDB (lokal atau Atlas).

```bash
cp .env.example .env        # isi MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed                # isi konten contoh (klien di seed adalah FIKTIF)
npm run dev                 # http://localhost:8080  •  CMS: /admin
```

Mode production lokal: `npm run build && JWT_SECRET=... npm start`.

`npm run seed:reset` menghapus lalu mengisi ulang layanan, portofolio, artikel, dan lowongan.

## Sementara: GitHub Pages (statis)

Workflow `.github/workflows/pages.yml` berjalan setiap push ke `main`. Workflow menyalakan MongoDB sementara di GitHub Actions, mengisi konten seed, merender semua halaman (SSR) ke HTML statis, lalu mempublikasikannya.

- Alamat: `https://uncletan-oss.github.io/aruna-digital/`
- Tetap lengkap: semua halaman, transisi, SEO (meta, JSON-LD, sitemap.xml, rss.xml).
- Tidak aktif di Pages: CMS `/admin` dan penyimpanan formulir. Formulir kontak & lamaran membuka aplikasi email pengunjung dengan pesan yang sudah terisi.
- Konten diambil dari `server/seed.js`; ubah file itu lalu push untuk memperbarui situs.
- Domain kustom: tambahkan variable repo `CUSTOM_DOMAIN=aruna-digital.com` (Settings → Secrets and variables → Actions → Variables), arahkan DNS ke GitHub Pages, lalu jalankan ulang workflow.

Uji ekspor statis secara lokal:
```bash
BASE_PATH=/aruna-digital/ SITE_URL=https://uncletan-oss.github.io/aruna-digital npm run build
BASE_PATH=/aruna-digital/ SITE_URL=https://uncletan-oss.github.io/aruna-digital NODE_ENV=production STATIC_EXPORT=1 JWT_SECRET=dev-dev-dev-dev-dev-dev-dev-dev-dev node server/index.js &
SITE_URL=https://uncletan-oss.github.io/aruna-digital node scripts/export-static.mjs --out out
```

## Deploy ke Cloud Run

1. **MongoDB Atlas**: buat cluster (region `asia-southeast2`/Jakarta bila tersedia), user database, dan izinkan akses jaringan (untuk awal `0.0.0.0/0`; lebih aman pakai VPC peering + Serverless VPC Access atau Private Endpoint).

2. **Siapkan project GCP**
   ```bash
   gcloud config set project PROJECT_ID
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
   gcloud artifacts repositories create web --repository-format=docker --location=asia-southeast2
   ```

3. **Simpan rahasia di Secret Manager**
   ```bash
   printf '%s' 'mongodb+srv://...'           | gcloud secrets create aruna-mongodb-uri --data-file=-
   openssl rand -base64 48 | tr -d '\n'       | gcloud secrets create aruna-jwt-secret --data-file=-
   printf '%s' 'admin@aruna-digital.com'      | gcloud secrets create aruna-admin-email --data-file=-
   printf '%s' 'KataSandiKuatAnda'            | gcloud secrets create aruna-admin-password --data-file=-
   ```
   Beri akses ke service account Cloud Run (default: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`) dengan peran `roles/secretmanager.secretAccessor`, dan beri service account Cloud Build peran `roles/run.admin` + `roles/iam.serviceAccountUser`.

4. **Build & deploy**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```
   Atau tanpa Cloud Build:
   ```bash
   gcloud run deploy aruna-digital-web --source . --region asia-southeast2 --allow-unauthenticated \
     --set-env-vars SITE_URL=https://aruna-digital.com \
     --set-secrets MONGODB_URI=aruna-mongodb-uri:latest,JWT_SECRET=aruna-jwt-secret:latest,ADMIN_EMAIL=aruna-admin-email:latest,ADMIN_PASSWORD=aruna-admin-password:latest
   ```

5. **Isi konten awal** (sekali): jalankan `npm run seed` dari laptop dengan `MONGODB_URI` mengarah ke Atlas, atau langsung tulis konten dari `/admin`. Akun owner dibuat otomatis dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` saat server pertama kali start.

6. **Domain**: hubungkan `aruna-digital.com` dan `www.aruna-digital.com` lewat Cloud Run domain mapping atau Load Balancer + Cloud CDN. Permintaan ke `www` otomatis di-redirect 301 ke domain utama.

7. **Search Console**: verifikasi domain, lalu kirim `https://aruna-digital.com/sitemap.xml`.

Health check: `GET /healthz` (200 bila MongoDB terhubung).

## Mengubah identitas perusahaan

- Nilai default (nama, alamat, kontak, sosial): `src/site.js`.
- Nilai yang sering berubah (hero, kontak, alamat, sosial, pengumuman): **CMS → Pengaturan situs**.
- Warna & tipografi: variabel di awal `src/styles/global.css`.
- Gambar Open Graph default: `public/og-default.png` (1200×630).

> Konten contoh dari `npm run seed` (klien, angka hasil, nama penulis, statistik di halaman Tentang) adalah fiktif. Ganti sebelum situs dipublikasikan.
