"use client";

import { Select as HuiSelect, type SelectProps as HuiSelectProps } from "@headlessui/react";
import type { ReactNode } from "react";
import { FormField } from "./field";

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps
  extends Omit<HuiSelectProps, "className" | "children"> {
  options: NativeSelectOption[];
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  className?: string;
}

/**
 * A DaisyUI-styled native `<select>` built on Headless UI's `Select`.
 *
 * Prefer this over the `Listbox`-based `Select` inside forms that post
 * natively, and on mobile where the OS picker is the better control. Reach for
 * `Listbox` only when options need rich content.
 */
export function NativeSelect({
  options,
  label,
  description,
  error,
  placeholder,
  className = "",
  disabled,
  required,
  ...props
}: NativeSelectProps) {
  const control = (
    <HuiSelect
      invalid={Boolean(error)}
      disabled={disabled}
      required={required}
      className={`select w-full ${error ? "select-error" : ""} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </HuiSelect>
  );

  if (!label && !description && !error) return control;

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
    >
      {control}
    </FormField>
  );
}
