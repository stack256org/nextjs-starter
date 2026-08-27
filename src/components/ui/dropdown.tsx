"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  type MenuButtonProps,
  type MenuItemProps,
  type MenuItemsProps,
} from "@headlessui/react";
import Link from "next/link";
import { type ReactNode } from "react";

// Re-export Headless UI primitives so consumers can compose them
export { Menu, MenuButton, MenuItem, MenuItems };
export type { MenuButtonProps, MenuItemProps, MenuItemsProps };

/**
 * A Headless UI-powered dropdown menu styled with DaisyUI classes.
 *
 * IMPORTANT — do not wrap this in DaisyUI's `dropdown` / `dropdown-content`
 * classes.  DaisyUI 5 hides `.dropdown-content` with
 * `display:none` unless the wrapper matches `.dropdown-open`, `:hover` or
 * `:focus-within`, and Headless UI tracks open state in React while leaving
 * focus on the trigger.  Combining the two produces a menu that is "open"
 * according to React and invisible according to CSS.  We use Headless UI's
 * own `anchor` positioning plus DaisyUI's `menu` styling instead.
 *
 * @example
 *   <Dropdown trigger={<Avatar src={user.image} name={user.name} />}>
 *     <DropdownItem href="/settings">Settings</DropdownItem>
 *     <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
 *   </Dropdown>
 */
export interface DropdownProps {
  trigger: ReactNode;
  /**
   * Accessible name for the trigger. Required when `trigger` is an icon or an
   * avatar — without it the button is announced as just "button".
   */
  label?: string;
  /**
   * Classes for the trigger button itself — pass DaisyUI's `btn` classes here
   * when you want a button-looking trigger.
   *
   * `trigger` MUST NOT contain a `<button>`: Headless UI renders `MenuButton`
   * as a real `<button>`, and nesting one inside another is invalid HTML that
   * React reports as a hydration error.
   */
  triggerClassName?: string;
  children: ReactNode;
  placement?:
    | "top"
    | "bottom"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";
  className?: string;
}

export function Dropdown({
  trigger,
  label,
  triggerClassName = "",
  children,
  placement = "bottom end",
  className = "",
}: DropdownProps) {
  return (
    <Menu>
      <MenuButton
        aria-label={label}
        className={`cursor-pointer rounded-selector align-middle ${triggerClassName}`}
      >
        {trigger}
      </MenuButton>
      <MenuItems
        as="ul"
        transition
        anchor={{ to: placement, gap: 8 }}
        className={`menu z-50 min-w-52 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-lg
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none ${className}`}
      >
        {children}
      </MenuItems>
    </Menu>
  );
}

export interface DropdownItemProps {
  href?: string;
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  /** Renders the item in the error colour — for destructive actions. */
  destructive?: boolean;
}

/**
 * A single dropdown item, rendered as a `<li>` so it sits correctly inside
 * DaisyUI's `menu`.  DaisyUI styles `menu > li > a|button` directly — there
 * is no `menu-item` class (it does not exist in DaisyUI 5).
 */
export function DropdownItem({
  href,
  children,
  onClick,
  disabled = false,
  destructive = false,
}: DropdownItemProps) {
  const tone = destructive ? "text-error" : "";

  return (
    <MenuItem as="li" disabled={disabled}>
      {href ? (
        <Link href={href} className={tone}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={`text-left ${tone}`}>
          {children}
        </button>
      )}
    </MenuItem>
  );
}

/** A separator between dropdown item groups. */
export function DropdownSeparator() {
  return <li aria-hidden="true" className="my-1 h-px bg-base-300" />;
}

/** A non-interactive header/label inside the dropdown. */
export function DropdownHeader({ children }: { children: ReactNode }) {
  return <li className="menu-title px-3 py-1 text-xs">{children}</li>;
}
