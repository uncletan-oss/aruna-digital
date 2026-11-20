import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { site, site as defaultSite } from '../site.js';
import { useSiteOpts } from '../lib/data.jsx';

/**
 * Meta tag lengkap per halaman: title, description, canonical, Open Graph,
 * Twitter Card, robots, dan JSON-LD (structured data).
 */
export default function Seo({
  title,
  description = site.description,
  image = '/og-default.png',
  type = 'website',
  noindex = false,
  jsonLd = [],
  published,
  modified,
  breadcrumbs,
}) {
  const { siteUrl } = useSiteOpts();
  const { pathname } = useLocation();
  const canonical = siteUrl + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const img = image.startsWith('http') ? image : siteUrl + image;

  const ld = [...jsonLd];
  if (breadcrumbs?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Beranda', path: '/' }, ...breadcrumbs].map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: siteUrl + b.path,
      })),
    });
  }

  return (
    <Helmet prioritizeSeoTags>
      <html lang="id" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="id-ID" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || site.name} />
      {published && <meta property="article:published_time" content={new Date(published).toISOString()} />}
      {modified && <meta property="article:modified_time" content={new Date(modified).toISOString()} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj).replace(/</g, '\\u003c')}
        </script>
      ))}
    </Helmet>
  );
}

export function organizationLd(siteUrl, site = defaultSite) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    email: site.email,
    telephone: site.phone,
    foundingDate: site.founded,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.social),
  };
}
