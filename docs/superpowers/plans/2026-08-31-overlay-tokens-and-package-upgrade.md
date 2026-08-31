# Overlay Design Tokens & Package Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh all dependencies in `nextjs-starter/` to latest (including majors) and unify the floating-overlay components (Dropdown, Select, Combobox, PopoverMenu, Modal, Drawer, Tooltip) under a single `--overlay-*` token family defined in `globals.css`, so all panels share the same radius, anchor gap, border, and shadow treatment.

**Architecture:** One new token family (`--overlay-*`) lives inside each `@plugin "daisyui/theme"` block in `globals.css`, so it travels with the theme picker. Each overlay component migrates from hard-coded `rounded-box` / `p-2` / `shadow-lg` / `border-base-300` strings to `rounded-[var(--overlay-radius)]` / `p-[var(--overlay-padding)]` / etc. — class strings change, behaviour and exports do not. The package upgrade is a single `pnpm up --latest -r` followed by the project's mandatory `pnpm check` and `pnpm build`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, DaisyUI v5, Headless UI v2, Phosphor Icons, pnpm, TypeScript, Oxlint.

**Spec:** [../specs/2026-08-31-overlay-tokens-and-package-upgrade-design.md](../specs/2026-08-31-overlay-tokens-and-package-upgrade-design.md)

## Global Constraints

- All edits stay inside `nextjs-starter/`. No other workspace apps touched.
- Component prop APIs, exports, and behaviour are unchanged. This is a visual-only refactor.
- Tailwind v4 arbitrary-value syntax is the only acceptable form. Use:
  - `rounded-[var(--overlay-radius)]`
  - `p-[var(--overlay-padding)]` or `p-[var(--overlay-padding-rich)]`
  - `border-[var(--overlay-border)]`
  - `shadow-[var(--overlay-shadow)]` or `shadow-[var(--overlay-shadow-elevated)]`
  Do not introduce a new Tailwind config file.
- `color-mix(in oklch, var(--color-base-300) 80%, transparent)` is the only acceptable border treatment. Do not write `border-base-300` or `border-base-300/80` in overlay files.
- Anchor `gap` on every Headless UI floating panel (`MenuItems`, `ListboxOptions`, `ComboboxOptions`, `PopoverPanel`) must be the literal number `8` (mapped to `var(--overlay-anchor-gap)`). The current mixed `4`/`8` must be normalised.
- Verification gates are non-negotiable: `pnpm check` AND `pnpm build` must both succeed before claiming done. (Per `AGENTS.md` "Verify before claiming".)
- Final delivery is a single combined commit per the user's choice. No intermediate commits.
- The `nextjs-starter` README's note that "Three DaisyUI classes are deliberately not reused" still holds — do not reintroduce `dropdown-content`, `collapse`, or native checkbox/toggle styles.

---

## File Structure

| File | Role | Touched by task |
|---|---|---|
| `package.json` | Direct dependency versions | Task 1 |
| `pnpm-lock.yaml` | Resolved versions | Task 1 |
| `src/app/globals.css` | Defines both DaisyUI theme blocks; gains the overlay token family | Task 2 |
| `src/components/ui/dropdown.tsx` | `Dropdown` / `DropdownItem` / `DropdownSeparator` / `DropdownHeader` panel | Task 3 |
| `src/components/ui/select.tsx` | `Select` panel | Task 4 |
| `src/components/ui/combobox.tsx` | `Combobox` panel | Task 5 |
| `src/components/ui/popover.tsx` | `PopoverMenu` panel | Task 6 |
| `src/components/ui/modal.tsx` | `Modal` panel | Task 7 |
| `src/components/ui/drawer.tsx` | `Drawer` panel | Task 8 |
| `src/components/ui/tooltip.tsx` | `Tooltip` bubble | Task 9 |

Order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Tasks 3-9 each touch one file and are independent of one another; they could run in parallel, but sequencing keeps review surface linear and the diff readable.

---

## Task 1: Bump all dependencies to latest

**Files:**
- Modify: `package.json`
- Regenerate: `pnpm-lock.yaml`

**Consumes:** nothing (initial state).
**Produces:** A `package.json` and `pnpm-lock.yaml` where every direct dependency and devDependency is the newest semver-compatible-with-major version on the registry. No downgrades, no force flags.

- [ ] **Step 1: Confirm working directory and clean state**

Run:
```bash
cd nextjs-starter
git status --porcelain
```
Expected: empty output. If dirty, STOP and ask the user — do not proceed on a dirty tree.

- [ ] **Step 2: Run the upgrade**

