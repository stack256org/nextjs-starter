import { initQueue, closeQueue } from "./index";
import { registerWorker } from "./jobs";
import { sendEmail } from "@/lib/email/send";
import type { Job } from "pg-boss";

/**
 * Job handlers — the business logic for each job type lives here.
 * Each handler receives a single pgBoss Job whose `data` field holds the
 * payload passed to `sendJob`.
 */

interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email via SMTP (Nodemailer) using credentials from environment
 * variables.  This runs in the **worker process**, so slow SMTP calls never
 * block the web server.  The transport is configured in `src/lib/email/send.ts`.
 */
async function handleSendEmail(job: Job<SendEmailData>) {
  const { to, subject, html, text } = job.data;
  await sendEmail({ to, subject, html, text });
}

/**
 * Start the pgBoss worker process.
 *
 * Registers every job handler and keeps the process alive.  Run it alongside
 * the Next.js app — `pnpm dev` starts both; in production run `pnpm worker`
 * as its own process.
 */
export async function startWorker() {
  console.log("Starting pgBoss worker...");
  await initQueue();

  // Register all job handlers
  await registerWorker("send-email", handleSendEmail);

  console.log("pgBoss worker is running. Press Ctrl+C to stop.");

  // Graceful shutdown
  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} received, shutting down worker...`);
    await closeQueue().catch((err) =>
      console.error("Error stopping queue:", err),
    );
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}
