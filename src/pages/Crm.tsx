import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import ProductVideo from '../components/ProductVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const capabilities = [
  { n: '01', title: 'Three channels, one pipeline view', body: 'Direct customers, agents, and resellers each get the right stages and commission fields.' },
  { n: '02', title: 'Telecom-native records', body: 'Site counts, line inventories, contract terms, install and cutover dates, MRC/NRC on every opportunity.' },
  { n: '03', title: 'Quotes and renewals', body: 'Build a quote from an opportunity; get renewal alerts before the term ends.' },
  { n: '04', title: 'AI-maintained', body: "Agents from Partner Hub log calls, enrich contacts, qualify leads, and move stages so reps don't." },
  { n: '05', title: 'Reporting that matters', body: 'Pipeline by channel, by vertical, by product; forecast by close date.' },
];

const whoFor = [
  'Telecom agents and MSPs tired of bending HubSpot or Pipedrive into shape',
  'Reseller programs that need partner-level visibility without exposing other partners’ deals',
  'Small sales teams that want automation without an admin',
];

const faqs = [
  { q: 'Can I import from Pipedrive / HubSpot?', a: 'Yes — CSV import with field mapping.' },
  { q: 'Does it replace Partner Hub?', a: 'No. Partner Hub manages agents; TNX CRM manages deals. They share data.' },
  { q: 'Can partners see each other’s deals?', a: 'No. Partner visibility is scoped to their own book.' },
];

const Crm = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="bg-canvas text-body antialiased">
      <Seo
        title="TNX CRM — Opportunity Management Telecom | TrustedNetworx"
        description="Track direct, agent, and reseller deals with telecom-native fields and AI agents that keep the pipeline current, from the operators behind TrustedNetworx."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'TNX CRM',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Opportunity management for telecom, MSP and channel sales: direct, agent, and reseller pipelines with telecom-native fields.',
          },
          faqJsonLd,
        ]}
      />

      {/* Hero — navy band with motion; the product frame below overlaps it */}
      <section className="relative overflow-hidden bg-navy-950 pt-32 pb-44">
        <HeroVideo name="hero-crm" />
        <div className="relative z-10 mx-auto w-full max-w-site px-6 md:px-gutter">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
              TNX CRM
            </span>
            <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] lg:text-[72px] lg:leading-[1.0]">
              The CRM that speaks telecom.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-200">
              Sites, lines, terms, install dates, MRC — first-class fields, not custom hacks.
            </p>
          </div>
        </div>
      </section>

      {/* Product screenshot — overlaps the hero band */}
      <section className="relative z-10 -mt-[120px]">
        <div className="mx-auto w-full max-w-site px-6 pb-16 md:px-gutter">
          <div className="rounded-lg border border-hairline bg-white p-4">
            <ProductVideo
              name="crm-value"
              label="TNX CRM pipeline — account data landing on a deal, a next step being set, and the deal moving to Negotiation. Sample data."
              className="w-full rounded border border-hairline"
            />
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">01 Pipeline view</span>
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">02 Quotes + renewals</span>
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">03 Reporting</span>
            </div>
          </div>
        </div>
      </section>

      {/* What it does — numbered hairline list */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                What it does
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
                Deals, quotes, renewals — telecom-shaped.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ul className="divide-y divide-hairline border-t border-hairline">
                {capabilities.map(({ n, title, body }) => (
                  <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                    <span className="font-mono text-sm text-accent-text">{n}</span>
                    <span>
                      <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                      <span className="mt-1 block text-base leading-relaxed text-body">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-b border-hairline bg-white">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">Who it's for</span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">Built for channel sales.</h2>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ul className="divide-y divide-hairline border-t border-hairline">
                {whoFor.map((item) => (
                  <li key={item} className="py-4 text-lg leading-relaxed text-body">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it fits with Partner Hub — dark band */}
      <section className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">With Partner Hub</span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">How it fits with Partner Hub.</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-200">
              Partner Hub manages agents; TNX CRM manages deals. They share one data model, so your
              AI agents write straight into your pipeline.
            </p>
            <Link
              to="/platforms/partner-hub"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              Explore Partner Hub
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">FAQ</span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">Asked before the trial.</h2>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ul className="divide-y divide-hairline border-t border-hairline">
                {faqs.map((f) => (
                  <li key={f.q} className="py-5">
                    <h3 className="font-display text-display-h3 font-semibold text-ink">{f.q}</h3>
                    <p className="mt-2 leading-relaxed text-body">{f.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / intake */}
      <section id="trial" className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">Trial</span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">Try it on your own pipeline.</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
                Start a trial and import a CSV — we'll map your fields.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-lg border border-divider bg-navy-900 p-8">
                <CrmFormEmbed form="contact" variant="bare" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Crm;
