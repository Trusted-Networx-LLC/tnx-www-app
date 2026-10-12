/**
 * tnx-crm-bus#98, step 4: keep the PSTN Sunset lookup citing official sources only.
 *
 * The first test is the real guard. The two after it are controls: they plant citations that MUST be
 * rejected, so this file cannot quietly become a check that passes for free.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { checkOfficialSources, collectCitedUrls } from '../scripts/check-official-sources.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const LOOKUP = join(here, '..', 'public', 'embeds', 'pstn-sunset-lookup.html');
const html = readFileSync(LOOKUP, 'utf8');

test('the lookup cites only official sources (FCC, carriers, state regulators)', () => {
  const { violations, checked } = checkOfficialSources(html);

  // Guard against the check silently finding nothing to look at.
  assert.ok(checked > 300, `expected to scan hundreds of cited URLs, scanned ${checked}`);
  assert.deepEqual(
    violations,
    [],
    `non-official URL(s) cited:\n${violations.map((v) => `  ${v.url} (${v.where}) — ${v.reason}`).join('\n')}`,
  );
});

test('it reads citations out of the data block as well as the markup', () => {
  const { cited } = collectCitedUrls(html);
  const urls = [...cited.keys()];
  assert.ok(urls.some((u) => u.includes('docs.fcc.gov')), 'expected at least one docs.fcc.gov citation');
  assert.ok(urls.some((u) => u.includes('ctfassets.net')), 'expected the Windstream notice PDFs to be scanned');
  assert.ok([...cited.values()].some((w) => w.has('data block')), 'expected citations tagged as coming from the data block');
});

test('CONTROL: a vendor newsroom URL is rejected — the guard can still fail', () => {
  const planted =
    'https://dataremote.com/newsroom/news/verizon-section-214-application-discontinue-copper-pots-nine-states-dc';
  const { violations } = checkOfficialSources(html.replace('</footer>', `<a href="${planted}">x</a></footer>`));
  const hit = violations.find((v) => v.url === planted);
  assert.ok(hit, 'a dataremote.com citation must be reported as a violation');
  assert.match(hit.reason, /allowlist/);
});

test('CONTROL: a non-Windstream file on the CDN is rejected — the host alone is not enough', () => {
  const planted = 'https://assets.ctfassets.net/8d4yn2ywtegc/abc/marketing-brochure-2026.pdf';
  const { violations } = checkOfficialSources(html.replace('</footer>', `<a href="${planted}">x</a></footer>`));
  const hit = violations.find((v) => v.url === planted);
  assert.ok(hit, 'a non-Windstream-notice URL on ctfassets.net must be reported as a violation');
  assert.match(hit.reason, /network-change notice PDFs only/);
});

test('CONTROL: a state regulator domain is allowed, and a lookalike is not', () => {
  // Assert about the planted URL only: this file is expected to be clean of violations once the
  // bus#98 edits land, and these controls must not depend on that being true yet.
  const { violations: ok } = checkOfficialSources(html.replace('</footer>', '<a href="https://puc.pa.gov/filing.pdf">x</a></footer>'));
  assert.ok(!ok.some((v) => v.url.includes('puc.pa.gov/')), 'a *.gov regulator URL must not be a violation');

  const { violations: bad } = checkOfficialSources(html.replace('</footer>', '<a href="https://puc.pa.gov.evil.example/filing.pdf">x</a></footer>'));
  assert.ok(bad.some((v) => v.url.includes('evil.example')), 'a lookalike domain must be rejected');
});

test('XML namespaces are declarations, not citations, and are reported as ignored', () => {
  const withNamespace = html.replace('<body', '<svg xmlns="http://www.w3.org/2000/svg"></svg><body');
  const { violations, namespaces } = checkOfficialSources(withNamespace);
  assert.ok(!violations.some((v) => v.url.includes('w3.org')), 'an svg namespace must not be treated as a cited source');
  assert.ok(namespaces.includes('http://www.w3.org/2000/svg'));
});
