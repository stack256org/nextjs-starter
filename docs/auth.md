# Authentication

Uses [BetterAuth](https://better-auth.com) for authentication with:

- **Magic link** — email a sign-in link (no passwords)
- **Google OAuth** — sign in with Google
- **Admin role** — a simple `role` column on the `users` table (`user` | `admin`)
- **Impersonation** — admins can impersonate any user (via the admin plugin)

## Environment Variables

```bash
# Required — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-random-secret-here

# Public URL — used by BetterAuth for callback URLs in OAuth
NEXT_PUBLIC_APP_URL=http://localhost:3003

# Required for Google OAuth — create at console.cloud.google.com
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
| `src/lib/auth/config.ts` | Client-safe config (`APP_URL`) |
| `src/lib/auth/helpers.ts` | Server-side helpers (`getSession`, `isAdmin`, `requireAdmin`) |
| `src/lib/auth/providers.tsx` | `AuthProvider` context wrapper |
| `src/lib/auth/send-magic-link-email.ts` | Queues magic link email via pgBoss worker |
| `src/lib/auth/make-admin.cli.ts` | CLI to promote a user to admin |
| `src/lib/email/send.ts` | Nodemailer SMTP transport |
| `src/app/api/auth/[...all]/route.ts` | Catch-all API route for BetterAuth |
| `src/app/login/page.tsx` | Centralized login page |
| `src/app/dashboard/` | User dashboard (top navbar, requires auth) |
| `src/app/orbit/` | Orbit Admin (sidebar, dark theme, requires admin role) |

## Auth Flow

### Sign In (Centralized)

1. User visits `/login`.
2. They enter their email for a **magic link** or click **Google**.
3. BetterAuth creates/updates the user record in the `users` table.
   All users start with `role = "user"`.
4. The magic link email is **queued** to pgBoss (not sent inline).
   The worker process sends it via SMTP using Nodemailer.
5. On success, the user is redirected to `/dashboard`.

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
3. BetterAuth creates a new session as that user, storing the admin's
   session token in a `admin_session` cookie.
4. The UI shows a **warning badge** and a **"Stop impersonating"**
   button in the topbar.
5. Clicking "Stop impersonating" restores the admin's original session.

> Impersonating another admin is blocked by the admin plugin.
