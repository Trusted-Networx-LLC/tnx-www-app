import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Seo from './Seo';
import HeroVideo from './HeroVideo';
import {
  PRODUCTS,
  PRODUCT_ORDER,
  REPLACED_ENDPOINTS,
  CALL_FEATURES,
  ARA_CAPABILITIES,
  type ProductSlug,
} from '../data/potsProducts';
import CrmFormEmbed from './CrmFormEmbed';

const SITE_URL = 'https://trustednetworx.com';

/**
 * One template, four product pages.
 *
 * Sibling product pages sharing a layout is correct — a spec sheet reads best
 * when the reader already knows where the battery row lives. The Direction A
 * rule against repeated section templates is about repetition *within* a page,
 * not across a product family.
 *
 * Section order is fixed and the numbering is derived from `sectionKeys`, not
 * hardcoded: sections appear and disappear per product (call handling is 90X1
 * and 90X2 only, the module breakdown is 90X5 only, Ara has no hardware
 * sections), and hand-numbered eyebrows drifted out of sequence the last time
 * a section was added.
 *
 * The hero must stay navy: the navbar is transparent with white text, so a
 * light hero makes the nav disappear. Product photography is transparent WebP
 * for exactly this reason — the same asset sits on navy here and on white
 * further down the page.
 */

interface ProductPageProps {
  slug: ProductSlug;
}

