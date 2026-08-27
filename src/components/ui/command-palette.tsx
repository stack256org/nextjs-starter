"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { useEffect, useState, type ReactNode } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { KbdCombo } from "./kbd";

export interface Command {
  id: string;
  label: string;
  /** Groups commands under a heading. */
  group?: string;
  description?: string;
  icon?: ReactNode;
  keywords?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  commands: Command[];
  /** Controlled open state. Omit to let the palette own it via ⌘K / Ctrl-K. */
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
}

/**
 * A ⌘K command palette, built on Headless UI's `Combobox` inside a `Dialog`.
 *
 * The Combobox supplies type-ahead filtering, arrow-key navigation and the
 * `aria-activedescendant` wiring; the Dialog supplies the focus trap, scroll
 * lock and Escape handling. Neither is reimplemented here.
 *
 * Matching covers the label, the group and an optional `keywords` string, so
 * "logout" can find a command labelled "Sign out".
 */
export function CommandPalette({
  commands,
  isOpen,
  onClose,
  placeholder = "Search commands…",
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const controlled = isOpen !== undefined;
  const open = controlled ? isOpen : internalOpen;

  const close = () => {
    setQuery("");
    if (controlled) onClose?.();
    else setInternalOpen(false);
  };

  // Only bind the shortcut when uncontrolled — a controlled palette's owner
  // decides how it opens.
  useEffect(() => {
    if (controlled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setInternalOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [controlled]);

  const filtered =
    query === ""
      ? commands
      : commands.filter((command) =>
          `${command.label} ${command.group ?? ""} ${command.keywords ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

  // Preserve the order commands were declared in, grouped by heading.
  const groups = filtered.reduce<Record<string, Command[]>>((acc, command) => {
    const key = command.group ?? "";
    (acc[key] ??= []).push(command);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-base-content/40 transition-opacity duration-150 data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-start justify-center p-4 pt-[12vh]">
        <DialogPanel
          transition
          className="w-full max-w-lg overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-2xl
            transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          <Combobox
            onChange={(command: Command | null) => {
              if (!command) return;
              close();
              command.onSelect();
            }}
          >
            <div className="flex items-center gap-3 border-b border-base-300 px-4">
              <MagnifyingGlassIcon
                size={17}
                className="shrink-0 text-base-content/50"
                aria-hidden="true"
              />
              {/* `data-autofocus` is Headless UI's own initial-focus hook for
                  a Dialog — it puts the caret here on open without the plain
                  `autoFocus` attribute, which fires before the dialog has
                  finished mounting and which jsx-a11y rightly flags. */}
              <ComboboxInput
                data-autofocus
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 text-sm placeholder:text-base-content/40 focus:outline-none"
              />
              <KbdCombo keys={["Esc"]} />
            </div>

            <ComboboxOptions
              static
              as="ul"
              className="max-h-80 overflow-y-auto p-2"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-base-content/60">
                  Nothing matches “{query}”.
                </li>
              ) : (
                Object.entries(groups).map(([group, items]) => (
                  <li key={group || "ungrouped"}>
                    {group && (
                      <p className="px-3 pt-3 pb-1 text-xs tracking-wide text-base-content/50 uppercase">
                        {group}
                      </p>
                    )}
                    <ul>
                      {items.map((command) => (
                        <ComboboxOption
                          key={command.id}
                          value={command}
                          as="li"
                          className="flex cursor-pointer items-center gap-3 rounded-field px-3 py-2 text-sm data-focus:bg-base-200"
                        >
                          {command.icon && (
                            <span className="shrink-0 text-base-content/60">
                              {command.icon}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">
                              {command.label}
                            </span>
                            {command.description && (
                              <span className="block truncate text-xs text-base-content/60">
                                {command.description}
                              </span>
                            )}
                          </span>
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                ))
              )}
            </ComboboxOptions>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
