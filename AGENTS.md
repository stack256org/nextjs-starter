<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Documentation

The project architecture and usage guides live in the `docs/` folder so each
topic has its own dedicated file:

- [`docs/architecture.md`](docs/architecture.md) — Tech stack and project
  structure (includes auth, Orbit admin)
- [`docs/database.md`](docs/database.md) — Drizzle ORM, migrations, and
  environment variables
- [`docs/worker.md`](docs/worker.md) — pgBoss job queue setup and usage
- [`docs/themes.md`](docs/themes.md) — Light/dark mode with DaisyUI tokens and
  a zero-script ThemeProvider, plus Phosphor icons
- [`docs/auth.md`](docs/auth.md) — BetterAuth setup, auth flow, admin guide, SMTP
- [`docs/security.md`](docs/security.md) — Sessions, cookies, CSRF, and how
  Server Actions are authorised
- [`docs/rules.md`](docs/rules.md) — Engineering rules that must always be followed

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # set APP_SECRET at minimum
pnpm db:migrate              # create database tables
pnpm dev                     # web server AND pgBoss worker, on port 3003
```

`pnpm dev` runs both processes under `concurrently`. Do not pass `--port` — the
port is set inside the script, and the extra flag is forwarded to
`concurrently`, which rejects it.

**Admin promotion** — the first admin must come from the CLI, because the UI
that grants the role is itself admin-only:
```bash
pnpm make:admin user@example.com
```

## Conventions

- **Components:** every control is a Headless UI primitive styled with DaisyUI
  tokens. There are no native `<select>`, bare `<input>` or bare `<button>`
  elements in the app. Import from `@/components/ui`; the full set is demoed at
  `/ui` (unlinked and noindex).
- **Page layout:** compose `Page` → `PageHeader` → `Section` from
  `@/components/ui` rather than hand-rolling headings and spacing.
- **Verify before claiming:** `pnpm check` runs typecheck and lint together.
