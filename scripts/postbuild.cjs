#!/usr/bin/env node
const { existsSync } = require('fs');
const { spawnSync } = require('child_process');
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function runSeoPatch() {
  const patchResult = spawnSync(process.execPath, [require.resolve('./patch-prerendered-seo.cjs')], {
    stdio: 'inherit',
    env: process.env,
  });
  if (typeof patchResult.status === 'number') {
    process.exit(patchResult.status);
  }
  console.error('[postbuild] SEO patch script did not return an exit code.');
  process.exit(1);
}

async function resolveChromiumPath() {
  const envChromium = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN;
  if (envChromium && existsSync(envChromium)) return envChromium;

  try {
    const puppeteer = require('puppeteer');
    const path = await puppeteer.executablePath();
    if (path && existsSync(path)) return path;
  } catch (error) {
    console.warn('[postbuild] Puppeteer-managed browser not available:', error?.message || error);
  }

  const localSnapChromium = '/snap/bin/chromium';
  if (existsSync(localSnapChromium)) return localSnapChromium;

  return null;
}

// Cache dir that Netlify persists between builds (node_modules is cached),
// so the ~120MB Chrome download happens once, not on every deploy.
const CHROME_CACHE_DIR = require('path').join(process.cwd(), 'node_modules', '.cache', 'puppeteer');

