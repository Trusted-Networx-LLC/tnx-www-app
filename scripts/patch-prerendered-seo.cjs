#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE_URL = 'https://trustednetworx.com';
// Canonical Organization entity. The node itself (with @id + PostalAddress)
// lives in index.html and is therefore present on every built page; other
// nodes reference it by this @id instead of restating it.
const ORG_ID = `${SITE_URL}/#organization`;
const CARTER_DEWEY_ID = `${SITE_URL}/about/team#carter-dewey`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/TrustedNetworx-Hero-Image.jpg`;
const DEFAULT_DESCRIPTION = 'TrustedNetworx is a managed telecom solutions provider delivering POTS replacement, AI consulting, internet connectivity, IP PBX, mobility, and voice solutions for enterprise and multi-site businesses.';

// Every @type the patch script injects as the source of truth for route-page
// JSON-LD. `stripStructuredData` drops any Helmet-rendered copy of these types
// BEFORE appending the deterministic ones, so a page never carries duplicates
// and the output is identical across builds regardless of Helmet flush timing.
const STRUCTURED_DATA_TYPES = [
  'BlogPosting',
  'Service',
  'SoftwareApplication',
  'WebApplication',
  'CollectionPage',
  'Blog',
  'FAQPage',
  'BreadcrumbList',
  'LocalBusiness',
  'Product',
  'Person',
];

function parseFrontmatter(raw) {
  const parts = raw.split('---');
  if (parts.length < 3) return { data: {}, content: '' };
  const fm = parts[1];
  const content = parts.slice(2).join('---').trim();
  const data = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
    if (m) data[m[1]] = m[2];
  }
  return { data, content };
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function replaceTag(html, regex, replacement) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `${replacement}\n</head>`);
}

function upsertMeta(html, attr, name, content) {
  const regex = new RegExp(`\\s*<meta[^>]*${attr}="${name}"[^>]*>`, 'gi');
  const tag = `<meta ${attr}="${name}" content="${escapeAttr(content)}">`;
  html = html.replace(regex, '');
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertLink(html, rel, href) {
  const regex = new RegExp(`\\s*<link[^>]*rel="${rel}"[^>]*>`, 'gi');
  const tag = `<link rel="${rel}" href="${escapeAttr(href)}">`;
  html = html.replace(regex, '');
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertTitle(html, title) {
  const regex = /\s*<title>[\s\S]*?<\/title>/i;
  html = html.replace(regex, '');
  return html.replace('</head>', `<title>${escapeAttr(title)}</title>\n</head>`);
}

// Singleton head tags: exactly one copy is allowed per built page.
const SINGLETON_META = [
  ['name', 'description'],
  ['property', 'og:type'],
  ['property', 'og:site_name'],
  ['property', 'og:url'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:image'],
  ['name', 'twitter:card'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
];

/**
 * Collapse duplicate singleton head tags down to one copy.
 *
 * Why the homepage needs this and route pages do not: every route page is run
 * through `patchPage`, whose `upsert*` helpers strip all existing copies and
 * append exactly one. The homepage shell (`dist/index.html`) is NOT patched that
 * way, so react-helmet's rendered tags (`data-rh="true"`) sit alongside the
 * ones written by hand in `index.html` — two canonicals, two descriptions, two
 * og:* — which is what the 2026-09-10 SEO audit flagged.
 *
 * This keeps the LAST copy (the page's own rendered value wins over the shell
 * default), drops the `data-rh` attribute the kept copy carries, and appends it
 * the same way `upsert*` does. No value is invented or altered: it only removes
 * byte-identical duplicates.
 */
function dedupeHeadTags(html) {
  let removed = 0;
  for (const [attr, name] of SINGLETON_META) {
    const regex = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*>`, 'gi');
    const found = html.match(regex);
    if (!found || found.length < 2) continue;
    const keep = found[found.length - 1].replace(/\s*data-rh="true"/g, '');
    html = html.replace(regex, '').replace('</head>', `${keep}\n</head>`);
    removed += found.length - 1;
  }
  const canonRe = /<link[^>]*rel="canonical"[^>]*>/gi;
  const canon = html.match(canonRe);
  if (canon && canon.length > 1) {
    const keep = canon[canon.length - 1].replace(/\s*data-rh="true"/g, '');
    html = html.replace(canonRe, '').replace('</head>', `${keep}\n</head>`);
    removed += canon.length - 1;
  }
  if (removed) console.log(`[postbuild] Homepage: removed ${removed} duplicate head tag copies.`);
  return html;
}

