import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, CheckCircle2, Loader2, Send } from 'lucide-react';

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
  /** Override thank-you headline */
  thankYouHeadline?: string;
  /** Override thank-you body */
  thankYouBody?: string;
  /** CRM endpoint override */
  endpoint?: string;
  /** Source tag sent with the submission */
  source?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_ENDPOINT =
  'https://enhancedlines.com/api/public/forms/f042309a-4268-4d51-986d-c1a827af9dea/submit';

const STORAGE_KEY = 'trustednetworx_exit_intent_dismissed';

// ── Component ──────────────────────────────────────────────────────────────────

const ExitIntentPopup = ({
  headline = 'Before you go...',
  subtext = 'See exactly what your legacy lines are costing you — run the free POTS Replacement ROI Calculator. Two minutes, no sales call.',
  buttonLabel = 'Email Me the Calculator Link',
  dismissLabel = 'No thanks',
  thankYouHeadline = 'On its way!',
  thankYouBody = 'Check your inbox for the calculator link — or run it now at trustednetworx.com/pots-replacement.',
  endpoint = DEFAULT_ENDPOINT,
  source = 'exit_intent',
}: ExitIntentPopupProps) => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source,
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(body || `Request failed (${res.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Nothing to show ──────────────────────────────────────────────────────

  if (!visible) return null;

  // ── Render ───────────────────────────────────────────────────────────────

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

        {submitted ? (
          /* ── Thank-you state ────────────────────────────────────────── */
          <div className="text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-navy-900">
              {thankYouHeadline}
            </h3>
            <p className="mt-3 text-navy-500 leading-relaxed">{thankYouBody}</p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form state ─────────────────────────────────────────────── */
          <>
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Free Resource
            </span>

            <h3 className="mt-4 text-2xl font-extrabold text-navy-900 leading-tight">
              {headline}
            </h3>
            <p className="mt-3 text-navy-500 leading-relaxed">{subtext}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="exit-intent-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="exit-intent-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={!email.trim() || submitting}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  email.trim() && !submitting
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-glow hover:shadow-card-hover hover:-translate-y-0.5'
                    : 'bg-navy-100 text-navy-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {buttonLabel}
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 w-full text-center text-sm text-navy-400 hover:text-navy-600 transition-colors"
            >
              {dismissLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
