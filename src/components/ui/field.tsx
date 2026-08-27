"use client";

import {
  Field as HuiField,
  Fieldset as HuiFieldset,
  Label as HuiLabel,
  Legend as HuiLegend,
  Description as HuiDescription,
} from "@headlessui/react";
import { useId, type ReactNode } from "react";

export {
  HuiField as Field,
  HuiFieldset as Fieldset,
  HuiLabel as Label,
  HuiLegend as Legend,
  HuiDescription as Description,
};

/**
 * Form field primitives built on Headless UI's `Field`.
 *
 * `Field` wires the label, description and error text to the control with the
 * right `id`/`aria-describedby` automatically, so screen readers announce them
 * together. That is the reason to use it over a hand-rolled `<label>`.
 *
 * Layout follows the house rule: label above the control, helper text below,
 * error text below that.
 */
export interface FormFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  description,
  error,
  required = false,
  disabled = false,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <HuiField disabled={disabled} className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <HuiLabel className="text-sm font-medium text-base-content data-disabled:opacity-50">
          {label}
          {required && (
            <span className="ml-1 text-error" aria-hidden="true">
              *
            </span>
          )}
        </HuiLabel>
      )}

      {children}

      {description && !error && (
        <HuiDescription className="text-xs text-base-content/60">
          {description}
        </HuiDescription>
      )}

      {error && (
        <p className="text-xs font-medium text-error" role="alert">
          {error}
        </p>
      )}
    </HuiField>
  );
}

/**
 * A titled group of related fields.
 *
 * The group description is a plain `<p>` wired up with `aria-describedby`,
 * NOT Headless UI's `<Description>`: `Fieldset` provides a Label context but
 * no Description context, so a `<Description>` placed directly inside one
 * throws "not inside a relevant parent". Only `Field` provides that context.
 */
export function FormFieldset({
  legend,
  description,
  children,
  className = "",
}: {
  legend: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const descriptionId = useId();

  return (
    <HuiFieldset
      aria-describedby={description ? descriptionId : undefined}
      className={`flex flex-col gap-4 ${className}`}
    >
      <div className="flex flex-col gap-1">
        <HuiLegend className="text-sm font-semibold text-base-content">
          {legend}
        </HuiLegend>
        {description && (
          <p id={descriptionId} className="text-xs text-base-content/60">
            {description}
          </p>
        )}
      </div>
      {children}
    </HuiFieldset>
  );
}