function stripStructuredData(html, type) {
  // Match each ld+json script individually (tolerating attributes like
  // react-helmet's data-rh="true"), parse it, and drop blocks of the given
  // @type. Non-greedy per-block matching avoids spanning across script tags.
  return html.replace(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    (match, body) => {
      try {
        const data = JSON.parse(body);
        const types = Array.isArray(data)
          ? data.map((d) => d && d['@type'])
          : [data && data['@type']];
        if (types.includes(type)) return '';
      } catch {
        // Unparseable block — leave it alone.
      }
      return match;
    }
  );
}

function appendStructuredData(html, blocks) {
  const snippet = blocks
    .map((block) => `<script type="application/ld+json">${escapeJsonForScript(block)}</script>`)
    .join('');
  return html.replace('</head>', `${snippet}</head>`);
}

function versionedImageUrl(rootDir, imagePath) {
  if (!imagePath || !imagePath.startsWith('/')) return imagePath || DEFAULT_OG_IMAGE;
  const localPath = path.join(rootDir, 'public', imagePath.replace(/^\//, ''));
  if (!fs.existsSync(localPath)) return `${SITE_URL}${imagePath}`;
  const sha = crypto.createHash('sha256').update(fs.readFileSync(localPath)).digest('hex').slice(0, 12);
  return `${SITE_URL}${imagePath}?v=${sha}`;
}

/**
 * Remove the src attribute from any <video> whose class contains "hero-video".
 * HeroVideo attaches its source imperatively after window load; react-snap
 * snapshots the DOM after that attach, so without this strip the prerendered
 * HTML would carry a src and fetch the crawler-sized video file at parse time
 * on every viewport.
 */
function stripHeroVideoSrc(html) {
  return html.replace(
    /<video\b[^>]*class="[^"]*\bhero-video\b[^"]*"[^>]*>/g,
    (tag) => tag.replace(/\s+src="[^"]*"/g, '')
  );
}

/**
 * Rebuild FAQPage structured data from the prerendered markup.
 *
 * react-snap does not carry Helmet's <script type="application/ld+json"> tags
 * into the snapshot, so anything the Seo component emits at runtime is absent
 * from the HTML a crawler or an answer engine actually reads. Rather than
 * duplicating every question into this file (which is how the hardware table
 * drifted last time), the FAQ section marks its <dl> with data-faq and we read
 * the pairs back out of the page we just built.
 */
function extractFaqJsonLd(html) {
  const list = html.match(/<dl[^>]*data-faq="true"[^>]*>([\s\S]*?)<\/dl>/);
  if (!list) return null;
  const pairs = [...list[1].matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g)];
  if (!pairs.length) return null;
  const plain = (fragment) =>
    fragment
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(([, q, a]) => ({
      '@type': 'Question',
      name: plain(q),
      acceptedAnswer: { '@type': 'Answer', text: plain(a) },
    })),
  };
}

