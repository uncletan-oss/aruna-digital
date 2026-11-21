import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { Service, Project, Post, Job, Message, Subscriber, User, Setting, Product, Member, Faq, renderMarkdown } from '../models.js';
import { clearSeoCache } from './seo.js';

const router = Router();
const COOKIE = 'ad_session';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.' },
});

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: 'Sesi berakhir. Silakan masuk lagi.' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Sesi berakhir. Silakan masuk lagi.' });
  }
}

function requireOwner(req, res, next) {
  if (req.user?.role !== 'owner') return res.status(403).json({ error: 'Hanya owner yang dapat melakukan tindakan ini.' });
  next();
}

// Semua request admin wajib JSON — mencegah CSRF via form HTML biasa.
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type harus application/json.' });
  }
  next();
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    const password = String(req.body?.password || '');
    const user = await User.findOne({ email }).select('+passwordHash');
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    user.lastLoginAt = new Date();
    await user.save();
    const token = jwt.sign({ sub: String(user._id), email: user.email, name: user.name, role: user.role || 'owner' }, config.jwtSecret, {
      expiresIn: '8h',
    });
    res.cookie(COOKIE, token, {
      httpOnly: true,
      secure: config.isProd,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/',
    });
    res.json({ email: user.email, name: user.name, role: user.role || 'owner' });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => res.json({ email: req.user.email, name: req.user.name, role: req.user.role }));

router.use(requireAuth);

router.post('/password', async (req, res, next) => {
  try {
    const { current, next: nextPw } = req.body || {};
    if (typeof nextPw !== 'string' || nextPw.length < 10)
      return res.status(422).json({ error: 'Kata sandi baru minimal 10 karakter.' });
    const user = await User.findById(req.user.sub).select('+passwordHash');
    if (!user || !(await bcrypt.compare(String(current || ''), user.passwordHash)))
      return res.status(401).json({ error: 'Kata sandi saat ini salah.' });
    user.passwordHash = await bcrypt.hash(nextPw, 12);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [services, projects, posts, jobs, unread, messages, subscribers, products, team] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Post.countDocuments(),
      Job.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.countDocuments(),
      Subscriber.countDocuments(),
      Product.countDocuments(),
      Member.countDocuments(),
    ]);
    res.json({ services, projects, posts, jobs, unread, messages, subscribers, products, team });
  } catch (e) {
    next(e);
  }
});

/* ---------- CRUD generik untuk konten ---------- */
const resources = {
  services: { model: Service, sort: { order: 1 } },
  projects: { model: Project, sort: { order: 1, year: -1 } },
  posts: { model: Post, sort: { publishedAt: -1 } },
  jobs: { model: Job, sort: { createdAt: -1 } },
  products: { model: Product, sort: { order: 1 } },
  team: { model: Member, sort: { leadership: -1, order: 1 } },
  faqs: { model: Faq, sort: { category: 1, order: 1 } },
};
const BLOCKED = ['_id', '__v', 'createdAt', 'updatedAt', 'bodyHtml', 'readingMinutes'];
const clean = (body = {}) => Object.fromEntries(Object.entries(body).filter(([k]) => !BLOCKED.includes(k)));

function handleError(e, res, next) {
  if (e?.code === 11000) return res.status(409).json({ error: 'Slug sudah dipakai. Gunakan slug lain.' });
  if (e?.name === 'ValidationError') {
    const fields = Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v.message]));
    return res.status(422).json({ error: 'Periksa kembali isian yang ditandai.', fields });
  }
  if (e?.name === 'CastError') return res.status(404).json({ error: 'Data tidak ditemukan.' });
  next(e);
}

// Setiap perubahan konten mengosongkan cache sitemap & RSS.
router.use('/content', (req, res, next) => {
  if (req.method !== 'GET') res.on('finish', clearSeoCache);
  next();
});

router.param('resource', (req, res, next, name) => {
  req.resource = resources[name];
  if (!req.resource) return res.status(404).json({ error: 'Jenis konten tidak dikenal.' });
  next();
});

router.get('/content/:resource', async (req, res, next) => {
  try {
    const items = await req.resource.model.find().sort(req.resource.sort).select('-body -bodyHtml').lean();
    res.json(items);
  } catch (e) {
    handleError(e, res, next);
  }
});

router.get('/content/:resource/:id', async (req, res, next) => {
  try {
    const item = await req.resource.model.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: 'Data tidak ditemukan.' });
    res.json(item);
  } catch (e) {
    handleError(e, res, next);
  }
});

