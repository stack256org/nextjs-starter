/**
 * Loads environment variables for scripts that run OUTSIDE of Next.js
 * (the pgBoss worker, the migration runner, the make-admin CLI).
 *
 * Import this as the FIRST import of any CLI entry point:
 *
 * ```ts
 * import "@/lib/env/load";        // must come first
 * import { startWorker } from "./worker";
 * ```
 *
 * Why a module and not a plain `dotenv.config()` call in the CLI?
 * ES module imports are hoisted and evaluated before any statement in the
 * importing module's body.  Calling `dotenv.config()` in the body therefore
 * runs *after* `@/lib/db` has already constructed its `Pool` from an empty
 * `process.env.DATABASE_URL`.  Because sibling imports are evaluated in
 * source order, putting the load in its own module and importing it first
 * guarantees the env is populated before anything reads it.
 *
 * Next.js loads `.env.local` / `.env` itself, so this module is never
 * imported from application code.
 */
import { config } from "dotenv";

// `.env.local` wins over `.env`; neither overrides variables that are
// already set in the real environment (production, CI, Docker).
config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const REQUIRED = ["DATABASE_URL"] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `\nMissing required environment variable(s): ${missing.join(", ")}\n` +
      `   Copy .env.example to .env.local and fill it in:\n` +
      `     cp .env.example .env.local\n`,
  );
  process.exit(1);
}
