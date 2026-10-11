import { ArrowRight, ChevronDown } from 'lucide-react';
import Seo from '../components/Seo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const whatItDoes = [
  {
    title: 'One board for Claude, ChatGPT and Codex',
    body: 'Each AI app signs in once and becomes a named agent on the task board. Agents claim, update, hand off and comment. Every move is attributed and logged.',
  },
  {
    title: 'Inbox and calendar, with a human in the loop',
    body: 'An agent reads mail and calendar on Microsoft 365 or Google Workspace, drafts the reply or the invite, and a person approves before anything sends. Send limits per agent.',
  },
  {
    title: 'Stop, cap, pause',
    body: 'One global stop. A per-agent stop. A monthly spend cap that pauses the agent. A loop guard that pauses a runaway agent after three limit hits. Every one of them is one click.',
  },
  {
    title: 'Audit trail that holds up',
    body: 'Every tool call logged with agent, owner, tool and outcome. Daily call caps per agent and per workspace. Built for buyers who get audited: healthcare, property management, finance.',
  },
];

const builtForChannel = [
  {
    title: 'White-label',
    body: 'Your brand on the Hub your clients log into. Hosted and operator-managed; one instance per customer.',
  },
  {
    title: 'Per-client workspaces',
    body: 'Each client gets its own workspace, users, agents and limits. You see all of them from one place.',
  },
  {
    title: 'Partner enablement built in',
    body: 'Content library, campaigns, templates and connected accounts for the marketing side of your partner program.',
  },
];

const youGet = [
  'Your own branded instance, set up with us on a call',
  'Up to 3 client workspaces and 5 agents included for 90 days',
  'A weekly 30-minute check-in; your requests go to the top of the backlog',
  'Design-partner pricing locked for 12 months',
];

const weAskFor = ['Weekly feedback', 'A reference and a one-page case study at day 90'];

const pricing = [
  { plan: 'Partner instance', forWhom: 'MSP or agency: branded instance, 3 client workspaces, 5 agents, integrations, approvals, audit', monthly: '$499' },
  { plan: 'Additional client workspace', forWhom: 'per client, 2 agents included', monthly: '$149' },
  { plan: 'Additional agent', forWhom: 'any plan', monthly: '$49' },
  { plan: 'Direct business instance', forWhom: 'a business with no reseller: 1 workspace, 3 agents', monthly: '$349' },
  { plan: 'Design-partner rate', forWhom: 'first five partners', monthly: '50% off for 12 months' },
];

const howItWorks = [
  '20-minute look. We show the board, an approval and the kill switch on a live instance.',
  'Setup call. Your instance, your brand, your first client workspace, your first agents.',
  'Go live. Your clients sign in; you watch everything from the Hub.',
  'Weekly check-in for 90 days.',
];