Run:
```bash
pnpm up --latest -r
```
Expected: pnpm prints a table of bumped versions, exits 0. Capture the full output for the commit message.

If pnpm reports a peer-dependency conflict that requires `--force` or a manual override: STOP. Surface the conflict to the user before forcing.

- [ ] **Step 3: Verify lockfile resolves**

Run:
```bash
pnpm install
```
Expected: exit 0, no errors. If peer warnings appear, list them — they are warnings, not errors, but we want them recorded.

- [ ] **Step 4: Capture the diff for the commit message**

Run:
```bash
git diff --stat package.json pnpm-lock.yaml
git diff package.json
```
Expected: `package.json` shows new version strings; `pnpm-lock.yaml` shows resolved version bumps. Save the version-bump table from Step 2 for the final commit message.

- [ ] **Step 5: Verify the project still typechecks and lints**

Run:
```bash
pnpm check
```
Expected: exit 0. If it fails, STOP — do not continue. Surface the failure to the user. Likely cause: a package major bump introduced a breaking type or lint rule. Fix forward, don't downgrade.

- [ ] **Step 6: Verify the project still builds**

Run:
```bash
pnpm build
```
Expected: exit 0, `.next/` produced. If it fails, STOP and surface.

- [ ] **Step 7: Do not commit yet**

Per the user's chosen commit shape ("single combined commit"), this work is committed together with Tasks 2-9 in Task 10. Leave the working tree dirty with the package changes.

---

## Task 2: Add the `--overlay-*` token family to both DaisyUI theme blocks

**Files:**
- Modify: `src/app/globals.css`

**Consumes:** nothing (initial state).
**Produces:** Both `@plugin "daisyui/theme"` blocks in `globals.css` contain the seven overlay tokens. Tailwind v4 JIT will pick them up because the arbitrary-value classes that use them appear in source files added in Tasks 3-9. Until those source files reference the tokens, Tailwind will not emit any CSS for them — this is expected and correct.

- [ ] **Step 1: Read the current `globals.css` to confirm the theme block structure**

Read: `src/app/globals.css` lines 29-72 (light) and 80-118 (dark).

The two theme blocks each end with:
```css
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
```

- [ ] **Step 2: Insert the overlay tokens into the light theme block**

In the light theme block, immediately after the line `--noise: 0;` and before the closing `}`, insert:

```css

  /* Overlay family — shared by Dropdown, Select, Combobox, Popover, Drawer, Modal */
  --overlay-radius: var(--radius-field);
  --overlay-padding: 0.5rem;
  --overlay-padding-rich: 1rem;
  --overlay-anchor-gap: 0.5rem;
  --overlay-border: color-mix(in oklch, var(--color-base-300) 80%, transparent);
  --overlay-shadow: 0 4px 12px -2px oklch(0% 0 0 / 0.18);
  --overlay-shadow-elevated: 0 12px 32px -8px oklch(0% 0 0 / 0.28);
```

- [ ] **Step 3: Insert the same overlay tokens into the dark theme block**

In the dark theme block, immediately after the line `--noise: 0;` and before the closing `}`, insert the **same** seven lines from Step 2. The tokens do not need to differ between light and dark — `--overlay-shadow` and `--overlay-shadow-elevated` are pure black at low alpha and look right on either background.

- [ ] **Step 4: Verify the file is still valid CSS**

Run:
```bash
pnpm build
```
Expected: exit 0. The build will catch any syntax error in the theme block. If it fails, fix the indentation or token name and rerun.

- [ ] **Step 5: Do not commit yet**

Combined commit is in Task 10.

---

## Task 3: Migrate `Dropdown` to overlay tokens

**Files:**
- Modify: `src/components/ui/dropdown.tsx`

**Consumes:** `--overlay-radius`, `--overlay-padding`, `--overlay-border`, `--overlay-shadow`, `--overlay-anchor-gap` from `globals.css`.
**Produces:** The `MenuItems` panel uses overlay tokens; the `MenuButton` trigger keeps `rounded-selector` (it is a control surface that varies by consumer — `btn` classes may apply).

- [ ] **Step 1: Edit the `MenuItems` className**

In `src/components/ui/dropdown.tsx`, find the `MenuItems` element (currently around lines 80-88). Replace the existing className string with:

```tsx
        className={`menu z-50 min-w-52 rounded-[var(--overlay-radius)] border border-[var(--overlay-border)] bg-base-100 p-[var(--overlay-padding)] text-base-content shadow-[var(--overlay-shadow)]
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none ${className}`}
```

