/**
 * Ekspor statis untuk GitHub Pages.
 *
 * Prasyarat: server production sedang berjalan (NODE_ENV=production, STATIC_EXPORT=1,
 * BASE_PATH & SITE_URL sesuai alamat Pages) dan database sudah berisi konten.
 * Script ini merayapi server, menyimpan HTML hasil SSR setiap halaman, data API
 * sebagai JSON, serta sitemap/robots/rss, lalu menggabungkannya dengan aset build.
 *
 *   node scripts/export-static.mjs [--origin http://localhost:8080] [--out out]
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, v, i, a) => (v.startsWith('--') ? [...acc, [v.slice(2), a[i + 1]]] : acc), [])
);
const ORIGIN = args.origin || 'http://localhost:8080';
const OUT = path.resolve(args.out || 'out');
const SITE_URL = (process.env.SITE_URL || 'https://aruna-digital.com').replace(/\/$/, '');
const CNAME = process.env.CUSTOM_DOMAIN || '';

// Harus sama dengan staticDataFile() di src/lib/data.jsx
const dataFile = (url) =>
  `data/${url.replace(/^\/api\//, '').replace(/[^a-z0-9]+/gi, '_').replace(/_$/, '') || 'index'}.json`;

async function get(p, { allow404 = false } = {}) {
  const r = await fetch(ORIGIN + p);
  if (!r.ok && !(allow404 && r.status === 404)) throw new Error(`${p} → HTTP ${r.status}`);
  return r;
}
async function write(rel, content) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  // 1. Aset hasil build (JS, CSS, font, gambar). index.html mentah dibuang.
  await fs.cp(path.resolve('dist/client'), OUT, { recursive: true });
  await fs.rm(path.join(OUT, 'index.html'), { force: true });

  // 2. File SEO
  for (const f of ['sitemap.xml', 'robots.txt', 'rss.xml', 'site.webmanifest']) {
    await write(f, await (await get(`/${f}`)).text());
  }

  // 3. Halaman: semua URL di sitemap
  const sitemap = await (await get('/sitemap.xml')).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const p = m[1].replace(SITE_URL, '') || '/';
    return p.startsWith('/') ? p : `/${p}`;
  });
  const pageHtml = [];
  for (const p of pages) {
    const html = await (await get(p)).text();
    pageHtml.push(html);
    // /layanan → layanan.html: GitHub Pages melayaninya tanpa ekstensi & tanpa redirect garis miring
    await write(p === '/' ? 'index.html' : `${p.slice(1)}.html`, html);
  }
  // /admin: tampilkan pemberitahuan bahwa CMS hanya aktif di Cloud Run (noindex)
  await write('admin.html', await (await get('/admin')).text());
  await write('404.html', await (await get('/__halaman-tidak-ada__', { allow404: true })).text());

  // 4. Data JSON untuk navigasi di browser
  const apiUrls = new Set(['/api/settings', '/api/home', '/api/services', '/api/projects', '/api/posts', '/api/jobs']);
  const posts = await (await get('/api/posts')).json();
  for (const t of posts.tags || []) {
    apiUrls.add(`/api/posts?tag=${encodeURIComponent(t)}`);
    const first = await (await get(`/api/posts?tag=${encodeURIComponent(t)}`)).json();
    for (let n = 2; n <= first.pages; n++) apiUrls.add(`/api/posts?tag=${encodeURIComponent(t)}&page=${n}`);
  }
  for (let n = 2; n <= (posts.pages || 1); n++) apiUrls.add(`/api/posts?page=${n}`);
  for (const p of pages) {
    const m = p.match(/^\/(layanan|portofolio|wawasan|karier)\/([a-z0-9-]+)$/);
    if (m) apiUrls.add(`/api/${{ layanan: 'services', portofolio: 'projects', wawasan: 'posts', karier: 'jobs' }[m[1]]}/${m[2]}`);
  }
  for (const u of apiUrls) await write(dataFile(u), await (await get(u)).text());

  // 5. Cek semua foto Unsplash yang dipakai masih bisa diakses (peringatan di GitHub Actions)
  const notFoundHtml = await (await get('/__halaman-tidak-ada__', { allow404: true })).text();
  const all = [...pageHtml, notFoundHtml].join(' ');
  const photos = [...new Set(all.match(/https:\/\/images\.unsplash\.com\/photo-[\w-]+/g) || [])];
  let broken = 0;
  for (const src of photos) {
    const r = await fetch(`${src}?w=16`, { method: 'HEAD' }).catch(() => null);
    if (!r || !r.ok) {
      broken++;
      console.log(`::warning title=Foto tidak dapat dimuat::${src} (HTTP ${r ? r.status : 'gagal'})`);
    }
  }
  console.log(`[export] cek foto: ${photos.length - broken}/${photos.length} OK`);

  // 6. GitHub Pages: matikan Jekyll, domain kustom opsional
  await write('.nojekyll', '');
  if (CNAME) await write('CNAME', CNAME + '\n');

  console.log(`[export] ${pages.length} halaman, ${apiUrls.size} file data → ${OUT}`);
}

main().catch((e) => {
  console.error('[export] gagal:', e.message);
  process.exit(1);
});
