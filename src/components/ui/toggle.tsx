"use client";

import { Switch, type SwitchProps } from "@headlessui/react";

export { Switch };
export type { SwitchProps };

export interface ToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const toggleSizes = {
  sm: { track: "h-5 w-9", knob: "size-3.5", translate: "group-data-checked:translate-x-4", top: "top-0.5 left-0.5" },
  md: { track: "h-6 w-11", knob: "size-4.5", translate: "group-data-checked:translate-x-5", top: "top-0.5 left-0.5" },
  lg: { track: "h-7 w-13", knob: "size-5.5", translate: "group-data-checked:translate-x-6", top: "top-0.5 left-0.5" },
} as const;

export function Toggle({
  label,
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className = "",
}: ToggleProps) {
  const currentSize = toggleSizes[size];

  return (
    <label className={`inline-flex cursor-pointer items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`group relative inline-flex ${currentSize.track} shrink-0 cursor-pointer rounded-full border border-base-300
          transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
          data-checked:bg-primary data-checked:border-primary data-disabled:cursor-not-allowed data-disabled:opacity-50
          bg-base-300`}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        {/* The knob — translated, not the track. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute ${currentSize.top} ${currentSize.knob} rounded-full bg-base-100 shadow-sm
            transition-transform duration-200 ${currentSize.translate}`}
        />
      </Switch>
      {label && <span className="label-text text-sm font-medium">{label}</span>}
    </label>
  );
}
