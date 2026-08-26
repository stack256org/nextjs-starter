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
import { type ReactNode } from "react";

// Re-export Headless UI primitives so consumers can compose them
export { Menu, MenuButton, MenuItem, MenuItems };
export type { MenuButtonProps, MenuItemProps, MenuItemsProps };

/**
 * A Headless UI-powered dropdown menu styled with DaisyUI classes.
 *
 * @example
 *   <Dropdown
 *     trigger={<Avatar src={user.image} name={user.name} />}
 *     placement="bottom-end"
 *   >
 *     <DropdownItem href="/settings">Settings</DropdownItem>
 *     <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
 *   </Dropdown>
 */
export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "top-end" | "bottom-end" | "left-end" | "right-end";
  className?: string;
}

const placementClasses: Record<NonNullable<DropdownProps["placement"]>, string> =
  {
    top: "dropdown-top",
    bottom: "dropdown-bottom",
    left: "dropdown-left",
    right: "dropdown-right",
    "top-end": "dropdown-top dropdown-end",
    "bottom-end": "dropdown-bottom dropdown-end",
    "left-end": "dropdown-left dropdown-end",
    "right-end": "dropdown-right dropdown-end",
  };

export function Dropdown({
  trigger,
  children,
  placement = "bottom-end",
  className = "",
}: DropdownProps) {
  const placementClass = placementClasses[placement] ?? "dropdown-bottom dropdown-end";

  return (
    <div className={`dropdown ${placementClass} ${className}`}>
      <Menu>
        <MenuButton className="w-full cursor-pointer">
          {trigger}
        </MenuButton>
        <MenuItems
          as="ul"
          className="menu dropdown-content bg-base-100 text-base-content rounded-box z-[100] mt-2 min-w-[200px] p-2 shadow-lg"
        >
          {children}
        </MenuItems>
      </Menu>
    </div>
  );
}

/**
 * A single dropdown item. Renders as a `<li>` with the DaisyUI `menu-item`
 * class inside the `menu` component (Headless UI `MenuItems` provides `ul`).
 */
export interface DropdownItemProps extends Omit<MenuItemProps, "onClick"> {
  href?: string;
  children: ReactNode;
  onClick?: () => void | Promise<void>;
}

export function DropdownItem({
  href,
  children,
  ...props
}: DropdownItemProps) {
  const content = <span>{children}</span>;

  if (href) {
    return (
      <MenuItem as="li">
        <a href={href} className="menu-item">
          {content}
        </a>
      </MenuItem>
    );
  }

  return (
    <MenuItem as="li">
      <button
        type="button"
        className="menu-item w-full text-left"
        {...props}
      >
        {content}
      </button>
    </MenuItem>
  );
}

/**
 * A separator between dropdown item groups.
 */
export function DropdownSeparator() {
  return <li className="my-1 h-px bg-base-300" />;
}

/**
 * A header/label inside the dropdown.
 */
export function DropdownHeader({ children }: { children: ReactNode }) {
  return <li className="px-2 py-1 text-xs font-semibold opacity-60">{children}</li>;
}
