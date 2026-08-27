# Next.js Starter

A Next.js 16 starter with TypeScript, App Router, Drizzle ORM + PostgreSQL,
pgBoss job queues, BetterAuth, and the DaisyUI design system.

The plumbing is set up and verified end to end, so you can start on features.

## What's included

| Stack layer | Technology |
|---|---|
| Framework | Next.js 16 with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | PostgreSQL via Drizzle ORM (type-safe) |
| Job queue | pgBoss (PostgreSQL-backed background jobs) |
| Auth | BetterAuth (magic link, optional Google OAuth, roles, impersonation) |
| Email | Nodemailer + SMTP (Mailpit for local dev) |
| Lint | Oxlint |
| Package manager | pnpm |

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, ThemeProvider)
│   ├── page.tsx                # Public landing page
│   ├── globals.css             # Tailwind + DaisyUI themes
│   ├── login/                  # Magic link + optional Google sign-in
│   ├── dashboard/              # Signed-in area (navbar)
│   │   ├── profile/            # Display name + avatar
│   │   └── settings/           # Theme picker, active sessions
│   ├── orbit/                  # Admin area (sidebar) — admins only
│   │   ├── users/              # Roles + impersonation
│   │   └── settings/           # Instance config, live queue stats
│   └── api/auth/[...all]/      # BetterAuth catch-all handler
├── components/
│   ├── ui/                     # Button, Input, Select, Modal, Dropdown, …
│   └── orbit/                  # Admin-only components
└── lib/
    ├── auth/                   # BetterAuth server/client, helpers, actions
    ├── db/                     # Drizzle schema, migrations, connection pool
    ├── email/                  # Nodemailer SMTP transport
    ├── env/                    # Env loading for non-Next.js entry points
    ├── hooks/                  # Shared React hooks
    └── queue/                  # pgBoss init, jobs, worker
```

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 14+ (local, Docker, or cloud)

### Local development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL.** With Docker, matching the default `DATABASE_URL`:
   ```bash
   docker run -d --name nextjs-starter-db -p 5432:5432 \
     -e POSTGRES_USER=paco -e POSTGRES_PASSWORD=paco \
     -e POSTGRES_DB=nextjs_starter postgres:16
   ```

3. **Create your env file:**
   ```bash
   cp .env.example .env.local
   ```
   Then set `BETTER_AUTH_SECRET` — the app refuses to start without it:
   ```bash
   openssl rand -base64 32
   ```

4. **Start a local mail catcher** so magic-link emails go somewhere you can
   read them:
   ```bash
   brew install mailpit && mailpit     # SMTP :1025, web UI :8025
   ```

5. **Run the migrations:**
   ```bash
   pnpm db:migrate
   ```

6. **Start the app.** `pnpm dev` runs the web server *and* the background
   worker together — you do not need a second terminal, and you should not
   pass a `--port` flag (the port is set inside the script):
   ```bash
   pnpm dev
   ```

Open <http://localhost:3003>, sign in with any email, and open
<http://localhost:8025> to click the magic link.

### Becoming an admin

The Orbit admin area requires `role = "admin"`, and the UI that grants that
role is itself admin-only — so the first admin is promoted from the CLI:

```bash
pnpm make:admin you@example.com     # sign in once first
pnpm make:admin you@example.com --demote
```

Sign out and back in for the new role to appear in your session. After that,
manage roles at `/orbit/users`.

### Google OAuth (optional)

Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local` and restart.
The "Continue with Google" button only renders when both are present — a
button with no credentials behind it can never work, so it stays hidden.

## Commands

```bash
pnpm dev              # Web server + worker together (port 3003)
pnpm dev:web          # Web server only
pnpm worker           # Worker only

pnpm check            # Typecheck + lint (run this before committing)
pnpm typecheck        # tsc --noEmit
pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix

pnpm build            # Production build
pnpm start            # Serve the production build

pnpm db:generate      # Generate a migration from schema changes
pnpm db:migrate       # Apply pending migrations
pnpm db:push          # Push schema without a migration (throwaway DBs only)
pnpm db:studio        # Drizzle Studio GUI
pnpm db:migrate:run   # Apply migrations programmatically (for Docker entrypoints)

pnpm make:admin <email>   # Promote a user to admin
```

> **On `db:push`:** it changes the database without writing a migration file,
> which is how this project's schema and migrations drifted apart before. Use
> `db:generate` + `db:migrate` for anything you intend to keep.

## Components

Every shared component is documented and demoed at **`/ui`** (excluded from
search engines). Behaviour comes from Headless UI — keyboard navigation, focus
management and ARIA wiring — and styling from DaisyUI semantic tokens, so
switching the theme restyles all of it.

```tsx
import { Button, Input, Select, Modal, Dropdown, Alert } from "@/components/ui";
```

Available: `Button` `ButtonLink` `Input` `Textarea` `Checkbox` `RadioGroup`
`Toggle` `Select` `NativeSelect` `Combobox` `Dropdown` `Modal` `PopoverMenu`
`Tabs` `DisclosureItem` `Avatar` `Alert` `Badge` `Skeleton` `EmptyState`
`FormField` `FormFieldset`.

> Three DaisyUI classes are deliberately **not** reused: `dropdown-content`,
> `collapse`, and the `checkbox`/`toggle` input styles. Each depends on a
> hidden `<input>` or a CSS-driven open state that Headless UI never sets, so
> combining them yields a component that React thinks is open and CSS keeps
> hidden. The wrappers in `src/components/ui/` draw those parts from theme
> tokens instead.

## Themes

DaisyUI themes are registered in `src/app/globals.css`:

`light` (default) · `dark` (follows system) · `cupcake` · `synthwave` ·
`valentine` · `emerald` · `dim`

Users pick one at `/dashboard/settings`; the navbar toggle flips light/dark.
To add a theme, add its name to the `@plugin "daisyui"` block **and** to
`THEME_OPTIONS` in `src/app/dashboard/settings/theme-picker.tsx`.

Don't hard-code `data-theme` on a wrapper element — DaisyUI resolves theme
variables from the nearest ancestor that has it, so doing so silently disables
the theme toggle for that whole subtree.

## Documentation

Deeper guides live in [`docs/`](docs/):

- [`docs/architecture.md`](docs/architecture.md) — stack and project structure
- [`docs/auth.md`](docs/auth.md) — auth flow, admin, impersonation, SMTP
- [`docs/database.md`](docs/database.md) — Drizzle, migrations, env vars
- [`docs/worker.md`](docs/worker.md) — pgBoss job queue
- [`docs/themes.md`](docs/themes.md) — theming and icons
- [`docs/security.md`](docs/security.md) — sessions, cookies, CSRF, authorisation
- [`docs/rules.md`](docs/rules.md) — engineering rules for this repo

## License

MIT