function patchPage(filePath, seo) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripHeroVideoSrc(html);
  if (seo.heroPoster) {
    html = html.replace(
      '</head>',
      `<link rel="preload" as="image" href="${seo.heroPoster}" fetchpriority="high">\n</head>`
    );
  }
  // On the product pages the device shot sits beside the H1 and is the LCP
  // element more often than the hero poster is. Preload it too.
  if (seo.heroImage) {
    html = html.replace(
      '</head>',
      `<link rel="preload" as="image" href="${seo.heroImage}" fetchpriority="high">\n</head>`
    );
  }
  html = upsertTitle(html, seo.title);
  html = upsertMeta(html, 'name', 'description', seo.description);
  html = upsertLink(html, 'canonical', seo.canonical);
  html = upsertMeta(html, 'property', 'og:type', seo.type);
  html = upsertMeta(html, 'property', 'og:site_name', 'TrustedNetworx');
  html = upsertMeta(html, 'property', 'og:title', seo.title);
  html = upsertMeta(html, 'property', 'og:description', seo.description);
  html = upsertMeta(html, 'property', 'og:url', seo.canonical);
  html = upsertMeta(html, 'property', 'og:image', seo.image);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', seo.title);
  html = upsertMeta(html, 'name', 'twitter:description', seo.description);
  html = upsertMeta(html, 'name', 'twitter:image', seo.image);

  for (const type of STRUCTURED_DATA_TYPES) {
    html = stripStructuredData(html, type);
  }
  const faqJsonLd = extractFaqJsonLd(html);
  const blocks = [...(seo.jsonLd || []), ...(faqJsonLd ? [faqJsonLd] : [])];
  if (blocks.length) {
    html = appendStructuredData(html, blocks);
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function ensureHtmlShell(filePath, fallbackHtmlPath) {
  if (fs.existsSync(filePath)) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.copyFileSync(fallbackHtmlPath, filePath);
}

function patchBlogIndex(distDir) {
  const filePath = path.join(distDir, 'blog', 'index.html');
  ensureHtmlShell(filePath, path.join(distDir, 'index.html'));
  patchPage(filePath, {
    title: 'TrustedNetworx Blog | Telecom, AI & Connectivity Insights',
    description: 'Practical insights on telecom modernization, AI for business, copper retirement, compliance, and connectivity from the operators behind TrustedNetworx.',
    canonical: `${SITE_URL}/blog`,
    image: DEFAULT_OG_IMAGE,
    type: 'website',
    jsonLd: [
      blogJsonLd({
        name: 'TrustedNetworx Blog',
        description: 'Practical insights on telecom modernization, AI for business, copper retirement, compliance, and connectivity from the operators behind TrustedNetworx.',
      }),
      buildBreadcrumbList('blog'),
    ],
  });
}

function patchBlogPosts(distDir, srcBlogDir, rootDir) {
  const files = fs.readdirSync(srcBlogDir).filter((file) => file.endsWith('.md'));
  const issues = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(srcBlogDir, file), 'utf8');
    const { data } = parseFrontmatter(raw);
    const htmlPath = path.join(distDir, 'blog', slug, 'index.html');
    ensureHtmlShell(htmlPath, path.join(distDir, 'index.html'));

    const title = data.title || slug;
    // Title rule (SEO pass 2026-09-10): "<title> | TrustedNetworx" when that is
    // ≤ 60 characters, otherwise the bare title. An optional frontmatter
    // `seoTitle` stands in for the base title when present. The on-page <h1>
    // (and the BlogPosting headline) always keep the full title.
    const baseTitle = data.seoTitle || title;
    const withBrand = `${baseTitle} | TrustedNetworx`;
    const pageTitle = withBrand.length <= 60 ? withBrand : baseTitle;
    const description = data.description || DEFAULT_DESCRIPTION;
    const canonical = `${SITE_URL}/blog/${slug}`;
    const image = versionedImageUrl(rootDir, data.image);
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image,
      datePublished: data.date,
      dateModified: data.dateModified || data.date,
      articleSection: data.category || 'Blog',
      author: authorJsonLd(data.author),
      publisher: {
        '@type': 'Organization',
        name: 'TrustedNetworx',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    };
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: title, item: canonical },
      ],
    };

    patchPage(htmlPath, {
      title: pageTitle,
      description,
      canonical,
      image,
      type: 'article',
      jsonLd: [articleJsonLd, breadcrumbJsonLd],
    });

    // Build-time SEO guard input. Redirect stubs are excluded: they are
    // redirect-only, carry no canonical page of their own and are absent from
    // the sitemap, so their shells are not held to the live-post limits.
    if (!data.redirect) {
      issues.push({ slug, title: pageTitle, titleLen: pageTitle.length, descLen: description.length });
    }
  }
  return issues;
}

/**
 * Build-time guard (SEO pass 2026-09-10): warn — never fail — when a live
 * blog post ships a <title> over 60 characters or a description outside the
 * 120–160 range. Runs last so the warning lists every offending slug in one
 * place at the end of the build log.
 */
