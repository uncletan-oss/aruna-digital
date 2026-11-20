import { Router } from 'express';
import { config } from '../config.js';
import { Service, Project, Post, Job } from '../models.js';
import { site, staticPages } from '../../src/site.js';

const router = Router();
const xmlEscape = (s = '') =>
  String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
const iso = (d) => new Date(d || Date.now()).toISOString();

// Cache sederhana di memori — sitemap tidak perlu dihitung ulang tiap request.
const cache = new Map();
async function cached(key, ttlMs, build) {
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return hit.value;
  const value = await build();
  cache.set(key, { value, exp: Date.now() + ttlMs });
  return value;
}

router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').set('Cache-Control', 'public, max-age=86400').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${config.siteUrl}/sitemap.xml`,
      '',
    ].join('\n')
  );
});

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const xml = await cached('sitemap', 10 * 60 * 1000, async () => {
      const [services, projects, posts, jobs] = await Promise.all([
        Service.find({ published: true }).select('slug updatedAt').lean(),
        Project.find({ published: true }).select('slug updatedAt').lean(),
        Post.find({ published: true, publishedAt: { $lte: new Date() } }).select('slug updatedAt').lean(),
        Job.find({ published: true }).select('slug updatedAt').lean(),
      ]);
      const now = iso();
      const urls = [
        ...staticPages.map((p) => ({ loc: p.path, lastmod: now, changefreq: p.changefreq, priority: p.priority })),
        ...services.map((d) => ({ loc: `/layanan/${d.slug}`, lastmod: iso(d.updatedAt), changefreq: 'monthly', priority: 0.8 })),
        ...projects.map((d) => ({ loc: `/portofolio/${d.slug}`, lastmod: iso(d.updatedAt), changefreq: 'monthly', priority: 0.7 })),
        ...posts.map((d) => ({ loc: `/wawasan/${d.slug}`, lastmod: iso(d.updatedAt), changefreq: 'monthly', priority: 0.6 })),
        ...jobs.map((d) => ({ loc: `/karier/${d.slug}`, lastmod: iso(d.updatedAt), changefreq: 'weekly', priority: 0.5 })),
      ];
      return (
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls
          .map(
            (u) =>
              `  <url><loc>${xmlEscape(config.siteUrl + u.loc)}</loc><lastmod>${u.lastmod}</lastmod>` +
              `<changefreq>${u.changefreq}</changefreq><priority>${u.priority.toFixed(1)}</priority></url>`
          )
          .join('\n') +
        '\n</urlset>\n'
      );
    });
    res.type('application/xml').set('Cache-Control', 'public, max-age=600').send(xml);
  } catch (e) {
    next(e);
  }
});

router.get(['/rss.xml', '/wawasan/rss.xml'], async (_req, res, next) => {
  try {
    const xml = await cached('rss', 10 * 60 * 1000, async () => {
      const posts = await Post.find({ published: true, publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 })
        .limit(30)
        .select('slug title excerpt author publishedAt tags')
        .lean();
      const items = posts
        .map((p) => {
          const link = `${config.siteUrl}/wawasan/${p.slug}`;
          return [
            '    <item>',
            `      <title>${xmlEscape(p.title)}</title>`,
            `      <link>${link}</link>`,
            `      <guid isPermaLink="true">${link}</guid>`,
            `      <description>${xmlEscape(p.excerpt)}</description>`,
            `      <author>${xmlEscape(site.email)} (${xmlEscape(p.author)})</author>`,
            ...(p.tags || []).map((t) => `      <category>${xmlEscape(t)}</category>`),
            `      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>`,
            '    </item>',
          ].join('\n');
        })
        .join('\n');
      return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(site.name)} — Wawasan</title>
    <link>${config.siteUrl}/wawasan</link>
    <atom:link href="${config.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(site.description)}</description>
    <language>id</language>
${items}
  </channel>
</rss>
`;
    });
    res.type('application/rss+xml').set('Cache-Control', 'public, max-age=600').send(xml);
  } catch (e) {
    next(e);
  }
});

router.get('/site.webmanifest', (_req, res) => {
  res.type('application/manifest+json').set('Cache-Control', 'public, max-age=86400').json({
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: './',
    display: 'standalone',
    background_color: '#F1F2F6',
    theme_color: '#141A46',
    lang: 'id',
    icons: [
      { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  });
});

export function clearSeoCache() {
  cache.clear();
}

export default router;
