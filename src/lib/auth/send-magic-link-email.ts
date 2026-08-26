/**
 * Sends a magic link email.
 *
 * In a real deployment you would send an email via your provider
 * (SendGrid, Resend, Postmark, etc.).  For the starter we log the
 * URL to the console so you can copy it during local development.
 */
export async function sendMagicLinkEmail(
  email: string,
  url: string,
): Promise<void> {
  console.log(`[magic-link] Sending link to ${email}: ${url}`);
}