function reportBlogSeoWarnings(issues) {
  const longTitles = issues.filter((i) => i.titleLen > 60);
  const badDescriptions = issues.filter((i) => i.descLen < 120 || i.descLen > 160);

  if (longTitles.length) {
    console.warn(`[postbuild] WARNING: ${longTitles.length} blog <title> over 60 characters:`);
    for (const i of longTitles) console.warn(`[postbuild]   - ${i.slug}: ${i.titleLen} chars — ${i.title}`);
  }
  if (badDescriptions.length) {
    console.warn(`[postbuild] WARNING: ${badDescriptions.length} blog description outside 120–160 characters:`);
    for (const i of badDescriptions) console.warn(`[postbuild]   - ${i.slug}: ${i.descLen} chars`);
  }
  if (!longTitles.length && !badDescriptions.length) {
    console.log(`[postbuild] Blog SEO guard passed: ${issues.length} live posts, all <title> ≤ 60 and descriptions 120–160.`);
  }
}

// --- Static route pages (non-blog) ---
// These pages get unique HTML shells with proper SEO meta so search engines
// see correct titles/descriptions without needing to execute JavaScript.

// Intermediate path segments that map to a real page (mirrors Seo.tsx so the
// prerendered BreadcrumbList matches what the runtime component emits).
const SECTION_ROUTES = {
  tools: '/tools',
  about: '/about',
  'about/team': '/about/team',
  'pots-replacement': '/pots-replacement',
};

// Segments whose display name isn't derivable from the slug (model numbers).
const CRUMB_NAMES = {
  'pots-replacement': 'POTS Replacement',
  '90x1': '90X1',
  '90x2': '90X2',
  '90x5': '90X5',
  ara: 'Ara',
};

function titleCase(seg) {
  return CRUMB_NAMES[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** BreadcrumbList mirroring src/components/Seo.tsx buildBreadcrumbs(). */
function buildBreadcrumbList(route) {
  const segments = route.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }];
  let acc = '';
  segments.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLeaf = i === segments.length - 1;
    // Only link intermediate segments that resolve to a real page.
    if (!isLeaf && !SECTION_ROUTES[acc.slice(1)]) return;
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: titleCase(seg),
      item: `${SITE_URL}${acc}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/** Service schema for the six solution pages (audit #10 / Sprint 4 A2). */
function serviceJsonLd({ name, serviceType, route, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    provider: { '@type': 'Organization', name: 'TrustedNetworx' },
    areaServed: { '@type': 'Country', name: 'US' },
    serviceType,
    description,
    url: `${SITE_URL}/${route}`,
  };
}

/** Product schema for the four POTS IN A BOX product pages (no offers/pricing). */
function productJsonLd({ name, route, description, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: 'DataRemote' },
    category: 'POTS Replacement',
    description,
    url: `${SITE_URL}/${route}`,
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}

/** SoftwareApplication schema for the two platform pages (no offers). */
function softwareAppJsonLd({ name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description,
  };
}

function faqPageJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * Person node for Carter Dewey. Every fact here is already published on
 * /about/team (src/pages/Team.tsx): "CEO & Founder", SVP of Global Sales at
 * DataRemote, Inc. from April 2016, and 12 years with AT&T. No knowsAbout and
 * no sameAs — a sameAs requires a verified public profile URL and none exists
 * in the repo.
 */
function carterDeweyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': CARTER_DEWEY_ID,
    name: 'Carter Dewey',
    jobTitle: 'CEO & Founder',
    url: `${SITE_URL}/about/team`,
    worksFor: { '@id': ORG_ID },
    alumniOf: [
      { '@type': 'Organization', name: 'AT&T' },
      { '@type': 'Organization', name: 'DataRemote, Inc.' },
    ],
  };
}

/**
 * WebApplication schema for the five free calculator/assessment pages.
 * `name` is the page title without the " | TrustedNetworx" suffix; price is
 * "0" USD, matching the nav's "Free Tools" label.
 */
function webApplicationJsonLd({ name, route }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${SITE_URL}/${route}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORG_ID },
  };
}

/** CollectionPage schema for a hub page (currently /tools). */
function collectionPageJsonLd({ name, route, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${SITE_URL}/${route}`,
    description,
    publisher: { '@id': ORG_ID },
  };
}

