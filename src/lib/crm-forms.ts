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
 */

export const CRM_FORM_ORIGIN = 'https://tnxcrm.com';

export type CrmFormKey = 'contact' | 'ai' | 'potsVoice';

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
};

/** The public URL of a form. The only place a CRM form URL is built. */
export function crmFormUrl(key: CrmFormKey): string {
  return `${CRM_FORM_ORIGIN}/forms/${CRM_FORMS[key].id}`;
}
