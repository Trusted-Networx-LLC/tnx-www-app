import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import Seo from '../../components/Seo';
import CrmFormEmbed from '../../components/CrmFormEmbed';

/**
 * PSTN / copper shutdown lookup.
 *
 * The lookup itself (search, filters, drill-down, ~1 MB of filing data) is a self-contained page in
 * `public/embeds/pstn-sunset-lookup.html`, served from this origin and framed here. Same origin
 * means this page can size the frame to its content (no inner scrollbar), and the frame can scroll
 * this page and jump to the request form below. The H1, intro and form live here so they are
 * crawlable and the lead goes to TNX CRM like every other form on the site.
 */
const EMBED_SRC = '/embeds/pstn-sunset-lookup.html';

const scrollToForm = () =>
  document.getElementById('request-info')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const PstnShutdownLookup = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);
  // The frame src is set after mount, never during prerender: react-snap crawls every iframe src
  // as a page and would wait forever for the SPA ready marker inside the static embed. Server HTML
  // and the first client render both have no src, so hydration matches.
  const [src, setSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!navigator.userAgent.includes('ReactSnap')) setSrc(EMBED_SRC);
  }, []);

  const fit = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc?.body) return;
    // Measure the body, not documentElement: the root is at least as tall as the frame itself, so
    // its scrollHeight never lets the frame shrink when the results get shorter.
    const h = Math.ceil(doc.body.getBoundingClientRect().height);
    if (h > 0) setHeight(h);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !src) return;
    let observer: ResizeObserver | null = null;
    const onLoad = () => {
      fit();
      const body = frame.contentDocument?.body;
      if (body && 'ResizeObserver' in window) {
        observer = new ResizeObserver(fit);
        observer.observe(body);
      }
    };
    frame.addEventListener('load', onLoad);
    if (frame.contentDocument?.readyState === 'complete') onLoad();
    window.addEventListener('resize', fit);
    return () => {
      frame.removeEventListener('load', onLoad);
      window.removeEventListener('resize', fit);
      observer?.disconnect();
    };
  }, [fit, src]);

  return (
    <div className="bg-navy-50">
      <Seo
        title="PSTN Sunset: Copper Shutdown Lookup by ZIP | TrustedNetworx"
        description="Check if your ZIP code or city is on a carrier copper retirement or POTS discontinuance filing. See the carrier, wire center, and earliest shutoff date."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PSTN Sunset Copper Shutdown Lookup',
          url: 'https://trustednetworx.com/pots-replacement/pstn-sunset',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@id': 'https://trustednetworx.com/#organization' },
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-navy-950 via-navy-900 to-brand-900" />
        <div className="absolute inset-0 z-0 bg-grid-dark bg-grid opacity-40" />
        <div className="relative z-10 w-full pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="eyebrow border border-brand-400/30 bg-brand-500/10 text-brand-200">
                <MapPin size={14} />
                PSTN Sunset
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                {'Is your area on the '}
                <span className="text-brand-300">copper shutdown list?</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg sm:text-xl text-navy-200">
                Phone companies are retiring copper lines and ending traditional landline (POTS) service,
                wire center by wire center. Search a ZIP code or city to see which carrier filed, what is
                changing, and the earliest date service can be cut.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button type="button" onClick={scrollToForm} className="btn-primary">
                  Request more information
                  <ArrowRight size={18} />
                </button>
                <Link to="/pots-replacement" className="btn-outline">
                  POTS replacement options
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookup */}
      <section className="relative py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          <iframe
            ref={frameRef}
            src={src}
            title="PSTN and copper shutdown lookup by ZIP code"
            className="block w-full border-0"
            style={{ height }}
            scrolling="no"
          />
        </div>
      </section>

      {/* Request more information → TNX CRM */}
      <section id="request-info" className="relative scroll-mt-24 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">
              Request more information
            </h2>
            <p className="mt-4 text-lg text-navy-500">
              On the list, or not sure? Tell us about your sites and lines. We will confirm what the
              filings mean for your addresses and send a replacement plan for fire alarm, elevator,
              emergency phone and fax lines.
            </p>
          </div>
          <CrmFormEmbed form="quick" variant="bare" />
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-600">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            <span className="block">Installers book up when a wire center closes.</span>
            <span className="block text-brand-100">Plan your line replacement early.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <button type="button" onClick={scrollToForm} className="btn-light">
              Request more information
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PstnShutdownLookup;
