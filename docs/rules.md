# Engineering Rules

> Universal development practices that apply to **every** change in this repo.
> These are the minimal, must-follow rules distilled from the broader
> organization-wide principles.

## 1. Research first — never rely on training data

Your training data is a starting hypothesis, never a source of truth. For
anything that touches an external API, library, framework, CLI, or cloud
service:

- **Fetch the current official documentation** before writing or claiming
  anything. Read the vendor's docs, changelog, and release notes — not memory,
  not a blog, not a Stack Overflow answer.
- **Confirm the installed version** (`package.json`, lockfile) and read the
  docs **for that exact version**.
- **Re-verify on every touch** — writing new code, modifying existing code,
  reviewing a PR, or auditing.
- **Cite your sources** — the doc URL and version — so a reviewer can check.
  If docs and memory disagree, the docs win.

## 2. Always target the latest stable version

- When adding a dependency, tool, or runtime, **use the latest stable release**.
  Check the real latest version at the source — don't assume your training data
  is current.
- When bumping, **read the changelog / migration guide** and audit the
  codebase for breaking changes. Never bump-and-hope.

## 3. Verify before you claim

- Run the checks the repo provides (typecheck, lint, build) **and read the
  output** before saying anything works. "Should work" and "looks correct" are
  not acceptable without evidence.
- Exercise actual behavior end-to-end when the change has a runtime surface,
  not just the type checker.

## 4. Think, then act

- **Research → Think → Ask → Implement**, in that order, for every non-trivial
  change. Don't implement first and rationalize after.
- State assumptions and trade-offs explicitly. If a request has multiple
  readings, surface them and ask.
- **Simplicity first:** the minimum correct change, matching the surrounding
  code's style. Touch only what the task requires; don't refactor what isn't
  broken.
- **Default to warn, not auto-fix** on anything destructive or ambiguous — a
  surfaced warning preserves the user's intent.

## 5. No fake features — ship real implementations

Every route, page, table, and API endpoint must have a real handler, render,
or reader/writer behind it. If you can't implement something real this turn,
don't ship the surface.

## 6. No code duplication

Shared business logic must live in a single module under `src/lib/` or
`src/components/`. Never copy-paste across files. Search for similar
implementations first, study 2–3 references, and match established patterns.

## 7. Keep a task list, and work it to the end

Any request with more than one step requires a written task list:

- Put every outstanding item on it, including things the user adds mid-flight.
- Exactly one item `in_progress` at a time; mark it `completed` the moment it
  is done.
- **The list is the contract.** Do not end a turn with items left undone.
  Continue until the list is empty or you are genuinely blocked.

## 8. Stop only for real customer impact

- **Stop and tell the owner ONLY when:** a customer-facing page is broken,
  customer data is at risk, the change is irreversible, or proceeding under
  an assumption would be unsafe.
- **Do NOT stop for:** cosmetic differences, pixels, advisory linter warnings,
  or a trade-off you can pick a sensible default for. Fix it and mention it in
  one line.

## 9. Where knowledge lives

| Location | Purpose |
|---|---|
| `src/` | The application source code |
| `docs/` | Internal reference documentation (this folder) |
| `README.md` | The public front door — keep it accurate |

**Keep these current.** When you change architecture, add a rule or convention,
modify setup, or alter the database schema, update the matching doc in the same
pass — stale guidance is worse than none.

## 10. Git and commits

- **Commit in the right repo.** Changes to `src/` and `docs/` are committed
  from this repo's root, not from the workspace.
- **Commit authorship is the owner only** — no AI co-author trailers, no
  "Generated with" lines, no "🤖" markers in the body, the trailer, or the PR
  description.
- **Branch for code changes** — don't commit code directly to `main` unless
  authorized. Documentation-only changes may go directly to `main`.
- **Open a PR for code changes** — finished work must not sit only on a branch.
