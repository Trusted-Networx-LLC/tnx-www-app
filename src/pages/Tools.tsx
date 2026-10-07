import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';

const tools = [
  { n: '01', to: '/pots-replacement/pstn-sunset', title: 'PSTN Sunset Lookup', desc: 'Check whether your ZIP code is on a carrier copper retirement or landline shutdown filing.' },
  { n: '02', to: '/tools/copper-sunset-risk', title: 'Copper Sunset Risk Assessment', desc: 'Evaluate your exposure to the copper network decommissioning.' },
  { n: '03', to: '/tools/failover-readiness', title: 'Business Continuity Readiness Check', desc: 'How prepared is your organization for a connectivity outage?' },
  { n: '04', to: '/tools/ai-readiness', title: 'AI Readiness Assessment', desc: 'Evaluate how prepared your organization is for AI adoption.' },
];

const Tools = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="Free Telecom Assessment Tools | TrustedNetworx"
      description="Free tools to size your telecom position: PSTN shutdown lookup by ZIP, copper sunset risk, business continuity readiness, and AI readiness."
      jsonLd={{
        // Hub for the five free tools → CollectionPage. The BreadcrumbList is
        // added automatically by the Seo component.
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Free Telecom Assessment Tools',
        url: 'https://trustednetworx.com/tools',
        description:
          'Free tools to size your telecom position: PSTN shutdown lookup by ZIP, copper sunset risk, business continuity readiness, and AI readiness.',
        publisher: { '@id': 'https://trustednetworx.com/#organization' },
      }}
    />

    {/* Hero */}
    <section className="relative overflow-hidden bg-navy-950 py-28">
      <div className="mx-auto w-full max-w-site px-6 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            Free Assessment Tools
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            Evaluate your telecom infrastructure.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            Interactive tools to help you understand costs, risks, and readiness — no signup
            required.
          </p>
        </div>
      </div>
    </section>

    {/* Tools list */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              The tools
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Five self-serve assessments.
            </h2>
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
                      <span className="block font-display text-display-h3 font-semibold text-ink group-hover:text-brand-600">
                        {title}
                      </span>
                      <span className="mt-1 block text-base leading-relaxed text-body">{desc}</span>
                    </span>
                    <ArrowRight size={18} className="translate-y-1 text-muted-text transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Want a personalized assessment instead?
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Tools;
