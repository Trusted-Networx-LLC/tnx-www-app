import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const whatYouGet = [
  { n: '01', title: 'White-label telecom + AI', desc: 'Sell under your brand. Your customers see you, not us — every deliverable, invoice, and support touch is yours.' },
  { n: '02', title: 'Margin or commission', desc: 'Your choice on every deal: resell at your own margin, or place it and take commission.' },
  { n: '03', title: 'TNX Partner Hub seat', desc: 'Run AI agents for your clients — sales outreach, quoting, and support — without building the plumbing.' },
  { n: '04', title: 'Partner support team', desc: 'Deal directly with the operators. Dedicated partner support and a real onboarding path.' },
  { n: '05', title: 'Onboarding path', desc: 'A real ramp: product training, pricing setup, and co-selling support on your first deals.' },
];

const process = [
  { n: '01', title: 'Apply', desc: 'Tell us what you sell today and who you serve. We map you to the right program tier.' },
  { n: '02', title: 'Onboard', desc: 'We set up your Partner Hub seat, pricing, and training — usually inside a week.' },
  { n: '03', title: 'First deal', desc: 'We co-sell your first deal end to end so you see the full playbook in action.' },
];

const verticals = [
  'Senior Living',
  'Hospitality',
  'Healthcare',
  'Property Management / Multi-family',
  'Retail & Multi-site',
  'Education',
  'Government / Municipal',
  'Auto Dealership',
  'Construction / Jobsites',
  'Fire, Alarm & Security Integrator',
];

const Partners = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="Become a Partner — MSP & Reseller Program | TrustedNetworx"
      description="Join the TrustedNetworx partner program for MSPs, telecom agents, and resellers. White-label telecom and AI, TNX Partner Hub, and commission on every deal."
    />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-partners" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            Partner Program
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            Sell more with an operator behind you.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            TrustedNetworx gives MSPs, agents, and resellers a white-label telecom and AI practice —
            without hiring engineers or building the infrastructure.
          </p>
        </div>
      </div>
    </section>

    {/* 01 — What you get */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — What you get
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              A full practice, not a resale agreement.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {whatYouGet.map(({ n, title, desc }) => (
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

    {/* 02 — How it works */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              02 — How it works
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Three steps to your first deal.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {process.map(({ n, title, desc }) => (
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

    {/* 03 — Verticals */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              03 — Verticals
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Where your customers already are.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2">
              {verticals.map((v) => (
                <li key={v} className="border-b border-hairline py-3 text-base leading-relaxed text-body">
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* 04 — Get started (form) */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              04 — Get started
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Book a partner call.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Tell us what you sell today and we&apos;ll build your onboarding path.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <CrmFormEmbed form="contact" variant="bare" />
          </div>
        </div>
      </div>
    </section>

    {/* Email / Partner Hub */}
    <section className="bg-navy-950">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
          Prefer email?
        </span>
        <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
          Reach the partner team directly.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
          <a
            href="mailto:sales@trustednetworx.com"
            className="text-brand-300 underline underline-offset-4 hover:text-brand-200"
          >
            sales@trustednetworx.com
          </a>
          {' — or explore the hub your clients would run on.'}
        </p>
        <Link
          to="/platforms/partner-hub"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          Explore TNX Partner Hub
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </div>
);

export default Partners;
