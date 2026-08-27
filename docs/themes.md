# Themes (Light / Dark Mode)

## Overview

Two libraries work together:

- **[next-themes](https://github.com/pacocourse/next-themes)** — tracks the
  active theme, persists the choice in `localStorage`, and follows the OS
  `prefers-color-scheme` by default.
- **[DaisyUI v5](https://daisyui.com/)** — supplies the CSS variables, swapped
  via the `data-theme` attribute.

`src/components/theme-provider.tsx` sets **both** attributes on `<html>`:
`class` (for Tailwind's `dark:` variant) and `data-theme` (for DaisyUI).

## Registered themes

Configured in the `@plugin "daisyui"` block of `src/app/globals.css`:

| Theme | Flag | Notes |
|---|---|---|
| `light` | `--default` | Default |
| `dark` | `--prefersdark` | Used when the system prefers dark |
| `cupcake` | | Pastel, rounded |
| `synthwave` | | Retro neon |
| `valentine` | | Pink/red — note the name is singular |
| `emerald` | | Green |
| `dim` | | Muted dark |

A name that isn't in this block produces **no CSS at all** and silently falls
back to the default theme. DaisyUI does not warn about it.

## Adding a theme

1. Add the name to the `@plugin "daisyui"` block in `src/app/globals.css`.
2. Add it to `THEME_OPTIONS` in
   `src/app/dashboard/settings/theme-picker.tsx` so users can select it.

## ⚠️ Never hard-code `data-theme` on a wrapper

DaisyUI resolves theme variables from the **nearest ancestor** carrying
`data-theme`. Putting a fixed value on a layout wrapper:

```tsx
// Don't do this — it breaks the theme toggle for this whole subtree.
<div className="min-h-screen" data-theme="dim">
```

...overrides whatever `next-themes` wrote on `<html>`. The toggle still fires
and still updates `localStorage`, but nothing inside that subtree changes, so
it reads as a broken toggle. This is exactly what happened to `/orbit`.

Give a section its own identity with accent colours, borders and layout — all
of which follow the active theme — rather than by pinning one.

## Hydration

The active theme is only knowable in the browser, so the server cannot render
the correct state for anything that depends on it. Rendering a guess produces
a React hydration mismatch.

`suppressHydrationWarning` is **not** a general fix: it only covers an
element's own attributes and text, not its children. Putting it on a `<button>`
does nothing for the `<path d="…">` inside the icon it renders.

Use `useHydrated()` from `src/lib/hooks/use-hydrated.ts` instead — it returns
`false` on the server and the first client render, then `true`:

```tsx
const hydrated = useHydrated();
if (!hydrated) return <Placeholder />;
```

`src/components/theme-toggle.tsx` and the settings theme picker both use it.

## Phosphor Icons

The SSR entry point renders icons as plain markup during server rendering:

```ts
import { SunIcon, MoonIcon } from "@phosphor-icons/react/dist/ssr";
```

Use the `*Icon` names. The bare names (`Sun`, `Moon`, `X`, `Warning`) still
exist but are deprecated aliases.

Note that the SSR entry does not prevent hydration mismatches on its own — if
*which* icon you render depends on client-only state, gate it with
`useHydrated()` as above.