router.post('/content/:resource', async (req, res, next) => {
  try {
    const item = await req.resource.model.create(clean(req.body));
    res.status(201).json(item);
  } catch (e) {
    handleError(e, res, next);
  }
});

router.put('/content/:resource/:id', async (req, res, next) => {
  try {
    const item = await req.resource.model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Data tidak ditemukan.' });
    item.set(clean(req.body));
    await item.save();
    res.json(item);
  } catch (e) {
    handleError(e, res, next);
  }
});

router.delete('/content/:resource/:id', async (req, res, next) => {
  try {
    await req.resource.model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    handleError(e, res, next);
  }
});

/* ---------- Pesan masuk ---------- */
router.get('/messages', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.kind) filter.kind = String(req.query.kind);
    if (req.query.unread === '1') filter.read = false;
    res.json(await Message.find(filter).sort({ createdAt: -1 }).limit(500).lean());
  } catch (e) {
    next(e);
  }
});

router.patch('/messages/:id', async (req, res, next) => {
  try {
    const item = await Message.findByIdAndUpdate(req.params.id, { read: !!req.body?.read }, { new: true }).lean();
    if (!item) return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
    res.json(item);
  } catch (e) {
    handleError(e, res, next);
  }
});

router.delete('/messages/:id', async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    handleError(e, res, next);
  }
});

/* ---------- Pratinjau markdown ---------- */
router.post('/preview', (req, res) => {
  res.json({ html: renderMarkdown(String(req.body?.markdown || '').slice(0, 100000)) });
});

/* ---------- Pengaturan situs ---------- */
const SETTING_KEYS = [
  'heroTitle', 'heroLead', 'email', 'careersEmail', 'phone', 'whatsapp', 'hours',
  'street', 'locality', 'region', 'postalCode', 'linkedin', 'instagram', 'github', 'announcement',
];

router.get('/settings', async (_req, res, next) => {
  try {
    res.json((await Setting.findOne({ key: 'site' }).lean()) || {});
  } catch (e) {
    next(e);
  }
});

router.put('/settings', requireOwner, async (req, res, next) => {
  try {
    const update = {};
    for (const k of SETTING_KEYS) if (typeof req.body?.[k] === 'string') update[k] = req.body[k].trim();
    const doc = await Setting.findOneAndUpdate(
      { key: 'site' },
      { $set: update },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(doc);
  } catch (e) {
    handleError(e, res, next);
  }
});

/* ---------- Manajemen akun admin (khusus owner) ---------- */
router.get('/users', requireOwner, async (_req, res, next) => {
  try {
    res.json(await User.find().sort({ createdAt: 1 }).lean());
  } catch (e) {
    next(e);
  }
});

router.post('/users', requireOwner, async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const role = req.body?.role === 'owner' ? 'owner' : 'editor';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(422).json({ error: 'Email tidak valid.', fields: { email: 'Masukkan email yang valid.' } });
    if (password.length < 10) return res.status(422).json({ error: 'Kata sandi terlalu pendek.', fields: { password: 'Minimal 10 karakter.' } });
    const user = await User.create({ email, role, name: String(req.body?.name || '').trim() || email.split('@')[0], passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ _id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Email ini sudah terdaftar sebagai admin.' });
    handleError(e, res, next);
  }
});

router.delete('/users/:id', requireOwner, async (req, res, next) => {
  try {
    if (req.params.id === req.user.sub) return res.status(400).json({ error: 'Anda tidak bisa menghapus akun sendiri.' });
    const owners = await User.countDocuments({ role: 'owner' });
    const target = await User.findById(req.params.id).lean();
    if (!target) return res.status(404).json({ error: 'Akun tidak ditemukan.' });
    if (target.role === 'owner' && owners <= 1) return res.status(400).json({ error: 'Harus ada minimal satu owner.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    handleError(e, res, next);
  }
});

/* ---------- Pelanggan newsletter ---------- */
router.get('/subscribers', async (req, res, next) => {
  try {
    const items = await Subscriber.find().sort({ createdAt: -1 }).lean();
    if (req.query.format === 'csv') {
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="subscribers.csv"');
      return res.send('email,tanggal\n' + items.map((s) => `${s.email},${s.createdAt.toISOString()}`).join('\n'));
    }
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.delete('/subscribers/:id', async (req, res, next) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    handleError(e, res, next);
  }
});

export default router;
