# Project Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | PostgreSQL via Drizzle ORM |
| Job queue | pgBoss (PostgreSQL-backed) |
| Auth | BetterAuth (magic link + Google OAuth) |
| Roles | BetterAuth admin plugin (user / admin) |
| Impersonation | BetterAuth admin plugin |
| Email | Nodemailer + SMTP (Mailpit for local dev) |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Lint | ESLint with `eslint-config-next` |
| Package manager | pnpm |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout — ThemeProvider + AuthProvider
│   ├── page.tsx                  # Home page with sign-in link
│   ├── globals.css               # Tailwind CSS + DaisyUI (7 themes, dim for admin)
│   ├── login/                    # Centralized login page (magic link + Google)
│   │   └── page.tsx
│   ├── dashboard/                # User dashboard (top navbar)
│   │   ├── layout.tsx            # Server-side auth guard + DashboardNavbar
│   │   └── page.tsx              # Stats cards + quick actions
│   ├── orbit/                    # Orbit Admin (sidebar nav, dark theme)
│   │   ├── layout.tsx            # Admin guard + OrbitTopbar + OrbitSidebar
│   │   ├── page.tsx              # Admin dashboard with metrics
│   │   └── users/
│   │       └── page.tsx          # User list + impersonate + role toggle
│   ├── api/
│   │   └── auth/[...all]/
│   │       └── route.ts          # BetterAuth catch-all handler
│   └── favicon.ico
├── components/
│   ├── avatar.tsx                # Reusable avatar (handles image + fallback)
│   ├── google-logo.tsx           # SVG Google "G" for OAuth button
│   ├── theme-provider.tsx        # next-themes wrapper
│   ├── theme-toggle.tsx          # Sun/Moon toggle (Phosphor icons)
│   ├── dashboard-navbar.tsx      # Top navbar for /dashboard
│   ├── auth/
│   │   ├── sign-out-button.tsx
│   │   └── providers.tsx         # AuthProvider context
│   └── orbit/
│       ├── orbit-sidebar.tsx     # Sidebar navigation (DaisyUI Menu)
│       ├── orbit-topbar.tsx      # Topbar with admin info + impersonation indicator
│       ├── stop-impersonating-button.tsx
│       ├── impersonate-button.tsx
│       └── set-role-button.tsx
├── lib/
│   ├── auth/
│   │   ├── config.ts             # App URL (client-safe)
│   │   ├── server.ts             # BetterAuth server instance
│   │   ├── client.ts             # BetterAuth React client
│   │   ├── helpers.ts            # getSession(), isAdmin(), requireAdmin()
│   │   ├── send-magic-link-email.ts  # Queues email to pgBoss worker
│   │   ├── make-admin.cli.ts     # CLI: pnpm make:admin <email>
│   │   └── providers.tsx         # AuthProvider (session context)
│   ├── db/
│   │   ├── index.ts              # PostgreSQL pool + Drizzle db instance
│   │   ├── schema.ts             # Users, sessions, accounts, verifications, posts
│   │   ├── migrate.ts            # runMigrations()
│   │   ├── migrate.cli.ts        # CLI entry point
│   │   └── migrations/           # Generated SQL migration files
│   ├── email/
│   │   └── send.ts               # Nodemailer SMTP transport
│   └── queue/                    # pgBoss job queue
│       ├── index.ts
│       ├── jobs.ts
│       ├── worker.ts
│       └── worker.cli.ts
drizzle.config.ts                # Drizzle Kit configuration
```

## Auth Flow

1. **Sign in** — `/login` page offers magic-link email or Google OAuth.
   One centralized login for both regular users and admins.
2. **Magic link email** — when a user requests a magic link, the email is
   **queued** to pgBoss (not sent inline). The worker process picks it up
   and sends it via SMTP using Nodemailer (configured for Mailpit in dev).
3. **Admin promotion** — use the CLI command:
   ```bash
   pnpm make:admin user@example.com
   ```
   This sets `role = "admin"` in the `users` table. The user must
   sign out and back in for the role to take effect in their session.
3. **User dashboard** — `/dashboard` requires auth. Top navbar with nav links
   and a link to Orbit Admin for admins (based on `role` field).
4. **Orbit Admin** — `/orbit` requires `role = "admin"`. Sidebar navigation
   with the `dim` (dark) DaisyUI theme. Supports impersonation:
   - Admin clicks "Impersonate" on any user → a new session is created as
     that user, stored via the `admin_session` cookie.
   - "Stop impersonating" button returns to the admin's own session.
   - While impersonating, the topbar shows a warning badge.
