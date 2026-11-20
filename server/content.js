/**
 * Fungsi baca konten publik. Dipakai oleh REST API (/api/...) dan oleh SSR,
 * sehingga halaman yang dirender di server memakai data yang persis sama
 * dengan yang di-fetch browser saat navigasi.
 */
import { Service, Project, Post, Job, Setting } from './models.js';

const SETTING_FIELDS =
  'heroTitle heroLead email careersEmail phone whatsapp hours street locality region postalCode linkedin instagram github announcement';

const PUBLIC = { published: true };
const LIST_PROJECT = 'slug title client industry year services summary accent results featured';
const LIST_POST = 'slug title excerpt author tags readingMinutes publishedAt';
const PAGE_SIZE = 9;

const lean = (q) => q.lean({ virtuals: false });

export const content = {
  /** Pengaturan yang diubah lewat CMS. Kolom kosong → frontend memakai default di src/site.js. */
  async settings() {
    const s = await Setting.findOne({ key: 'site' }).select(SETTING_FIELDS).lean();
    const out = {};
    for (const k of SETTING_FIELDS.split(' ')) if (s?.[k]) out[k] = s[k];
    return out;
  },

  async home() {
    const [services, projects, posts, jobs] = await Promise.all([
      lean(Service.find(PUBLIC).sort({ order: 1 }).select('slug title summary').limit(6)),
      lean(Project.find(PUBLIC).sort({ featured: -1, order: 1, year: -1 }).select(LIST_PROJECT).limit(3)),
      lean(Post.find({ ...PUBLIC, publishedAt: { $lte: new Date() } }).sort({ publishedAt: -1 }).select(LIST_POST).limit(3)),
      Job.countDocuments(PUBLIC),
    ]);
    return { services, projects, posts, openJobs: jobs };
  },

  async services() {
    return lean(Service.find(PUBLIC).sort({ order: 1 }).select('slug title summary deliverables'));
  },

  async service({ slug }) {
    const service = await lean(Service.findOne({ ...PUBLIC, slug }));
    if (!service) return null;
    const [projects, others] = await Promise.all([
      lean(Project.find({ ...PUBLIC, services: service.title }).select(LIST_PROJECT).limit(3)),
      lean(Service.find({ ...PUBLIC, slug: { $ne: slug } }).sort({ order: 1 }).select('slug title')),
    ]);
    return { service, projects, others };
  },

  async projects(_params, query = {}) {
    const filter = { ...PUBLIC };
    if (query.industry) filter.industry = String(query.industry);
    const [items, industries] = await Promise.all([
      lean(Project.find(filter).sort({ featured: -1, order: 1, year: -1 }).select(LIST_PROJECT)),
      Project.distinct('industry', PUBLIC),
    ]);
    return { items, industries: industries.filter(Boolean).sort() };
  },

  async project({ slug }) {
    const project = await lean(Project.findOne({ ...PUBLIC, slug }));
    if (!project) return null;
    const all = await lean(Project.find(PUBLIC).sort({ featured: -1, order: 1, year: -1 }).select('slug title client accent'));
    const idx = all.findIndex((p) => p.slug === slug);
    const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
    return { project, next };
  },

  async posts(_params, query = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const filter = { ...PUBLIC, publishedAt: { $lte: new Date() } };
    if (query.tag) filter.tags = String(query.tag).toLowerCase();
    const [items, total, tags] = await Promise.all([
      lean(Post.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).select(LIST_POST)),
      Post.countDocuments(filter),
      Post.distinct('tags', PUBLIC),
    ]);
    return { items, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total, tags: tags.sort() };
  },

  async post({ slug }) {
    const post = await lean(Post.findOne({ ...PUBLIC, slug, publishedAt: { $lte: new Date() } }));
    if (!post) return null;
    const related = await lean(
      Post.find({ ...PUBLIC, slug: { $ne: slug }, tags: { $in: post.tags || [] }, publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 })
        .select(LIST_POST)
        .limit(2)
    );
    return { post, related };
  },

  async jobs() {
    return lean(Job.find(PUBLIC).sort({ createdAt: -1 }).select('slug title department location employmentType remote summary'));
  },

  async job({ slug }) {
    return lean(Job.findOne({ ...PUBLIC, slug }));
  },
};

/** Tabel rute API publik (GET) → fungsi konten. */
const table = [
  ['/api/settings', content.settings],
  ['/api/home', content.home],
  ['/api/services', content.services],
  ['/api/services/:slug', content.service],
  ['/api/projects', content.projects],
  ['/api/projects/:slug', content.project],
  ['/api/posts', content.posts],
  ['/api/posts/:slug', content.post],
  ['/api/jobs', content.jobs],
  ['/api/jobs/:slug', content.job],
].map(([pattern, fn]) => {
  const keys = [];
  const re = new RegExp(
    '^' + pattern.replace(/:([a-z]+)/g, (_m, k) => (keys.push(k), '([a-z0-9-]+)')) + '/?$'
  );
  return { pattern, re, keys, fn };
});

export const apiPatterns = table.map((t) => t.pattern);

/**
 * Resolve URL API (mis. "/api/posts?tag=cloud") langsung ke fungsi konten.
 * Return { found: boolean, data }.
 */
export async function resolveApi(url) {
  const u = new URL(url, 'http://local');
  for (const { re, keys, fn } of table) {
    const m = u.pathname.match(re);
    if (!m) continue;
    const params = Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
    const query = Object.fromEntries(u.searchParams.entries());
    const data = await fn(params, query);
    return { found: data !== null && data !== undefined, data };
  }
  return { found: false, data: null };
}
