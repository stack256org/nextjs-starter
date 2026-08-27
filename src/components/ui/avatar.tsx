import type { ReactNode } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  src?: string | null;
  /** Used for the alt text and to derive initials. */
  name: string;
  size?: AvatarSize;
  /** `squircle` reads as less generic than a circle for product UI. */
  shape?: "circle" | "squircle";
  className?: string;
  children?: ReactNode;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-6 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-11 text-base",
  xl: "size-14 text-lg",
  "2xl": "size-20 text-2xl",
};

/**
 * Derives up to two initials from a name, e.g. "Priya Raghunathan" → "PR".
 */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts.at(-1)![0]!).toUpperCase();
}

/**
 * An avatar that falls back to initials on a themed surface.
 *
 * A plain `<img>` is used rather than `next/image` so that arbitrary
 * user-supplied and OAuth-provider URLs work without configuring
 * `images.remotePatterns` for every possible host.
 */
export function Avatar({
  src,
  name,
  size = "md",
  shape = "circle",
  className = "",
  children,
}: AvatarProps) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-[30%]";
  const dimensions = sizeClasses[size];

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ? `${name}'s avatar` : "User avatar"}
          className={`${dimensions} ${radius} object-cover ring-1 ring-base-content/10`}
        />
      ) : (
        <span
          className={`${dimensions} ${radius} flex items-center justify-center bg-primary font-semibold text-primary-content ring-1 ring-base-content/10`}
          aria-hidden="true"
        >
          {initialsFrom(name)}
        </span>
      )}
      {children}
    </span>
  );
}
