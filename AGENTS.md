<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Architecture

## Tech Stack

- **Next.js 16** — App Router with TypeScript
- **Tailwind CSS v4** + **DaisyUI v5** — Design system with 6 themes (light, dark, cupcake, synthwave, valentines, emerald)
- **Drizzle ORM** + **PostgreSQL** — Type-safe database with migrations
- **pgBoss** — PostgreSQL-backed job queue for background processing

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with DaisyUI data-theme
│   ├── page.tsx              # Home page showcasing DaisyUI components
│   ├── globals.css           # Tailwind + DaisyUI styles
│   └── favicon.ico
├── lib/
│   ├── db/
│   │   ├── index.ts          # Drizzle ORM db instance (PostgreSQL pool)
│   │   ├── schema.ts         # Database schema (users, posts tables)
│   │   ├── migrate.ts        # runMigrations() function
│   │   └── migrate.cli.ts    # CLI entry point for migrations
│   └── queue/
│       ├── index.ts          # pgBoss instance and init/close functions
│       ├── jobs.ts           # Job types, sendJob(), registerWorker()
│       ├── worker.ts         # Job handlers + startWorker()
│       └── worker.cli.ts     # CLI entry point for the worker
```

## Database Scripts

```bash
npm run db:generate     # Generate migration from schema changes
npm run db:migrate      # Apply migrations (Drizzle Kit CLI)
npm run db:migrate:run  # Apply migrations (programmatic, for Docker)
npm run db:push         # Push schema changes without migrations
npm run db:studio       # Open Drizzle Studio GUI
```

## Worker Script

```bash
npm run worker          # Start the pgBoss job worker
```

## Environment Variables

| Variable            | Description          | Example                                         |
|---------------------|----------------------|-------------------------------------------------|
| `DATABASE_URL`      | PostgreSQL connection| `postgres://user:pass@host:5432/dbname`         |
| `PGBOSS_DATABASE_URL` | pgBoss connection   | Same as DATABASE_URL (optional, falls back)     |

Set these in `.env.local` (already created with example values).
