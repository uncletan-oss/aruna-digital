import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { resolveApi } from '../content.js';
import { Message, Subscriber, Job } from '../models.js';

const router = Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak pengiriman. Coba lagi dalam 15 menit.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function validateContact(body) {
  const data = {
    name: str(body.name, 120),
    email: str(body.email, 160).toLowerCase(),
    phone: str(body.phone, 40),
    company: str(body.company, 160),
    topic: str(body.topic, 120),
    budget: str(body.budget, 60),
    link: str(body.link, 300),
    message: str(body.message, 5000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Tulis nama Anda.';
  if (!EMAIL_RE.test(data.email)) errors.email = 'Masukkan alamat email yang valid, mis. nama@perusahaan.com.';
  if (data.message.length < 10) errors.message = 'Ceritakan sedikit lebih banyak (minimal 10 karakter).';
  return { data, errors };
}

// Honeypot: field "website" harus kosong. Bot biasanya mengisinya.
const isBot = (body) => typeof body.website === 'string' && body.website.length > 0;

router.post('/contact', formLimiter, async (req, res, next) => {
  try {
    if (isBot(req.body)) return res.status(201).json({ ok: true });
    const { data, errors } = validateContact(req.body || {});
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Periksa kembali isian formulir.', fields: errors });
    await Message.create({ ...data, kind: 'contact', ip: req.ip });
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/jobs/:slug/apply', formLimiter, async (req, res, next) => {
  try {
    if (isBot(req.body)) return res.status(201).json({ ok: true });
    const job = await Job.findOne({ slug: req.params.slug, published: true }).select('slug title').lean();
    if (!job) return res.status(404).json({ error: 'Lowongan ini sudah ditutup.' });
    const { data, errors } = validateContact(req.body || {});
    if (!/^https?:\/\//i.test(data.link)) errors.link = 'Sertakan tautan CV atau portofolio (diawali https://).';
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Periksa kembali isian formulir.', fields: errors });
    await Message.create({ ...data, kind: 'application', jobSlug: job.slug, topic: `Lamaran: ${job.title}`, ip: req.ip });
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/subscribe', formLimiter, async (req, res, next) => {
  try {
    const email = str(req.body?.email, 160).toLowerCase();
    if (!EMAIL_RE.test(email)) return res.status(422).json({ error: 'Masukkan alamat email yang valid.' });
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Semua GET konten publik diteruskan ke tabel resolver yang sama dengan SSR.
router.get('/*', async (req, res, next) => {
  try {
    const { found, data } = await resolveApi(req.originalUrl);
    if (!found) return res.status(404).json({ error: 'Konten tidak ditemukan.' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
