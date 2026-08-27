"use client";

import {
  Popover as HuiPopover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
  PopoverBackdrop,
  CloseButton,
} from "@headlessui/react";
import type { ReactNode } from "react";

export {
  HuiPopover as Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
  PopoverBackdrop,
  CloseButton,
};

export interface PopoverMenuProps {
  trigger: ReactNode;
  /**
   * Classes for the trigger button itself. As with `Dropdown`, `trigger` must
   * not contain a `<button>` — `PopoverButton` already renders one.
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
  panelClassName?: string;
}

/**
 * A DaisyUI-styled popover built on Headless UI's `Popover`.
 *
 * Use this for rich floating content (filters, a form, a preview). Use
 * `Dropdown` instead when the content is a list of actions — `Menu` provides
 * the roving-tabindex behaviour a menu needs, which `Popover` deliberately
 * does not.
 */
export function PopoverMenu({
  trigger,
  triggerClassName = "",
  children,
  placement = "bottom start",
  className = "",
  panelClassName = "",
}: PopoverMenuProps) {
  return (
    <HuiPopover className={className}>
      <PopoverButton className={`cursor-pointer ${triggerClassName}`}>
        {trigger}
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{ to: placement, gap: 8 }}
        className={`z-50 w-72 rounded-box border border-base-300 bg-base-100 p-4 text-base-content shadow-lg
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none ${panelClassName}`}
      >
        {children}
      </PopoverPanel>
    </HuiPopover>
  );
}
