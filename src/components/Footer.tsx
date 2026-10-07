import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const solutionLinks = [
  { to: '/pots-replacement', label: 'POTS Replacement' },
  { to: '/ai-consulting', label: 'AI Consulting & Solutions' },
  { to: '/ai', label: 'AI Overview' },
  { to: '/internet-connectivity', label: 'Internet Connectivity' },
  { to: '/voice-solutions', label: 'Voice & IP PBX' },
  { to: '/mobility-solutions', label: 'Mobility Solutions' },
];

// Free tools — plain links (label = tool name) so crawlers see /tools and every
// calculator. The Navbar's Resources dropdown is not in the prerendered HTML.
const freeToolLinks = [
  { to: '/tools', label: 'All Free Tools' },
  { to: '/tools/copper-sunset-risk', label: 'Copper Sunset Risk Assessment' },
  { to: '/tools/failover-readiness', label: 'Business Continuity Readiness Check' },
  { to: '/tools/ai-readiness', label: 'AI Readiness Assessment' },
];

const platformLinks = [
  { to: '/platforms/partner-hub', label: 'TNX Partner Hub' },
  { to: '/platforms/crm', label: 'TNX CRM' },
];

const companyLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact Us' },
];

const Footer = () => {
  return (
    <footer className="relative bg-navy-950 text-navy-200 overflow-hidden">
      <h2 className="sr-only">Site footer</h2>
      {/* Ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="TrustedNetworx logo" className="h-9 w-9" />
              <span className="text-xl font-extrabold tracking-tight text-white">
                Trusted<span className="text-brand-400">Networx</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
              Your trusted partner in managed telecommunications. We help businesses modernize their
              infrastructure, cut costs, and stay connected with next-generation solutions.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-500 hover:-translate-y-0.5"
            >
              Get a Quote
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {/* Solutions */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Solutions</h3>
              <ul className="mt-4 space-y-3">
                {solutionLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-navy-300 transition-colors hover:text-brand-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Tools */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Free Tools</h3>
              <ul className="mt-4 space-y-3">
                {freeToolLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-navy-300 transition-colors hover:text-brand-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platforms */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Platforms</h3>
              <ul className="mt-4 space-y-3">
                {platformLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-navy-300 transition-colors hover:text-brand-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Company</h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-navy-300 transition-colors hover:text-brand-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Contact</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="tel:13054987530"
                    className="flex items-start gap-3 text-sm text-navy-300 transition-colors hover:text-brand-300"
                  >
                    <Phone size={18} className="mt-0.5 flex-shrink-0 text-brand-400" />
                    305-498-7530
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:sales@trustednetworx.com"
                    className="flex items-start gap-3 text-sm text-navy-300 transition-colors hover:text-brand-300"
                  >
                    <Mail size={18} className="mt-0.5 flex-shrink-0 text-brand-400" />
                    sales@trustednetworx.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-navy-300">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-brand-400" />
                  18001 Old Cutler Rd, Miami, FL 33157
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-400">
            {`© ${new Date().getFullYear()} TrustedNetworx. All rights reserved.`}
          </p>
          <p className="text-sm text-navy-400">Managed Telecom Solutions Provider</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
