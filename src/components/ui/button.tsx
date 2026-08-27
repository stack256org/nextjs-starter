"use client";

import { Button as HuiButton, type ButtonProps as HuiButtonProps } from "@headlessui/react";
import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link"
  | "outline"
  | "dash"
  | "soft";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  block?: boolean;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export interface ButtonProps
  extends CommonProps,
    Omit<HuiButtonProps, "className" | "children"> {
  href?: never;
}

export interface ButtonLinkProps extends CommonProps {
  href: string;
  disabled?: boolean;
}

function classesFor({
  variant,
  size,
  active,
  block,
  className = "",
}: CommonProps) {
  return [
    "btn",
    variant ? `btn-${variant}` : "",
    size ? `btn-${size}` : "",
    active ? "btn-active" : "",
    block ? "btn-block" : "",
    // Tactile press feedback — transform only, so it stays on the compositor.
    "transition-transform duration-100 active:scale-[0.98]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * A DaisyUI-styled button built on Headless UI's `Button`.
 *
 * `variant` is intentionally optional: DaisyUI's convention is that a plain
 * `btn` is the default and colour is opt-in, so most buttons on a page should
 * pass nothing.
 *
 * @example
 *   <Button variant="primary" loading={saving}>Save</Button>
 *   <ButtonLink href="/dashboard" variant="ghost">Back</ButtonLink>
 */
export function Button({
  variant,
  size,
  active = false,
  block = false,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <HuiButton
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classesFor({ variant, size, active, block, className, children })}
      {...props}
    >
      {loading && (
        <span
          className="loading loading-spinner loading-xs"
          aria-hidden="true"
        />
      )}
      {children}
    </HuiButton>
  );
}

/**
 * The same styling as `Button`, rendered as a Next.js `Link`.
 *
 * Navigation must be an anchor: a `<button>` with an onClick router push is
 * not openable in a new tab and is announced wrongly by screen readers.
 */
export function ButtonLink({
  href,
  variant,
  size,
  active = false,
  block = false,
  loading = false,
  disabled = false,
  className = "",
  children,
}: ButtonLinkProps) {
  const classes = classesFor({ variant, size, active, block, className, children });

  if (disabled) {
    return (
      <span className={`${classes} btn-disabled`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={classes}>
      {loading && (
        <span className="loading loading-spinner loading-xs" aria-hidden="true" />
      )}
      {children}
    </Link>
  );
}
