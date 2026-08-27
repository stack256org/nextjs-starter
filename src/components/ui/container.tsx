import type { ElementType, ReactNode } from "react";

/**
 * The app's single horizontal container.
 *
 * Every bar, main region and footer wraps its contents in this, so the brand
 * in the navbar sits on the same left edge as the page heading below it and
 * the layout keeps one rhythm on wide screens.
 *
 * The pattern is: the *bar* stays full-bleed so its border and backdrop reach
 * the viewport edges, while the bar's *contents* sit inside a Container. Do
 * not put the max-width on the bar itself — the border will stop short of the
 * edges and look like a bug.
 *
 * ```tsx
 * <header className="border-b border-base-300">   // full-bleed chrome
 *   <Container className="flex h-16 items-center"> // aligned contents
 * ```
 *
 * `size` narrows the content without changing the page's outer rhythm:
 *  - `app`   the default shell width, for dashboards and tables
 *  - `prose` long-form text and forms, kept near 65–75 characters
 *  - `form`  a single centred form column
 */
const sizeClasses = {
  app: "max-w-7xl",
  prose: "max-w-3xl",
  form: "max-w-sm",
} as const;

export type ContainerSize = keyof typeof sizeClasses;

export interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  /** Renders as a different element, e.g. `main`, `nav`, `footer`. */
  as?: ElementType;
  className?: string;
  id?: string;
}

export function Container({
  children,
  size = "app",
  as: Tag = "div",
  className = "",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={`mx-auto w-full ${sizeClasses[size]} px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
