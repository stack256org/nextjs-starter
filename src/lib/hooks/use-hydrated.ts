"use client";

import { useSyncExternalStore } from "react";

// Never changes, so React never resubscribes.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `false` during SSR and the first client render, then `true`.
 *
 * Use it to gate anything that can only be known in the browser — the stored
 * theme, `localStorage`, `window` — so the server and the first client render
 * agree and React doesn't report a hydration mismatch.
 *
 * `useSyncExternalStore` is the idiomatic way to express this: the usual
 * `useState(false)` + `useEffect(() => setState(true))` pattern schedules an
 * extra render pass just to flip a flag.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
