import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const ipPbx = [
  { n: '01', title: 'Advanced features', desc: 'Auto-attendant, call queuing, voicemail-to-email, call recording.' },
  { n: '02', title: 'Collaboration', desc: 'Video conferencing, instant messaging, presence, screen sharing.' },
  { n: '03', title: 'Easy management', desc: 'Web-based interface, user management, call reporting, system monitoring.' },
  { n: '04', title: 'Support', desc: '24/7 technical support, remote assistance, regular updates, training.' },
];

const enterprise = [
  { n: '01', title: 'Voice services', desc: 'HD voice quality, toll-free numbers, local numbers, international calling.' },
  { n: '02', title: 'Voice features', desc: 'Voice recognition, voice analytics, call recording, voice transcription.' },
  { n: '03', title: 'Unified comms', desc: 'Voice & video, instant messaging, presence information, team collaboration.' },
  { n: '04', title: 'Management', desc: 'Call analytics, quality monitoring, system administration, user management.' },
];

const VoiceSolutions = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="Voice Solutions — IP PBX & UCaaS | TrustedNetworx"
      description="Enterprise voice from TrustedNetworx: cloud IP PBX, HD voice, unified communications, voice analytics, and cloud calling that scales with the business."
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Voice Solutions / IP PBX',
        provider: { '@type': 'Organization', name: 'TrustedNetworx' },
        areaServed: { '@type': 'Country', name: 'US' },
        serviceType: 'Unified Communications',
        description: 'Cloud IP PBX and unified communications for multi-site businesses.',
        url: 'https://trustednetworx.com/voice-solutions',
      }}
    />

    {/* Hero */}
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-voice" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            Voice &amp; IP PBX
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            One phone system. Every location. Zero on-prem headaches.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            Cloud voice and unified communications that scale from a single office to hundreds of
            sites — with the compliance, call routing, and analog integrations enterprise operators
            actually need.
          </p>
          <p className="mt-4 max-w-xl text-sm text-navy-300">
            Multi-site E911 done right: dispatchable location per station, Kari&apos;s Law direct
            dialing, and on-site notification — configured per location, not bolted on after.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#quote" className="btn-primary">
              Get a quote
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* 01 — Cloud IP PBX */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              01 — Cloud IP PBX
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Business phone, minus the phone closet.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Advanced business phone systems combining traditional telephony with modern IP
              technology — lower call rates, no per-employee line, minimal hardware.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {ipPbx.map(({ n, title, desc }) => (
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

    {/* 02 — Enterprise voice */}
    <section className="border-b border-hairline bg-white">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-mono-label text-accent-text">
              02 — Enterprise voice
            </span>
            <h2 className="mt-4 font-display text-display-h2 font-semibold text-ink">
              Unified communications, one vendor.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              HD voice, analytics, and intelligent routing — with the redundancy and failover that
              keep calls up through an outage.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {enterprise.map(({ n, title, desc }) => (
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
              Price your locations.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-navy-200">
              Tell us about your sites and we&apos;ll come back with a plan and pricing within one
              business day.
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

export default VoiceSolutions;
