"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { type ReactNode } from "react";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { FormField } from "./field";

export { Listbox };

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
}

const selectSizeClasses: Record<NonNullable<SelectProps["size"]>, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "select-md",
  lg: "select-lg",
  xl: "select-xl",
};

/**
 * A DaisyUI-styled `Listbox` — the app's only select control.
 *
 * There is deliberately no native `<select>` wrapper: a native control cannot
 * render rich options, cannot be styled consistently across browsers, and
 * would be the one component in the set not built on Headless UI.
 *
 * Two DaisyUI details this works around:
 *  - `.select` already draws its own chevron with a background gradient, so
 *    adding an icon here would render two.
 *  - `dropdown-content` is only positioned inside a `.dropdown` wrapper and is
 *    hidden unless that wrapper is in an open state Headless UI never sets, so
 *    the panel is positioned with Headless UI's `anchor` instead.
 */
export function Select({
  label,
  description,
  error,
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
  size = "md",
  disabled = false,
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  const control = (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        className={`select w-full text-left ${selectSizeClasses[size]} ${
          error ? "select-error" : ""
        } ${className}`}
      >
        <span className={`truncate ${selectedOption ? "" : "opacity-50"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </ListboxButton>

      <ListboxOptions
        as="ul"
        transition
        anchor={{ to: "bottom start", gap: 4 }}
        className="menu z-50 max-h-72 w-[var(--button-width)] overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-lg
          transition duration-100 ease-out
          data-closed:scale-95 data-closed:opacity-0
          focus:outline-none"
      >
        {options.map((option) => (
          <ListboxOption
            key={option.value}
            as="li"
            value={option.value}
            disabled={option.disabled}
          >
            {({ selected }) => (
              <span className="flex items-center gap-2">
                <CheckIcon
                  size={14}
                  className={selected ? "opacity-100" : "opacity-0"}
                  aria-hidden="true"
                />
                <span className="truncate">{option.label}</span>
              </span>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );

  if (!label && !description && !error) return control;

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      disabled={disabled}
    >
      {control}
    </FormField>
  );
}
