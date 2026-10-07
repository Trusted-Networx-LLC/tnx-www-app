#!/usr/bin/env node
/**
 * Generate sitemap.xml from static routes + blog posts.
 * Output: public/sitemap.xml — served at https://trustednetworx.com/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://trustednetworx.com';

// Static routes with relative crawl priority. Redirect-only routes
// (e.g. /ip-pbx, /fleet-management) are intentionally excluded.
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/ai-workforce', priority: '0.9', changefreq: 'monthly' },
  { path: '/ai-consulting', priority: '0.9', changefreq: 'monthly' },
  { path: '/pots-replacement', priority: '0.9', changefreq: 'monthly' },
  { path: '/pots-replacement/90x1', priority: '0.8', changefreq: 'monthly' },
  { path: '/pots-replacement/90x2', priority: '0.8', changefreq: 'monthly' },
  { path: '/pots-replacement/90x5', priority: '0.7', changefreq: 'monthly' },
  { path: '/pots-replacement/ara', priority: '0.7', changefreq: 'monthly' },
  { path: '/internet-connectivity', priority: '0.8', changefreq: 'monthly' },
  { path: '/voice-solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/mobility-solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools', priority: '0.8', changefreq: 'monthly' },
  { path: '/pots-replacement', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/copper-sunset-risk', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/failover-readiness', priority: '0.7', changefreq: 'monthly' },
  { path: '/ai', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools/ai-readiness', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/about/team', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/platforms/partner-hub', priority: '0.8', changefreq: 'monthly' },
  { path: '/platforms/crm', priority: '0.8', changefreq: 'monthly' },
  { path: '/partners', priority: '0.8', changefreq: 'monthly' },
  { path: '/ai', priority: '0.9', changefreq: 'monthly' },
];

function parseFrontmatter(raw) {
  const parts = raw.split('---');
  if (parts.length < 3) return {};
  const data = {};
  for (const line of parts[1].split('\n')) {
    const m = line.match(/^(\w+):\s*["']?(.*?)["']?\s*$/);
    if (m) data[m[1]] = m[2];
  }
  return data;
}

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const posts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const slug = f.replace(/\.md$/, '');
    const data = parseFrontmatter(fs.readFileSync(path.join(blogDir, f), 'utf8'));
    return { slug, date: data.date || '', dateModified: data.dateModified || '', redirect: data.redirect || '' };
  })
  .filter((p) => !p.redirect)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function iso(date) {
  const d = date ? new Date(date) : new Date();
  return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

const urls = [
  ...STATIC_ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
  ),
  ...posts.map(
    (p) =>
      `  <url>\n    <loc>${SITE_URL}/blog/${p.slug}</loc>\n    <lastmod>${iso(p.dateModified || p.date)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  ),
].join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml, 'utf8');
console.log(`Sitemap: ${STATIC_ROUTES.length} routes + ${posts.length} posts → public/sitemap.xml`);
