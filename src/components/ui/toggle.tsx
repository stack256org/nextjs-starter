"use client";

import { Switch, type SwitchProps } from "@headlessui/react";

export { Switch };
export type { SwitchProps };

export interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * A Headless UI `Switch` styled as a DaisyUI toggle.
 *
 * DaisyUI's own `toggle` class targets `input[type=checkbox]`, which Headless
 * UI does not render, so the track and knob are drawn here with DaisyUI theme
 * tokens instead.
 *
 * @example
 *   <Toggle label="Enable notifications" checked={on} onChange={setOn} />
 */
export function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: ToggleProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-base-300
          transition-colors duration-200
          data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50
          bg-base-300`}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        {/* The knob — translated, not the track. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0.5 left-0.5 size-4.5 rounded-full bg-base-100 shadow
            transition-transform duration-200 group-data-checked:translate-x-5"
        />
      </Switch>
      {label && <span className="label-text">{label}</span>}
    </div>
  );
}
