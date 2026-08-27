# Worker (pgBoss)

## Overview

The project uses [pgBoss](https://github.com/tiangolo/pg-boss) for background
job processing. pgBoss stores its job queue tables inside your existing
PostgreSQL database, so no separate queue broker (Redis, RabbitMQ, etc.) is
needed.

## pnpm Script

```bash
pnpm worker          # Start the pgBoss worker process
```

Run this as a **separate process** alongside your Next.js app — for example,
in a second terminal during development or as a second container/process in
production (Docker Compose, Kubernetes, etc.).

## Job System

### Job Types

Defined in `src/lib/queue/jobs.ts`:

| Job type | Handler | Description |
|---|---|---|
| `send-email` | `handleSendEmail` | Sends an email via SMTP (Nodemailer) — used for magic links |
| `process-post` | `handleProcessPost` | Increments a post's view count |

### Sending Jobs

```ts
import { sendJob } from "@/lib/queue/jobs";

await sendJob("send-email", {
  to: "user@example.com",
  subject: "Welcome!",
  html: "<p>Thanks for joining...</p>",
  text: "Thanks for joining...",
});
```

### Registering Handlers

Handlers live in `src/lib/queue/worker.ts`. Add new job types by:

1. Adding the type to `JobType` in `src/lib/queue/jobs.ts`
2. Writing the handler function in `worker.ts`
3. Calling `registerWorker("job-type", handlerFn)` inside `startWorker()`

### Graceful Shutdown

The worker listens for `SIGINT` and `SIGTERM`, calling `closeQueue()` to
drain in-flight jobs before exiting.

## Environment Variables

| Variable | Description |
|---|---|
| `PGBOSS_DATABASE_URL` | PostgreSQL connection for the queue. Falls back to `DATABASE_URL` if not set. |
| `SMTP_HOST` | SMTP server hostname (e.g. `localhost` for Mailpit) |
| `SMTP_PORT` | SMTP server port (e.g. `1025` for Mailpit) |
| `SMTP_USER` | SMTP authentication username (optional for Mailpit) |
| `SMTP_PASS` | SMTP authentication password (optional for Mailpit) |
| `SMTP_FROM` | Default sender email address |
