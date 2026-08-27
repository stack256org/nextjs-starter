# Database

## Overview

[Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL (`pg`) for type-safe
access. Migrations are managed by
[Drizzle Kit](https://orm.drizzle.team/kit/docs/overview).

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required) | `postgres://user:pass@host:5432/dbname` |
| `PGBOSS_DATABASE_URL` | pgBoss queue connection (optional) | Falls back to `DATABASE_URL` |

```bash
cp .env.example .env.local
```

### Env loading outside Next.js

Next.js loads `.env.local` on its own, but the CLIs (`db:migrate:run`,
`worker`, `make:admin`) and `drizzle.config.ts` do not get that for free. They
each import `@/lib/env/load` **as their first import**.

The ordering matters. ES module imports are hoisted and evaluated before any
statement in the importing module's body, so calling `dotenv.config()` in the
body runs *after* `@/lib/db` has already built its connection pool from an
empty `process.env.DATABASE_URL`. The symptom is
`SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`.
Putting the load in its own module and importing it first fixes it, because
sibling imports are evaluated in source order.

## pnpm Scripts

| Command | Description |
|---|---|
| `pnpm db:generate` | Generate a new SQL migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations (Drizzle Kit CLI) |
| `pnpm db:migrate:run` | Apply migrations programmatically (Docker entrypoints) |
| `pnpm db:push` | Push schema without generating a migration |
| `pnpm db:studio` | Open Drizzle Studio |

> **Use `db:push` only on databases you're willing to throw away.** It mutates
> the database without writing a migration file, so the schema and the
> migration history drift apart — a fresh clone running `pnpm db:migrate` then
> gets a database that doesn't match `schema.ts`. That is exactly how the ban
> columns went missing from migration `0000` and had to be repaired in `0001`.

## Changing the schema

1. Edit `src/lib/db/schema.ts`.
2. `pnpm db:generate` — writes SQL to `src/lib/db/migrations/`.
3. Read the generated SQL. Drizzle can't tell a rename from a drop-plus-add,
   and it will ask.
4. `pnpm db:migrate`.
5. Commit the schema, the `.sql` file, **and** `migrations/meta/`.

## Tables

| Table | Purpose |
|---|---|
| `users` | Auth users — `role`, `banned`, `ban_reason`, `ban_expires`, `email_verified`, `image` |
| `accounts` | Linked sign-in providers; unique on (`provider_id`, `account_id`) |
| `sessions` | Sessions — `token` is unique, `impersonated_by` set while impersonating |
| `verifications` | Magic link and email verification tokens |

All four are BetterAuth's, mapped through the Drizzle adapter with
`usePlural: true`. Renaming a column here breaks auth unless the adapter
config in `src/lib/auth/server.ts` is updated to match.

Application tables go alongside them — this starter ships none, so the first
table you add is yours.

## Usage Example

```ts
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"));
```
