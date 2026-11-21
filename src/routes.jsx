import { matchRoutes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import About from './pages/About.jsx';
import Posts from './pages/Posts.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Careers from './pages/Careers.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Team from './pages/Team.jsx';
import Faq from './pages/Faq.jsx';
import AdminGate from './admin/AdminGate.jsx';

const qs = (search, allowed) => {
  const p = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const k of allowed) if (p.get(k)) out.set(k, p.get(k));
  const s = out.toString();
  return s ? `?${s}` : '';
};

/**
 * Setiap rute bisa punya `data({ params, search })` yang mengembalikan URL API.
 * URL yang sama dipakai SSR (diambil langsung dari MongoDB) dan browser (fetch).
 */
export const routes = [
  { path: '/', Component: Home, data: () => '/api/home' },
  { path: '/layanan', Component: Services, data: () => '/api/services' },
  { path: '/layanan/:slug', Component: ServiceDetail, data: ({ params }) => `/api/services/${params.slug}` },
  { path: '/portofolio', Component: Projects, data: () => '/api/projects' },
  { path: '/portofolio/:slug', Component: ProjectDetail, data: ({ params }) => `/api/projects/${params.slug}` },
  { path: '/produk', Component: Products, data: () => '/api/products' },
  { path: '/produk/:slug', Component: ProductDetail, data: ({ params }) => `/api/products/${params.slug}` },
  { path: '/tim', Component: Team, data: () => '/api/team' },
  { path: '/faq', Component: Faq, data: () => '/api/faqs' },
  { path: '/tentang', Component: About },
  {
    path: '/wawasan',
    Component: Posts,
    data: ({ search }) => `/api/posts${qs(search, ['tag', 'page'])}`,
  },
  { path: '/wawasan/:slug', Component: PostDetail, data: ({ params }) => `/api/posts/${params.slug}` },
  { path: '/karier', Component: Careers, data: () => '/api/jobs' },
  { path: '/karier/:slug', Component: JobDetail, data: ({ params }) => `/api/jobs/${params.slug}` },
  { path: '/kontak', Component: Contact, data: () => '/api/services' },
  { path: '/kebijakan-privasi', Component: Privacy },
  { path: '/admin/*', Component: AdminGate, private: true, bare: true },
];

const SLUG_OK = /^[a-z0-9-]+$/;

/** Dipakai server: tentukan rute & URL data yang perlu dimuat untuk sebuah URL. */
export function planRoute(url) {
  const u = new URL(url, 'http://local');
  const matches = matchRoutes(routes, u.pathname);
  if (!matches) return { matched: false, dataUrls: [], private: false };
  const { route, params } = matches[matches.length - 1];
  if (params.slug !== undefined && !SLUG_OK.test(params.slug)) return { matched: false, dataUrls: [], private: false };
  const dataUrl = route.data?.({ params, search: u.search });
  if (route.private) return { matched: true, dataUrls: [], private: true };
  return { matched: true, dataUrls: dataUrl ? [dataUrl] : [], private: false };
}
