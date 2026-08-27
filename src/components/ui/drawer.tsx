"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Actions pinned to the bottom, outside the scrolling body. */
  footer?: ReactNode;
  side?: "right" | "left";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" } as const;

/**
 * A slide-over panel, built on Headless UI's `Dialog`.
 *
 * Prefer this over a centred modal for editing a record or reviewing detail:
 * it keeps the list behind it visible, so the user does not lose their place.
 * Use `Modal` for a short confirmation that should command full attention.
 *
 * Headless UI supplies the focus trap, Escape handling, scroll lock and
 * `aria-modal` wiring.
 *
 * The body scrolls independently of the footer, so long content never pushes
 * the actions off screen.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
}: DrawerProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-base-content/40 transition-opacity duration-200 data-closed:opacity-0"
      />

      <div
        className={`fixed inset-y-0 flex max-w-full ${side === "right" ? "right-0" : "left-0"}`}
      >
        <DialogPanel
          transition
          className={`flex w-screen ${sizeClasses[size]} flex-col bg-base-100 shadow-xl
            transition duration-200 ease-out
            ${side === "right" ? "data-closed:translate-x-full" : "data-closed:-translate-x-full"}`}
        >
          <header className="flex items-start justify-between gap-4 border-b border-base-300 px-5 py-4">
            <div className="min-w-0">
              {title && (
                <DialogTitle className="font-medium">{title}</DialogTitle>
              )}
              {description && (
                <DialogDescription className="mt-1 text-sm text-base-content/70">
                  {description}
                </DialogDescription>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle shrink-0"
              aria-label="Close"
            >
              <XIcon size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

          {footer && (
            <footer className="flex justify-end gap-2 border-t border-base-300 px-5 py-4">
              {footer}
            </footer>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
