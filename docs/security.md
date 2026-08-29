# Session Security

## Sessions live in the database

Every sign-in creates a row in the `sessions` table. The cookie holds a signed
token that points at that row — it is **not** a self-contained credential.

Nothing in this app configures BetterAuth's `session.cookieCache`. That is
deliberate: with cookie caching on, the server trusts a signed copy of the
session embedded in the cookie for a short window, so a revoked session keeps
working until that copy expires. Without it, every request looks the session up
in the database, and **revocation takes effect on the very next request**.

The trade is one indexed primary-key lookup per request. `sessions.token`
carries a `UNIQUE` constraint (added in migration `0001`) so that lookup stays
an index scan.

## Signing out everywhere

| Where | What it does |
|---|---|
| `/dashboard/settings` → "Sign out other sessions" | Deletes every session row except the current one |
| `/dashboard/settings` → "Sign out everywhere" | Deletes every session row, including this device |
| `/orbit/users/[id]` → "Sign out of N sessions" | An admin revokes one user's sessions |
| `/orbit/users/[id]` → "Ban this account" | Revokes every session and blocks future sign-ins |

Because the cookie is only a pointer, deleting the row is what actually ends
the session. A copied cookie stops working at the same instant — there is
nothing left for it to point at.

This was verified end to end: with a session cookie captured from one client,
revoking that user's sessions from another made `GET /api/auth/get-session`
return `null` and `GET /dashboard` redirect to `/login` on the very next
request.

## Cookie hardening

Configured in `src/lib/auth/server.ts` under `advanced`:

| Property | Setting | Why |
|---|---|---|
| `httpOnly` | `true` | JavaScript cannot read the cookie, so an XSS bug cannot exfiltrate it |
| `secure` | `true` outside development | The cookie is never sent over plain HTTP |
| `sameSite` | `lax` | Not attached to cross-site POSTs, which blocks the basic CSRF shape |
| Signed | `APP_SECRET` | A forged or tampered token is rejected before any database lookup |

> The previous configuration set these under a top-level `cookies` key. That is
> **not** a BetterAuth option — it was silently ignored, and the settings only
> took effect because they happen to match the defaults. They now live under
> `advanced.defaultCookieAttributes`, where BetterAuth actually reads them.

`APP_SECRET` is required at startup; the app throws if it is missing.
Without it BetterAuth signs cookies with a value that changes per process,
which silently invalidates every session on restart.

## CSRF and origin checks

BetterAuth verifies the `Origin` header on state-changing requests. Neither
`disableCSRFCheck` nor `disableOriginCheck` is set.

Verified against the running app:

```
POST /api/auth/admin/revoke-user-sessions   (no Origin header)
  -> {"message":"Missing or null Origin","code":"MISSING_OR_NULL_ORIGIN"}

POST /api/auth/admin/revoke-user-sessions   Origin: https://evil.example.com
  -> {"message":"Invalid origin","code":"INVALID_ORIGIN"}

POST /api/auth/admin/revoke-user-sessions   Origin: http://localhost:3003
  -> {"success":true}
```

When you deploy, set `NEXT_PUBLIC_APP_URL` to the real public origin — it is
what BetterAuth checks against. Serving from a different host than that value
will reject every mutation with `INVALID_ORIGIN`.

## Authorising Server Actions

Every Server Action re-checks authorisation. A Server Action compiles to a
public HTTP endpoint identified by a generated id; the fact that the button
calling it renders only inside an admin page is a UI detail, not a permission.

`src/lib/auth/admin-actions.ts` and `src/lib/queue/actions.ts` each call
`requireAdmin()` first. Disabled buttons in the UI are guidance, never the
security boundary.

## Deliberate limits

- **Sessions are not bound to an IP or User-Agent.** Both change legitimately
  (mobile networks, browser updates), so binding to them signs real users out
  for no security gain against an attacker who can already copy a cookie.
  The session list on `/dashboard/settings` surfaces IP and device instead, so
  a person can spot and revoke anything they don't recognise.
- **No rate limiting on magic-link requests.** BetterAuth ships a rate limiter;
  enable it before going to production, or an attacker can use your SMTP
  reputation to send mail to arbitrary addresses.
- **Impersonation sessions carry the impersonated user's role**, so they are
  rejected by `/orbit`. An impersonating admin holds no admin powers.
