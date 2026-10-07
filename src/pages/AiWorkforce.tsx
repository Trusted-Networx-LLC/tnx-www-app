import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const agents = [
  { n: '01', title: 'AI Sales Agents', desc: 'Qualify inbound leads, nurture pipeline, draft proposals, surface highest-value accounts — 24/7.' },
  { n: '02', title: 'AI Customer Service Agents', desc: 'Resolve common issues, triage tickets, escalate complex cases to the right team.' },
  { n: '03', title: 'AI Lead Qualification Agents', desc: 'Score every inbound lead against your ICP, book meetings for hot leads, nurture the rest.' },
  { n: '04', title: 'AI Scheduling Agents', desc: 'Find mutual availability, send invites, handle reschedules and reminders — across any calendar.' },
  { n: '05', title: 'AI Follow-Up Agents', desc: 'Track every conversation, trigger personalized follow-ups at the right moment.' },
  { n: '06', title: 'AI Email Triage Agents', desc: 'Flag priorities, draft responses, route action items to the right person.' },
  { n: '07', title: 'AI Support Agents', desc: 'First-line support that never sleeps — resets, status checks, common troubleshooting.' },
  { n: '08', title: 'AI Infrastructure Advisors', desc: 'Detect anomalies, forecast capacity, surface proactive recommendations before impact.' },
];

const why = [
  { n: '01', title: 'Deploy in days', desc: 'Most agents go live within 5–10 business days. No 6-month engagements.' },
  { n: '02', title: 'Measurable ROI', desc: 'Every agent ships with baseline metrics and monthly performance reporting.' },
  { n: '03', title: 'Telecom-native', desc: 'Built for telecom workflows — POTS migration tracking, compliance, carrier coordination.' },
  { n: '04', title: 'Not a black box', desc: 'You control the playbooks, tone, and escalation rules. Full transparency.' },
];

const useCases = [
  { n: '01', title: 'Inbound sales qualification', desc: 'Answers web inquiries, qualifies against ICP criteria, books meetings for hot leads.' },
  { n: '02', title: 'POTS migration tracking', desc: 'Monitors migration across hundreds of sites, flags stuck orders, alerts account managers.' },
  { n: '03', title: 'Network operations alerting', desc: 'Watches health metrics, correlates alarms, drafts incident summaries, escalates with context.' },
];

const AiWorkforce = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="AI Workforce — AI Agents for Telecom | TrustedNetworx"
      description="Deploy AI sales, service, and operations agents built for telecom: lead qualification, scheduling, email triage, and infrastructure monitoring, running 24/7."
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Workforce',
        provider: { '@type': 'Organization', name: 'TrustedNetworx' },
        areaServed: { '@type': 'Country', name: 'US' },
        serviceType: 'AI Agents',
        description: 'AI agents for sales, service, and operations, built for telecom.',
        url: 'https://trustednetworx.com/ai-workforce',
      }}
    />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-ai-workforce" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            AI Workforce
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            AI agents that answer, sell, and support — 24/7.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            Telecom-native AI voice and chat agents that qualify leads, book appointments, handle
            tier-1 support, and monitor your services around the clock.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              Get a quote
              <ArrowRight size={18} />
            </Link>
            <a href="#agents" className="btn-outline">
              Explore the agents
            </a>
          </div>
          {/* Plain crawlable link line to the free tools (SEO pass 2026-09-10). */}
          <p className="mt-6 text-sm text-navy-200">
            Free tools:{' '}
            <Link to="/ai" className="font-semibold text-brand-300 hover:text-brand-200">
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

    {/* 01 — The agents */}
    <section id="agents" className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — The agents
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Eight agents, one platform.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Each agent is purpose-built for one business function. Deploy one, or deploy them all.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {agents.map(({ n, title, desc }) => (
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

    {/* 02 — Why TNX AI (dark band) */}
    <section className="border-b border-hairline bg-navy-950">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
              02 — Why TrustedNetworx
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
              AI that understands telecom.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
              Not generic chatbots — agents trained on telecom workflows, compliance requirements,
              and infrastructure operations.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-divider border-t border-divider">
              {why.map(({ n, title, desc }) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="font-mono text-sm text-accent-500">{n}</span>
                  <div>
                    <h3 className="font-display text-display-h3 font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-navy-200">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 03 — Use cases */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              03 — Use cases
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              How telecom teams use AI.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {useCases.map(({ n, title, desc }) => (
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
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">Deploy</span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
              Ready to deploy your AI workforce?
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
              Tell us what&apos;s eating your team&apos;s time — we&apos;ll show you which agent
              takes it off their plate.
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

export default AiWorkforce;
