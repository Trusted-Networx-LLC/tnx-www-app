import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE_URL = 'https://trustednetworx.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/TrustedNetworx-Hero-Image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  /** Absolute URL or site-relative path (e.g. "/blog-images/x.png"). */
  image?: string;
  type?: 'website' | 'article';
  /** Override the canonical path. Defaults to the current route. */
  canonicalPath?: string;
  noindex?: boolean;
  /** One or more JSON-LD objects to inject as <script type="application/ld+json">. */
  jsonLd?: object | object[];
}

/** Intermediate path segments that map to a real page (linked in breadcrumbs). */
const SECTION_ROUTES: Record<string, string> = {
  tools: '/tools',
  blog: '/blog',
  about: '/about',
  'about/team': '/about/team',
  'pots-replacement': '/pots-replacement',
};

// Segments whose display name isn't derivable from the slug (model numbers).
const CRUMB_NAMES: Record<string, string> = {
  'pots-replacement': 'POTS Replacement',
  '90x1': '90X1',
  '90x2': '90X2',
  '90x5': '90X5',
  ara: 'Ara',
  'pstn-sunset': 'PSTN Sunset',
};

/** Build a BreadcrumbList from the pathname (Home > Segment > Segment). */

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const items: { '@type': string; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ];
  let acc = '';
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLeaf = i === segments.length - 1;
    // Only link intermediate segments that resolve to a real page; otherwise
    // drop them (e.g. /platforms/* has no single /platforms page).
    if (!isLeaf && !SECTION_ROUTES[acc.slice(1)]) return;
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: CRUMB_NAMES[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      item: `${SITE_URL}${acc}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Per-page document head: title, meta description, canonical URL,
 * Open Graph + Twitter cards, and optional JSON-LD structured data.
 * Title is passed in full (pages format as "<Page> | TrustedNetworx").
 */
const Seo = ({
  title,
  description,
  image,
  type = 'website',
  canonicalPath,
  noindex,
  jsonLd,
}: SeoProps) => {
  const { pathname } = useLocation();
  const path = canonicalPath ?? pathname;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_OG_IMAGE;
  const callerJsonLd = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const callerHasBreadcrumb = callerJsonLd.some(
    (block) => block && (block['@type'] === 'BreadcrumbList' || (Array.isArray(block) && block.some((b) => b && b['@type'] === 'BreadcrumbList'))),
  );
  const breadcrumbs = callerHasBreadcrumb ? null : buildBreadcrumbs(pathname);
  const blocks = [
    ...(breadcrumbs ? [breadcrumbs] : []),
    ...callerJsonLd,
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Signal react-snap (postbuild `waitFor: "html[data-seo-ready]"`) that the
    // route component AND its Helmet head elements have committed. react-snap
    // snapshots only after this flag, so the prerendered HTML carries the same
    // JSON-LD/meta the runtime app renders — closing the nondeterministic
    // Helmet-flush race (V1). The patch script remains the source of truth.
    window.__seoReady = true;
    document.documentElement.setAttribute('data-seo-ready', 'true');

    return () => {
      document.documentElement.removeAttribute('data-seo-ready');
      delete window.__seoReady;
    };
  }, [title, description, canonical, ogImage, blocks.length]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="TrustedNetworx" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
