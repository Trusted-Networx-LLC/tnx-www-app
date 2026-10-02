import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const capabilities = [
  { n: '01', title: 'Deploy from blueprints', body: 'Start from tested agent designs — outreach, inbound quoting, support triage, monitoring — and customize per client. Every agent inherits improvements to its core blueprint.' },
  { n: '02', title: 'Control spend', body: 'Set a monthly budget per agent and per client. Hard stop, not a warning.' },
  { n: '03', title: 'See everything', body: 'Every action, message, and decision is logged with who approved it. Audit-ready.' },
  { n: '04', title: 'Keep humans in the loop', body: 'Define what an agent may do alone and what needs a click from a person.' },
  { n: '05', title: 'Multi-tenant by design', body: 'One hub, isolated client workspaces, role-based access.' },
];

const whoFor = [
  'MSPs adding an AI practice without hiring ML engineers',
  'Telecom agents and resellers who want a white-label AI offer',
  'Multi-site operators running their own agents for scheduling, quoting, and support',
];

const faqs = [
  { q: 'Which AI models does it use?', a: 'Model-agnostic; default is a cost-optimized provider with the option to bring your own keys.' },
  { q: 'Do I need developers?', a: 'No for blueprint agents. Yes for custom integrations, which we can build.' },
  { q: 'Where does it run?', a: 'Dedicated VPS per client or shared multi-tenant, your choice.' },
  { q: 'Is my client data isolated?', a: 'Yes — tenant isolation is enforced at the database layer, not just the UI.' },
];

const PartnerHub = () => {
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
        title="TNX Partner Hub — AI Agent Management | TrustedNetworx"
        description="Deploy, budget, monitor, and govern AI agents for sales, support, and operations from one multi-tenant hub. Built by an operator, for MSPs and resellers."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'TNX Partner Hub',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'AI agent management platform for MSPs and channel partners: deploy, budget, monitor, and govern AI agents from one multi-tenant hub.',
          },
          faqJsonLd,
        ]}
      />

      {/* Hero — navy band with motion; the product frame below overlaps it */}
      <section className="relative overflow-hidden bg-navy-950 pt-32 pb-44">
        <HeroVideo name="hero-partner-hub" />
        <div className="relative z-10 mx-auto w-full max-w-site px-6 md:px-gutter">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
              TNX Partner Hub
            </span>
            <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] lg:text-[72px] lg:leading-[1.0]">
              AI agents you can actually manage.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-200">
              Most AI tools give you a chatbot. Partner Hub gives you a workforce — with a manager.
            </p>
          </div>
        </div>
      </section>

      {/* Product screenshot — overlaps the hero band */}
      <section className="relative z-10 -mt-[120px]">
        <div className="mx-auto w-full max-w-site px-6 pb-16 md:px-gutter">
          <div className="rounded-lg border border-hairline bg-white p-4">
            <img
              src="/product/partner-hub-dashboard.webp"
              alt="Partner Hub dashboard — stats and recent agents"
              width="1600"
              height="1000"
              className="w-full rounded border border-hairline"
            />
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">01 Dashboard</span>
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">02 Controls — budgets + kill switch</span>
              <span className="font-mono text-[11px] uppercase tracking-mono-label text-muted-text">03 Activity stream</span>
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
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">A fleet you can govern.</h2>
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
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">Built for the channel.</h2>
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

      {/* How it fits with TNX CRM — dark band */}
      <section className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">With TNX CRM</span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">How it fits with TNX CRM.</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-200">
              Agents in Partner Hub read and write to TNX CRM natively — leads qualified, calls
              logged, stages moved. One login, one data model.
            </p>
            <Link
              to="/platforms/crm"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              Explore TNX CRM
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
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">Asked before the demo.</h2>
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
      <section id="demo" className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">Demo</span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">See it with your own agents.</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
                Request a demo and we'll walk you through a tenant set up for your clients.
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

export default PartnerHub;