/** Find a chrome executable under the cache dir (chrome/<build>/chrome-linux64/chrome). */
function findChromeInCache(cacheDir) {
  const path = require('path');
  const fs = require('fs');
  const root = path.join(cacheDir, 'chrome');
  if (!existsSync(root)) return null;
  for (const build of fs.readdirSync(root)) {
    for (const platformDir of ['chrome-linux64', 'chrome-linux', 'chrome-mac-x64', 'chrome-mac-arm64']) {
      const candidate = path.join(root, build, platformDir, 'chrome');
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * Resolve a Chromium, downloading one into the persistent cache if the build
 * environment (e.g. Netlify's image) doesn't provide any. Pre-rendering is a
 * critical build step — see the empty-shell incident — so we go get a browser
 * rather than silently skipping.
 */
async function ensureChromiumPath() {
  const resolved = await resolveChromiumPath();
  if (resolved) return resolved;

  const cached = findChromeInCache(CHROME_CACHE_DIR);
  if (cached) {
    console.log(`[postbuild] Using cached Chrome at: ${cached}`);
    return cached;
  }

  console.log('[postbuild] No Chromium in this environment — downloading Chrome into node_modules/.cache/puppeteer (persisted by Netlify build cache)...');
  const result = spawnSync(npxCommand, ['puppeteer', 'browsers', 'install', 'chrome'], {
    stdio: 'inherit',
    env: { ...process.env, PUPPETEER_CACHE_DIR: CHROME_CACHE_DIR },
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.warn('[postbuild] Chrome download failed. React-snap cannot run in this environment.');
    return null;
  }
  const downloaded = findChromeInCache(CHROME_CACHE_DIR);
  if (downloaded) console.log(`[postbuild] Chrome installed at: ${downloaded}`);
  return downloaded;
}

/**
 * The one and only condition that may bypass prerendering. Anything else
 * (missing binary, failed download, launch error, timeout, or some other env
 * var set in CI) must fail the build — a green build that ships meta-only
 * shells is worse than a red one.
 */
const BYPASS_ENV = 'DISABLE_REACT_SNAP';
const SNAPSHOT_MARKER = 'data-seo-ready';
const ROOT_SHELL = require('path').join(process.cwd(), 'dist', 'index.html');

/**
 * The prerender gate. Every path that cannot produce prerendered HTML lands
 * here and exits non-zero, so `npm run build` cannot go green without
 * prerendering. The only escape hatch is the explicit, logged bypass.
 */
function failPrerender(reason) {
  console.error('');
  console.error('[postbuild] ================ PRERENDER GATE FAILURE ================');
  console.error(`[postbuild] ${reason}`);
  console.error('[postbuild] Refusing to emit a deployable build: prerendered HTML is what');
  console.error('[postbuild] makes this site visible to non-JS crawlers and AI engines.');
  console.error(`[postbuild] If skipping prerendering is genuinely intended, re-run with the`);
  console.error(`[postbuild] explicit bypass ${BYPASS_ENV}=1 (the skip is logged loudly).`);
  console.error('[postbuild] ======================================================');
  console.error('');
  process.exit(1);
}

/**
 * Count HTML files under dist/ carrying the react-snap readiness marker.
 * react-snap only produces that attribute by snapshotting a live browser DOM,
 * so a non-zero count is evidence that prerendering actually happened.
 */
function countPrerenderedHtml(dir) {
  const fs = require('fs');
  const path = require('path');
  let count = 0;
  let visited = 0;
  const walk = (current) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        visited += 1;
        try {
          if (fs.readFileSync(full, 'utf8').includes(SNAPSHOT_MARKER)) count += 1;
        } catch {
          /* unreadable file — cannot count as prerendered */
        }
      }
    }
  };
  walk(dir);
  return { count, visited };
}

/** Post-condition: react-snap said OK, so prerendered HTML must exist on disk. */
function assertPrerenderOutput() {
  const fs = require('fs');
  const { count, visited } = countPrerenderedHtml(require('path').join(process.cwd(), 'dist'));
  if (count < 1) {
    failPrerender(
      `react-snap exited 0 but produced no prerendered HTML: scanned ${visited} .html file(s) in dist/, none carried "${SNAPSHOT_MARKER}".`,
    );
  }
  if (!fs.existsSync(ROOT_SHELL) || !fs.readFileSync(ROOT_SHELL, 'utf8').includes(SNAPSHOT_MARKER)) {
    failPrerender(
      `react-snap exited 0 but the root shell dist/index.html carries no "${SNAPSHOT_MARKER}" — the homepage would ship as a meta-only shell.`,
    );
  }
  console.log(`[postbuild] Prerender assertion OK: ${count}/${visited} .html file(s) in dist/ carry "${SNAPSHOT_MARKER}", including dist/index.html.`);
}

async function main() {
  // Run react-snap by default in every environment. A Chromium that cannot be
  // acquired, or react-snap failing to run, now FAILS the build (see
  // failPrerender) — opt OUT explicitly with DISABLE_REACT_SNAP=1 instead.
  const shouldRun = process.env[BYPASS_ENV] !== '1';

  if (!shouldRun) {
    console.log('');
    console.log('[postbuild] ============== PRERENDER BYPASSED ==============');
    console.log(`[postbuild] ${BYPASS_ENV}=1 — react-snap is NOT running.`);
    console.log('[postbuild] This output has NO prerendered HTML (meta-only shells).');
    console.log(`[postbuild] ${BYPASS_ENV}=1 is the only supported way to skip, and it is`);
    console.log('[postbuild] never silent — a skipped prerender is a non-production build.');
    console.log('[postbuild] ================================================');
    console.log('');
    runSeoPatch();
    return;
  }

  const chromiumPath = await ensureChromiumPath();
  if (!chromiumPath) {
    failPrerender('No Chromium executable available — react-snap cannot run.');
  }

  console.log(`[postbuild] Running react-snap with Chromium at: ${chromiumPath}`);
  const result = spawnSync(process.execPath, [require.resolve('./run-react-snap.cjs'), chromiumPath], {
    stdio: 'inherit',
    env: process.env,
  });

  if (typeof result.status === 'number') {
    if (result.status !== 0) {
      failPrerender(`react-snap failed (exit code ${result.status}); no prerendered build was produced.`);
    }
    assertPrerenderOutput();
    runSeoPatch();
    return;
  }

  failPrerender(
    `react-snap did not return an exit code (spawn error: ${result.error?.message || 'unknown'}).`,
  );
}

main().catch((error) => {
  console.error('[postbuild] Fatal error:', error?.stack || error);
  process.exit(1);
});
