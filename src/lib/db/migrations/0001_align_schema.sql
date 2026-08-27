-- Aligns the database with src/lib/db/schema.ts.
--
-- Migration 0000 drifted from the schema: the BetterAuth admin plugin's ban
-- columns were added to running databases with `drizzle-kit push` and never
-- written to a migration file, so a fresh clone got a `users` table the admin
-- plugin could not use. This migration is written idempotently so it converges
-- both a fresh database and one that was pushed to by hand.

-- ── users: admin-plugin ban fields (previously push-only) ──
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ban_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ban_expires" timestamp with time zone;--> statement-breakpoint

-- ── Drop columns nothing reads ──
-- `is_active` was never referenced by the app; bans are handled by the
-- admin plugin's `banned` column instead.
ALTER TABLE "users" DROP COLUMN IF EXISTS "is_active";--> statement-breakpoint
-- `active_organization_id` belongs to BetterAuth's organization plugin, which
-- this starter does not enable.
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "active_organization_id";--> statement-breakpoint
-- `issuer` is not a BetterAuth account field.
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "issuer";--> statement-breakpoint

-- ── sessions.token must be unique ──
-- BetterAuth looks sessions up by token on every request and assumes one row.
DELETE FROM "sessions" a
  USING "sessions" b
  WHERE a.ctid < b.ctid AND a.token = b.token;--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_token_unique";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");--> statement-breakpoint

-- ── accounts: one row per (provider, remote account) ──
DELETE FROM "accounts" a
  USING "accounts" b
  WHERE a.ctid < b.ctid
    AND a.provider_id = b.provider_id
    AND a.account_id = b.account_id;--> statement-breakpoint
DROP INDEX IF EXISTS "accounts_provider_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_account_idx"
  ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint

-- ── Drop the posts example table ──
-- Nothing in the app read or wrote it; add your own tables here instead.
DROP TABLE IF EXISTS "posts";
