"use client";

import {
  Dialog,
  type DialogProps,
} from "@headlessui/react";
import { type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

export { Dialog };
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
 * A Headless UI `Dialog` (modal) styled with DaisyUI classes.
 *
 * Usage:
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
  const sizeClass = sizeClasses[size];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-base-content/30" aria-hidden="true" />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`relative w-full ${sizeClass} rounded-box bg-base-100 p-6 shadow-xl`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>

          {title && (
            <Dialog.Title className="text-lg font-semibold mb-2">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-sm opacity-70 mb-4">
              {description}
            </Dialog.Description>
          )}

          <div className="text-base-content">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
