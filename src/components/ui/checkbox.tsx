"use client";

import { Checkbox as HuiCheckbox, Field, Label, Description } from "@headlessui/react";
import type { ReactNode } from "react";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react/dist/ssr";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

/**
 * A DaisyUI-styled checkbox built on Headless UI's `Checkbox`.
 *
 * DaisyUI's `checkbox` class targets a real `input[type=checkbox]`, which
 * Headless UI renders as a `<span role="checkbox">` — so the box is drawn here
 * with theme tokens rather than by borrowing that class.
 */
export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  onChange,
  label,
  description,
  disabled = false,
  name,
  value,
  className = "",
}: CheckboxProps) {
  const box = (
    <HuiCheckbox
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      onChange={onChange}
      disabled={disabled}
      name={name}
      value={value}
      className="group flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-selector border border-base-content/30 bg-base-100
        transition-all duration-150 active:scale-95
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
        data-checked:border-primary data-checked:bg-primary
        data-indeterminate:border-primary data-indeterminate:bg-primary
        data-disabled:cursor-not-allowed data-disabled:opacity-50"
    >
      {indeterminate ? (
        <MinusIcon
          size={13}
          weight="bold"
          className="text-primary-content opacity-0 group-data-indeterminate:opacity-100"
          aria-hidden="true"
        />
      ) : (
        <CheckIcon
          size={13}
          weight="bold"
          className="text-primary-content opacity-0 group-data-checked:opacity-100"
          aria-hidden="true"
        />
      )}
    </HuiCheckbox>
  );

  if (!label && !description) {
    return <div className={className}>{box}</div>;
  }

  return (
    <Field
      disabled={disabled}
      className={`flex items-start gap-3 ${className}`}
    >
      {box}
      <div className="flex flex-col gap-0.5">
        {label && (
          <Label className="cursor-pointer text-sm font-medium data-disabled:cursor-not-allowed data-disabled:opacity-50">
            {label}
          </Label>
        )}
        {description && (
          <Description className="text-xs text-base-content/60">
            {description}
          </Description>
        )}
      </div>
    </Field>
  );
}
