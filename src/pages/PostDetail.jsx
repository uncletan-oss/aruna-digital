import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import { Breadcrumbs, Prose, PostRow, fmtDate, CtaBand } from '../components/ui.jsx';
import { useSiteOpts } from '../lib/data.jsx';
import Photo, { imageUrl } from '../components/Photo.jsx';
import { site } from '../site.js';

export default function PostDetail({ data }) {
  const { siteUrl } = useSiteOpts();
  const { post: p, related = [] } = data;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const crumbs = [
    { name: 'Wawasan', path: '/wawasan' },
    { name: p.title, path: `/wawasan/${p.slug}` },
  ];
  const url = `${siteUrl}/wawasan/${p.slug}`;

  return (
    <>
      <Seo
        title={p.seoTitle || p.title}
        description={p.seoDescription || p.excerpt}
        type="article"
        image={p.image ? imageUrl(p.image, 1200, 630) : undefined}
        published={p.publishedAt}
        modified={p.updatedAt}
        breadcrumbs={crumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt,
            datePublished: new Date(p.publishedAt).toISOString(),
            dateModified: new Date(p.updatedAt || p.publishedAt).toISOString(),
            author: { '@type': 'Person', name: p.author },
            publisher: {
              '@type': 'Organization',
              name: site.name,
              logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            image: p.image ? imageUrl(p.image, 1200, 630) : `${siteUrl}/og-default.png`,
            keywords: (p.tags || []).join(', '),
            inLanguage: 'id-ID',
            wordCount: (p.body || '').split(/\s+/).length,
          },
        ]}
      />
      <motion.div className="readbar" style={{ scaleX: progress }} aria-hidden="true" />

      <article className="article">
        <header className="wrap article__head">
          <Breadcrumbs items={crumbs} />
          <h1 className="article__title">{p.title}</h1>
          <p className="article__meta">
            <span>{p.author}</span>
            <time dateTime={new Date(p.publishedAt).toISOString()}>{fmtDate(p.publishedAt)}</time>
            <span>{p.readingMinutes} menit baca</span>
          </p>
        </header>
        {p.image && (
          <div className="wrap wide-photo">
            <Photo src={p.image} alt={p.imageAlt || ''} ratio={2} credit={p.imageCredit} seed={p.slug} priority />
          </div>
        )}
        <div className="wrap article__body">
          <p className="lead">{p.excerpt}</p>
          <Prose html={p.bodyHtml} />
          {p.tags?.length > 0 && (
            <ul className="taglist taglist--links" aria-label="Topik">
              {p.tags.map((t) => (
                <li key={t}>
                  <Link to={`/wawasan?tag=${encodeURIComponent(t)}`}>{t}</Link>
                </li>
              ))}
            </ul>
          )}
          <p className="share">
            Bagikan:{' '}
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${p.title} ${url}`)}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener noreferrer">
              X
            </a>
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <h2 className="h2">Baca juga</h2>
            <div className="postlist">
              {related.map((r) => (
                <PostRow key={r.slug} post={r} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
