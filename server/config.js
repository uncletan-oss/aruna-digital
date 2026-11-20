import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  console.error('[config] JWT_SECRET wajib diisi (minimal 32 karakter) di production.');
  process.exit(1);
}

export const config = {
  isProd,
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aruna_digital',
  siteUrl: (process.env.SITE_URL || 'https://aruna-digital.com').replace(/\/$/, ''),
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me-dev-only-secret',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  // Untuk ekspor statis (GitHub Pages) di sub-path, mis. /aruna-digital/
  basePath: (process.env.BASE_PATH || '/').replace(/\/$/, ''),
  staticExport: process.env.STATIC_EXPORT === '1',
  gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
};
