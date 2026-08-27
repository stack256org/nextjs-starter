# Database

## Overview

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
(`pg`) for type-safe database access. Migrations are managed by
[Drizzle Kit](https://orm.drizzle.team/kit/docs/overview).

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required) | `postgres://user:pass@host:5432/dbname` |
| `PGBOSS_DATABASE_URL` | pgBoss queue connection (optional) | Same as `DATABASE_URL` if omitted |

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

## pnpm Scripts

| Command | Description |
|---|---|
| `pnpm db:generate` | Generate a new SQL migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations (Drizzle Kit CLI) |
| `pnpm db:migrate:run` | Apply migrations programmatically (for Docker startup) |
| `pnpm db:push` | Push schema changes to the database without generating migration files (dev only) |
| `pnpm db:studio` | Open the Drizzle Studio web GUI |

## Usage Example

```ts
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Select
const user = await db.select().from(users).where(eq(users.email, "user@example.com"));

// Insert
await db.insert(users).values({
  email: "jane@example.com",
  name: "Jane Doe",
});
```

## Tables

| Table | Purpose |
|---|---|
| `users` | Auth users (managed by BetterAuth) — includes `role`, `is_active`, `email_verified`, `image` |
| `accounts` | OAuth account links (Google) |
| `sessions` | User sessions (includes `impersonated_by`) |
| `verifications` | Email verification / magic link tokens |
| `posts` | Application data — `author_id` FK to `users.id` |
