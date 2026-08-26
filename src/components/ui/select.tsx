"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { type ReactNode } from "react";

export { Listbox };

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  label?: ReactNode;
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
 * A Headless UI `Listbox` (select) styled with DaisyUI classes.
 *
 * Usage:
 *   <Select
 *     value={role}
 *     onChange={setRole}
 *     options={[
 *       { value: "user", label: "User" },
 *       { value: "admin", label: "Admin" },
 *     ]}
 *   />
 */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  size = "md",
  disabled = false,
}: SelectProps) {
  const sizeClass = selectSizeClasses[size];
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="form-control w-full">
      {label && <label className="label">{label}</label>}
      <Listbox value={value ?? undefined} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={`select w-full ${sizeClass} ${className} flex justify-between items-center`}
          >
            <span className={`truncate ${!selectedOption ? "opacity-50" : ""}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {/* Chevron down icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-50 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </ListboxButton>

          <ListboxOptions
            as="ul"
            className="menu dropdown-content bg-base-100 text-base-content rounded-box z-[100] mt-1 min-w-full p-2 shadow-lg border border-base-200"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                as="li"
                value={option.value}
                disabled={option.disabled}
                className="menu-item"
              >
                {({ selected }) => (
                  <>
                    {selected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span className="truncate">{option.label}</span>
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
