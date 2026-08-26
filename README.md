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
| Lint | ESLint with `eslint-config-next` |

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
   # Edit .env.local and set your DATABASE_URL
   ```

2. **Start PostgreSQL** — point `DATABASE_URL` at a running Postgres instance.
   Using Docker:
   ```bash
   docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
   ```

3. **Run the migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Start the background worker** (separate terminal):
   ```bash
   npm run worker
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database commands

```bash
npm run db:generate  # Generate migration from schema changes
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema without migrations (dev only)
npm run db:studio    # Open Drizzle Studio GUI
npm run db:migrate:run  # Apply migrations programmatically (Docker)
```

## Worker commands

```bash
npm run worker       # Start the pgBoss worker process
```

## Available DaisyUI themes

Switch themes by adding a `data-theme` attribute to the `<html>` element in `src/app/layout.tsx`:

`light` (default) · `dark` · `cupcake` · `synthwave` · `valentines` · `emerald`

## License

MIT
