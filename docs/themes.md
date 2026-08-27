# Themes (Light / Dark Mode)

## Overview

Theming is two pieces:

- **[DaisyUI v5](https://daisyui.com/)** supplies the CSS variables, selected
  by the `data-theme` attribute on `<html>`.
- **`src/lib/theme/`** stores the preference in a cookie, reads it on the
  server, and updates it in the browser.

There is deliberately **no `next-themes` dependency and no inline script**.

| File | Purpose |
| --- | --- |
| `src/lib/theme/config.ts` | Theme names, cookie name, `themeAttribute()` |
| `src/lib/theme/server.ts` | Reads the cookie in Server Components |
| `src/lib/theme/provider.tsx` | `ThemeProvider` and the `useTheme()` hook |
| `src/components/theme-toggle.tsx` | The light/dark button |
| `src/app/dashboard/settings/theme-picker.tsx` | Full theme selector |

## How it works

The preference lives in a **cookie**, not `localStorage`, so the server can
read it:

```tsx
// src/app/layout.tsx — a Server Component
const theme = await getThemePreference();
<html data-theme={themeAttribute(theme)}>
```

That single decision removes the usual FOUC machinery:

- **No flash.** `data-theme` is in the first byte of the HTML response, so the
  correct theme paints immediately.
- **No inline script.** React 19 logs *"Encountered a script tag while
  rendering React component"* for a `<script>` anywhere in the React tree —
  including one rendered by a Server Component, because the tag is still
  hydrated. Not having one avoids the warning entirely.
- **No hydration mismatch.** The server and the client render the same
  attribute.
- **`system` works with JavaScript disabled.** `system` is represented by the
  *absence* of `data-theme`, which lets this rule in `globals.css` resolve it:

  ```css
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) { /* dark palette */ }
  }
  ```

  Setting `data-theme="light"` for the system preference would pin it and
  break that, which is why `themeAttribute()` returns `undefined`.

On the client, `ThemeProvider` seeds its state from the same server value and
only handles changes: it writes the cookie, swaps the attribute, and suppresses
transitions for one frame so the switch doesn't animate every colour at once.
The OS preference is read through `useSyncExternalStore` — the right primitive
for `matchMedia`, with a server snapshot built in.

## Registered themes

Configured in the `@plugin "daisyui"` and `@plugin "daisyui/theme"` blocks of
`src/app/globals.css`:

| Theme | Notes |
| --- | --- |
| `light` | Default. Custom palette — a single desaturated jade accent |
| `dark` | Custom palette. Used when the system prefers dark |
| `cupcake` · `emerald` · `synthwave` · `valentine` · `dim` | Stock DaisyUI |

`light` and `dark` override DaisyUI's stock versions, whose primary is a
heavily saturated indigo (`oklch(45% 0.24 277)`).

## Adding a theme

1. Register it in the `@plugin "daisyui"` block in `src/app/globals.css`.
2. Add its name to `THEMES` in `src/lib/theme/config.ts`.
3. Add a label for it to `LABELS` in `theme-picker.tsx`.

A name registered in one place but not the others either produces no CSS or is
unreachable, and DaisyUI does not warn about it.

`color-scheme` needs no attention — DaisyUI emits it per theme, so form
controls and scrollbars follow automatically.

## Never hard-code `data-theme` on a wrapper

DaisyUI resolves theme variables from the **nearest ancestor** carrying
`data-theme`. Putting a fixed value on a layout wrapper:

```tsx
// Don't. This breaks the theme toggle for the entire subtree.
<div className="min-h-screen" data-theme="dim">
```

...overrides whatever the root layout set. The toggle still fires and still
writes the cookie, but nothing inside changes — so it reads as a broken
toggle. This is exactly what happened to `/orbit`.

Give a section its own identity with accent colours, borders and layout, all of
which follow the active theme, rather than by pinning one.

## The one remaining hydration case

For an explicit theme the server knows the answer, so the toggle renders the
right icon on the first pass. For `system` it cannot — the OS preference is
only knowable in the browser — so the icon may change on hydration.

`suppressHydrationWarning` covers an element's own attributes and text but
**not its children**, so putting it on the `<button>` would do nothing for the
`<path d="…">` inside the icon. The icon is therefore wrapped in a `<span>`
that carries the flag for its whole subtree.

## Phosphor Icons

Import from the SSR entry point, and use the `*Icon` names:

```ts
import { SunIcon, MoonIcon } from "@phosphor-icons/react/dist/ssr";
```

The bare names (`Sun`, `Moon`, `X`, `Warning`) still exist but are deprecated
aliases.
