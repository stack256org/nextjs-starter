"use client";

import { useState, type ReactNode } from "react";

export interface TooltipProps {
  /** The tooltip text. Keep it short — this is a hint, not documentation. */
  label: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  /**
   * Whether the trigger needs its own control.
   *
   * Defaults to `true`, which wraps the child in a real `<button>` so it can
   * be reached by keyboard and tapped on touch. Set it to `false` when
   * wrapping something already interactive — a button or a link — otherwise
   * you nest one control inside another and create two tab stops.
   */
  focusable?: boolean;
  className?: string;
}

const placementClasses = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
} as const;

/**
 * A hint shown on hover, on keyboard focus, and on tap.
 *
 * Headless UI has no tooltip primitive, so this is hand-built to the same
 * standard. Three things it gets right that hover-only tooltips do not:
 *
 *  - **Keyboard.** The trigger is a real `<button>`, not a `<span>` with a
 *    `tabindex`. A non-interactive child — a badge, an icon, plain text — has
 *    no focus to receive, so without this a keyboard user could never read
 *    the hint. Pass `focusable={false}` when the child is already a control.
 *  - **Touch.** There is no hover on a phone. Tapping the trigger toggles the
 *    tooltip, so the hint is not desktop-only.
 *  - **Screen readers.** The text is in the DOM permanently with
 *    `role="tooltip"` and wired to the trigger through `aria-describedby`, so
 *    it is announced whether or not it is visible.
 *
 * Even so, never put essential information here. A hint is a hint; if the user
 * must read it to succeed, put it on the page.
 */
export function Tooltip({
  label,
  children,
  placement = "top",
  focusable = true,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = `tooltip-${label.replace(/\W+/g, "-").toLowerCase()}`;

  const bubble = (
    <span
      id={id}
      role="tooltip"
      className={`pointer-events-none absolute z-50 w-max max-w-56 rounded-field border border-[var(--overlay-border)] bg-neutral px-2 py-1 text-xs text-neutral-content shadow-[var(--overlay-shadow)]
        transition-opacity duration-150 ${placementClasses[placement]}
        ${open ? "opacity-100" : "opacity-0"}`}
    >
      {label}
    </span>
  );

  // Shared handlers: hover for pointers, focus for keyboards.
  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  if (!focusable) {
    // The child is already interactive — wrapping it in a button would nest
    // controls, so the hint rides along on a plain span instead.
    return (
      <span className={`relative inline-flex ${className}`} {...handlers}>
        <span aria-describedby={id} className="inline-flex">
          {children}
        </span>
        {bubble}
      </span>
    );
  }

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-help"
        {...handlers}
      >
        {children}
      </button>
      {bubble}
    </span>
  );
}
