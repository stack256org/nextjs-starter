"use client";

import { Switch } from "@headlessui/react";

export { Switch };
export type { SwitchProps } from "@headlessui/react";

export interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * A Headless UI `Switch` (toggle) styled with DaisyUI classes.
 *
 * @example
 *   <Toggle
 *     label="Enable notifications"
 *     checked={enabled}
 *     onChange={setEnabled}
 *   />
 */
export function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: ToggleProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {({ checked: isChecked }) => (
          <>
            <span className="sr-only">{label || "Toggle"}</span>
            <span
              className={`inline-block h-5 w-5 transform transition-transform duration-200 ${
                isChecked ? "translate-x-6" : "translate-x-1"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full transition-colors ${
                  isChecked ? "bg-primary" : "bg-base-300"
                }`}
              />
            </span>
          </>
        )}
      </Switch>
      {label && <span className="label-text">{label}</span>}
    </label>
  );
}
