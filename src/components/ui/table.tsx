import type { ReactNode } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * Data table primitives.
 *
 * `Table` supplies the scroll container and the rounded, clipped surface —
 * `overflow-x-auto` is what lets a wide table scroll inside its own box
 * instead of making the whole page scroll sideways, and it doubles as the
 * clip that keeps zebra and hover backgrounds inside the rounded corners.
 *
 * ```tsx
 * <Table>
 *   <THead>
 *     <TR>
 *       <TH>Name</TH>
 *       <TH sortable sorted="asc" onSort={…}>Created</TH>
 *       <TH align="right" srOnlyLabel="Actions" />
 *     </TR>
 *   </THead>
 *   <TBody>…</TBody>
 * </Table>
 * ```
 */
export function Table({
  children,
  className = "",
  /** Alternating row shading. Off by default — rules are usually enough. */
  zebra = false,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  zebra?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table
        className={`table ${size === "sm" ? "table-sm" : ""} ${
          zebra ? "table-zebra" : ""
        } ${className}`}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className = "",
  /** Adds a hover tint — only for rows that are actually clickable. */
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <tr
      className={`${interactive ? "transition-colors hover:bg-base-200/60" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export type SortDirection = "asc" | "desc" | null;

export interface THProps {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  /** Renders a sort control. */
  sortable?: boolean;
  /** Current direction for this column, or null when not the sort column. */
  sorted?: SortDirection;
  onSort?: () => void;
  /**
   * Accessible name for a visually empty header (an actions column).
   * An empty `<th>` leaves the column unnamed for screen readers.
   */
  srOnlyLabel?: string;
}

const alignClasses = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function TH({
  children,
  align = "left",
  className = "",
  sortable = false,
  sorted = null,
  onSort,
  srOnlyLabel,
}: THProps) {
  // `aria-sort` is what tells assistive tech the current sort state; the
  // caret alone conveys it only visually.
  const ariaSort = sortable
    ? sorted === "asc"
      ? "ascending"
      : sorted === "desc"
        ? "descending"
        : "none"
    : undefined;

  return (
    <th aria-sort={ariaSort} className={`${alignClasses[align]} ${className}`}>
      {srOnlyLabel && !children ? (
        <span className="sr-only">{srOnlyLabel}</span>
      ) : sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex cursor-pointer items-center gap-1 font-inherit transition-colors hover:text-base-content"
        >
          {children}
          <span className="flex flex-col leading-none" aria-hidden="true">
            <CaretUpIcon
              size={9}
              weight="fill"
              className={sorted === "asc" ? "opacity-100" : "opacity-30"}
            />
            <CaretDownIcon
              size={9}
              weight="fill"
              className={sorted === "desc" ? "opacity-100" : "opacity-30"}
            />
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TD({
  children,
  align = "left",
  className = "",
  /** Numeric cells get tabular figures so columns line up. */
  numeric = false,
}: {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  numeric?: boolean;
}) {
  return (
    <td
      className={`${alignClasses[align]} ${numeric ? "font-mono tabular" : ""} ${className}`}
    >
      {children}
    </td>
  );
}

/** A full-width row for the empty case, so the table keeps its header. */
export function TEmpty({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-sm text-base-content/60">
        {children}
      </td>
    </tr>
  );
}
