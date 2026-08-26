import { initQueue, closeQueue } from "./index";
import { registerWorker } from "./jobs";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Job } from "pg-boss";

/**
 * Job handlers — define the business logic for each job type here.
 * Each handler receives a single pgBoss Job whose `data` field
 * contains the payload sent via `sendJob`.
 */

/** Sends a welcome email to a newly registered user. */
async function handleSendEmail(
  job: Job<{ userId: string; subject: string; body: string }>,
) {
  const { userId, subject, body } = job.data;

  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    console.warn(`⚠️ User ${userId} not found, skipping email`);
    return;
  }

  // TODO: Integrate your email provider (Resend, SendGrid, etc.)
  console.log(`📧 Sending email to ${user.email}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body: ${body}`);
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
 *   npm run worker
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
