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
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/** The published forms, exactly as they appear in the TrustedNetworx workspace. */
const PUBLISHED = {
  contact: 'b94a66e6-c983-4004-88e4-7a532ce98b76',
  ai: '602b1dfe-9e19-4647-9222-a0490a65361b',
  potsVoice: '8231e559-674b-48ed-af83-601e0cf004c9',
  quick: 'a7c3e5f1-2b4d-4e6f-8a90-1c2d3e4f5a6b',
};

/** page -> form key that page must show. */
const PLACEMENTS = {
  'src/pages/Ai.tsx': 'ai',
  'src/pages/PotsReplacement.tsx': 'potsVoice',
  'src/pages/VoiceSolutions.tsx': 'potsVoice',
  'src/pages/Contact.tsx': 'quick',
  'src/pages/Partners.tsx': 'quick',
  'src/pages/Home.tsx': 'quick',
  'src/pages/pots/PstnShutdownLookup.tsx': 'quick',
  'src/pages/tools/FailoverReadiness.tsx': 'quick',
  'src/pages/tools/AiReadinessAssessment.tsx': 'quick',
  'src/pages/tools/CopperSunsetRisk.tsx': 'quick',
  'src/pages/Crm.tsx': 'contact',
  'src/pages/PartnerHub.tsx': 'contact',
  'src/components/ProductPage.tsx': 'potsVoice',
};

test('the published form ids are the ones the site embeds', () => {
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
  // The chat widget's embed must survive the edit.
  assert.ok(frameSrc[1].includes('https://enhancedlines.com'), 'frame-src lost https://enhancedlines.com');
  // One lead path (tnx-crm-bus#79): the unused Pipedrive web-forms loader is gone, so is its CSP.
  assert.ok(!csp.includes('pipedrive'), 'the CSP must not allow Pipedrive any more');
  for (const page of ['index.html', 'src/index.html']) {
    assert.ok(!read(page).includes('pipedrive'), `${page} must not load the Pipedrive loader`);
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

test('one lead path: assessment tools send their answers to the CRM form', () => {
  // Since #54 every lead goes through a TNX CRM embed and the local lead function is gone.
  // Each assessment tool must hand its questions, answers and score to the embed, or the CRM
  // gets a contact with none of the context the visitor just gave us.
  assert.ok(!existsSync(join(ROOT, 'netlify/functions/lead.mts')), 'lead.mts was retired in #54');
  for (const tool of [
    'src/pages/tools/AiReadinessAssessment.tsx',
    'src/pages/tools/CopperSunsetRisk.tsx',
    'src/pages/tools/FailoverReadiness.tsx',
  ]) {
    const src = read(tool);
    assert.ok(!src.includes('/.netlify/functions/lead'), `${tool} must not post to the retired lead function`);
    assert.match(src, /<CrmFormEmbed[^>]*context=\{crmContext\}/, `${tool} must pass its answers to the CRM form`);
  }
  assert.match(read('src/lib/crm-forms.ts'), /\?ctx=/, 'crmFormUrl must carry the context as ?ctx=');
});
