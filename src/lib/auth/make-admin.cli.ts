#!/usr/bin/env tsx
/**
 * CLI command: `pnpm make:admin <email>`
 *
 * Promotes a user to the "admin" role in the database.
 *
 * Usage:
 *   pnpm make:admin user@example.com
 *
 * This updates the `role` column directly in the `users` table
 * (managed by BetterAuth's admin plugin).  No ADMIN_EMAILS env
 * var is needed — roles are managed exclusively through this CLI
 * or the Orbit Admin UI.
 */
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌  Usage: pnpm make:admin <email>");
    console.error("   Example: pnpm make:admin user@example.com");
    process.exit(1);
  }

  console.log(`🔍 Looking up user with email: ${email}`);

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existing) {
    console.error(`❌  No user found with email: ${email}`);
    console.error("   Make sure the user has signed in at least once.");
    process.exit(1);
  }

  if (existing.role === "admin") {
    console.log(`✅  User "${email}" is already an admin.`);
    process.exit(0);
  }

  await db
    .update(users)
    .set({ role: "admin" })
    .where(eq(users.email, email));

  console.log(`✅  User "${email}" has been promoted to admin.`);
  console.log("   They will need to sign out and sign back in for the");
  console.log("   role change to take effect in their session.");
}

main().catch((err) => {
  console.error("❌  Error:", err);
  process.exit(1);
});
