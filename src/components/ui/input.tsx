"use client";

import { Input as HuiInput, type InputProps as HuiInputProps } from "@headlessui/react";
import type { ReactNode } from "react";
import { FormField } from "./field";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<InputSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

export interface InputProps extends Omit<HuiInputProps, "size" | "className"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: InputSize;
  className?: string;
  /** Rendered inside the field, before the text. */
  startIcon?: ReactNode;
}

/**
 * A DaisyUI-styled text input built on Headless UI's `Input`.
 *
 * When wrapped in a `label`/`description`, `Field` handles the id and
 * `aria-describedby` wiring; the visual styling is DaisyUI's `input` class so
 * it tracks the active theme.
 */
const iconPaddingClasses: Record<InputSize, string> = {
  xs: "pl-8",
  sm: "pl-9",
  md: "pl-10",
  lg: "pl-11",
  xl: "pl-12",
};

export function Input({
  label,
  description,
  error,
  size = "md",
  className = "",
  startIcon,
  disabled,
  required,
  ...props
}: InputProps) {
  const control = (
    <div className="relative w-full">
      {startIcon && (
        <span
          className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50"
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )}
      <HuiInput
        invalid={Boolean(error)}
        disabled={disabled}
        required={required}
        className={`input w-full transition-all duration-150 ${sizeClasses[size]} ${
          startIcon ? iconPaddingClasses[size] : ""
        } ${error ? "input-error" : ""} ${className}`}
        {...props}
      />
    </div>
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
