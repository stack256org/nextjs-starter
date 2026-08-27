import { initQueue, closeQueue } from "./index";
import { registerWorker } from "./jobs";
import { sendEmail } from "@/lib/email/send";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Job } from "pg-boss";

/**
 * Job handlers — define the business logic for each job type here.
 * Each handler receives a single pgBoss Job whose `data` field
 * contains the payload sent via `sendJob`.
 */

interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends an email via SMTP (Nodemailer) using credentials from
 * environment variables.  This runs in the **worker process**,
 * so slow SMTP operations never block the web server.
 *
 * The job payload includes `to`, `subject`, `html`, and optionally
 * `text`.  The SMTP transport is configured in `src/lib/email/send.ts`.
 */
async function handleSendEmail(job: Job<SendEmailData>) {
  const { to, subject, html, text } = job.data;

  await sendEmail({
    to,
    subject,
    html,
    text,
  });

  console.log(`✅ Email queued and sent to ${to} (subject: ${subject})`);
}

/** Recalculates a post's view count (example background processing). */
async function handleProcessPost(job: Job<{ postId: string }>) {
  const { postId } = job.data;

  const [post] = await db.select().from(posts).where(eq(posts.id, postId));

  if (!post) {
    console.warn(`⚠️ Post ${postId} not found`);
    return;
  }

  // Simulate some background work
  const updatedViews = post.viewCount + 1;
  await db
    .update(posts)
    .set({ viewCount: updatedViews })
    .where(eq(posts.id, postId));

  console.log(`📊 Updated post "${post.title}" view count to ${updatedViews}`);
}

/**
 * Start the pgBoss worker process.
 *
 * This sets up all job handlers and keeps the process alive.
 * Run it as a separate process alongside your Next.js app:
 *
 *   pnpm worker
 *
 * In production (e.g. Docker), run the compiled version:
 *   node src/lib/queue/worker.cli.js
 */
export async function startWorker() {
  console.log("🚀 Starting pgBoss worker...");
  await initQueue();

  // Register all job handlers
  registerWorker("send-email", handleSendEmail);
  registerWorker("process-post", handleProcessPost);

  console.log("📋 pgBoss worker is running. Press Ctrl+C to stop.");

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down worker...`);
    await closeQueue();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
