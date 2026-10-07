import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const services = [
  { n: '01', title: 'AI workflow automation', desc: 'Map your workflows, identify automation targets, and deploy AI agents that run continuously — order entry, provisioning, billing reconciliation, ticket routing.' },
  { n: '02', title: 'AI-powered customer engagement', desc: 'Intelligent chat, voice, and messaging agents that handle inbound inquiries, qualify leads, schedule appointments — 24/7.' },
  { n: '03', title: 'AI strategy & roadmapping', desc: 'An operations audit, tool evaluation, and a prioritized implementation plan with clear ROI projections.' },
  { n: '04', title: 'Sales & CRM AI enablement', desc: 'AI tools that surface the right opportunities, automate follow-up, generate proposals faster, and keep the pipeline clean.' },
  { n: '05', title: 'Telecom + AI integration', desc: 'Bridge telecom infrastructure with AI-driven operations — smarter call routing, anomaly detection, usage analytics.' },
  { n: '06', title: 'Channel partner AI enablement', desc: 'White-label-ready AI programs that accelerate your MSP, VAR, and agent partners without creating support overhead.' },
];

const industries = [
  { n: '01', title: 'MSPs & telecom agents', desc: 'Automate quoting, renewals, and onboarding; surface at-risk accounts before churn.' },
  { n: '02', title: 'Healthcare & senior living', desc: 'Streamline resident communications and compliance documentation in HIPAA-aware environments.' },
  { n: '03', title: 'Hospitality', desc: 'Guest-facing AI, maintenance workflows, and reduced front-desk call volume.' },
  { n: '04', title: 'Property management', desc: 'Tenant communication, lease renewals, maintenance dispatch, vendor coordination.' },
  { n: '05', title: 'Multi-site enterprises', desc: 'Centralized operations intelligence across locations.' },
  { n: '06', title: 'Field services & logistics', desc: 'Intelligent dispatch, route optimization, automated job documentation.' },
];

const steps = [
  { n: '01', title: 'Discovery', desc: 'We audit your workflows, tools, and data — and find where AI creates the most immediate leverage.' },
  { n: '02', title: 'Roadmap', desc: 'A prioritized plan with timelines, ROI estimates, and tool recommendations.' },
  { n: '03', title: 'Deploy', desc: 'We configure, integrate, and launch alongside your team to ensure adoption.' },
  { n: '04', title: 'Optimize', desc: 'Ongoing support and performance reviews as your business scales.' },
];

const differentiators = [
  { n: '01', title: 'Telecom-native context', desc: "We know telecom — AI implementations that account for your actual billing, provisioning, and channel operations." },
  { n: '02', title: 'Execution over theory', desc: 'Every engagement ends with something running, not a recommendation report.' },
  { n: '03', title: 'No-bloat engagements', desc: 'Scoped to your actual needs. Transparent pricing, fast timelines, measurable outcomes.' },
  { n: '04', title: 'Operator-to-operator', desc: 'We advise from experience running telecom operations — not from textbooks.' },
];

/**
 * Stats strip.
 *
 * Two tiles were removed rather than softened:
 *  - "40%+ Reduction in manual admin time" had no source. A hedged version of
 *    an unsourced number reads worse than no number.
 *  - "3x Faster lead follow-up with AI" had no source and no definition of
 *    what it was 3x faster than.
 *
 * "Weeks — not months" was also dropped: it contradicted the 5–10 day window
 * published on / and /ai-workforce. Two timeframes on one site is a defect.
 *
 * The three that remain are defensible. 24/7 is what the agents do, 5–10 days
 * is Carter's own confirmed deployment window (keep in sync with Home.tsx and
 * AiWorkforce.tsx), and the starting scope is a description of the method, not
 * a claim about outcomes. Do not put an unsourced round number back here.
 */
const stats = [
  { value: '24/7', label: 'AI-assisted customer engagement' },
  { value: '5–10 days', label: 'From kickoff to first agent live' },
  { value: 'One workflow', label: 'Where every engagement starts' },
];

const AiConsulting = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="AI Consulting & Solutions | TrustedNetworx"
      description="Practical AI consulting and implementation for telecom operators, channel partners, and multi-site businesses — automation, engagement, and strategy that ships."
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Consulting',
        provider: { '@type': 'Organization', name: 'TrustedNetworx' },
        areaServed: { '@type': 'Country', name: 'US' },
        serviceType: 'AI Consulting',
        description: 'Practical AI consulting and implementation for telecom and multi-site businesses.',
        url: 'https://trustednetworx.com/ai-consulting',
      }}
    />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-ai-consulting" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            AI Consulting
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            Practical AI. Deployed, not decked.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            We map your operations, find the automation wins with real ROI, and build them into
            production — for telecom operators, channel partners, and multi-site businesses.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              Get a quote
              <ArrowRight size={18} />
            </Link>
            <a href="#services" className="btn-outline">
              Explore services
            </a>
          </div>
          {/* Plain crawlable link line to the free tools (SEO pass 2026-09-10). */}
          <p className="mt-6 text-sm text-navy-200">
            Free tools:{' '}
            <Link to="/tools/ai-readiness" className="font-semibold text-brand-300 hover:text-brand-200">
              AI Readiness Assessment
            </Link>
          </p>
        </div>
      </div>
    </section>

    {/* Stats strip */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-10 md:px-gutter">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`py-6${i > 0 ? ' sm:border-l sm:border-hairline sm:pl-8 max-sm:border-t max-sm:border-hairline' : ''}`}>
              <p className="font-display text-stat font-semibold text-ink">{value}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-mono-label text-muted-text">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 01 — What we deliver */}
    <section id="services" className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — What we deliver
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Focused engagements, not software demos.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {services.map(({ n, title, desc }) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-mono text-sm text-accent-text">{n}</span>
                  <div>
                    <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-body">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 02 — Industries */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              02 — Industries
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Built for how you operate.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {industries.map(({ n, title, desc }) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-mono text-sm text-accent-text">{n}</span>
                  <div>
                    <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-body">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 03 — How we work */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              03 — How we work
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              From discovery to live deployment.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {steps.map(({ n, title, desc }) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-mono text-sm text-accent-text">{n}</span>
                  <div>
                    <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-body">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 04 — Why TNX */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              04 — Why TrustedNetworx
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Operator-to-operator, not vendor-to-client.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {differentiators.map(({ n, title, desc }) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-mono text-sm text-accent-text">{n}</span>
                  <div>
                    <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-body">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* CTA / form */}
    <section className="bg-navy-950">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">Start</span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
              Ready to put AI to work?
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
              Tell us what&apos;s eating your team&apos;s time or costing you deals, and we&apos;ll
              tell you exactly where AI helps — and how fast.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-lg border border-divider bg-navy-900 p-8">
              <CrmFormEmbed form="ai" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AiConsulting;
