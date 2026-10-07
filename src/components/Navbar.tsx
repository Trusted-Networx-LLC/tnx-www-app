import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Bot,
  Wifi,
  PhoneCall,
  Smartphone,
  Mic,
  Layers,
  BarChart3,
  BookOpen,
  Wrench,
  Users,
  Building2,
} from 'lucide-react';

const aiSolutions = [
  { to: '/ai-workforce', label: 'AI Workforce', desc: 'AI agents for telecom', icon: Bot },
  { to: '/ai-consulting', label: 'AI Consulting', desc: 'Practical AI automation', icon: Bot },
  { to: '/ai', label: 'AI Overview', desc: 'All AI resources in one place', icon: Bot },
];

const platforms = [
  { to: '/platforms/partner-hub', label: 'TNX Partner Hub', desc: 'AI agent management', icon: Layers },
  { to: '/platforms/crm', label: 'TNX CRM', desc: 'Opportunity management', icon: BarChart3 },
];

/**
 * The four DataRemote hardware pages live under /pots-replacement, so they
 * render as CHILDREN of that entry rather than as a flat block at the end of
 * the Telecom group — where they read as belonging to whatever item happened
 * to be last (Mobility Solutions). They stay compact so eight full-height rows
 * never overflow the 26rem desktop panel.
 */
const potsProducts = [
  { to: '/pots-replacement/90x1', label: '90X1', desc: '8 lines · 5G' },
  { to: '/pots-replacement/90x2', label: '90X2', desc: '8 lines · LTE' },
  { to: '/pots-replacement/90x5', label: '90X5', desc: 'Modular · pre-order' },
  { to: '/pots-replacement/ara', label: 'Ara', desc: 'Device management' },
];

const telecom = [
  {
    to: '/pots-replacement',
    label: 'POTS Replacement',
    desc: 'Modern landline alternatives',
    icon: Phone,
    children: potsProducts,
  },
  { to: '/voice-solutions', label: 'Voice & IP PBX', desc: 'Unified voice communications', icon: Mic },
  { to: '/internet-connectivity', label: 'Internet Connectivity', desc: 'Enterprise-grade access', icon: Wifi },
  { to: '/mobility-solutions', label: 'Mobility Solutions', desc: 'Manage your mobile fleet', icon: Smartphone },
];

const resources = [
  { to: '/blog', label: 'Blog', desc: 'Telecom & AI insights', icon: BookOpen },
  { to: '/tools', label: 'Free Tools', desc: 'ROI, risk & readiness assessments', icon: Wrench },
  { to: '/tools/ai-readiness', label: 'AI Readiness', desc: 'Free AI readiness assessment', icon: Wrench },
];

const company = [
  { to: '/about', label: 'About', desc: 'Who we are & what we do', icon: Building2 },
  { to: '/about/team', label: 'Team', desc: 'Meet our team & partners', icon: Users },
  { to: '/contact', label: 'Contact', desc: 'Get in touch', icon: PhoneCall },
  { to: '/partners', label: 'Partners', desc: 'MSP & reseller program', icon: Users },
];

const platformsFooter = (
  <div className="space-y-1">
    <a href="https://tnxpartnerhub.com" target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-300 hover:bg-white/5 hover:text-brand-200 transition-colors">
      Log in to Partner Hub
    </a>
    <a href="https://tnxcrm.com" target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-300 hover:bg-white/5 hover:text-brand-200 transition-colors">
      Log in to TNX CRM
    </a>
  </div>
);

interface SubMenuItem {
  to: string;
  label: string;
  desc: string;
}

interface MenuItem {
  to: string;
  label: string;
  desc: string;
  icon: typeof Bot;
  /** Rendered indented directly beneath this item, on desktop and mobile. */
  children?: SubMenuItem[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      setOpenMenu(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const open = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const renderDropdown = (name: string, items: MenuItem[], footer?: ReactNode) => (
    <div className="relative" onMouseEnter={() => open(name)} onMouseLeave={scheduleClose}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-navy-200 hover:text-white transition-colors"
        onClick={() => setOpenMenu((v) => (v === name ? null : name))}
        aria-expanded={openMenu === name}
      >
        {name}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300${openMenu === name ? ' rotate-180' : ''}`}
        />
      </button>

      {openMenu === name && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-[26rem] rounded-2xl p-3 bg-navy-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-navy-950/50 animate-fadeIn">
          <div className="grid grid-cols-1 gap-1.5">
            {items.map(({ to, label, desc, icon: Icon, children }) => (
              <div key={to}>
                <Link
                  to={to}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5 group"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 group-hover:bg-brand-500/25 transition-colors">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{label}</span>
                    <span className="block text-xs text-navy-300">{desc}</span>
                  </span>
                </Link>

                {children && (
                  <div className="ml-[1.85rem] mt-0.5 grid grid-cols-2 gap-0.5 border-l border-white/10 pl-3">
                    {children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="rounded-lg px-2.5 py-1.5 transition-colors hover:bg-white/5"
                      >
                        <span className="block text-sm font-semibold text-brand-300">
                          {child.label}
                        </span>
                        <span className="block text-xs text-navy-300">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {footer && <div className="mt-2 border-t border-white/10 pt-2">{footer}</div>}
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out-expo ${
        scrolled ? 'glass-dark shadow-lg shadow-navy-950/30' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <img
              src="/logo.svg"
              alt="TrustedNetworx logo"
              className="h-9 w-9 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Trusted<span className="text-brand-400">Networx</span>
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {renderDropdown('AI Solutions', aiSolutions)}
            {renderDropdown('Platforms', platforms, platformsFooter)}
            {renderDropdown('Telecom', telecom)}
            {renderDropdown('Resources', resources)}
            {renderDropdown('Company', company)}
            <Link
              to="/tools/ai-readiness"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-brand-500 hover:-translate-y-0.5"
            >
              Book a Review
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-navy-950/95 backdrop-blur-xl border-t border-white/10 animate-fadeIn">
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-navy-400">
              AI Solutions
            </p>
            {aiSolutions.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10">
                <Icon size={18} className="text-brand-300" />
                {label}
              </Link>
            ))}
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-navy-400">Platforms</p>
            {platforms.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10">
                <Icon size={18} className="text-brand-300" />
                {label}
              </Link>
            ))}
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-navy-400">Telecom</p>
            {telecom.map(({ to, label, icon: Icon, children }) => (
              <div key={to}>
                <Link to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10">
                  <Icon size={18} className="text-brand-300" />
                  {label}
                </Link>
                {children && (
                  <div className="ml-[1.85rem] border-l border-white/10 pl-3">
                    {children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="flex items-baseline gap-2 rounded-lg px-3 py-2 text-sm text-navy-200 hover:bg-white/10"
                      >
                        <span className="font-semibold text-brand-300">{child.label}</span>
                        <span className="text-xs text-navy-400">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-navy-400">Resources</p>
            {resources.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10">
                <Icon size={18} className="text-brand-300" />
                {label}
              </Link>
            ))}
            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-navy-400">Company</p>
            {company.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-white/10">
                <Icon size={18} className="text-brand-300" />
                {label}
              </Link>
            ))}
            <Link
              to="/tools/ai-readiness"
              className="mt-3 flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-glow"
            >
              Book a Review
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
