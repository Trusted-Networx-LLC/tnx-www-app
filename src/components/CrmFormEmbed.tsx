import type { CSSProperties } from 'react';
import { CRM_FORMS, crmFormUrl, type CrmFormContext, type CrmFormKey } from '../lib/crm-forms';

type Props = {
  /** Which published CRM form to show. Never a raw URL — the URL is built in `lib/crm-forms`. */
  form: CrmFormKey;
  /**
   * `section` — a standalone band with its own heading (a page that had no form).
   * `bare` — only the framed form, for a placement inside an existing card or column.
   */
  variant?: 'section' | 'bare';
  className?: string;
  /** Override the measured height for one placement, in CSS pixels. */
  height?: number;
  /** Override the measured phone-width height for one placement. */
  heightPhone?: number;
  /** Assessment answers and score to attach to the lead (see `CrmFormContext`). */
  context?: CrmFormContext;
};

/**
 * The one way this site embeds a TNX CRM form.
 *
 * The form is a cross-origin iframe: this page cannot measure or style its inside, so the height is
 * declared here and the responsive values live in `index.css` (`.crm-form-embed iframe`). Both are
 * measured against the live form so it fits with no inner scrollbar — one fixed value would either
 * clip the stacked phone layout or leave a band of empty space.
 *
 * Two things must both be true or the iframe renders nothing:
 *   1. the site's CSP allows the CRM in `frame-src` (netlify.toml), and
 *   2. the published form's `allowed_origins` contains this exact origin — the CRM builds
 *      `frame-ancestors` from it and accepts exact HTTPS origins only.
 * So every placement carries a visible "open in a new tab" fallback rather than a dead rectangle.
 */
export default function CrmFormEmbed({
  form,
  variant = 'section',
  className = '',
  height,
  heightPhone,
  context,
}: Props) {
  const definition = CRM_FORMS[form];
  const url = crmFormUrl(form, context);

  const style = {
    '--crm-form-height': `${height ?? definition.height}px`,
    '--crm-form-height-phone': `${heightPhone ?? definition.heightPhone}px`,
  } as CSSProperties;

  const frame = (
    <>
      <div className="crm-form-embed overflow-hidden rounded-lg border border-hairline bg-white" style={style}>
        <iframe
          src={url}
          title={definition.title}
          loading="lazy"
          // The form does not need the embedding page's URL, and it must not receive credentials.
          referrerPolicy="strict-origin-when-cross-origin"
          className="block w-full border-0"
        />
      </div>
      <p className="mt-4 text-center text-sm text-muted-text">
        Form not loading?{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-700 underline hover:text-brand-800"
        >
          Open it in a new tab
        </a>
        .
      </p>
    </>
  );

  if (variant === 'bare') {
    return <div className={className}>{frame}</div>;
  }

  return (
    <section className={`border-b border-hairline bg-white ${className}`.trim()}>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <header className="mb-8 text-center">
          <h2 className="font-display text-display-h2 font-semibold text-ink">{definition.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-body">{definition.blurb}</p>
        </header>
        {frame}
      </div>
    </section>
  );
}
