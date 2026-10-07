import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const fundamentals = [
  { n: '01', title: 'Reliability', desc: 'Primary circuits sized to the site, with LTE/5G failover that kicks in automatically.' },
  { n: '02', title: 'Scalability', desc: 'Adjust services as locations are added or consolidated.' },
  { n: '03', title: 'Security', desc: 'Managed edge security and monitoring on every circuit.' },
  { n: '04', title: 'Cost efficiency', desc: 'One vendor, one SLA — no finger-pointing between carriers.' },
];

const solutions = [
  { n: '01', title: 'Managed SD-WAN', desc: 'MPLS, broadband, and 4G-LTE combined into one resilient, high-performance network that manages resources dynamically.' },
  { n: '02', title: 'Starlink satellite broadband', desc: 'Authorized Starlink reseller — high-speed, low-latency broadband for remote locations where terrestrial options end.' },
  { n: '03', title: 'IoT single SIM', desc: 'One SIM that roams to the strongest carrier signal — global connectivity for devices that can’t drop.' },
];

const InternetConnectivity = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="Internet Connectivity | TrustedNetworx"
      description="Enterprise-grade internet connectivity — managed SD-WAN, Starlink satellite broadband, and global IoT SIM solutions to keep your business securely online."
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Internet Connectivity',
        provider: { '@type': 'Organization', name: 'TrustedNetworx' },
        areaServed: { '@type': 'Country', name: 'US' },
        serviceType: 'Enterprise Internet',
        description: 'Enterprise-grade internet connectivity with managed SD-WAN and wireless failover.',
        url: 'https://trustednetworx.com/internet-connectivity',
      }}
    />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-connectivity" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            Internet Connectivity
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            Connectivity your locations can&apos;t afford to lose.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            High-speed primary circuits with LTE/5G wireless failover, managed and monitored across
            every site. One vendor, one SLA, no finger-pointing between carriers.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#quote" className="btn-primary">
              Get a quote
              <ArrowRight size={18} />
            </a>
          </div>
          {/* Plain crawlable link line to the free tools (SEO pass 2026-09-10). */}
          <p className="mt-6 text-sm text-navy-200">
            Free tools:{' '}
            <Link to="/tools/failover-readiness" className="font-semibold text-brand-300 hover:text-brand-200">
              Business Continuity Readiness Check
            </Link>
          </p>
        </div>
      </div>
    </section>

    {/* 01 — Fundamentals */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — Enterprise connectivity
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              When a site loses internet, it loses everything.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Phones, payments, and access control all ride the same circuit. We build connectivity
              that doesn&apos;t go down — and monitor it so problems surface before your staff does.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {fundamentals.map(({ n, title, desc }) => (
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

    {/* 02 — Solutions */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              02 — Available solutions
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Three ways to get connected.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {solutions.map(({ n, title, desc }) => (
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
    <section id="quote" className="bg-navy-950">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">Quote</span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-white">
              Get a multi-site quote.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
              Tell us about your sites and we&apos;ll come back with a plan and pricing within one
              business day.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-lg border border-divider bg-navy-900 p-8">
              <CrmFormEmbed form="potsVoice" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default InternetConnectivity;