This change is a literal class-string swap:
- `rounded-box` → `rounded-[var(--overlay-radius)]`
- `border border-base-300` → `border border-[var(--overlay-border)]`
- `p-2` → `p-[var(--overlay-padding)]`
- `shadow-lg` → `shadow-[var(--overlay-shadow)]`

`anchor={{ to: placement, gap: 8 }}` stays. `min-w-52` stays (it's a sizing token, not an overlay-family one). The `data-closed:scale-95`, `data-closed:opacity-0`, `transition`, and `focus:outline-none` classes stay.

- [ ] **Step 2: Verify TypeScript still compiles**

Run:
```bash
pnpm typecheck
```
Expected: exit 0.

- [ ] **Step 3: Verify lint still passes**

Run:
```bash
pnpm lint
```
Expected: exit 0.

- [ ] **Step 4: Do not commit yet**

Combined commit is in Task 10.

---

## Task 4: Migrate `Select` to overlay tokens

**Files:**
- Modify: `src/components/ui/select.tsx`

**Consumes:** `--overlay-radius`, `--overlay-padding`, `--overlay-border`, `--overlay-shadow`, `--overlay-anchor-gap`.
**Produces:** `ListboxOptions` panel uses overlay tokens; anchor gap normalised to `8`.

- [ ] **Step 1: Edit the `ListboxOptions` className**

In `src/components/ui/select.tsx`, find the `ListboxOptions` element (around lines 82-90). Replace the className string with:

```tsx
        className="menu z-50 max-h-72 w-[var(--button-width)] overflow-y-auto rounded-[var(--overlay-radius)] border border-[var(--overlay-border)] bg-base-100 p-[var(--overlay-padding)] text-base-content shadow-[var(--overlay-shadow)]
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none"
```

Class-string swaps:
- `rounded-box` → `rounded-[var(--overlay-radius)]`
- `border border-base-300` → `border border-[var(--overlay-border)]`
- `p-2` → `p-[var(--overlay-padding)]`
- `shadow-lg` → `shadow-[var(--overlay-shadow)]`

- [ ] **Step 2: Normalise the anchor gap from 4 to 8**

On the same `ListboxOptions` element, change:

```tsx
        anchor={{ to: "bottom start", gap: 4 }}
```

to:

```tsx
        anchor={{ to: "bottom start", gap: 8 }}
```

- [ ] **Step 3: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 4: Do not commit yet**

Combined commit is in Task 10.

---

## Task 5: Migrate `Combobox` to overlay tokens

**Files:**
- Modify: `src/components/ui/combobox.tsx`

**Consumes:** `--overlay-radius`, `--overlay-padding`, `--overlay-border`, `--overlay-shadow`, `--overlay-anchor-gap`.
**Produces:** `ComboboxOptions` panel uses overlay tokens; anchor gap normalised to `8`. The empty-state row's `text-base-content/60` is already token-driven and stays.

- [ ] **Step 1: Edit the `ComboboxOptions` className**

In `src/components/ui/combobox.tsx`, find the `ComboboxOptions` element (around lines 88-95). Replace the className string with:

```tsx
        className="menu z-50 max-h-64 w-[var(--input-width)] overflow-y-auto rounded-[var(--overlay-radius)] border border-[var(--overlay-border)] bg-base-100 p-[var(--overlay-padding)] text-base-content shadow-[var(--overlay-shadow)]
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none"
```

Class-string swaps:
- `rounded-box` → `rounded-[var(--overlay-radius)]`
- `border border-base-300` → `border border-[var(--overlay-border)]`
- `p-2` → `p-[var(--overlay-padding)]`
- `shadow-lg` → `shadow-[var(--overlay-shadow)]`

- [ ] **Step 2: Normalise the anchor gap from 4 to 8**

On the same `ComboboxOptions` element, change:

```tsx
        anchor={{ to: "bottom start", gap: 4 }}
```

to:

```tsx
        anchor={{ to: "bottom start", gap: 8 }}
```

- [ ] **Step 3: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 4: Do not commit yet**

Combined commit is in Task 10.

---

## Task 6: Migrate `PopoverMenu` to overlay tokens

**Files:**
- Modify: `src/components/ui/popover.tsx`

**Consumes:** `--overlay-radius`, `--overlay-padding-rich`, `--overlay-border`, `--overlay-shadow`, `--overlay-anchor-gap`.
**Produces:** `PopoverPanel` uses overlay tokens. Padding is the rich variant (`1rem`) because popover bodies hold form controls and previews, not menu items.

- [ ] **Step 1: Edit the `PopoverPanel` className**

In `src/components/ui/popover.tsx`, find the `PopoverPanel` element (around lines 62-69). Replace the className string with:

```tsx
        className={`z-50 w-72 rounded-[var(--overlay-radius)] border border-[var(--overlay-border)] bg-base-100 p-[var(--overlay-padding-rich)] text-base-content shadow-[var(--overlay-shadow)]
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none ${panelClassName}`}
```

Class-string swaps:
- `rounded-box` → `rounded-[var(--overlay-radius)]`
- `border border-base-300` → `border border-[var(--overlay-border)]`
- `p-4` → `p-[var(--overlay-padding-rich)]`
- `shadow-lg` → `shadow-[var(--overlay-shadow)]`

- [ ] **Step 2: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 3: Do not commit yet**

Combined commit is in Task 10.

---

## Task 7: Migrate `Modal` to overlay tokens (border only; keep radius and shadow)

**Files:**
- Modify: `src/components/ui/modal.tsx`

**Consumes:** `--overlay-border`.
**Produces:** `DialogPanel` adopts the shared border token. Radius and shadow are **deliberately unchanged** — modal IS a container (a card-class surface), so `rounded-box` is correct, and `shadow-2xl` is the right elevation for a centered full-screen overlay.

- [ ] **Step 1: Edit the `DialogPanel` className**

In `src/components/ui/modal.tsx`, find the `DialogPanel` element (around lines 67-70). Change the className string to:

```tsx
          className={`relative w-full ${sizeClasses[size]} rounded-box border border-[var(--overlay-border)] bg-base-100 p-6 text-base-content shadow-2xl
            transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0`}
```

The only change is `border-base-300/80` → `border-[var(--overlay-border)]`. Everything else stays.

- [ ] **Step 2: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 3: Do not commit yet**

Combined commit is in Task 10.

---

## Task 8: Add missing border-radius and shared border to `Drawer`

**Files:**
- Modify: `src/components/ui/drawer.tsx`

**Consumes:** `--overlay-radius`, `--overlay-border`.
**Produces:** `DialogPanel` gains `rounded-[var(--overlay-radius)]` (was missing entirely) and a shared border on its inside edge.

- [ ] **Step 1: Edit the `DialogPanel` className**

In `src/components/ui/drawer.tsx`, find the `DialogPanel` element (around lines 60-64). Change the className string to:

```tsx
          className={`flex w-screen ${sizeClasses[size]} flex-col rounded-[var(--overlay-radius)] bg-base-100 shadow-xl
            transition duration-200 ease-out
            ${side === "right" ? "data-closed:translate-x-full" : "data-closed:-translate-x-full"}`}
```

Note: we add `rounded-[var(--overlay-radius)]` on all four corners. The user explicitly chose "Full overlay radius on all corners" for the drawer edge. (The header / body / footer children extend past the rounded corners, which is acceptable because each has its own background-on-the-panel — the panel's overall outline still reads as rounded.)

We are **not** adding `border-[var(--overlay-border)]` to the drawer panel itself. The shadow plus the page background provides sufficient separation. If a follow-up task finds the drawer looks flat, that's a separate concern.

- [ ] **Step 2: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 3: Do not commit yet**

Combined commit is in Task 10.

---

## Task 9: Bring `Tooltip` into the overlay family

**Files:**
- Modify: `src/components/ui/tooltip.tsx`

**Consumes:** `--overlay-border`, `--overlay-shadow`.
**Produces:** Tooltip bubble adopts the shared border and shadow. Radius stays `rounded-field` (the user explicitly chose "Keep at rounded-field" for tooltips — a small pill that reads as a control surface, not a menu).

- [ ] **Step 1: Edit the tooltip bubble className**

In `src/components/ui/tooltip.tsx`, find the `bubble` span's className (around lines 58-68). Change:

```tsx
      className={`pointer-events-none absolute z-50 w-max max-w-56 rounded-field bg-neutral px-2 py-1 text-xs text-neutral-content shadow-lg
        transition-opacity duration-150 ${placementClasses[placement]}
        ${open ? "opacity-100" : "opacity-0"}`}
```

to:

```tsx
      className={`pointer-events-none absolute z-50 w-max max-w-56 rounded-field border border-[var(--overlay-border)] bg-neutral px-2 py-1 text-xs text-neutral-content shadow-[var(--overlay-shadow)]
        transition-opacity duration-150 ${placementClasses[placement]}
        ${open ? "opacity-100" : "opacity-0"}`}
```

Two changes:
- Added `border border-[var(--overlay-border)]`
- `shadow-lg` → `shadow-[var(--overlay-shadow)]`

The `rounded-field` and `bg-neutral` stay. Tooltip background is intentionally `neutral` (a high-contrast surface) rather than `base-100` (the menu-panel family) — tooltips are an emphatic hint, not a list.

- [ ] **Step 2: Verify**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: exit 0.

- [ ] **Step 3: Do not commit yet**

Combined commit is in Task 10.

---

## Task 10: Final verification and single combined commit

**Files:** All files touched in Tasks 1-9, plus the commit message.

**Consumes:** Every artifact from Tasks 1-9. The working tree should now contain:
- `package.json` and `pnpm-lock.yaml` (Task 1)
- `src/app/globals.css` (Task 2)
- `src/components/ui/dropdown.tsx`, `select.tsx`, `combobox.tsx`, `popover.tsx`, `modal.tsx`, `drawer.tsx`, `tooltip.tsx` (Tasks 3-9)

**Produces:** A single commit on `main` with the message below. Tag is not used.

- [ ] **Step 1: Full verification gate**

Run:
```bash
pnpm check
pnpm build
```
Expected: both exit 0. If either fails, STOP. Do not commit a broken state.

- [ ] **Step 2: Verify the diff is exactly what was planned**

Run:
```bash
git status --short
git diff --stat
```
Expected output should show modifications to:
- `package.json`
- `pnpm-lock.yaml`
- `src/app/globals.css`
- `src/components/ui/dropdown.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/combobox.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/modal.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/tooltip.tsx`

Anything outside that list means a stray file was touched — STOP and investigate.

- [ ] **Step 3: Stage everything**

Run:
```bash
git add -A
git status --short
```
Expected: all files from Step 2 are staged, nothing else.

- [ ] **Step 4: Commit with a message that captures both halves**

Run:
```bash
git commit -m "$(cat <<'EOF'
chore: bump packages to latest and unify overlay design tokens

Package upgrade (pnpm up --latest -r):
EOF
)"
```

The full message body should list (a) every package that moved, by name, and (b) the design-token changes. Use the version-bump table captured in Task 1 Step 4 and the file list from Step 2 above to fill in the body. Conclude with:

```
- Migrate Dropdown, Select, Combobox, Popover, Modal, Drawer, Tooltip
  to consume --overlay-* tokens so they read as one visual family
- Normalise anchor gap to 8px across floating overlays
- Add missing border-radius to Drawer

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

- [ ] **Step 5: Confirm the commit landed**

Run:
```bash
git log -1 --stat
```
Expected: the most recent commit shows all expected files.

- [ ] **Step 6: Hand back to the user with a summary of what changed**

In the chat reply, list:
- Packages that moved (the table from Task 1)
- Files touched in the design-token half
- The verification commands that passed
- An invitation to the user to run `pnpm dev` and walk `/ui` to confirm the visual result

---

## Self-Review

**Spec coverage:**
- [x] Package upgrade to latest including majors → Task 1
- [x] Add overlay token family to both theme blocks → Task 2
- [x] Dropdown migration → Task 3
- [x] Select migration + gap normalisation → Task 4
- [x] Combobox migration + gap normalisation → Task 5
- [x] PopoverMenu migration with `padding-rich` → Task 6
- [x] Modal border-only migration → Task 7
- [x] Drawer adds missing radius → Task 8
- [x] Tooltip adopts shared border + shadow, keeps its pill radius → Task 9
- [x] Final verification + single combined commit → Task 10
- [x] User confirmation step (end of Task 10) → Task 10

**Placeholder scan:** No TBD / TODO / "implement later" markers. Every code change shows the exact old → new class strings. No "similar to Task N" cross-references without the code.

**Type consistency:** No new types or method signatures introduced anywhere; this is a class-string refactor, so the type surface is unchanged. The Tailwind arbitrary-value strings (`rounded-[var(--overlay-radius)]` etc.) are referenced identically in Tasks 2 through 9.

**Risks re-checked:**
- The `color-mix(in oklch, ...)` syntax requires modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+). The starter's Node 22 + modern browser expectation covers it. The package upgrade in Task 1 is unrelated to this concern.
- Tailwind v4 JIT needs to see the arbitrary-value classes. They appear in source files modified in Tasks 3-9, so the build in Task 2 Step 4 will only fully generate the styles after those tasks land. This is fine because Task 2 Step 4 only validates CSS syntax, not the final rendered output — full validation happens in Task 10 Step 1.
- Task 1's package upgrade may surface breaking changes. The `pnpm check` and `pnpm build` gates in Step 5/6 catch this. If a regression is real, the executor fixes forward and does not silently downgrade.
