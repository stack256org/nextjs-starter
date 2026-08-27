# Worker (pgBoss)

## Overview

[pgBoss](https://pgboss.io/) handles background jobs. It stores its queue
tables inside your existing PostgreSQL database, so there's no separate broker
(Redis, RabbitMQ) to run.

## Running it

```bash
pnpm dev       # web server AND worker together (development)
pnpm worker    # worker only
```

In development `pnpm dev` runs both under `concurrently`, so you do **not**
need a second terminal. In production, run `pnpm worker` as its own process
(a second container, a Procfile entry, a systemd unit).

If magic-link emails never arrive, check the worker is running first —
`/orbit/settings` shows live queue depths, and a growing `queued` count with
zero `active` means nothing is consuming the queue.

## Job System

### Job Types

| Job type | Handler | Description |
|---|---|---|
| `send-email` | `handleSendEmail` | Sends an email via SMTP (Nodemailer) — used for magic links |

### Sending Jobs

```ts
import { sendJob } from "@/lib/queue/jobs";

await sendJob("send-email", {
  to: "user@example.com",
  subject: "Welcome!",
  html: "<p>Thanks for joining…</p>",
  text: "Thanks for joining…",
});
```

`sendJob` initialises the queue lazily, so it is safe to call from a Route
Handler, a Server Action, or a BetterAuth callback without pre-starting pgBoss.

### Adding a job type

1. Add the name to `JobType` in `src/lib/queue/jobs.ts`.
2. Add the same name to `QUEUE_NAMES` in `src/lib/queue/index.ts` — the queue
   must exist before anything sends to it, and the web server creates queues
   without registering handlers.
3. Write the handler in `src/lib/queue/worker.ts`.
4. `await registerWorker("your-job", handler)` inside `startWorker()`.

### Errors and retries

A handler that throws propagates the error so pgBoss can apply its retry
policy. `registerWorker` awaits `boss.work()`, so a failed registration
surfaces at startup rather than becoming an unhandled rejection.

### Graceful Shutdown

The worker traps `SIGINT` and `SIGTERM` and calls `closeQueue()` to drain
in-flight jobs before exiting. The handler is idempotent, so a double Ctrl-C
won't start two shutdowns.

## Environment Variables

| Variable | Description |
|---|---|
| `PGBOSS_DATABASE_URL` | Queue connection. Falls back to `DATABASE_URL`. |
| `SMTP_HOST` | SMTP hostname (`localhost` for Mailpit) |
| `SMTP_PORT` | SMTP port (`1025` for Mailpit) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Default sender address |

`src/lib/email/send.ts` throws if `SMTP_HOST`, `SMTP_USER` or `SMTP_PASS` is
missing — the job fails loudly instead of silently dropping the email.
