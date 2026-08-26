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

# Required — where the app is served (used for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3003

# Required for Google OAuth — create at console.cloud.google.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional — comma-separated emails that auto-promote to admin on sign-up
# Example: ADMIN_EMAILS=you@yourdomain.com,team@yourdomain.com
NEXT_PUBLIC_ADMIN_EMAILS=
```

## File Layout

| File | Purpose |
|---|---|
| `src/lib/auth/server.ts` | BetterAuth server config (Drizzle adapter, plugins) |
| `src/lib/auth/client.ts` | React client instance (`authClient`) |
| `src/lib/auth/config.ts` | Client-safe config (`isAdminEmail`, `APP_URL`) |
| `src/lib/auth/helpers.ts` | Server-side helpers (`getSession`, `isAdmin`, `requireAdmin`) |
| `src/lib/auth/providers.tsx` | `AuthProvider` React context wrapper |
| `src/lib/auth/send-magic-link-email.ts` | Email sender (logs URL in dev) |
| `src/app/api/auth/[...all]/route.ts` | Catch-all API route for BetterAuth |
| `src/app/login/page.tsx` | Centralized login page |
| `src/app/dashboard/` | User dashboard (top navbar, requires auth) |
| `src/app/orbit/` | Orbit Admin (sidebar, dark theme, requires admin role) |

## Auth Flow

### Sign In (Centralized)

1. User visits `/login`.
2. They enter their email for a **magic link** or click **Google**.
3. BetterAuth creates/updates the user record in the `users` table.
4. The `databaseHooks.user.create.before` hook checks `ADMIN_EMAILS`
   and sets `role = "admin"` if the email matches.
5. On success, the user is redirected to `/dashboard`.

### Admin Access

An admin is any user whose:
- `role` column in the database is `"admin"`, **or**
- `email` is listed in the `NEXT_PUBLIC_ADMIN_EMAILS` env variable

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
