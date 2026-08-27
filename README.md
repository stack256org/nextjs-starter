# Next.js Starter

A production-ready Next.js 16 starter template with TypeScript, App Router, Drizzle ORM + PostgreSQL, pgBoss job queues, and the DaisyUI design system.

Everything you need to ship a modern, self-hostable web application — all the plumbing is set up and tested, so you can focus on building features.

## What's included

| Stack layer | Technology |
|---|---|
| Framework | Next.js 16 with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | PostgreSQL via Drizzle ORM (type-safe) |
| Job queue | pgBoss (PostgreSQL-backed background jobs) |
| Auth | BetterAuth (magic link + Google OAuth) |
| Email | Nodemailer + SMTP (Mailpit for local dev) |
| Lint | ESLint with `eslint-config-next` |
| Package manager | pnpm |

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (DaisyUI theme)
│   ├── page.tsx            # Home page with DaisyUI components
│   └── globals.css         # Tailwind + DaisyUI styles (6 themes)
├── lib/
│   ├── db/                 # Drizzle ORM
│   │   ├── index.ts        # db connection (PostgreSQL pool)
│   │   ├── schema.ts       # Schema (users, posts)
│   │   ├── migrate.ts      # Migration runner
│   │   └── migrations/     # Generated SQL migrations
│   └── queue/              # pgBoss job queue
│       ├── index.ts        # Queue init/close
│       ├── jobs.ts         # sendJob(), registerWorker()
│       ├── worker.ts       # Job handlers + startWorker()
│       └── worker.cli.ts   # CLI entry point
```

## Getting started

### Prerequisites

- Node.js 22+
- PostgreSQL 14+ (local, Docker, or cloud)

### Local development

1. **Copy the environment file:**
```bash
   cp .env.example .env.local
   # Edit .env.local and set your DATABASE_URL, BETTER_AUTH_SECRET
   ```

2. **Start PostgreSQL** — point `DATABASE_URL` at a running Postgres instance.
   Using Docker:
   ```bash
   docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
   ```

3. **Run the migrations:**
   ```bash
   pnpm db:migrate
   ```

4. **Start the dev server:**
   ```bash
   pnpm dev --port 3003
   ```

5. **Start the background worker** (separate terminal):
   ```bash
   pnpm worker
   ```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.

## Database commands

```bash
pnpm db:generate  # Generate migration from schema changes
pnpm db:migrate   # Apply pending migrations
pnpm db:push      # Push schema without migrations (dev only)
pnpm db:studio    # Open Drizzle Studio GUI
pnpm db:migrate:run  # Apply migrations programmatically (Docker)
```

## Worker commands

```bash
pnpm worker       # Start the pgBoss worker process
pnpm make:admin user@example.com  # Promote a user to admin
```

## Available DaisyUI themes

Switch themes by adding a `data-theme` attribute to the `<html>` element in `src/app/layout.tsx`:

`light` (default) · `dark` · `cupcake` · `synthwave` · `valentines` · `emerald` · `dim` (Orbit Admin)

## License

MIT
