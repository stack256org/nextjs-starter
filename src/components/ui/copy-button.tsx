"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./button";

export interface CopyButtonProps {
  value: string;
  /** Names the thing being copied, e.g. "API key". */
  label?: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

/**
 * Copies a value to the clipboard and confirms it inline.
 *
 * The confirmation is in the button itself rather than a toast — feedback
 * belongs next to the action that caused it, and a toast for something this
 * small is noise. The tick reverts after two seconds.
 *
 * `navigator.clipboard` requires a secure context (https or localhost) and
 * can be blocked by permissions, so the failure path is handled rather than
 * left to throw.
 */
export function CopyButton({
  value,
  label = "value",
  size = "sm",
  className = "",
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleCopy}
      aria-label={state === "copied" ? `${label} copied` : `Copy ${label}`}
      className={className}
    >
      {state === "copied" ? (
        <CheckIcon size={14} className="text-success" aria-hidden="true" />
      ) : (
        <CopyIcon size={14} aria-hidden="true" />
      )}
      <span aria-hidden="true">
        {state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy"}
      </span>
    </Button>
  );
}
