import {
  BRAND,
  escapeHtml,
  renderButton,
  renderEmailLayout,
} from "./layout";

export interface MagicLinkEmailOptions {
  appName: string;
  url: string;
  /** How long the link stays valid, in minutes. */
  expiresInMinutes: number;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * The sign-in email.
 *
 * Copy rules this follows: no exclamation marks, no "Oops", active voice, and
 * it states the expiry and the "you didn't request this" case up front —
 * those two lines are what make a magic-link email read as legitimate rather
 * than as phishing.
 */
export function renderMagicLinkEmail({
  appName,
  url,
  expiresInMinutes,
}: MagicLinkEmailOptions): RenderedEmail {
  const body = `
    <h1 class="email-ink" style="margin:0 0 12px;font-size:21px;line-height:1.3;font-weight:600;letter-spacing:-0.01em;color:${BRAND.ink};">
      Your sign-in link
    </h1>
    <p class="email-muted" style="margin:0;font-size:15px;line-height:1.65;color:${BRAND.inkMuted};">
      Select the button below to sign in to ${escapeHtml(appName)}. The link
      works once and expires in ${expiresInMinutes} minutes.
    </p>

    ${renderButton(url, "Sign in")}

    <p class="email-muted" style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${BRAND.inkMuted};">
      If the button does not work, paste this address into your browser:
    </p>
    <p class="email-code" style="margin:0;padding:11px 13px;background:${BRAND.page};border-radius:7px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;word-break:break-all;color:${BRAND.inkMuted};">
      ${escapeHtml(url)}
    </p>

    <div class="email-hairline" style="margin:26px 0 0;border-top:1px solid ${BRAND.border};"></div>
    <p class="email-muted" style="margin:18px 0 0;font-size:13px;line-height:1.6;color:${BRAND.inkMuted};">
      You received this because someone entered this address on the
      ${escapeHtml(appName)} sign-in page. If that was not you, no action is
      needed — the link expires on its own and nobody can sign in without it.
    </p>
  `;

  const text = [
    `Your sign-in link`,
    ``,
    `Open this address to sign in to ${appName}. It works once and expires in ${expiresInMinutes} minutes.`,
    ``,
    url,
    ``,
    `You received this because someone entered this address on the ${appName} sign-in page. If that was not you, no action is needed — the link expires on its own.`,
  ].join("\n");

  return {
    subject: `Your ${appName} sign-in link`,
    html: renderEmailLayout({
      preheader: `Sign in to ${appName}. This link expires in ${expiresInMinutes} minutes.`,
      appName,
      body,
      footer: `This is an automated message — replies are not monitored.`,
    }),
    text,
  };
}
