/**
 * The TNX CRM forms published in the TrustedNetworx workspace, and where the site embeds them.
 *
 * ONE SOURCE OF TRUTH. Every page that shows a form imports from here; no page builds its own
 * URL or its own iframe. That is what makes the frame-ancestors policy on the CRM side meaningful:
 * the CRM allows exactly `https://trustednetworx.com` and `https://www.trustednetworx.com` to frame
 * a form (exact origins, no wildcards — `formFrameAncestors` in tnx-crm-app rejects anything else),
 * so the only thing that may change about an embed is WHICH form is shown and how tall it is.
 *
 * `height` values are the iframe height in CSS pixels. The DESKTOP values are measured against the
 * live forms (1280px viewport, full document height): ai 1387, potsVoice 1387, contact 1111 — plus
 * a small headroom, so the form fits with no inner scrollbar.
 *
 * The PHONE values are NOT measured: they are the desktop value x1.5, which is an estimate. Phone
 * width stacks the fields and each one's label wraps, so the form grows, but by how much is unknown
 * until a form actually renders in an embed. Tune these the first time one does — an under-estimate
 * clips the submit button, which the form itself cannot report because it is cross-origin.
 *
 * ONE EXCEPTION, and it is the model for the rest: `partnerHub` is measured at both breakpoints and
 * as the embed actually renders it — framed, with the form page's own header hidden. Its form box
 * turned out not to reflow at all (718px from 320 to 1280), so its phone value equals its desktop
 * value. See the note on that entry, including the merge-order dependency the framed values carry.
 */

export const CRM_FORM_ORIGIN = 'https://tnxcrm.com';

export type CrmFormKey = 'contact' | 'ai' | 'potsVoice' | 'quick' | 'partnerHub';

type CrmFormDefinition = {
  /** The published form's public id, exactly as it appears in `https://tnxcrm.com/forms/<id>`. */
  readonly id: string;
  /** Accessible iframe title. Screen readers announce this, so it must name the form, not the page. */
  readonly title: string;
  /** Heading shown above the embed. */
  readonly heading: string;
  /** One line of context under the heading. */
  readonly blurb: string;
  /** Fits the form with no inner scrollbar at desktop width. */
  readonly height: number;
  /** Fits the form with no inner scrollbar at phone width. */
  readonly heightPhone: number;
};

