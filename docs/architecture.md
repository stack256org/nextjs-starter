# Project Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | PostgreSQL via Drizzle ORM |
| Job queue | pgBoss (PostgreSQL-backed) |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Lint | ESLint with `eslint-config-next` |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — wraps app with ThemeProvider
│   ├── page.tsx                  # Home page (Client Component) with DaisyUI showcase
│   ├── globals.css               # Tailwind CSS + DaisyUI (6 themes)
│   └── favicon.ico
├── components/
│   ├── theme-provider.tsx        # Wraps next-themes ThemeProvider for light/dark + DaisyUI
│   └── theme-toggle.tsx          # Sun/Moon toggle button using Phosphor icons
├── lib/
│   ├── db/                       # Drizzle ORM
│   │   ├── index.ts              # PostgreSQL pool + Drizzle db instance
│   │   ├── schema.ts             # Database schema (users, posts tables)
│   │   ├── migrate.ts            # runMigrations() for programmatic use
│   │   ├── migrate.cli.ts        # CLI entry point for migrations
│   │   └── migrations/           # Generated SQL migration files
│   └── queue/                    # pgBoss job queue
│       ├── index.ts              # pgBoss instance, initQueue(), closeQueue()
│       ├── jobs.ts               # JobType, sendJob(), registerWorker()
│       ├── worker.ts             # Job handlers + startWorker()
│       └── worker.cli.ts         # CLI entry point for the worker
drizzle.config.ts                # Drizzle Kit configuration
```