const ProductPage = ({ slug }: ProductPageProps) => {
  const p = PRODUCTS[slug];
  const siblings = PRODUCT_ORDER.filter((s) => s !== slug).map((s) => PRODUCTS[s]);
  const isAra = slug === 'ara';
  const hasCallFeatures = slug === '90x1' || slug === '90x2';

  const sectionKeys = [
    ...(p.features ? ['features'] : []),
    ...(p.modules ? ['modules'] : []),
    'specs',
    'replaces',
    ...(hasCallFeatures ? ['call'] : []),
    'certs',
    ...(isAra ? [] : ['ara']),
    ...(p.faqs ? ['faq'] : []),
    'siblings',
  ];
  const num = (key: string) => String(sectionKeys.indexOf(key) + 1).padStart(2, '0');

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.title,
      brand: { '@type': 'Brand', name: 'DataRemote' },
      category: 'POTS Replacement',
      description: p.seoDescription,
      url: `${SITE_URL}/pots-replacement/${p.slug}`,
      ...(p.image ? { image: `${SITE_URL}${p.image.src}` } : {}),
    },
  ];

  if (p.faqs) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }

  return (
    <div className="bg-canvas text-body antialiased">
      <Seo title={p.seoTitle} description={p.seoDescription} jsonLd={jsonLd} />

      {/* Hero — navy band */}
      <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-navy-950">
        <HeroVideo name="hero-pots" />
        <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              to="/pots-replacement"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-mono-label text-navy-300 transition-colors hover:text-white"
            >
              ← POTS Replacement
            </Link>
          </nav>

          {p.notice && (
            <p className="mb-6 inline-block rounded border border-accent-500/40 bg-accent-500/10 px-3 py-2 font-mono text-xs uppercase tracking-mono-label text-accent-500">
              {p.notice}
            </p>
          )}

          <div className="grid grid-cols-12 items-center gap-8">
            <div className={p.image ? 'col-span-12 lg:col-span-7' : 'col-span-12 max-w-3xl'}>
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                {p.eyebrow}
              </span>
              <h1 className="mt-6 font-display text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[52px] md:leading-[1.05] lg:text-[64px] lg:leading-[1.0]">
                {p.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">{p.lede}</p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {p.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-mono-label text-navy-200"
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#quote" className="btn-primary">
                  Get a line audit
                  <ArrowRight size={18} />
                </a>
                <Link to="/tools/pots-roi-calculator" className="btn-outline">
                  Calculate your savings
                </Link>
              </div>
            </div>

            {p.image && (
              <div className="col-span-12 lg:col-span-5">
                <img
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  className="mx-auto w-full max-w-md drop-shadow-2xl lg:max-w-none"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key features */}
      {p.features && (
        <section className="border-b border-hairline">
          <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                {`${num('features')} — Key features`}
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                What the unit actually does.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-body">
                {`Six capabilities decide whether a line-replacement deployment works or generates tickets. Here is where the ${p.name} stands on each.`}
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
              {p.features.map(({ title, desc }, i) => (
                <li key={title} className="bg-white p-6">
                  <span className="font-mono text-sm text-accent-text">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-display-h3 font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-body">{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Modular architecture — 90X5 only */}
      {p.modules && (
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5">
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                  {`${num('modules')} — Modular architecture`}
                </span>
                <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                  Three independent modules, one platform.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                  {p.positioning}
                </p>

                {p.detail && (
                  <figure className="mt-10">
                    <img
                      src={p.detail.src}
                      alt={p.detail.alt}
                      width={p.detail.width}
                      height={p.detail.height}
                      className="mx-auto w-full max-w-sm"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="mt-4 max-w-sm text-sm leading-relaxed text-muted-text">
                      {p.detail.caption}
                    </figcaption>
                  </figure>
                )}
              </div>

              <div className="col-span-12 lg:col-span-7">
                <ul className="divide-y divide-hairline border-t border-hairline">
                  {p.modules.map((m, i) => (
                    <li key={m.name} className="py-8">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[8rem_1fr]">
                        <div>
                          <span className="font-mono text-sm text-accent-text">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {m.image && (
                            <img
                              src={m.image.src}
                              alt={m.image.alt}
                              width={m.image.width}
                              height={m.image.height}
                              className="mt-3 w-24 sm:w-full"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-display-h3 font-semibold text-ink">
                            {m.name}
                          </h3>
                          <p className="mt-2 text-base leading-relaxed text-body">{m.role}</p>
                          <dl className="mt-4 divide-y divide-hairline border-t border-hairline">
                            {m.rows.map(({ label, value }) => (
                              <div
                                key={label}
                                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-6"
                              >
                                <dt className="text-sm font-semibold text-ink">{label}</dt>
                                <dd className="text-base leading-relaxed text-body">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {p.expansion && (
                  <div className="mt-10 border-t border-hairline pt-6">
                    <p className="font-mono text-xs uppercase tracking-mono-label text-muted-text">
                      Expansion options
                    </p>
                    <dl className="mt-3 divide-y divide-hairline border-t border-hairline">
                      {p.expansion.map(({ label, value }) => (
                        <div
                          key={label}
                          className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
                        >
                          <dt className="text-sm font-semibold text-ink">{label}</dt>
                          <dd className="text-base leading-relaxed text-body">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      <section className={`border-b border-hairline${p.modules ? '' : ' bg-white'}`}>
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                {`${num('specs')} — ${isAra ? 'Capabilities' : 'Specifications'}`}
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                {isAra ? 'What Ara does.' : 'At a glance.'}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-body">{p.positioning}</p>
              <p className="mt-5 max-w-md border-l-2 border-hairline pl-4 text-base leading-relaxed text-muted-text">
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                  Best fit
                </span>
                <span className="mt-1 block">{p.bestFor}</span>
              </p>

              {p.detail && !p.modules && (
                <figure className="mt-10">
                  <img
                    src={p.detail.src}
                    alt={p.detail.alt}
                    width={p.detail.width}
                    height={p.detail.height}
                    className="w-full max-w-sm"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="mt-4 max-w-sm text-sm leading-relaxed text-muted-text">
                    {p.detail.caption}
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="col-span-12 lg:col-span-7">
              {p.specGroups.map(({ heading, rows }) => (
                <div key={heading} className="mb-10 last:mb-0">
                  <p className="font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    {heading}
                  </p>
                  <dl className="mt-3 divide-y divide-hairline border-t border-hairline">
                    {rows.map(({ label, value }) => (
                      <div
                        key={label}
                        className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
                      >
                        <dt className="text-sm font-semibold text-ink">{label}</dt>
                        <dd className="text-base leading-relaxed text-body">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it replaces / Ara capability grid */}
      <section className={`border-b border-hairline${p.modules ? ' bg-white' : ''}`}>
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                {`${num('replaces')} — ${isAra ? 'Operations' : 'What it replaces'}`}
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                {isAra ? 'Zero truck rolls for diagnostics.' : 'The lines that come off copper.'}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                {isAra
                  ? 'Every capability below removes a reason to send someone to the site. That is the entire commercial argument for managing a fleet this way, and it is what makes our managed support offer economic across multi-site portfolios.'
                  : 'These are the endpoints still hanging on a dial tone. Each one terminates on an FXS port and rides the managed cellular path instead.'}
              </p>
            </div>

            <div className="col-span-12 lg:col-span-7">
              {isAra ? (
                <ul className="divide-y divide-hairline border-t border-hairline">
                  {ARA_CAPABILITIES.map(({ title, desc }, i) => (
                    <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                      <span className="font-mono text-sm text-accent-text">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display text-display-h3 font-semibold text-ink">
                          {title}
                        </h3>
                        <p className="mt-1 text-base leading-relaxed text-body">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2">
                  {REPLACED_ENDPOINTS.map((e) => (
                    <li
                      key={e}
                      className="border-b border-hairline py-3 text-base leading-relaxed text-body"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call features (90X1 / 90X2 only) */}
      {hasCallFeatures && (
        <section className="border-b border-hairline bg-white">
          <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5">
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                  {`${num('call')} — Call handling`}
                </span>
                <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                  It behaves like a line, because it is one.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                  Ring-down, CPC and echo cancellation are what make an elevator phone and a fire
                  panel work on this path rather than merely connect to it.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ul className="grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2">
                  {CALL_FEATURES.map((f) => (
                    <li
                      key={f}
                      className="border-b border-hairline py-3 text-base leading-relaxed text-body"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      <section className={`border-b border-hairline${hasCallFeatures ? '' : ' bg-white'}`}>
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                {`${num('certs')} — Certifications`}
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                {p.certifications.length ? 'The identifiers, in full.' : 'What we will not claim.'}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                {p.certifications.length
                  ? 'Every number below is a real, verifiable listing. An AHJ will ask for them, so we publish them rather than describing the unit as "certified" and leaving you to find out.'
                  : 'A missing certification is a fact worth publishing. Here is exactly where this product stands.'}
              </p>
            </div>

            <div className="col-span-12 lg:col-span-7">
              {p.certifications.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-hairline">
                        <th className="py-3 pr-4 font-mono text-xs uppercase tracking-mono-label text-muted-text">
                          Standard
                        </th>
                        <th className="py-3 font-mono text-xs uppercase tracking-mono-label text-muted-text">
                          Identifier
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {p.certifications.map(({ standard, identifier, holder }) => (
                        <tr key={standard}>
                          <td className="py-4 pr-4 align-top text-sm font-semibold text-ink">
                            {standard}
                          </td>
                          <td className="py-4 align-top text-base leading-relaxed text-body">
                            <span className="font-mono text-sm">{identifier}</span>
                            {holder && (
                              <span className="mt-1 block text-sm text-muted-text">
                                {`Grant holder: ${holder}`}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p
                className={`${p.certifications.length ? 'mt-8 border-t border-hairline pt-6' : ''} text-base leading-relaxed text-body`}
              >
                {p.complianceNote}
              </p>

              {p.carriers && (
                <div className="mt-8 border-t border-hairline pt-6">
                  <p className="font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    Carrier approvals
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-body">
                    {p.carriers.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 border-t border-hairline pt-6">
                <p className="font-mono text-xs uppercase tracking-mono-label text-muted-text">
                  Network layer
                </p>
                <p className="mt-3 text-base leading-relaxed text-body">
                  {'The device credentials above cover the equipment. The service obligations — E911 address association and dispatchable location, 911-call notification to designated contacts, and Kari’s Law and RAY BAUM’S Act support — are met on the MIX Networks voice network that carries the line. '}
                  <Link to="/pots-replacement" className="text-accent-text underline underline-offset-4">
                    See how the three layers fit together
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Managed by Ara (hardware pages only) */}
      {!isAra && (
        <section className={`border-b border-hairline${hasCallFeatures ? ' bg-white' : ''}`}>
          <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5">
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                  {`${num('ara')} — Management`}
                </span>
                <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                  Managed remotely, through Ara.
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                  Every unit we deploy is enrolled in Ara, DataRemote&apos;s cloud management
                  platform, and monitored by our NOC. Line-state changes raise an alert before the
                  customer notices, and most faults are diagnosed without a site visit.
                </p>
                <Link
                  to="/pots-replacement/ara"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-mono-label text-accent-text transition-colors hover:text-ink"
                >
                  Ara platform detail
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ul className="grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2">
                  {ARA_CAPABILITIES.slice(0, 6).map(({ title }) => (
                    <li
                      key={title}
                      className="border-b border-hairline py-3 text-base leading-relaxed text-body"
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {p.faqs && (
        <section className="border-b border-hairline">
          <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5">
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                  {`${num('faq')} — Questions`}
                </span>
                <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                  {`What buyers ask about the ${p.name}.`}
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                  {`If the answer you need is not here, ask us directly — the line audit below is free and comes back within one business day.`}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7">
                {/*
                  data-faq is read by scripts/patch-prerendered-seo.cjs, which
                  rebuilds FAQPage JSON-LD from the prerendered markup. Helmet's
                  script tags do not survive the react-snap snapshot, so the
                  patch script is the only reliable emitter — and reading the Q/A
                  back out of the DOM keeps potsProducts.ts the single source of
                  truth instead of duplicating the copy into the build script.
                */}
                <dl data-faq="true" className="divide-y divide-hairline border-t border-hairline">
                  {p.faqs.map(({ q, a }) => (
                    <div key={q} className="py-6">
                      <dt className="font-display text-display-h3 font-semibold text-ink">{q}</dt>
                      <dd className="mt-3 text-base leading-relaxed text-body">{a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Siblings */}
      <section className="border-b border-hairline bg-white">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
            {`${num('siblings')} — The rest of the family`}
          </span>
          <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
            Compare the alternatives.
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-px border border-hairline bg-hairline md:grid-cols-3">
            {siblings.map((s) => (
              <li key={s.slug} className="bg-white">
                <Link to={`/pots-replacement/${s.slug}`} className="group block h-full p-6">
                  <span className="font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    {s.eyebrow}
                  </span>
                  <h3 className="mt-3 font-display text-display-h3 font-semibold text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-body">{s.bestFor}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-mono-label text-accent-text">
                    View specs
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA / form */}
      <section id="quote" className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                Line audit
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
                Get your free line audit.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
                Tell us about your sites and we&apos;ll come back with the right model, a
                deployment plan and pricing within one business day.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-lg border border-divider bg-navy-900 p-8">
                <CrmFormEmbed form="potsVoice" variant="bare" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
