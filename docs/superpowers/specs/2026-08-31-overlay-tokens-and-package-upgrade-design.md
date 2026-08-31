# Overlay design tokens + package upgrade

**Date:** 2026-08-31
**Status:** Draft — awaiting user approval
**Scope:** `nextjs-starter/`

## Problem

Two complaints about the current state of the `nextjs-starter`:

1. **Design tokens not honoured across overlays.** The four floating overlays
   (`Dropdown`, `Select`, `Combobox`, `PopoverMenu`) and the two full-screen
   overlays (`Modal`, `Drawer`) each choose their own border-radius, anchor
   gap, padding, shadow, and border treatment. Reading the files:

   - `Dropdown` uses `rounded-box` (the container radius, 0.875rem) and `gap: 8`
   - `Select` uses `rounded-box` and `gap: 4`
   - `Combobox` uses `rounded-box` and `gap: 4`
   - `PopoverMenu` uses `rounded-box`, `p-4`, and `gap: 8`
   - `Modal` uses `rounded-box`, `shadow-2xl`, and a translucent border
   - `Drawer` uses **no border-radius at all** and `shadow-xl`
   - `Tooltip` uses `rounded-field` and `shadow-lg`

   Two values for the same thing (anchor gap, panel padding, shadow elevation)
   means the overlays do not look like one family. A `Dropdown` panel
   attached to a `Select` button looks heavier than a `Select`'s own panel
   because the radii don't match.

2. **Packages need an upgrade.** The current `package.json` is reasonably
   modern but several dependencies are not at latest stable. The user has
   asked for a "bump including majors" refresh.

## Approach

### Package upgrade

Run `pnpm up --latest -r` inside `nextjs-starter/`. This pulls the latest
version of every direct dependency and devDependency, including major bumps,
and rewrites `pnpm-lock.yaml`. Verify with:

- `pnpm install` — lockfile resolves cleanly
- `pnpm check` — typecheck and lint, per `AGENTS.md`
- `pnpm build` — full Next.js build

If any package is forced off a pinned version, the resolver will surface it;
we will not force a downgrade. The diff is captured in the lockfile and the
commit message.

### Design tokens

Introduce one **overlay family** in `globals.css`, inside each
`@plugin "daisyui/theme"` block (so the tokens travel with the theme and
respond to the theme picker):

```css
--overlay-radius: var(--radius-field);   /* 0.5rem — matches inputs/buttons */
--overlay-padding: 0.5rem;                /* 8px  — menu/list panels */
--overlay-padding-rich: 1rem;             /* 16px — Popover/Modal/Drawer body */
--overlay-anchor-gap: 0.5rem;             /* 8px  — the one true gap to trigger */
--overlay-border: color-mix(in oklch, var(--color-base-300) 80%, transparent);
--overlay-shadow: 0 4px 12px -2px oklch(0% 0 0 / 0.18);
--overlay-shadow-elevated: 0 12px 32px -8px oklch(0% 0 0 / 0.28);
```

Rationale:

- `rounded-box` is for **containers** (cards, modals, drawers). Menu panels
  and select dropdowns are **control surfaces** — they sit adjacent to
  buttons/inputs and should use the **field** radius, the same one the
  trigger uses. This is what DaisyUI itself documents in the
  `--radius-selector` / `--radius-field` / `--radius-box` separation.
- One anchor gap (8px) is the only sensible value. Mixing 4 and 8 produces
  jitter as a user moves the mouse between two adjacent overlays.
- One translucent border treatment, parameterised by `color-mix` against
  the theme's `--color-base-300`, replaces the ad-hoc `border-base-300` and
  `border-base-300/80` choices.
- One shadow for floating panels (`--overlay-shadow`) and one elevated
  variant for full-screen overlays (`--overlay-shadow-elevated`).

### Component changes

All edits are surgical — no behavioural change, no API change. Just class
strings and, in one place, the addition of a missing radius.

