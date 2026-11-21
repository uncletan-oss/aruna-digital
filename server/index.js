import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { connectDB, dbReady } from './db.js';
import { User } from './models.js';
import publicApi from './routes/public-api.js';
import adminApi from './routes/admin-api.js';
import seoRoutes from './routes/seo.js';
import { resolveApi } from './content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function ensureAdmin() {
  if (!config.adminEmail || !config.adminPassword) return;
  const exists = await User.exists({ email: config.adminEmail.toLowerCase() });
  if (exists) return;
  await User.create({
    email: config.adminEmail,
    name: 'Administrator',
    passwordHash: await bcrypt.hash(config.adminPassword, 12),
  });
  console.log(`[auth] Akun admin dibuat: ${config.adminEmail}`);
}

const serialize = (data) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

async function createServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true); // Cloud Run berada di belakang Google Front End

  // Redirect www → apex & paksa HTTPS (hanya di production, berdasarkan header GFE)
  if (config.isProd) {
    const canonicalHost = new URL(config.siteUrl).host;
    app.use((req, res, next) => {
      const host = req.headers.host || '';
      if (host.startsWith('www.') && host.slice(4) === canonicalHost) {
        return res.redirect(301, `${config.siteUrl}${req.originalUrl}`);
      }
      next();
    });
  }

  app.use(
    helmet({
      // CSP hanya di production: Vite dev server butuh inline script untuk hot reload.
      contentSecurityPolicy: !config.isProd
        ? false
        : {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", 'https://www.googletagmanager.com'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'font-src': ["'self'", 'data:'],
          'img-src': ["'self'", 'data:', 'https:'],
          'connect-src': ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com', ...(config.isProd ? [] : ['ws:'])],
          'frame-src': ['https://www.google.com'],
          'upgrade-insecure-requests': config.isProd ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      strictTransportSecurity: config.isProd ? { maxAge: 63072000, includeSubDomains: true, preload: true } : false,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/healthz', (_req, res) => res.status(dbReady() ? 200 : 503).json({ ok: dbReady() }));

  app.use(seoRoutes);
  app.use('/api/admin', adminApi);
  app.use('/api', publicApi);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }));

  /* ---------- Frontend (SSR) ---------- */
  let vite;
  let getRenderer;
  let getTemplate;

  if (!config.isProd) {
    const { createServer: createVite } = await import('vite');
    vite = await createVite({ root, server: { middlewareMode: true }, appType: 'custom' });
    app.use(vite.middlewares);
    // Dev: muat CSS lebih awal agar tidak ada kilasan halaman tanpa style sebelum JS jalan.
    getTemplate = async (url) =>
      vite.transformIndexHtml(
        url,
        (await fs.readFile(path.join(root, 'index.html'), 'utf-8')).replace(
          '<!--app-head-->',
          '<link rel="stylesheet" href="/src/styles/global.css" />\n    <!--app-head-->'
        )
      );
    getRenderer = () => vite.ssrLoadModule('/src/entry-server.jsx');
  } else {
    const clientDir = path.join(root, 'dist/client');
    app.use(
      '/assets',
      express.static(path.join(clientDir, 'assets'), { immutable: true, maxAge: '1y', index: false })
    );
    app.use(express.static(clientDir, { index: false, maxAge: '1d' }));
    const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf-8');
    const renderer = await import(path.join(root, 'dist/server/entry-server.js'));
    getTemplate = async () => template;
    getRenderer = async () => renderer;
  }

  app.get('*', async (req, res) => {
    const url = req.originalUrl;
    try {
      const template = await getTemplate(url);
      const { render, planRoute } = await getRenderer();
      const plan = planRoute(url);

      // Muat semua data yang dibutuhkan rute ini langsung dari MongoDB.
      const initialData = {};
      let notFound = !plan.matched;
      if (!plan.private) initialData['/api/settings'] = (await resolveApi('/api/settings')).data;
      await Promise.all(
        plan.dataUrls.map(async (u) => {
          const { found, data } = await resolveApi(u);
          initialData[u] = found ? data : null;
          if (!found) notFound = true;
        })
      );

      const renderOpts = {
        siteUrl: config.siteUrl,
        gaId: config.gaMeasurementId,
        basename: config.basePath,
        static: config.staticExport,
      };
      const { html, helmet: h } = render(url, initialData, renderOpts);

      const head = [
        h.title.toString(),
        h.priority.toString(),
        h.meta.toString(),
        h.link.toString(),
        h.script.toString(),
        config.googleSiteVerification
          ? `<meta name="google-site-verification" content="${config.googleSiteVerification}">`
          : '',
        config.gaMeasurementId ? `<meta name="ga-id" content="${config.gaMeasurementId}">` : '',
      ].join('\n    ');

      const page = template
        .replace('<html lang="id">', `<html ${h.htmlAttributes.toString() || 'lang="id"'}>`)
        .replace('<!--app-head-->', head)
        .replace('<!--app-html-->', html)
        .replace(
          '<!--app-data-->',
          `<script id="__DATA__" type="application/json">${serialize({
            data: initialData,
            opts: renderOpts,
          })}</script>`
        );

      res
        .status(notFound ? 404 : 200)
        .set('Content-Type', 'text/html; charset=utf-8')
        .set('Cache-Control', plan.private ? 'no-store' : 'public, max-age=0, s-maxage=60, must-revalidate')
        .send(page);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.error('[ssr]', e);
      res
        .status(500)
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(
          '<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
            '<title>Gangguan sementara — Aruna Digital</title><body style="font-family:system-ui;padding:3rem;max-width:40rem">' +
            '<h1>Halaman tidak dapat dimuat</h1><p>Server sedang mengalami gangguan. Muat ulang halaman dalam beberapa saat, ' +
            'atau hubungi kami di <a href="mailto:halo@aruna-digital.com">halo@aruna-digital.com</a>.</p></body></html>'
        );
    }
  });

  // Penanganan error API
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('[api]', err);
    res.status(500).json({ error: 'Terjadi kesalahan di server. Coba lagi sebentar lagi.' });
  });

  return app;
}

async function main() {
  await connectDB();
  await ensureAdmin();
  const app = await createServer();
  const server = app.listen(config.port, () => {
    console.log(`[web] Berjalan di http://localhost:${config.port} (${config.isProd ? 'production' : 'development'})`);
  });
  const shutdown = (sig) => {
    console.log(`[web] ${sig} diterima, menutup server...`);
    server.close(async () => {
      const { default: mongoose } = await import('mongoose');
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 9000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((e) => {
  console.error('[fatal]', e);
  process.exit(1);
});
