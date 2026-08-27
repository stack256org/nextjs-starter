"use client";

import { Input as HuiInput } from "@headlessui/react";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

export interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Milliseconds to wait before firing `onChange`. 0 disables debouncing. */
  debounceMs?: number;
  label?: string;
  className?: string;
}

/**
 * A search field with a clear button and built-in debouncing.
 *
 * `type="search"` gives mobile keyboards a Search key. The debounce keeps a
 * keystroke from firing a request per character; the input itself stays fully
 * responsive because the visible value is local state.
 */
export function SearchInput({
  value = "",
  onChange,
  placeholder = "Search…",
  debounceMs = 250,
  label = "Search",
  className = "",
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // Keep in step when the parent resets the value (a cleared filter, say).
  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    if (local === value) return;
    if (debounceMs === 0) {
      onChange(local);
      return;
    }
    const timer = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(timer);
    // `value` is intentionally excluded: including it would restart the timer
    // when the parent echoes the value back, debouncing forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs, onChange]);

  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50"
        aria-hidden="true"
      />
      <HuiInput
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="input w-full pr-9 pl-9"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            onChange("");
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-base-content/50 transition-colors hover:bg-base-200 hover:text-base-content"
        >
          <XIcon size={12} weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
