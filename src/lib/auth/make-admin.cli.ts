#!/usr/bin/env node
/**
 * CLI command: `pnpm make:admin <email>`
 *
 * Promotes a user to the "admin" role in the database — this is how you
 * create the FIRST admin, since the Orbit UI itself requires an admin.
 *
 * Usage:
 *   pnpm make:admin user@example.com
 *   pnpm make:admin user@example.com --demote
 *
 * This updates the `role` column directly in the `users` table (managed by
 * BetterAuth's admin plugin).  There is no ADMIN_EMAILS env var — roles live
 * only in the database, set through this CLI or the Orbit Admin UI.
 *
 * `@/lib/env/load` MUST stay the first import — see the comment in that file.
 */
import "@/lib/env/load";
import { db, closeDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const args = process.argv.slice(2);
  const demote = args.includes("--demote");
  const email = args.find((a) => !a.startsWith("--"));

  if (!email) {
    console.error("Usage: pnpm make:admin <email> [--demote]");
    console.error("   Example: pnpm make:admin user@example.com");
    return 1;
  }

  const targetRole = demote ? "user" : "admin";

  console.log(`Looking up user with email: ${email}`);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existing) {
    console.error(`No user found with email: ${email}`);
    console.error("   Make sure the user has signed in at least once.");
    return 1;
  }

  if (existing.role === targetRole) {
    console.log(`User "${email}" already has role "${targetRole}".`);
    return 0;
  }

  await db
    .update(users)
    .set({ role: targetRole, updatedAt: new Date() })
    .where(eq(users.email, email));

  console.log(`User "${email}" now has role "${targetRole}".`);
  console.log("   They must sign out and back in for the change to appear");
  console.log("   in their existing session.");
  return 0;
}

main()
  .then(async (code) => {
    await closeDb();
    process.exit(code);
  })
  .catch(async (err) => {
    console.error("Error:", err);
    await closeDb().catch(() => {});
    process.exit(1);
  });
