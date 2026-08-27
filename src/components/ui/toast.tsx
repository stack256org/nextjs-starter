"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

export type ToastTone = "info" | "success" | "warning" | "error";

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  /** Milliseconds before auto-dismiss. `null` keeps it until dismissed. */
  duration?: number | null;
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const toneConfig = {
  info: { className: "alert-info", Icon: InfoIcon },
  success: { className: "alert-success", Icon: CheckCircleIcon },
  warning: { className: "alert-warning", Icon: WarningIcon },
  error: { className: "alert-error", Icon: XCircleIcon },
} as const;

/** Errors stay until dismissed; everything else clears itself. */
const DEFAULT_DURATION = 5000;

let counter = 0;

/**
 * Transient notifications.
 *
 * Mount `<ToastProvider>` once, high in the tree, then call `useToast()`
 * anywhere beneath it.
 *
 * ```tsx
 * const { toast } = useToast();
 * toast({ tone: "success", title: "Profile updated" });
 * ```
 *
 * Accessibility notes that are easy to get wrong:
 *  - The region is `aria-live="polite"`, so a toast is announced without
 *    interrupting whatever the user is reading. Errors use `role="alert"`,
 *    which does interrupt — appropriate when something failed.
 *  - Focus is never moved to a toast. Stealing focus mid-task is worse than
 *    the toast being missed.
 *  - Errors do not auto-dismiss, because a message you might not have read is
 *    not a message you can act on.
 *
 * A toast is the wrong place for anything the user must act on — put that
 * inline, next to the thing it concerns.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      counter += 1;
      const id = `toast-${counter}`;
      const duration =
        input.duration === undefined
          ? input.tone === "error"
            ? null
            : DEFAULT_DURATION
          : input.duration;

      setToasts((current) => [...current, { ...input, id }]);

      if (duration !== null) {
        setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((item) => {
          const { className, Icon } = toneConfig[item.tone];
          return (
            <div
              key={item.id}
              role={item.tone === "error" ? "alert" : "status"}
              className={`alert ${className} pointer-events-auto w-full max-w-sm shadow-lg`}
            >
              <Icon size={20} aria-hidden="true" className="shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-medium">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-sm opacity-90">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="btn btn-ghost btn-xs btn-circle shrink-0"
                aria-label={`Dismiss: ${item.title}`}
              >
                <XIcon size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
