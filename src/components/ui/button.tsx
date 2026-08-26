import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "dash"
  | "soft";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  active?: boolean;
}

/**
 * A reusable button component styled with DaisyUI classes.
 *
 * DaisyUI follows the rule of using the default variant unless the user
 * asks for a specific variant/color. So `variant` defaults to `undefined`
 * (plain `btn` class), not `primary`.
 *
 * @example
 *   <Button variant="primary">Save</Button>
 *   <Button variant="ghost" size="sm">Cancel</Button>
 *   <Button active href="/dashboard">Dashboard</Button>
 */
export function Button({
  variant,
  size,
  active = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    variant ? `btn-${variant}` : "",
    size ? `btn-${size}` : "",
    active ? "btn-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
