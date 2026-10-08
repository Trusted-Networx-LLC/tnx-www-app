import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import HeroVideo from '../components/HeroVideo';
import CrmFormEmbed from '../components/CrmFormEmbed';

const contactInfo = [
  { label: 'Phone', value: '305-498-7530', href: 'tel:+13054987530' },
  { label: 'Email', value: 'sales@trustednetworx.com', href: 'mailto:sales@trustednetworx.com' },
  { label: 'Address', value: '18001 Old Cutler Rd, Miami, FL 33157' },
  { label: 'Hours', value: 'Mon–Fri · 9:00 AM – 6:00 PM EST' },
];

const Contact = () => (
  <div className="bg-canvas text-body antialiased">
    <Seo
      title="Contact Us | TrustedNetworx"
      description="Get in touch with the TrustedNetworx team to scope managed telecom, POTS replacement, voice, connectivity, mobility, or an AI agent build for your business."
      jsonLd={{
        // This LocalBusiness is the same real-world entity as the Organization
        // node (shipped from index.html on every page) — it references that
        // node by @id instead of restating name/telephone/email/url/address.
        // The address now lives on the Organization node and is shared through
        // this @id; only the LocalBusiness-specific openingHours is kept here.
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://trustednetworx.com/#organization',
        openingHours: 'Mo-Fr 09:00-18:00',
      }}
    />

    {/* Hero */}
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-navy-950">
      <HeroVideo name="hero-contact" />
      <div className="relative z-10 mx-auto w-full max-w-site px-6 py-24 md:px-gutter">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-mono-label text-accent-500">
            Get in touch
          </span>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold text-white md:text-[56px] md:leading-[1.05] lg:text-[72px] lg:leading-[1.0]">
            Contact us.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-200">
            Get in touch with our team to discuss your business needs.
          </p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-site px-6 py-section md:px-gutter">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display text-display-h2 font-semibold text-ink">Get in touch</h2>
            <p className="mt-2 text-body">Fill out the form below and we&apos;ll get back to you shortly.</p>
            <div className="mt-8">
              <CrmFormEmbed form="quick" variant="bare" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <ul className="divide-y divide-hairline border-t border-hairline">
              {contactInfo.map(({ label, value, href }) => (
                <li key={label} className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                  <span className="font-mono text-xs uppercase tracking-mono-label text-muted-text">{label}</span>
                  {href ? (
                    <a href={href} className="text-base text-body hover:text-brand-600">{value}</a>
                  ) : (
                    <span className="text-base text-body">{value}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-hairline pt-6">
              <h3 className="font-display text-display-h3 font-semibold text-ink">About us</h3>
              <p className="mt-3 leading-relaxed text-body">
                TrustedNetworx is a Miami-based managed telecom provider. We replace legacy copper
                lines, run cloud voice and connectivity for multi-site operators, and keep
                compliance-critical lines — fire alarms, elevators, emergency phones — monitored
                and inspection-ready.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src="/team/carter-dewey.webp"
                  alt="Carter Dewey"
                  width="48"
                  height="48"
                  className="h-12 w-12 rounded-full object-cover object-[65%_28%]"
                  loading="lazy"
                />
                <p className="text-sm text-body">
                  <span className="font-semibold text-ink">You&apos;ll talk to Carter Dewey</span>,
                  our CEO — not a call queue.
                </p>
              </div>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Learn more about us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
