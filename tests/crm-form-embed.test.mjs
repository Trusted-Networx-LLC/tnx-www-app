/**
 * Guards for the TNX CRM form embeds (tnx-crm-bus#67).
 *
 * These are red on main and green after the change — there is no CRM form on the site before it.
 * They are deliberately source-level: whether an iframe actually renders and submits depends on two
 * policies that live outside this repo (the site's CSP, and the published form's `allowed_origins`
 * on the CRM side), so the tests pin the parts the repo controls and the PR carries the rendered
 * evidence for the rest.
 *
 * Run: node --test tests/crm-form-embed.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const rel = relative;
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/** The published forms, exactly as they appear in the TrustedNetworx workspace. */
const PUBLISHED = {
  contact: 'b94a66e6-c983-4004-88e4-7a532ce98b76',
  ai: '602b1dfe-9e19-4647-9222-a0490a65361b',
  potsVoice: '8231e559-674b-48ed-af83-601e0cf004c9',
};

/** page -> form key that page must show. */
const PLACEMENTS = {
  'src/pages/Ai.tsx': 'ai',
  'src/pages/PotsReplacement.tsx': 'potsVoice',
  'src/pages/VoiceSolutions.tsx': 'potsVoice',
  'src/pages/Contact.tsx': 'contact',
  'src/pages/Partners.tsx': 'contact',
  'src/pages/Home.tsx': 'contact',
  'src/pages/Crm.tsx': 'contact',
  'src/pages/PartnerHub.tsx': 'contact',
  'src/components/ProductPage.tsx': 'potsVoice',
};

test('the three published form ids are the ones the site embeds', () => {
  const source = read('src/lib/crm-forms.ts');
  for (const [key, id] of Object.entries(PUBLISHED)) {
    assert.ok(source.includes(id), `${key}: expected the published form id ${id}`);
  }
  // The origin is built once, from the constant, never pasted into a page.
  assert.match(source, /CRM_FORM_ORIGIN = 'https:\/\/tnxcrm\.com'/, 'the CRM origin is a constant');
  assert.ok(source.includes('/forms/${CRM_FORMS[key].id}'), 'the URL is built from the constant');
});

test('every placement shows its form through the one component', () => {
  for (const [page, form] of Object.entries(PLACEMENTS)) {
    const source = read(page);
    assert.match(
      source,
      new RegExp(`<CrmFormEmbed[^>]*form="${form}"`),
      `${page}: expected an embed of "${form}"`,
    );
    assert.match(source, /import CrmFormEmbed from '[./]/, `${page}: expected the component import`);
  }
});

test('no placement page still carries the local MultiStepForm (one form per page)', () => {
  for (const page of Object.keys(PLACEMENTS)) {
    const source = read(page);
    assert.ok(
      !source.includes('MultiStepForm'),
      `${page}: still references MultiStepForm — the page would show two lead forms`,
    );
  }
});

test('the CSP allows the CRM to be framed', () => {
  const csp = read('netlify.toml')
    .split('\n')
    .find((line) => line.trim().startsWith('Content-Security-Policy'));
  assert.ok(csp, 'expected a Content-Security-Policy header in netlify.toml');
  const frameSrc = csp.match(/frame-src ([^;]+);/);
  assert.ok(frameSrc, 'expected a frame-src directive');
  assert.ok(
    frameSrc[1].split(/\s+/).includes('https://tnxcrm.com'),
    `frame-src must allow https://tnxcrm.com, got: ${frameSrc[1]}`,
  );
  // The ChatWidget embed must survive the edit. Pipedrive must NOT: it was a second lead path and
  // was removed by tnx-crm-bus#69 (the loader is gone from index.html and src/index.html).
  assert.ok(frameSrc[1].includes('https://enhancedlines.com'), 'frame-src lost the ChatWidget origin');
  assert.ok(
    !frameSrc[1].includes('pipedrive'),
    `frame-src must no longer allow Pipedrive, got: ${frameSrc[1]}`,
  );
  const scriptSrc = csp.match(/script-src ([^;]+);/);
  assert.ok(scriptSrc, 'expected a script-src directive');
  assert.ok(!scriptSrc[1].includes('pipedrive'), `script-src must no longer load Pipedrive, got: ${scriptSrc[1]}`);
  for (const html of ['index.html', 'src/index.html']) {
    assert.ok(!read(html).toLowerCase().includes('pipedrive'), `${html} must not load Pipedrive`);
  }
  assert.ok(!frameSrc[1].includes('*'), 'frame-src must not be widened with a wildcard');
});

test('the iframe height is declared per breakpoint, not fixed', () => {
  const css = read('src/index.css');
  assert.match(css, /\.crm-form-embed iframe\s*\{[^}]*height:\s*var\(--crm-form-height/,
    'expected a desktop iframe height from the CSS variable');
  assert.match(css, /@media \(max-width: 640px\)[\s\S]*\.crm-form-embed iframe\s*\{[^}]*height:\s*var\(--crm-form-height-phone/,
    'expected a phone-width iframe height');
});

test('the site has ONE lead path: the CRM embed', () => {
  // REVERSAL, recorded deliberately (2026-10-02, tnx-crm-bus#69). This test previously asserted
  // Carter's earlier constraint — "the forms move, the calculators do not", i.e. the tool pages and
  // the calculators must keep a route to /.netlify/functions/lead. Carter's work order reversed that:
  // one lead path only, the TNX CRM web form embed, and the local function is retired. The old
  // invariant is not deleted quietly; it is replaced, and this comment is the record of why.
  const retired = [
    'netlify/functions/lead.mts',
    'src/components/MultiStepForm.tsx',
    'src/components/ExitIntentPopup.tsx',
    'src/pages/tools/AiRoiCalculator.tsx',
    'src/pages/tools/PotsRoiCalculator.tsx',
  ];
  for (const gone of retired) {
    assert.ok(!existsSync(join(ROOT, gone)), `${gone} must be deleted — it was a second lead path`);
  }

  // No source file may still post to, or reference, the retired function.
  // tests/ is excluded on purpose: a test may legitimately NAME the retired path (this one does,
  // in the assertion below), and scanning it made the check match its own source. The invariant is
  // about shipped code and config, which is what the walk covers.
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', 'dist', '.git', 'tests'].includes(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|mts|mjs|cjs|js|html)$/.test(entry.name)) files.push(full);
    }
  };
  walk(ROOT);
  const offenders = files.filter((f) => read(rel(ROOT, f)).includes('netlify/functions/lead'));
  assert.deepEqual(offenders.map((f) => rel(ROOT, f)), [], 'these files still reference the retired function');

  // Every page that takes a lead must go through the embed.
  for (const page of ['src/pages/Contact.tsx', 'src/pages/Home.tsx', 'src/pages/Ai.tsx']) {
    assert.ok(read(page).includes('CrmFormEmbed'), `${page}: expected the CRM embed`);
  }
});
