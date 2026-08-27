# Authentication

Uses [BetterAuth](https://better-auth.com) for authentication with:

- **Magic link** — email a sign-in link (no passwords)
- **Google OAuth** — sign in with Google
- **Admin role** — a simple `role` column on the `users` table (`user` | `admin`)
- **Impersonation** — admins can impersonate any user (via the admin plugin)

## Environment Variables

```bash
# Required — generate with: openssl rand -base64 32
# The app throws on startup if this is unset: without it BetterAuth signs
# cookies with a random per-process value, silently invalidating every
# session on restart.
BETTER_AUTH_SECRET=your-random-secret-here

# Public URL — used by BetterAuth for callback URLs in OAuth
NEXT_PUBLIC_APP_URL=http://localhost:3003

# Optional. The "Continue with Google" button only renders when BOTH are set —
# a provider declared with empty credentials logs a warning on every request
# and produces a button that can never work.
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ── SMTP Email (for magic links & notifications) ─────────────
# Emails are sent by the pgBoss worker (pnpm worker), NOT in the
# request handler.  This ensures slow SMTP calls never block the
# web server.
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourapp.com
```

## File Layout

| File | Purpose |
|---|---|
| `src/lib/auth/server.ts` | BetterAuth server config (Drizzle adapter, plugins) |
| `src/lib/auth/client.ts` | React client instance (`authClient`) |
| `src/lib/auth/config.ts` | Client-safe config (`APP_URL`, redirect targets, `displayName`) |
| `src/lib/auth/helpers.ts` | Server-side helpers (`getSession`, `isAdmin`, `requireAdmin`) |
| `src/lib/auth/actions.ts` | Server Actions — update profile, revoke sessions |
| `src/lib/auth/send-magic-link-email.ts` | Queues magic link email via pgBoss worker |
| `src/lib/auth/make-admin.cli.ts` | CLI to promote a user to admin |
| `src/lib/email/send.ts` | Nodemailer SMTP transport |
| `src/lib/email/templates/` | HTML email layout + magic-link template |
| `src/app/api/auth/[...all]/route.ts` | Catch-all API route for BetterAuth |
| `src/app/login/page.tsx` | Centralized login page |
| `src/app/dashboard/` | User dashboard, profile and settings (requires auth) |
| `src/app/orbit/` | Orbit Admin — users and instance settings (requires admin role) |

## Auth Flow

### Sign In (Centralized)

1. User visits `/login`.
2. They enter their email for a **magic link** or click **Google**.
3. BetterAuth creates/updates the user record in the `users` table.
   All users start with `role = "user"`.
   A `databaseHooks` entry seeds a display name from the email local-part,
   since magic-link signups carry no name of their own.
4. The magic link email is **queued** to pgBoss (not sent inline).
   The worker process sends it via SMTP using Nodemailer, so a slow SMTP
   server never blocks the request handler.
5. Clicking the link returns the user to `/dashboard`.

   This comes from the explicit `callbackURL` passed in
   `src/app/login/login-form.tsx`. Omit it and BetterAuth falls back to `/`,
   dropping the user on the public landing page — which is indistinguishable
   from a login that failed.

### Promoting Users to Admin

No `ADMIN_EMAILS` env var is used. Instead, use one of these methods:

**CLI command:**
```bash
pnpm make:admin user@example.com
```

This updates the `role` column directly in the database. The user will need
to sign out and back in for the role change to take effect in their session.

**Orbit Admin UI** (requires existing admin):
1. Go to `/orbit/users`
2. Click the "👑 Admin" / "Make Admin" button next to any user

### Admin Access

An admin is any user whose `role` column in the database is `"admin"`.

Admins see an **Orbit Admin** link in the dashboard navbar.

### Impersonation

1. Admin goes to `/orbit/users`.
2. Clicks **"Impersonate"** on any non-admin user.
3. BetterAuth creates a session as that user, keeping the admin's own session
   token in an `admin_session` cookie.
4. An **impersonation banner** appears with a **"Stop impersonating"** button.
5. Clicking it restores the admin's original session and returns to
   `/orbit/users`.

> Impersonating another admin is blocked by the admin plugin.

**Why the banner lives in the dashboard layout, not just Orbit.** The borrowed
session carries the impersonated user's role, so `requireAdmin()` correctly
rejects it and redirects to `/dashboard` — an impersonation session must not
hold admin powers. If the only exit were in the Orbit topbar, the admin would
be stranded as that user with no way back short of clearing cookies. So
`ImpersonationBanner` renders wherever an impersonated session can land.

**`impersonatedBy` holds the admin's id**, not the impersonated user's. The
impersonated user is `session.user`. Use `impersonatorIdOf()` from
`src/lib/auth/helpers.ts` rather than reading the field directly.