export const CRM_FORMS: Readonly<Record<CrmFormKey, CrmFormDefinition>> = {
  contact: {
    id: 'b94a66e6-c983-4004-88e4-7a532ce98b76',
    title: 'Contact TrustedNetworx',
    heading: 'Talk to us',
    blurb: 'Tell us what you are trying to solve and the right person picks it up — usually the same day.',
    height: 1180,
    heightPhone: 1770,
  },
  ai: {
    id: '602b1dfe-9e19-4647-9222-a0490a65361b',
    title: 'AI Solutions enquiry',
    heading: 'Start with your AI focus',
    blurb: 'A few questions about where AI fits in your business. It takes about a minute.',
    height: 1450,
    heightPhone: 2180,
  },
  potsVoice: {
    id: '8231e559-674b-48ed-af83-601e0cf004c9',
    title: 'POTS replacement and hosted voice enquiry',
    heading: 'Get a POTS replacement plan',
    blurb: 'Tell us about your sites and lines, and we will come back with a migration plan and pricing.',
    height: 1450,
    heightPhone: 2180,
  },
  // tnx-crm-bus#77 (migration 121): Carter's short form — full name, email, company required;
  // phone, title, notes optional; nothing else. Heights are ESTIMATES from the contact form's
  // measured 1111px less its three extra fields; measure on the live form (bus#82 task 0.9).
  quick: {
    id: 'a7c3e5f1-2b4d-4e6f-8a90-1c2d3e4f5a6b',
    title: 'Contact TrustedNetworx',
    heading: 'Talk to us',
    blurb: 'Leave your details and the right person picks it up, usually the same business day.',
    height: 900,
    heightPhone: 1350,
  },
  // tnx-crm-bus#95 — the Partner Hub Design Partner Program form. The public id is a FIXED literal
  // in the CRM migration that creates the form (the migration-121 / bus#77 pattern), so it is the
  // same in every environment. The form is LIVE: migration 128 was applied to production 2026-10-11.
  //
  // MEASURED on the live form, not estimated. Puppeteer against https://tnxcrm.com/forms/<id> on
  // 2026-10-12, with the form serving SIX fields (full_name, company_name, email, phone, role_type,
  // notes). County and the year-one client count were removed in the CRM form editor; that first
  // attempt never saved because field removal returned 503 for every form — `replaceDefinitionGuarded`
  // called `web_form_replace_definition` on the session client while migration 093 grants it to
  // service_role only. Fixed by tnx-crm-app#193, removed after it deployed.
  //
  // The form is single-column and does NOT reflow: its box measures 718px at 320, 360, 390, 414,
  // 768, 1024 and 1280 alike. What varies with width is the form page's OWN header (96px of margin
  // included at desktop, 168px at 360) — and that header is not rendered inside a frame.
  //
  // So both heights below are the FRAMED height with the header hidden: the page's own padding plus
  // the form = 40 + 718 + 40 = 798, FLAT across every width measured, plus 40px of headroom.
  //
  // THE DEPENDENCY, stated plainly because it is a merge-order constraint: these values assume the
  // header is NOT rendered inside the frame, which is tnx-crm-bus#95 task 1 (the CRM branding PR,
  // tnx-crm-app#194). Until that is deployed the framed page still prints the header, so the same
  // embed holds 894px (desktop) / 966px (phone) of content in an 838px box: it scrolls internally
  // rather than clipping, but the submit button needs a scroll to reach. Deploy the CRM branding PR
  // BEFORE this site PR — or, if the order has to be the other way round, re-measure in the
  // with-header state instead of using these.
  //
  // Known limitation: a validation-error state (every required field failing at once) adds roughly
  // 100px that this headroom does not cover. The frame scrolls for it, which is acceptable because
  // the visitor is looking straight at the form when it happens.
  partnerHub: {
    id: '6fde8408-50d9-44a0-b77b-01d0fc315e24',
    title: 'Partner Hub Design Partner Program application',
    heading: 'Apply for the Design Partner Program',
    blurb: 'Five partners in South Florida, ninety days, hands-on. Tell us about your business and Carter will set up the 20-minute look.',
    height: 838,
    heightPhone: 838,
  },
};

/**
 * What a visitor answered on one of the site's assessment tools, handed to the CRM form so the
 * lead carries the questions, the answers and the score.
 *
 * Contract with TNX CRM (v1): the form URL gets `?ctx=<base64url(UTF-8 JSON of this object)>`.
 * The CRM decodes it on submit, stores it on the lead (a note listing every question, answer and
 * points, plus the total score and band), and uses it for the visitor's report email.
 * It is visitor-controlled input: the CRM treats it as untrusted text, caps its size, and never
 * lets it choose the tenant — the form id does that.
 */
export type CrmFormContext = {
  v: 1;
  /** Tool slug, e.g. "copper-sunset-risk". */
  tool: string;
  /** Human name of the tool. */
  title: string;
  score: number;
  max: number;
  /** The result band shown to the visitor, e.g. "High". */
  band: string;
  /** How to read the score, e.g. "higher = more risk". */
  scale: string;
  answers: { q: string; a: string; points?: number; max?: number }[];
  /** The recommendations shown on the page, if any. */
  recommendations?: string[];
};

const MAX_CTX_CHARS = 6000;

function base64UrlJson(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The public URL of a form. The only place a CRM form URL is built. */
export function crmFormUrl(key: CrmFormKey, context?: CrmFormContext): string {
  const base = `${CRM_FORM_ORIGIN}/forms/${CRM_FORMS[key].id}`;
  if (!context) return base;
  const ctx = base64UrlJson(context);
  // A URL that long would be refused somewhere along the way; drop the context rather than the lead.
  return ctx.length > MAX_CTX_CHARS ? base : `${base}?ctx=${ctx}`;
}
