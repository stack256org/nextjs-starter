# Themes (Light / Dark Mode)

## Overview

The project uses two libraries working together:

- **[next-themes](https://github.com/pacocoursehan/next-themes)** — manages the
  active theme, persists the user's choice in `localStorage`, and follows the
  OS `prefers-color-scheme` by default.
- **[DaisyUI v5](https://daisyui.com/)** — provides the actual CSS theme
  variables, swapped via the `data-theme` attribute on `<html>`.

Together they set **both** the `class` attribute (for Tailwind's `dark:`
variant) and the `data-theme` attribute (for DaisyUI's CSS variables) on the
`<html>` element.

## How It Works

1. **`src/components/theme-provider.tsx`** wraps the app with
   `next-themes`. On first load it follows the system preference
   (`defaultTheme="system"`). It injects an inline script that sets the
   theme attributes *before* the first client paint — preventing a flash of
   wrong theme (FOUC).

2. **`src/components/theme-toggle.tsx`** is a button that uses Phosphor Icons
   (`Sun` / `Moon`) to toggle between light and dark. Clicking it calls
   `setTheme(isDark ? "light" : "dark")`, and `next-themes` persists the
   choice.

## DaisyUI Themes

Six themes are configured in `src/app/globals.css`:

| Theme | Flag | Notes |
|---|---|---|
| `light` | `--default` | Default theme |
| `dark` | `--prefersdark` | Used when the system prefers dark mode |
| `cupcake` | | Pastel, rounded |
| `synthwave` | | Retro neon |
| `valentines` | | Pink/red |
| `emerald` | | Green |

To switch to a non-light/dark theme globally, set `data-theme` on the `<html>`
element in `src/app/layout.tsx`. To switch at runtime, call
`document.documentElement.setAttribute("data-theme", "cupcake")`.

## Phosphor Icons

The theme toggle uses [`@phosphor-icons/react`](https://phosphoricons.com/) —
a flexible icon toolkit with multiple weights. The **SSR** variant is imported
(`@phosphor-icons/react/dist/ssr`) so icons render correctly during
server-side rendering without hydration mismatches.

Available icon sets: `Sun`, `Moon`, `Sun` + `Moon` pair, and hundreds more.
Import from the SSR entry:

```ts
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";
```