/** Blog schema for the /blog hub. */
function blogJsonLd({ name, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name,
    url: `${SITE_URL}/blog`,
    description,
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Blog post author node. Carter Dewey's posts reference the Person node on
 * /about/team by @id so the author is the same entity sitewide.
 */
function authorJsonLd(author) {
  if (!author || author === 'TrustedNetworx') {
    return { '@type': 'Organization', name: 'TrustedNetworx' };
  }
  if (author === 'Carter Dewey') {
    return {
      '@type': 'Person',
      '@id': CARTER_DEWEY_ID,
      name: 'Carter Dewey',
      url: `${SITE_URL}/about/team`,
    };
  }
  return { '@type': 'Person', name: author };
}

const ROUTE_PAGES = [
  {
    route: 'about',
    title: 'About Us | TrustedNetworx',
    description: 'TrustedNetworx delivers managed telecom, connectivity, voice, and AI solutions for enterprise and multi-site organizations, built on operator experience.',
    jsonLd: [buildBreadcrumbList('about')],
  },
  {
    route: 'about/team',
    title: 'Our Team | TrustedNetworx',
    description: 'Meet the leadership and partners behind TrustedNetworx — telecom experts, enterprise architects, and creative professionals driving connectivity forward.',
    jsonLd: [carterDeweyJsonLd(), buildBreadcrumbList('about/team')],
  },
  {
    route: 'pots-replacement',
    heroPoster: '/media/hero-pots-poster.v2.jpg',
    title: 'POTS Replacement | TrustedNetworx',
    description: 'Replace legacy analog copper lines with the DataRemote POTS IN A BOX platform: 8-line 5G and LTE units with 48-hour battery backup, aligned with UL 864.',
    jsonLd: [
      serviceJsonLd({
        name: 'POTS Replacement',
        serviceType: 'Telecom Line Replacement',
        route: 'pots-replacement',
        description: 'Modern, cost-saving alternatives to legacy POTS lines.',
      }),
      buildBreadcrumbList('pots-replacement'),
    ],
  },
  {
    route: 'pots-replacement/pstn-sunset',
    title: 'PSTN Sunset: Copper Shutdown Lookup by ZIP | TrustedNetworx',
    description: 'Check if your ZIP code or city is on a carrier copper retirement or POTS discontinuance filing. See the carrier, wire center, and earliest shutoff date.',
    jsonLd: [
      webApplicationJsonLd({ name: 'PSTN Sunset Copper Shutdown Lookup', route: 'pots-replacement/pstn-sunset' }),
      buildBreadcrumbList('pots-replacement/pstn-sunset'),
    ],
  },
  {
    route: 'pots-replacement/90x1',
    heroPoster: '/media/hero-pots-poster.v2.jpg',
    heroImage: '/product/90x1-hero.v2.webp',
    title: 'DataRemote 90X1 — 5G POTS Replacement | TrustedNetworx',
    description: 'The DataRemote 90X1 replaces eight analog lines over 5G Sub-6 with up to 48 hours of standby. UL 864 aligned, CSFM listed, deployed by TrustedNetworx.',
    jsonLd: [
      productJsonLd({
        name: 'POTS IN A BOX 90X1',
        route: 'pots-replacement/90x1',
        image: '/product/90x1-hero.v2.webp',
        description: 'Eight-line 5G Sub-6 POTS replacement with an 18-cell 15Ah battery and up to 48 hours of standby.',
      }),
      buildBreadcrumbList('pots-replacement/90x1'),
    ],
  },
  {
    route: 'pots-replacement/90x2',
    heroPoster: '/media/hero-pots-poster.v2.jpg',
    heroImage: '/product/90x2-hero.v2.webp',
    title: 'DataRemote 90X2 — LTE POTS Replacement | TrustedNetworx',
    description: 'The DataRemote 90X2 replaces eight analog lines over LTE including band 14 for FirstNet. FirstNet Trusted and Bell Canada approved, with 48-hour battery.',
    jsonLd: [
      productJsonLd({
        name: 'POTS IN A BOX 90X2',
        route: 'pots-replacement/90x2',
        image: '/product/90x2-hero.v2.webp',
        description: 'Eight-line LTE POTS replacement including band 14 for FirstNet, with a 48-hour battery.',
      }),
      buildBreadcrumbList('pots-replacement/90x2'),
    ],
  },
  {
    route: 'pots-replacement/90x5',
    heroPoster: '/media/hero-pots-poster.v2.jpg',
    heroImage: '/product/90x5-hero.v2.webp',
    title: 'DataRemote 90X5 — Modular POTS Replacement | TrustedNetworx',
    description: 'The DataRemote 90X5 is a modular platform: a PoE-detachable 5G RedCap radio and a 4-line gateway expandable to 8. Pre-order, specifications preliminary.',
    jsonLd: [
      productJsonLd({
        name: 'POTS IN A BOX 90X5',
        route: 'pots-replacement/90x5',
        image: '/product/90x5-hero.v2.webp',
        description: 'Modular POTS replacement with a PoE-detachable 5G RedCap radio and a 4-line gateway expandable to 8 via RJ-14.',
      }),
      buildBreadcrumbList('pots-replacement/90x5'),
    ],
  },
  {
    route: 'pots-replacement/ara',
    heroPoster: '/media/hero-pots-poster.v2.jpg',
    title: 'Ara — POTS IN A BOX Device Management | TrustedNetworx',
    description: 'Ara is DataRemote\'s cloud device-management platform for the POTS IN A BOX family: remote access, firmware upgrade, line-status alerts, and a REST API.',
    jsonLd: [
      productJsonLd({
        name: 'Ara',
        route: 'pots-replacement/ara',
        description: 'Cloud device-management platform for the DataRemote POTS IN A BOX family.',
      }),
      buildBreadcrumbList('pots-replacement/ara'),
    ],
  },
  {
    route: 'ai-consulting',
    heroPoster: '/media/hero-ai-consulting-poster.v2.jpg',
    title: 'AI Consulting & Solutions | TrustedNetworx',
    description: 'Practical AI consulting and implementation for telecom operators, channel partners, and multi-site businesses — automation, engagement, and strategy that ships.',
    jsonLd: [
      serviceJsonLd({
        name: 'AI Consulting',
        serviceType: 'AI Consulting',
        route: 'ai-consulting',
        description: 'Practical AI consulting and implementation for telecom and multi-site businesses.',
      }),
      buildBreadcrumbList('ai-consulting'),
    ],
  },
  {
    route: 'ai-workforce',
    heroPoster: '/media/hero-ai-workforce-poster.v2.jpg',
    title: 'AI Workforce — AI Agents for Telecom | TrustedNetworx',
    description: 'Deploy AI sales, service, and operations agents built for telecom: lead qualification, scheduling, email triage, and infrastructure monitoring, running 24/7.',
    jsonLd: [
      serviceJsonLd({
        name: 'AI Workforce',
        serviceType: 'AI Agents',
        route: 'ai-workforce',
        description: 'AI agents for sales, service, and operations, built for telecom.',
      }),
      buildBreadcrumbList('ai-workforce'),
    ],
  },
  // NOTE: /fleet-management intentionally removed — it 301s to /ai-consulting in
  // netlify.toml (no dedicated page exists; a patched shell here would create a
  // duplicate-content page with mismatched meta).
  {
    route: 'internet-connectivity',
    heroPoster: '/media/hero-connectivity-poster.v2.jpg',
    title: 'Internet Connectivity | TrustedNetworx',
    description: 'Enterprise-grade internet connectivity — managed SD-WAN, Starlink satellite broadband, and global IoT SIM solutions to keep your business securely online.',
    jsonLd: [
      serviceJsonLd({
        name: 'Internet Connectivity',
        serviceType: 'Enterprise Internet',
        route: 'internet-connectivity',
        description: 'Enterprise-grade internet connectivity with managed SD-WAN and wireless failover.',
      }),
      buildBreadcrumbList('internet-connectivity'),
    ],
  },
  {
    route: 'voice-solutions',
    heroPoster: '/media/hero-voice-poster.v2.jpg',
    title: 'Voice Solutions — IP PBX & UCaaS | TrustedNetworx',
    description: 'Enterprise voice from TrustedNetworx: cloud IP PBX, HD voice, unified communications, voice analytics, and cloud calling that scales with the business.',
    jsonLd: [
      serviceJsonLd({
        name: 'Voice Solutions / IP PBX',
        serviceType: 'Unified Communications',
        route: 'voice-solutions',
        description: 'Cloud IP PBX and unified communications for multi-site businesses.',
      }),
      buildBreadcrumbList('voice-solutions'),
    ],
  },
  {
    route: 'mobility-solutions',
    heroPoster: '/media/hero-mobility-poster.v2.jpg',
    title: 'Mobility Solutions | TrustedNetworx',
    description: 'Enterprise mobility management from TrustedNetworx: MDaaS, IoT connectivity, and unified endpoint management to keep a mobile workforce secure and productive.',
    jsonLd: [
      serviceJsonLd({
        name: 'Mobility Solutions',
        serviceType: 'Enterprise Mobility Management',
        route: 'mobility-solutions',
        description: 'Enterprise mobility management and IoT connectivity.',
      }),
      buildBreadcrumbList('mobility-solutions'),
    ],
  },
  {
    route: 'platforms/partner-hub',
    heroPoster: '/media/hero-partner-hub-poster.v2.jpg',
    title: 'TNX Partner Hub — AI Agent Management | TrustedNetworx',
    description: 'Deploy, budget, monitor, and govern AI agents for sales, support, and operations from one multi-tenant hub. Built by an operator, for MSPs and resellers.',
    jsonLd: [
      softwareAppJsonLd({
        name: 'TNX Partner Hub',
        description:
          'AI agent management platform for MSPs and channel partners: deploy, budget, monitor, and govern AI agents from one multi-tenant hub.',
      }),
      faqPageJsonLd([
        { q: 'Which AI models does it use?', a: 'Model-agnostic; default is a cost-optimized provider with the option to bring your own keys.' },
        { q: 'Do I need developers?', a: 'No for blueprint agents. Yes for custom integrations, which we can build.' },
        { q: 'Where does it run?', a: 'Dedicated VPS per client or shared multi-tenant, your choice.' },
        { q: 'Is my client data isolated?', a: 'Yes — tenant isolation is enforced at the database layer, not just the UI.' },
      ]),
      buildBreadcrumbList('platforms/partner-hub'),
    ],
  },
  {
    route: 'platforms/crm',
    heroPoster: '/media/hero-crm-poster.v2.jpg',
    title: 'TNX CRM — Opportunity Management Telecom | TrustedNetworx',
    description: 'Track direct, agent, and reseller deals with telecom-native fields and AI agents that keep the pipeline current, from the operators behind TrustedNetworx.',
    jsonLd: [
      softwareAppJsonLd({
        name: 'TNX CRM',
        description:
          'Opportunity management for telecom, MSP and channel sales: direct, agent, and reseller pipelines with telecom-native fields.',
      }),
      faqPageJsonLd([
        { q: 'Can I import from Pipedrive / HubSpot?', a: 'Yes — CSV import with field mapping.' },
        { q: 'Does it replace Partner Hub?', a: 'No. Partner Hub manages agents; TNX CRM manages deals. They share data.' },
        { q: 'Can partners see each other’s deals?', a: 'No. Partner visibility is scoped to their own book.' },
      ]),
      buildBreadcrumbList('platforms/crm'),
    ],
  },
  {
    route: 'partners',
    heroPoster: '/media/hero-partners-poster.v2.jpg',
    title: 'Become a Partner — MSP & Reseller Program | TrustedNetworx',
    description: 'Join the TrustedNetworx partner program for MSPs, telecom agents, and resellers. White-label telecom and AI, TNX Partner Hub, and commission on every deal.',
    jsonLd: [buildBreadcrumbList('partners')],
  },
  {
    route: 'ai',
    heroPoster: '/media/hero-ai-poster.v2.jpg',
    title: 'AI for Telecom & Multi-Site Operators | TrustedNetworx',
    description: 'AI agents and consulting for telecom and multi-site operators. Explore the AI workforce, run a readiness assessment, and read the latest on AI in telecom.',
    jsonLd: [buildBreadcrumbList('ai')],
  },
  {
    route: 'tools',
    title: 'Free Telecom Assessment Tools | TrustedNetworx',
    description: 'Free tools to size your telecom position: PSTN shutdown lookup by ZIP, copper sunset risk, business continuity readiness, and AI readiness.',
    jsonLd: [
      collectionPageJsonLd({
        name: 'Free Telecom Assessment Tools',
        route: 'tools',
        description:
          'Free tools to size your telecom position: PSTN shutdown lookup by ZIP, copper sunset risk, business continuity readiness, and AI readiness.',
      }),
      buildBreadcrumbList('tools'),
    ],
  },
  {
    route: 'tools/copper-sunset-risk',
    title: 'Copper Sunset Risk Assessment | TrustedNetworx',
    description: 'Size your organization\'s exposure to the copper network shutdown. Identify at-risk phone lines, elevator lines, alarm panels, fax machines, and POS lines.',
    jsonLd: [
      webApplicationJsonLd({ name: 'Copper Sunset Risk Assessment', route: 'tools/copper-sunset-risk' }),
      buildBreadcrumbList('tools/copper-sunset-risk'),
    ],
  },
  {
    route: 'tools/failover-readiness',
    title: 'Business Continuity Readiness Check | TrustedNetworx',
    description: 'Check how prepared your business is for an internet outage. Score your network resilience and get a recommendation on LTE and 5G wireless failover options.',
    jsonLd: [
      webApplicationJsonLd({ name: 'Business Continuity Readiness Check', route: 'tools/failover-readiness' }),
      buildBreadcrumbList('tools/failover-readiness'),
    ],
  },
  {
    route: 'tools/ai-readiness',
    title: 'AI Readiness Assessment | TrustedNetworx',
    description: 'Score how prepared your organization is to adopt AI agents and automation, then get a scoped starting point. Interactive assessment from TrustedNetworx.',
    jsonLd: [
      webApplicationJsonLd({ name: 'AI Readiness Assessment', route: 'tools/ai-readiness' }),
      buildBreadcrumbList('tools/ai-readiness'),
    ],
  },
  {
    route: 'contact',
    heroPoster: '/media/hero-contact-poster.v2.jpg',
    title: 'Contact Us | TrustedNetworx',
    description: 'Get in touch with the TrustedNetworx team to scope managed telecom, POTS replacement, voice, connectivity, mobility, or an AI agent build for your business.',
    jsonLd: [
      {
        // Same real-world entity as the Organization node (shipped from
        // index.html on every page) — references it by @id instead of
        // restating name/telephone/email/url/address. The address now lives on
        // the Organization node and is shared through this @id; only the
        // LocalBusiness-specific openingHours is kept here.
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': ORG_ID,
        openingHours: 'Mo-Fr 09:00-18:00',
      },
      buildBreadcrumbList('contact'),
    ],
  },
];

function patchRoutePages(distDir) {
  const fallbackHtmlPath = path.join(distDir, 'index.html');
  let count = 0;

  for (const { route, title, description, jsonLd, heroPoster, heroImage } of ROUTE_PAGES) {
    const filePath = path.join(distDir, route, 'index.html');
    ensureHtmlShell(filePath, fallbackHtmlPath);
    patchPage(filePath, {
      title,
      description,
      canonical: `${SITE_URL}/${route}`,
      image: DEFAULT_OG_IMAGE,
      type: 'website',
      jsonLd: jsonLd || [],
      heroPoster,
      heroImage,
    });
    count++;
  }

  console.log(`[postbuild] Patched ${count} route page SEO shells.`);
}

function main() {
  const root = path.join(__dirname, '..');
  const distDir = path.join(root, 'dist');
  const srcBlogDir = path.join(root, 'src', 'content', 'blog');

  patchBlogIndex(distDir);
  const blogIssues = patchBlogPosts(distDir, srcBlogDir, root);
  patchRoutePages(distDir);

  // Homepage shell: strip the hero video src (so parse time never fetches it)
  // and preload the poster — the LCP element that is otherwise discovered late
  // as a CSS background-image.
  const indexPath = path.join(distDir, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  indexHtml = stripHeroVideoSrc(indexHtml);
  indexHtml = indexHtml.replace(
    '</head>',
    '<link rel="preload" as="image" href="/media/hero-home-poster.v2.jpg" fetchpriority="high">\n</head>'
  );
  // The homepage is the one page not routed through patchPage, so it keeps both
  // the shell's hand-written head tags and react-helmet's rendered copies.
  // Collapse them to one of each (see dedupeHeadTags).
  indexHtml = dedupeHeadTags(indexHtml);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');

  console.log('[postbuild] Patched prerendered blog SEO metadata.');
  reportBlogSeoWarnings(blogIssues);
}

main();
