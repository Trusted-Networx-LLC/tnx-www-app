import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

/** Routes where the popup is allowed to arm — blog + solution pages only. */
const ARMED_ROUTES = [
  '/blog',
  '/pots-replacement',
  '/voice-solutions',
  '/internet-connectivity',
  '/mobility-solutions',
  '/ai-consulting',
  '/ai-workforce',
];

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ExitIntentPopupProps {
  /** Override headline */
  headline?: string;
  /** Override subtext */
  subtext?: string;
  /** Override button label */
  buttonLabel?: string;
  /** Override dismiss text */
  dismissLabel?: string;
  /** Where the button goes */
  to?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'trustednetworx_exit_intent_dismissed';

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Exit-intent nudge. It collects nothing: every lead on this site goes through a TNX CRM form
 * (tnx-crm-bus#79), so the popup points at the PSTN Sunset lookup, whose request form is a CRM
 * embed. It used to post emails to a third-party endpoint and offer a calculator that no
 * longer exists.
 */
const ExitIntentPopup = ({
  headline = 'Is your area on the copper shutdown list?',
  subtext = 'Search your ZIP code to see which carrier filed to retire copper or end landline service, and the earliest date lines can be cut.',
  buttonLabel = 'Check your ZIP code',
  dismissLabel = 'No thanks',
  to = '/pots-replacement/pstn-sunset',
}: ExitIntentPopupProps) => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const scrolledEnoughRef = useRef(false);

  // Track scroll depth — only arm after the visitor has seen ~50% of the page.
  useEffect(() => {
    scrolledEnoughRef.current = false;
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0 || window.scrollY / scrollable >= 0.5) {
        scrolledEnoughRef.current = true;
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);
  const firedRef = useRef(false);

  // ── Touch detection ──────────────────────────────────────────────────────

  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Detect touch at mount time
    isTouchDevice.current =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    // Also listen for a touch event — if the user ever touches the screen,
    // treat it as a touch device so we don't fire on laptops with touchscreens
    // where the user is primarily touching.
    const onTouch = () => {
      isTouchDevice.current = true;
    };
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  // ── Exit-intent listener ─────────────────────────────────────────────────

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only fire if mouse leaves through the top of the viewport
    if (e.clientY > 10) return;

    // Skip if already fired this session
    if (firedRef.current) return;

    // Skip if sessionStorage has a dismissal flag
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    // Skip on touch devices
    if (isTouchDevice.current) return;

    // Only on blog + solution pages, and only once the visitor has actually
    // engaged (scrolled at least half the page).
    if (!ARMED_ROUTES.some((r) => window.location.pathname.startsWith(r))) return;
    if (!scrolledEnoughRef.current) return;

    firedRef.current = true;
    setVisible(true);
  }, []);

  useEffect(() => {
    // Don't attach if already dismissed
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return;

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  // ── Dismiss ──────────────────────────────────────────────────────────────

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop — glass-morphism dark overlay */}
      <div
        className="absolute inset-0 bg-navy-950/70 backdrop-blur-md animate-fadeIn"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-navy-100 shadow-2xl shadow-navy-950/30 p-8 animate-fadeInUp">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-navy-400 hover:text-navy-600 hover:bg-navy-50 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Free lookup
        </span>

        <h3 className="mt-4 text-2xl font-extrabold text-navy-900 leading-tight">{headline}</h3>
        <p className="mt-3 text-navy-500 leading-relaxed">{subtext}</p>

        <Link
          to={to}
          onClick={dismiss}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
        >
          {buttonLabel}
          <ArrowRight size={16} />
        </Link>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 w-full text-center text-sm text-navy-400 hover:text-navy-600 transition-colors"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