| File | Change |
|---|---|
| `src/app/globals.css` | Add the seven `--overlay-*` tokens to both theme blocks. |
| `src/components/ui/dropdown.tsx` | Panel: `rounded-box` → `rounded-[var(--overlay-radius)]`, `border-base-300` → `border-[var(--overlay-border)]`, `shadow-lg` → `shadow-[var(--overlay-shadow)]`, `p-2` → `p-[var(--overlay-padding)]`. Anchor gap stays at 8. |
| `src/components/ui/select.tsx` | Panel: same as Dropdown, but anchor gap `4` → `8`. |
| `src/components/ui/combobox.tsx` | Panel: same as Dropdown, but anchor gap `4` → `8`. Empty-state row keeps the existing `text-base-content/60` (it is a token-driven semantic colour already). |
| `src/components/ui/popover.tsx` | Panel: `rounded-box` → `rounded-[var(--overlay-radius)]`, `border-base-300` → `border-[var(--overlay-border)]`, `shadow-lg` → `shadow-[var(--overlay-shadow)]`, `p-4` → `p-[var(--overlay-padding-rich)]`. Anchor gap stays at 8. |
| `src/components/ui/modal.tsx` | Keep `rounded-box` (this IS a container, by design). Border: `border-base-300/80` → `border-[var(--overlay-border)]`. Shadow stays `shadow-2xl` — the elevated variant is for full-screen overlays, not menu panels. |
| `src/components/ui/drawer.tsx` | Add `rounded-[var(--overlay-radius)]` to the panel (was missing entirely). Border: add `border-[var(--overlay-border)]` on the inside edge (`border-l` for right-side, `border-r` for left-side). Shadow stays `shadow-xl`. |
| `src/components/ui/tooltip.tsx` | Keep `rounded-field` (a small pill — already a control radius, which is right for a hint). Adopt `border-[var(--overlay-border)]` and `shadow-[var(--overlay-shadow)]` for family consistency. |

### What is NOT changing

- `CommandPalette`, `ToastProvider`, `Tabs`, `DisclosureItem` — none of these
  are floating overlays anchored to a trigger. Out of scope.
- The DaisyUI theme block content itself — only **adding** tokens, not
  modifying any colour, radius, or border that already exists.
- Component props, exports, or behaviour. This is a visual-only change.
- The README's note that "Three DaisyUI classes are deliberately not
  reused" (lines 186-191) — still true, still relevant.

## Testing

1. `pnpm check` — typecheck + lint must pass.
2. `pnpm build` — full Next build must succeed.
3. `pnpm dev`, open <http://localhost:3003/ui>:
   - Open each demo: Dropdown, Select, Combobox, PopoverMenu, Modal, Drawer.
   - Verify panel radius, border, shadow, and trigger gap are visually
     consistent across all four floating overlays.
   - Toggle theme through `light → dark → cupcake → synthwave → emerald
     → dim` and confirm the overlay tokens track the theme (the
     `color-mix`-based border should pick up the theme's `base-300`).
4. Capture before/after screenshots via the visual companion for sign-off.

## Commit

Single combined commit per the user's choice. Message:

```
chore: bump packages to latest and unify overlay design tokens

- Run `pnpm up --latest -r` and lockfile refresh
- Add overlay-family tokens to both DaisyUI theme blocks in globals.css
- Migrate Dropdown, Select, Combobox, Popover, Modal, Drawer, Tooltip
  to consume --overlay-* tokens so they read as one visual family
- Normalise anchor gap to 8px across floating overlays
- Add missing border-radius to Drawer
```

## Risks

- **Package major bumps** may surface breaking changes. Mitigation: run
  `pnpm check` and `pnpm build` after the bump. If a real regression
  appears, we revert that single package and surface the issue rather than
  papering over it.
- **Tailwind v4's JIT** needs to see `var(--overlay-*)` used in source
  files; since we use the `rounded-[var(--overlay-radius)]` arbitrary-value
  pattern, this is fine. (If Tailwind ever complains, the fallback is
  inline-style usage, but v4 is happy with this.)
- **Color-mix browser support** is now baseline-modern (Chrome 111+,
  Firefox 113+, Safari 16.2+). The project's Node 22 / modern-browser
  expectation covers it. If we ever need IE-class support we'd swap
  `color-mix` for a precomputed hex, but that's not on the horizon.
