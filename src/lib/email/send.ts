import nodemailer from "nodemailer";

/**
 * Lazy-initialized Nodemailer transport using SMTP credentials
 * from environment variables.
 *
 * SMTP settings:
 *   SMTP_HOST   — e.g. smtp.gmail.com, smtp.mailgun.org
 *   SMTP_PORT   — 587 (STARTTLS) or 465 (SMTPS)
 *   SMTP_USER   — SMTP authentication username
 *   SMTP_PASS   — SMTP authentication password / app password
 *   SMTP_FROM   — sender email address (e.g. "noreply@yourapp.com")
 */
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, " +
        "SMTP_USER, and SMTP_PASS in your environment variables.",
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });

  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email via SMTP using Nodemailer.
 *
 * This is intended to be called from the **pgBoss worker process**,
 * not from request handlers.  Queuing ensures that slow SMTP
 * operations never block the web server.
 *
 * @example
 *   await sendEmail({
 *     to: "user@example.com",
 *     subject: "Welcome!",
 *     html: "<p>Thanks for joining.</p>",
 *   });
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost";

  const info = await getTransporter().sendMail({
    from,
    to,
    subject,
    html,
    text,
  });

  console.log(`Email sent to ${to}`);
  console.log(`   MessageId: ${info.messageId}`);

  return info;
}
