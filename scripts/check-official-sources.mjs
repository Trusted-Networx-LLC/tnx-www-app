#!/usr/bin/env node
/**
 * tnx-crm-bus#98: the PSTN Sunset lookup may cite ONLY official sources — the FCC, the carriers
 * themselves, and state utility regulators. This checks that every URL the lookup cites, in its
 * data block and in its markup, sits on that allowlist.
 *
 * It FAILS CLOSED: an unknown host is a violation, and so is a `ctfassets.net` URL that is not a
 * Windstream network-change notice PDF (that CDN is Windstream's document host; it is not a general
 * licence to cite anything Contentful serves).
 *
 * Run it directly:
 *   node scripts/check-official-sources.mjs [path/to/pstn-sunset-lookup.html]
 *
 * It is also imported by tests/pstn-sunset-official-sources.test.mjs, which checks the real file and
 * then plants a vendor URL to prove this can still fail — a guard nobody has seen reject anything is
 * not evidence of anything.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const DEFAULT_LOOKUP_PATH = 'public/embeds/pstn-sunset-lookup.html';

/** Official sources, matched as the host itself or any subdomain of it. */
export const OFFICIAL_HOSTS = Object.freeze([
  // FCC
  'fcc.gov',
  'docs.fcc.gov',
  // Carriers
  'verizon.com',
  'frontier.com',
  'att.com',
  'lumen.com',
  'centurylink.com',
  'hawaiiantel.com',
  'altafiber.com',
  'windstream.com',
  'consolidated.com',
  // Windstream hosts its network-change notices on Contentful's CDN — PDFs only, checked below.
  'ctfassets.net',
]);

/** State utility regulators live on *.gov (CPUC, Texas PUC, Vermont PSD, PA PUC, Utah PSC…) and *.us. */
const GOVERNMENT_SUFFIXES = ['.gov', '.us'];

/**
 * XML namespaces are declarations, not citations: `<svg xmlns="http://www.w3.org/2000/svg">` says
 * nothing about a source. They are stripped before scanning, and counted so the report says what it
 * ignored rather than silently dropping it.
 */
const NAMESPACE_ATTR = /\sxmlns(?::[A-Za-z0-9_.-]+)?="([^"]*)"/g;

/** Windstream's notice PDFs are named `Network_Change_Notice_<ST>_<place>_<n>.pdf`. */
function isWindstreamNoticePdf(url) {
  let path;
  try {
    path = decodeURIComponent(new URL(url).pathname);
  } catch {
    return false;
  }
  return /\.pdf$/i.test(path) && /Network[_\- ]?Change[_\- ]?Notice/i.test(path);
}

/** True when this host is an official source (and, for the CDN, a Windstream notice PDF). */
export function isOfficialUrl(url) {
  let host;
  try {
    host = new URL(url).host.replace(/^www\./, '').toLowerCase();
  } catch {
    return { ok: false, reason: 'not a parseable absolute URL' };
  }
  if (!host) return { ok: false, reason: 'no host' };

  const onList = OFFICIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  if (onList) {
    if (host === 'ctfassets.net' || host.endsWith('.ctfassets.net')) {
      return isWindstreamNoticePdf(url)
        ? { ok: true }
        : { ok: false, reason: 'ctfassets.net is allowed for Windstream network-change notice PDFs only' };
    }
    return { ok: true };
  }
  if (GOVERNMENT_SUFFIXES.some((s) => host.endsWith(s))) return { ok: true };

  return { ok: false, reason: 'host is not on the official-sources allowlist' };
}

/**
 * Every URL the lookup cites, with enough context to find it again. Handles the `\/` escaping that
 * JSON inside a `<script>` element uses, and strips namespace declarations first.
 */
export function collectCitedUrls(html) {
  const namespaces = [];
  const stripped = html.replace(NAMESPACE_ATTR, (whole, uri) => {
    if (uri) namespaces.push(uri);
    return ' '.repeat(whole.length);
  });

  const cited = new Map(); // url -> Set(where)
  const add = (url, where) => {
    const cleaned = url.replace(/\\\//g, '/').replace(/[)"'<>.,;]+$/, '');
    if (!cleaned.startsWith('http')) return;
    if (!cited.has(cleaned)) cited.set(cleaned, new Set());
    cited.get(cleaned).add(where);
  };

  for (const id of ['data', 'geo']) {
    const block = stripped.match(
      new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`),
    );
    if (block) for (const m of block[1].matchAll(/https?:\\?\/\\?\/[^\s"'<>)\\]+/g)) add(m[0], `${id} block`);
  }
  for (const m of stripped.matchAll(/(?:href|src)="([^"]+)"/g)) add(m[1], 'markup');
  for (const m of stripped.matchAll(/url\((['"]?)(https?:[^)'"]+)\1\)/g)) add(m[2], 'inline style');

  return { cited, namespaces };
}

/** Returns `{ violations, checked, namespaces }` — violations is empty when everything is official. */
export function checkOfficialSources(html) {
  const { cited, namespaces } = collectCitedUrls(html);
  const violations = [];
  for (const [url, where] of cited) {
    const verdict = isOfficialUrl(url);
    if (!verdict.ok) violations.push({ url, where: [...where].sort().join(', '), reason: verdict.reason });
  }
  return { violations, checked: cited.size, namespaces };
}

function main() {
  const argv = process.argv.slice(2);
  const path = resolve(argv[0] ?? DEFAULT_LOOKUP_PATH);
  let html;
  try {
    html = readFileSync(path, 'utf8');
  } catch (error) {
    console.error(`check-official-sources: cannot read ${path}: ${error.message}`);
    process.exit(2); // exit 2: the checker could not run, which is not the same as "clean"
  }

  const { violations, checked, namespaces } = checkOfficialSources(html);
  console.log(`check-official-sources: ${checked} cited URL(s) in ${path}`);
  if (namespaces.length) console.log(`  ignored ${namespaces.length} XML namespace declaration(s): ${[...new Set(namespaces)].join(' ')}`);

  if (violations.length === 0) {
    console.log('  OK — every cited URL is an official source (FCC, carrier, or state regulator).');
    process.exit(0);
  }
  console.error(`  FAIL — ${violations.length} URL(s) are not official sources:`);
  for (const v of violations) console.error(`    ${v.url}\n      in: ${v.where}\n      because: ${v.reason}`);
  process.exit(1);
}

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invokedDirectly) main();

export { dirname, resolve };
