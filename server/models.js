import mongoose from 'mongoose';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const { Schema, model } = mongoose;

/** Ubah markdown menjadi HTML yang sudah disanitasi. */
export function renderMarkdown(md = '') {
  const html = marked.parse(md, { gfm: true, breaks: false });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'figure', 'figcaption']),
    allowedAttributes: {
      a: ['href', 'title', 'rel', 'target'],
      img: ['src', 'alt', 'title', 'loading', 'width', 'height'],
      code: ['class'],
    },
    transformTags: {
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }),
    },
  });
}

export function slugify(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const slugField = { type: String, required: true, unique: true, index: true, trim: true, lowercase: true };

function withSlug(schema, from = 'title') {
  schema.pre('validate', function setSlug(next) {
    if (!this.slug && this[from]) this.slug = slugify(this[from]);
    else if (this.slug) this.slug = slugify(this.slug);
    next();
  });
}

function withMarkdown(schema, src = 'body', out = 'bodyHtml') {
  schema.pre('save', function md(next) {
    if (this.isModified(src)) this[out] = renderMarkdown(this[src] || '');
    next();
  });
}

/** Foto sampul (URL, mis. dari Unsplash) + teks alternatif + kredit fotografer. */
const imageFields = {
  image: { type: String, trim: true, maxlength: 500, match: [/^(https:\/\/|\/)\S+$/, 'URL gambar harus diawali https:// atau /'] },
  imageAlt: { type: String, trim: true, maxlength: 200 },
  imageCredit: { type: String, trim: true, maxlength: 120 },
};

const seoFields = {
  seoTitle: { type: String, trim: true, maxlength: 70 },
  seoDescription: { type: String, trim: true, maxlength: 170 },
};

/* ---------- Layanan ---------- */
const ServiceSchema = new Schema(
  {
    slug: slugField,
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    bodyHtml: { type: String, default: '' },
    deliverables: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    ...imageFields,
    ...seoFields,
  },
  { timestamps: true }
);
withSlug(ServiceSchema);
withMarkdown(ServiceSchema);

/* ---------- Portofolio / studi kasus ---------- */
const ProjectSchema = new Schema(
  {
    slug: slugField,
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    year: { type: Number },
    services: [{ type: String, trim: true }],
    summary: { type: String, required: true, trim: true },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    body: { type: String, default: '' },
    bodyHtml: { type: String, default: '' },
    results: [{ value: String, label: String }],
    accent: { type: String, default: '#3B4CCA', match: /^#[0-9a-fA-F]{6}$/ },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    ...imageFields,
    ...seoFields,
  },
  { timestamps: true }
);
withSlug(ProjectSchema);
withMarkdown(ProjectSchema);

/* ---------- Artikel / wawasan ---------- */
const PostSchema = new Schema(
  {
    slug: slugField,
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    body: { type: String, default: '' },
    bodyHtml: { type: String, default: '' },
    author: { type: String, default: 'Tim Aruna Digital', trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    readingMinutes: { type: Number, default: 1 },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    ...imageFields,
    ...seoFields,
  },
  { timestamps: true }
);
withSlug(PostSchema);
withMarkdown(PostSchema);
PostSchema.pre('save', function rt(next) {
  if (this.isModified('body')) {
    const words = (this.body || '').split(/\s+/).filter(Boolean).length;
    this.readingMinutes = Math.max(1, Math.round(words / 200));
  }
  next();
});
PostSchema.index({ title: 'text', excerpt: 'text', body: 'text' });

/* ---------- Lowongan ---------- */
const JobSchema = new Schema(
  {
    slug: slugField,
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    location: { type: String, default: 'Jakarta, Indonesia', trim: true },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'],
      default: 'FULL_TIME',
    },
    remote: { type: Boolean, default: false },
    summary: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    bodyHtml: { type: String, default: '' },
    published: { type: Boolean, default: true },
    validThrough: { type: Date },
    ...imageFields,
    ...seoFields,
  },
  { timestamps: true }
);
withSlug(JobSchema);
withMarkdown(JobSchema);


/* ---------- Produk milik Aruna (dengan catatan rilis) ---------- */
const ReleaseSchema = new Schema(
  {
    version: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    notes: [{ type: String, trim: true }],
  },
  { _id: false }
);
const ProductSchema = new Schema(
  {
    slug: slugField,
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    tagline: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    status: { type: String, enum: ['GA', 'BETA', 'SEGERA'], default: 'GA' },
    summary: { type: String, required: true, trim: true },
    features: [{ type: String, trim: true }],
    body: { type: String, default: '' },
    bodyHtml: { type: String, default: '' },
    releases: [ReleaseSchema],
    accent: { type: String, default: '#2E4BD8', match: /^#[0-9a-fA-F]{6}$/ },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    ...imageFields,
    ...seoFields,
  },
  { timestamps: true }
);
ProductSchema.pre('validate', function nameAsTitle(next) {
  this.title = this.name;
  next();
});
withSlug(ProductSchema, 'name');
withMarkdown(ProductSchema);
ProductSchema.pre('save', function sortReleases(next) {
  if (this.isModified('releases')) this.releases.sort((a, b) => new Date(b.date) - new Date(a.date));
  next();
});

/* ---------- Anggota tim ---------- */
const MemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 400 },
    photo: { type: String, trim: true, maxlength: 500 },
    linkedin: { type: String, trim: true },
    leadership: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
MemberSchema.pre('validate', function nameAsTitle(next) {
  this.title = this.name;
  next();
});

/* ---------- FAQ ---------- */
const FaqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: 'Umum' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
FaqSchema.pre('validate', function qAsTitle(next) {
  this.title = this.question;
  next();
});

/* ---------- Pesan masuk (kontak & lamaran) ---------- */
const MessageSchema = new Schema(
  {
    kind: { type: String, enum: ['contact', 'application'], default: 'contact', index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 160 },
    topic: { type: String, trim: true, maxlength: 120 },
    budget: { type: String, trim: true, maxlength: 60 },
    jobSlug: { type: String, trim: true },
    link: { type: String, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    read: { type: Boolean, default: false, index: true },
    ip: { type: String, select: false },
  },
  { timestamps: true }
);

/* ---------- Newsletter ---------- */
const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

/* ---------- Pengaturan situs (satu dokumen, key = "site") ---------- */
const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    heroTitle: { type: String, trim: true, maxlength: 140 },
    heroLead: { type: String, trim: true, maxlength: 400 },
    email: { type: String, trim: true },
    careersEmail: { type: String, trim: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    hours: { type: String, trim: true },
    street: { type: String, trim: true },
    locality: { type: String, trim: true },
    region: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true },
    github: { type: String, trim: true },
    announcement: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

/* ---------- Admin ---------- */
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: 'Admin' },
    role: { type: String, enum: ['owner', 'editor'], default: 'owner' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const Service = model('Service', ServiceSchema);
export const Project = model('Project', ProjectSchema);
export const Post = model('Post', PostSchema);
export const Job = model('Job', JobSchema);
export const Message = model('Message', MessageSchema);
export const Subscriber = model('Subscriber', SubscriberSchema);
export const User = model('User', UserSchema);
export const Setting = model('Setting', SettingSchema);
export const Product = model('Product', ProductSchema);
export const Member = model('Member', MemberSchema);
export const Faq = model('Faq', FaqSchema);
