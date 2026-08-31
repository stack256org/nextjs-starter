"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  type DialogProps,
} from "@headlessui/react";
import { type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

export { Dialog, DialogPanel, DialogTitle, DialogDescription };
export type { DialogProps };

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

/**
 * A Headless UI `Dialog` styled with DaisyUI classes.
 *
 * Uses the standalone `DialogPanel` / `DialogTitle` components rather than the
 * `Dialog.Panel` dot-notation, which Headless UI v2 deprecated.
 *
 * @example
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
 *     <p>Are you sure?</p>
 *   </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-base-content/40 backdrop-blur-sm transition-opacity duration-150 data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`relative w-full ${sizeClasses[size]} rounded-box border border-[var(--overlay-border)] bg-base-100 p-6 text-base-content shadow-2xl
            transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0`}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>

          {title && (
            <DialogTitle className="mb-2 pr-8 text-lg font-semibold">
              {title}
            </DialogTitle>
          )}
          {description && (
            <DialogDescription className="mb-4 text-sm opacity-70">
              {description}
            </DialogDescription>
          )}

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
