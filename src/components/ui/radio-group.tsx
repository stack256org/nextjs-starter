"use client";

import {
  RadioGroup as HuiRadioGroup,
  Radio,
  Field,
  Label,
  Description,
} from "@headlessui/react";
import type { ReactNode } from "react";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  label?: ReactNode;
  name?: string;
  disabled?: boolean;
  className?: string;
  /** `card` gives each option a selectable surface; `inline` is a plain list. */
  variant?: "inline" | "card";
}

/** A DaisyUI-styled radio group built on Headless UI's `RadioGroup`. */
export function RadioGroup({
  value,
  defaultValue,
  onChange,
  options,
  label,
  name,
  disabled = false,
  className = "",
  variant = "inline",
}: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-base-content">{label}</span>
      )}

      <HuiRadioGroup
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className={variant === "card" ? "grid gap-2" : "flex flex-col gap-3"}
      >
        {options.map((option) => (
          <Field
            key={option.value}
            disabled={option.disabled}
            className={
              variant === "card"
                ? "has-data-checked:border-primary has-data-checked:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition-colors duration-150 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                : "flex items-start gap-3"
            }
          >
            <Radio
              value={option.value}
              className="group mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-base-content/30 bg-base-100
                transition-colors duration-150
                data-checked:border-primary
                data-disabled:cursor-not-allowed data-disabled:opacity-50"
            >
              <span
                className="size-2.5 rounded-full bg-primary opacity-0 transition-opacity duration-150 group-data-checked:opacity-100"
                aria-hidden="true"
              />
            </Radio>
            <div className="flex flex-col gap-0.5">
              <Label className="cursor-pointer text-sm font-medium">
                {option.label}
              </Label>
              {option.description && (
                <Description className="text-xs text-base-content/60">
                  {option.description}
                </Description>
              )}
            </div>
          </Field>
        ))}
      </HuiRadioGroup>
    </div>
  );
}
