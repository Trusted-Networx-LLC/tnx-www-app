import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const sections = [
  { n: '01', to: '/ai-workforce', title: 'AI Workforce', desc: 'AI agents that sell, support, and monitor — 24/7, telecom-native, tenant-isolated.' },
  { n: '02', to: '/ai-consulting', title: 'AI Consulting', desc: 'Find the one workflow worth automating first, then deploy it end-to-end.' },
  { n: '03', to: '/platforms/partner-hub', title: 'TNX Partner Hub', desc: 'The control plane for running a fleet of agents — budgets, approvals, kill switches.' },
];

const tools = [
  { n: '01', to: '/tools/ai-readiness', title: 'AI Readiness Assessment', desc: 'Score your organization against the signals that predict a successful AI rollout.' },
  { n: '02', to: '/tools/ai-roi-calculator', title: 'AI ROI Calculator', desc: 'Estimate the payback of putting AI agents on your quoting, support, and scheduling.' },
];

const posts = [
  { slug: 'when-ai-sales-agents-outperform-humans', title: 'When AI Sales Agents Outperform Humans (And When They Don\u2019t)' },
  { slug: 'ai-email-triage-2026', title: 'AI Email Triage: How to Stop Drowning in Your Inbox' },
  { slug: 'real-roi-of-ai-in-telecom', title: 'The Real ROI of AI in Telecom: Beyond the Hype' },
  { slug: 'ai-readiness-checklist-for-midsize-organizations', title: 'AI Readiness Checklist: Is Your Organization Ready for AI Agents?' },
  { slug: 'lead-qualification-ai-scoring-signals-2026', title: 'Lead Qualification at Scale: The Signals AI Actually Trusts' },
  { slug: 'why-most-ai-projects-fail-and-how-to-succeed', title: 'Why Most AI Projects Fail (And How to Make Yours Succeed)' },
];

const Ai = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="AI for Telecom & Multi-Site Operators | TrustedNetworx"
      description="AI agents and consulting for telecom and multi-site operators. Explore the AI workforce, run a readiness assessment, and read the latest on AI in telecom."
    />

    {/* Hero — navy band with motion */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-ai" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">AI</span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            AI agents and modern telecom, working together.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            The workforce, the tools, and the playbooks — everything TrustedNetworx publishes on AI,
            in one place.
          </p>
          {/* Plain crawlable link line to the free tools (SEO pass 2026-09-10). */}
          <p className="mt-6 text-sm text-navy-200">
            Free tools:{' '}
            <Link to="/tools/ai-roi-calculator" className="font-semibold text-brand-300 hover:text-brand-200">
              AI Automation ROI Calculator
            </Link>{' '}
            ·{' '}
            <Link to="/tools/ai-readiness" className="font-semibold text-brand-300 hover:text-brand-200">
              AI Readiness Assessment
            </Link>
          </p>
        </div>
      </div>
    </section>

    {/* 01 — The AI stack (numbered hairline list) */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — The AI stack
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Start where the payoff is.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Three ways in — from agents that run your operations to the platform that governs
              them.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {sections.map(({ n, to, title, desc }) => (
                <li key={n}>
                  <Link
                    to={to}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5"
                  >
                    <span className="font-mono text-sm text-accent-text">{n}</span>
                    <span>
                      <h3 className="font-display text-display-h3 font-semibold text-ink group-hover:text-brand-600">
                        {title}
                      </h3>
                      <span className="mt-1 block text-base leading-relaxed text-body">{desc}</span>
                    </span>
                    <ArrowRight
                      size={18}
                      className="translate-y-1 text-muted-text transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 02 — Free tools (numbered hairline list) */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              02 — Free tools
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Measure before you build.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Two self-serve assessments — no sales call required.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {tools.map(({ n, to, title, desc }) => (
                <li key={n}>
                  <Link
                    to={to}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5"
                  >
                    <span className="font-mono text-sm text-accent-text">{n}</span>
                    <span>
                      <h3 className="font-display text-display-h3 font-semibold text-ink group-hover:text-brand-600">
                        {title}
                      </h3>
                      <span className="mt-1 block text-base leading-relaxed text-body">{desc}</span>
                    </span>
                    <ArrowRight
                      size={18}
                      className="translate-y-1 text-muted-text transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 03 — Latest thinking (hairline list) */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              03 — Latest thinking
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Notes from the build.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <h3 className="font-display text-display-h3 font-semibold text-ink group-hover:text-brand-600">
                      {p.title}
                    </h3>
                    <ArrowRight size={18} className="shrink-0 text-muted-text transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                All posts
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
      <CrmFormEmbed form="ai" />
  </div>
);

export default Ai;