const faqs = [
  {
    q: "Does the agent see my client's data?",
    a: "Only what the client's admin grants it, per workspace. Every read and write is logged. The agent acts with at most the permissions of the person who connected it, never more.",
  },
  {
    q: 'Can an agent send email on its own?',
    a: 'No. A person approves every send. The approval is logged. Send limits apply per agent.',
  },
  {
    q: 'What happens when something goes wrong?',
    a: 'Stop one agent or all of them in one click. A paused agent cannot act until a person resumes it. A budget cap pauses it automatically.',
  },
  {
    q: 'Which AI apps work with it?',
    a: 'Claude, ChatGPT and Codex sign in today. Runtime agents you build connect through the agent API.',
  },
  {
    q: 'Microsoft or Google?',
    a: "Both. Microsoft 365 is live. Google Workspace is live; Google's app verification is in review.",
  },
  {
    q: 'Who owns the model spend?',
    a: 'During the cohort, we do, inside the caps. Pass-through or bring-your-own-key is decided before general availability.',
  },
  {
    q: 'Is there a contract?',
    a: 'A 90-day design-partner agreement, then month to month at the locked rate.',
  },
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
        title="Partner Hub — the control room for AI agents | Trusted Networx"
        description="White-label AI agent management for MSPs and telecom partners. Every agent, every action, every approval, logged and under your brand. Five South Florida design partners."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'TNX Partner Hub',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'White-label AI agent management for MSPs and telecom partners. Every agent, every action, every approval, logged and under your brand.',
          },
          faqJsonLd,
        ]}
      />

      {/* 1 — Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="relative z-10 mx-auto w-full max-w-site px-6 py-14 md:px-gutter md:py-16">
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-12 lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                TNX Partner Hub · for MSPs and telecom partners
              </span>
              <h1 className="mt-4 font-display text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[44px] lg:text-[52px] lg:leading-[1.0]">
                The control room for AI agents in your business.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-navy-200">
                Every agent, every action, every approval, in one place, under your brand. Offer
                managed AI agents to your clients without taking on the risk.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="#apply" className="btn-primary">
                  Apply for the Design Partner Program
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#hero-demo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy-200 hover:text-white"
                >
                  Watch the 2-minute demo
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              {/* HERO MEDIA PLACEHOLDER — Carter will supply a 2-minute screen
                  recording. Swap this entire div for
                  <HeroVideo name="hero-partner-hub" /> once /public/media/hero-partner-hub.*
                  exists. No stock or generated imagery here in the meantime. */}
              <div
                id="hero-demo"
                className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg border border-divider bg-navy-900 p-6 text-center"
              >
                <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                  2-minute demo — coming soon
                </span>
                <p className="max-w-xs text-sm font-semibold text-white">
                  The 2-minute demo recording goes here.
                </p>
                <p className="max-w-xs text-xs leading-relaxed text-navy-300">
                  Claude and ChatGPT sign in, claim and hand off a task on one board, an email
                  waits for approval, the kill switch stops an agent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — The problem (three short lines, no icons) */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-site px-6 py-10 md:px-gutter md:py-12">
          <h2 className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
            The problem
          </h2>
          <ul className="mt-5 max-w-3xl space-y-3 text-lg leading-relaxed text-body">
            <li>Your clients' staff already use ChatGPT on client data. Nobody has a record of it.</li>
            <li>The AI vendors pitching your clients will not take the liability. You will.</li>
            <li>
              Banning AI does not work. Giving it a login, a log, an approval step and a stop
              button does.
            </li>
          </ul>
        </div>
      </section>

      {/* 3 — What Partner Hub does (four cards) */}
      <section className="border-b border-hairline bg-white">
        <div className="mx-auto w-full max-w-site px-6 py-10 md:px-gutter md:py-12">
          <h2 className="font-display text-display-h3 font-semibold text-ink">
            What Partner Hub does
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {whatItDoes.map(({ title, body }) => (
              <li key={title} className="bg-white p-6">
                <h3 className="font-display text-display-h3 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-body">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — Built for the channel (three columns) */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-site px-6 py-10 md:px-gutter md:py-12">
          <h2 className="font-display text-display-h3 font-semibold text-ink">
            Built for the channel
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {builtForChannel.map(({ title, body }) => (
              <div key={title} className="border-t border-hairline pt-5">
                <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — The Design Partner Program */}
      <section className="bg-navy-950">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                The Design Partner Program
              </span>
              <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
                Five South Florida partners. Ninety days. Hands-on.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
                We are taking five partners in Miami-Dade, Broward, Palm Beach, Lee and Collier
                counties for a 90-day design-partner cohort.
              </p>
              <a href="#apply" className="btn-primary mt-8">
                Apply for the Design Partner Program
                <ArrowRight size={18} />
              </a>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <div className="rounded-lg border border-divider bg-navy-900 p-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                      You get
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {youGet.map((item) => (
                        <li key={item} className="text-base leading-relaxed text-navy-200">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
                      We ask for
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {weAskFor.map((item) => (
                        <li key={item} className="text-base leading-relaxed text-navy-200">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Pricing */}
      <section className="border-b border-hairline bg-white">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
            Pricing
          </span>
          <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
            Design-partner pricing, published pricing follows the cohort.
          </h2>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="py-3 pr-4 font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    Plan
                  </th>
                  <th className="py-3 pr-4 font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    For
                  </th>
                  <th className="py-3 font-mono text-xs uppercase tracking-mono-label text-muted-text">
                    Monthly
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {pricing.map(({ plan, forWhom, monthly }) => (
                  <tr key={plan}>
                    <td className="py-4 pr-4 align-top text-sm font-semibold text-ink">{plan}</td>
                    <td className="py-4 pr-4 align-top text-base leading-relaxed text-body">
                      {forWhom}
                    </td>
                    <td className="py-4 align-top text-base leading-relaxed text-body">{monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-body">
            Referral partners (telecom agents and advisors) earn 15% of the monthly for the term
            of the customer.
          </p>
        </div>
      </section>

      {/* 7 — How it works */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                How it works
              </span>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ol className="divide-y divide-hairline border-t border-hairline">
                {howItWorks.map((step, i) => (
                  <li key={step} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                    <span className="font-mono text-sm text-accent-text">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base leading-relaxed text-body">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — Questions partners ask (FAQ, collapsible) */}
      <section className="border-b border-hairline bg-white">
        <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
                Questions partners ask
              </span>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="divide-y divide-hairline border-t border-hairline">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-display-h3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown
                        size={20}
                        className="flex-shrink-0 text-muted-text transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-3 text-base leading-relaxed text-body">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 — Form */}
      <div id="apply">
        <CrmFormEmbed form="partnerHub" />
      </div>

      {/* 10 — Footer line */}
      <section className="border-t border-hairline bg-canvas">
        <div className="mx-auto w-full max-w-site px-6 py-8 text-center md:px-gutter">
          <p className="text-sm text-muted-text">
            TNX Partner Hub is built and operated by Trusted Networx, Miami. Hosted,
            operator-managed, instance per customer.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PartnerHub;
