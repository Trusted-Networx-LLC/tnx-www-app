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
    console.warn('[postbuild] Chrome download failed; pre-rendering will be skipped this build.');
    return null;
  }
  const downloaded = findChromeInCache(CHROME_CACHE_DIR);
  if (downloaded) console.log(`[postbuild] Chrome installed at: ${downloaded}`);
  return downloaded;
}

async function main() {
  // Run react-snap by default in every environment that has a Chromium
  // available (falls back gracefully below when one isn't). Pre-rendered
  // HTML is what makes the site visible to non-JS crawlers and AI engines —
  // opt OUT with DISABLE_REACT_SNAP=1 rather than opting in.
  const shouldRun = process.env.DISABLE_REACT_SNAP !== '1';

  if (!shouldRun) {
    console.log('[postbuild] react-snap disabled via DISABLE_REACT_SNAP=1. Creating static blog route shells and patching SEO metadata.');
    runSeoPatch();
    return;
  }

  const chromiumPath = await ensureChromiumPath();
  if (!chromiumPath) {
    console.log('[postbuild] No Chromium executable available; skipping react-snap and patching SEO metadata directly.');
    console.log('[postbuild] WARNING: pages will ship as meta-only shells. Do not deploy this output to production.');
    runSeoPatch();
    return;
  }

  console.log(`[postbuild] Running react-snap with Chromium at: ${chromiumPath}`);
  const result = spawnSync(npxCommand, ['react-snap'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PUPPETEER_EXECUTABLE_PATH: chromiumPath,
      CHROME_BIN: chromiumPath,
    },
    shell: process.platform === 'win32',
  });

  if (typeof result.status === 'number') {
    if (result.status !== 0) {
      process.exit(result.status);
    }
    runSeoPatch();
    return;
  }

  console.error('[postbuild] react-snap did not return an exit code.');
  process.exit(1);
}

main().catch((error) => {
  console.error('[postbuild] Fatal error:', error?.stack || error);
  process.exit(1);
});
