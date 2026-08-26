<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Documentation

The project architecture and usage guides live in the `docs/` folder so each
topic has its own dedicated file:

- [`docs/nextjs-agent-rules.md`](docs/nextjs-agent-rules.md) — The Next.js
  agent rules (mirrors the block above)
- [`docs/architecture.md`](docs/architecture.md) — Tech stack and project
  structure
- [`docs/database.md`](docs/database.md) — Drizzle ORM, migrations, and
  environment variables
- [`docs/worker.md`](docs/worker.md) — pgBoss job queue setup and usage
- [`docs/themes.md`](docs/themes.md) — Light/dark mode with next-themes and
  DaisyUI, plus Phosphor icons

## Quick Start

```bash
npm install
cp .env.example .env.local   # set your DATABASE_URL
npm run db:migrate            # create database tables
npm run dev -- --port 3003   # start the app
npm run worker               # start the pgBoss worker (separate terminal)
```
