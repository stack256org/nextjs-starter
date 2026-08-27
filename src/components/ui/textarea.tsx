"use client";

import {
  Textarea as HuiTextarea,
  type TextareaProps as HuiTextareaProps,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { FormField } from "./field";

export interface TextareaProps extends Omit<HuiTextareaProps, "className"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  className?: string;
}

/** A DaisyUI-styled multi-line input built on Headless UI's `Textarea`. */
export function Textarea({
  label,
  description,
  error,
  className = "",
  disabled,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
  const control = (
    <HuiTextarea
      invalid={Boolean(error)}
      disabled={disabled}
      required={required}
      rows={rows}
      className={`textarea w-full ${error ? "textarea-error" : ""} ${className}`}
      {...props}
    />
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
