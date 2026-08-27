# Project Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | PostgreSQL via Drizzle ORM |
| Job queue | pgBoss (PostgreSQL-backed) |
| Auth | BetterAuth (magic link + optional Google OAuth) |
| Roles | BetterAuth admin plugin (`user` / `admin`) |
| Impersonation | BetterAuth admin plugin |
| Email | Nodemailer + SMTP (Mailpit for local dev) |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Lint | Oxlint |
| Package manager | pnpm |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout — fonts + ThemeProvider
│   ├── page.tsx                  # Public landing page (Server Component)
│   ├── globals.css               # Tailwind + DaisyUI theme registration
│   ├── login/
│   │   ├── page.tsx              # Redirects if already signed in
│   │   └── login-form.tsx        # Magic link + optional Google button
│   ├── dashboard/                # Signed-in area (top navbar)
│   │   ├── layout.tsx            # Auth guard + navbar + impersonation banner
│   │   ├── page.tsx              # Shortcuts and orientation
│   │   ├── profile/              # Display name + avatar
│   │   └── settings/             # Theme picker + active sessions
│   ├── orbit/                    # Admin area (sidebar) — admins only
│   │   ├── layout.tsx            # requireAdmin() + topbar + sidebar
│   │   ├── page.tsx              # User/session metrics
│   │   ├── users/                # Role toggle + impersonation
│   │   └── settings/             # Instance capabilities + live queue stats
│   ├── api/auth/[...all]/route.ts  # BetterAuth catch-all (toNextJsHandler)
│   └── favicon.ico
├── components/
│   ├── theme-provider.tsx        # next-themes wrapper
│   ├── theme-toggle.tsx          # Light/dark toggle
│   ├── dashboard-navbar.tsx      # Top navbar for /dashboard
│   ├── impersonation-banner.tsx  # Shown on any impersonated session
│   ├── auth/sign-out-button.tsx
│   ├── orbit/                    # Admin-only components
│   └── ui/                       # Button, Input, Select, Modal, Dropdown, …
└── lib/
    ├── auth/
    │   ├── config.ts             # Client-safe values + displayName helpers
    │   ├── server.ts             # BetterAuth server instance
    │   ├── client.ts             # BetterAuth React client
    │   ├── helpers.ts            # getSession, getViewer, requireAdmin, roleOf
    │   ├── actions.ts            # Server Actions (update profile, revoke sessions)
    │   ├── send-magic-link-email.ts
    │   └── make-admin.cli.ts     # CLI: pnpm make:admin <email>
    ├── db/                       # Pool, schema, migrations, migrate CLI
    ├── email/
    │   ├── send.ts               # Nodemailer SMTP transport
    │   └── templates/            # HTML email layout + magic-link template
    ├── env/load.ts               # Env loading for non-Next.js entry points
    ├── format/                   # Date and User-Agent formatting
    ├── hooks/use-hydrated.ts     # SSR-safe "are we on the client yet?"
    └── queue/
        ├── index.ts              # Init, queue registry
        ├── jobs.ts               # sendJob(), registerWorker()
        ├── worker.ts             # Handlers + startWorker()
        ├── types.ts              # Client-safe job types (no `pg` import)
        ├── admin.ts              # Server-only job queries + mutations
        └── actions.ts            # Server Actions, each behind requireAdmin()
drizzle.config.ts
```

## Server vs client

Session reads happen on the **server**. `getSession()` / `getViewer()` in
`src/lib/auth/helpers.ts` read the cookie in a Server Component and hand the
result down as props.

There is deliberately **no** global client-side auth context. An app-wide
provider calling `useSession()` fires an extra `/api/auth/get-session` request
on every page load — including public ones — for data the server already has.
Client components that genuinely need live session state (the sign-out button,
for example) call `authClient.useSession()` directly.

## Client/server boundary in the queue code

`src/lib/queue/admin.ts` opens a database connection. `src/lib/queue/types.ts`
holds the job types and pure helpers.

The job browser is a Client Component, so it imports from `types.ts` only.
Importing *anything* from `admin.ts` — even a type — pulls `pg` into the
browser bundle and fails the build.

## Auth Flow

1. **Sign in** — `/login` offers a magic link by email, plus Google when
   `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set. Someone who already
   has a session is redirected to `/dashboard`.
2. **Magic link email** — the email is **queued** to pgBoss, not sent inline,
   so a slow SMTP server never blocks the request handler. The worker sends it
   via Nodemailer.
3. **Callback** — the link returns to `/dashboard` (`AFTER_SIGN_IN_URL` in
   `src/lib/auth/config.ts`). Leaving the callback unset sends users to `/`,
   which looks identical to a failed login.
4. **Display name** — magic-link signups carry no name, so a `databaseHooks`
   entry seeds one from the email local-part, and `displayName()` covers rows
   created before that hook existed.
5. **Admin promotion** — `pnpm make:admin user@example.com`. The user must
   sign out and back in for the new role to appear in their session.
6. **Orbit Admin** — `/orbit` requires `role = "admin"`.

## Impersonation

An admin clicks "Impersonate" on `/orbit/users`; BetterAuth swaps the session
cookie to that user.

The borrowed session carries the **impersonated user's** role, so `/orbit`
correctly rejects it — an impersonation session must not hold admin powers.
That means the way out cannot live in Orbit. `ImpersonationBanner` therefore
renders in the **dashboard** layout as well, so "Stop impersonating" is always
reachable.

Note that `session.impersonatedBy` holds the **admin's** id, not the
impersonated user's. The impersonated user is `session.user`.
