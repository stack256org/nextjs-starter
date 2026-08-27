"use client";

import {
  Combobox as HuiCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, type ReactNode } from "react";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { FormField } from "./field";

export interface ComboboxItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  items: ComboboxItem[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Shown when the query matches nothing. */
  emptyMessage?: string;
}

/**
 * A type-ahead select built on Headless UI's `Combobox`.
 *
 * Filtering is done in the component over the `items` prop. For a large or
 * remote dataset, filter upstream and pass the already-narrowed list in.
 */
export function Combobox({
  items,
  value = null,
  onChange,
  label,
  description,
  error,
  placeholder = "Search…",
  disabled = false,
  className = "",
  emptyMessage = "No matches.",
}: ComboboxProps) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        );

  const control = (
    <HuiCombobox
      value={value}
      onChange={onChange}
      disabled={disabled}
      onClose={() => setQuery("")}
      immediate
    >
      <div className="relative">
        <ComboboxInput
          className={`input w-full pr-10 ${error ? "input-error" : ""}`}
          placeholder={placeholder}
          displayValue={(v: string | null) =>
            items.find((item) => item.value === v)?.label ?? ""
          }
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
          <CaretUpDownIcon
            size={16}
            className="opacity-50"
            aria-hidden="true"
          />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        transition
        anchor={{ to: "bottom start", gap: 4 }}
        className="menu z-50 max-h-64 w-[var(--input-width)] overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-lg
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none"
        as="ul"
      >
        {filtered.length === 0 ? (
          <li className="px-3 py-2 text-sm text-base-content/60">
            {emptyMessage}
          </li>
        ) : (
          filtered.map((item) => (
            <ComboboxOption
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              as="li"
            >
              {({ selected }) => (
                <span className="flex items-start gap-2">
                  <CheckIcon
                    size={14}
                    className={`mt-0.5 shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                    aria-hidden="true"
                  />
                  <span className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs opacity-60">
                        {item.description}
                      </span>
                    )}
                  </span>
                </span>
              )}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </HuiCombobox>
  );

  if (!label && !description && !error) return <div className={className}>{control}</div>;

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      disabled={disabled}
      className={className}
    >
      {control}
    </FormField>
  );
}
