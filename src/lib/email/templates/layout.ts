/**
 * Shared HTML email shell.
 *
 * Email clients are not browsers. The constraints this file works within:
 *  - Outlook (Word rendering engine) ignores flexbox, grid, and most modern
 *    CSS, so structure is tables and inline styles.
 *  - Gmail strips `<style>` blocks in some contexts, so every rule that must
 *    survive is inlined on the element.
 *  - `prefers-color-scheme` works in Apple Mail and iOS Mail but not Gmail, so
 *    the light palette must be legible on its own and dark mode is progressive
 *    enhancement layered on top.
 *  - No web fonts: system stacks only.
 *
 * The palette mirrors the app's DaisyUI theme, but hard-coded — CSS variables
 * do not resolve in email.
 */

export const BRAND = {
  ink: "#1b1f24",
  inkMuted: "#5b6672",
  surface: "#ffffff",
  page: "#f4f6f7",
  border: "#dfe4e8",
  accent: "#007b69",
  accentInk: "#ffffff",
} as const;

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export interface EmailLayoutOptions {
  /** Shown in the inbox preview line, next to the subject. */
  preheader: string;
  appName: string;
  /** Inner HTML of the message body. */
  body: string;
  /** Small print under the card. */
  footer?: string;
}

/**
 * Wraps message content in the shared shell.
 *
 * The preheader is a hidden element at the top of the body — inbox clients
 * show it after the subject line. Without one they show whatever text comes
 * first, which is usually the greeting or a stray URL.
 */
export function renderEmailLayout({
  preheader,
  appName,
  body,
  footer,
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${escapeHtml(appName)}</title>
<style>
  /* Progressive enhancement only — Gmail ignores this block entirely, which
     is why the inline light styles below must stand on their own. */
  @media (prefers-color-scheme: dark) {
    .email-page { background: #14171a !important; }
    .email-card { background: #1b1f24 !important; border-color: #2b3239 !important; }
    .email-ink { color: #e8ebee !important; }
    .email-muted { color: #9aa5b1 !important; }
    .email-hairline { border-color: #2b3239 !important; }
    .email-code { background: #14171a !important; color: #9aa5b1 !important; }
  }
  @media only screen and (max-width: 620px) {
    .email-card { padding: 28px 22px !important; }
    .email-button { display: block !important; text-align: center !important; }
  }
  a { color: ${BRAND.accent}; }
</style>
</head>
<body class="email-page" style="margin:0;padding:0;background:${BRAND.page};font-family:${FONT_STACK};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
  <!-- Repeated whitespace stops clients appending the quoted-text preview to the preheader. -->
  <div style="display:none;max-height:0;overflow:hidden;">${"&#847;&zwnj;&nbsp;".repeat(60)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-page" style="background:${BRAND.page};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:20px;">
              <span class="email-ink" style="font-size:15px;font-weight:600;letter-spacing:-0.01em;color:${BRAND.ink};">${escapeHtml(appName)}</span>
            </td>
          </tr>
          <tr>
            <td class="email-card" style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:14px;padding:36px 32px;">
              ${body}
            </td>
          </tr>
          ${
            footer
              ? `<tr><td style="padding-top:20px;">
                   <p class="email-muted" style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.inkMuted};">${footer}</p>
                 </td></tr>`
              : ""
          }
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * A bulletproof-ish CTA button.
 *
 * Uses a table rather than a styled anchor so Outlook renders the background
 * colour instead of a bare blue link.
 */
export function renderButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0;">
  <tr>
    <td align="center" bgcolor="${BRAND.accent}" style="border-radius:8px;">
      <a class="email-button" href="${escapeAttribute(href)}"
         style="display:inline-block;padding:13px 26px;font-family:${FONT_STACK};font-size:15px;font-weight:600;line-height:1;color:${BRAND.accentInk};text-decoration:none;border-radius:8px;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

/** Escapes text destined for element content. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes a value going into an HTML attribute.
 *
 * Magic-link URLs carry a token in the query string; interpolating one
 * unescaped lets a crafted token close the attribute and inject markup.
 */
export function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
