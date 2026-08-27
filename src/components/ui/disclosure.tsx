"use client";

import {
  Disclosure as HuiDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

export { HuiDisclosure as Disclosure, DisclosureButton, DisclosurePanel };

export interface DisclosureItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A single expandable section built on Headless UI's `Disclosure`.
 *
 * Preferred over DaisyUI's `collapse` when the content is interactive:
 * `collapse` relies on a hidden checkbox and `peer` selectors, which leaves the
 * panel in the accessibility tree even while visually closed.
 *
 * `overflow-hidden` on the wrapper is load-bearing, not decoration. The button
 * spans the full width, so any background it paints — hover, focus, active —
 * is a square that overlaps the wrapper's rounded corners unless the wrapper
 * clips it. Every rounded container in this set whose children reach its edge
 * carries the same clip.
 */
export function DisclosureItem({
  title,
  children,
  defaultOpen = false,
  className = "",
}: DisclosureItemProps) {
  return (
    <HuiDisclosure
      defaultOpen={defaultOpen}
      as="div"
      className={`overflow-hidden rounded-box border border-base-300 bg-base-100 ${className}`}
    >
      {/* No hover background: the caret rotating on open is the affordance,
          and a full-width colour block on hover reads as heavier than the
          control actually is. */}
      <DisclosureButton className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium">
        {title}
        <CaretDownIcon
          size={16}
          className="shrink-0 opacity-60 transition-transform duration-200 group-data-open:rotate-180"
          aria-hidden="true"
        />
      </DisclosureButton>
      <DisclosurePanel
        transition
        className="overflow-hidden px-4 pb-4 text-sm text-base-content/80
          transition duration-200 ease-out
          data-closed:-translate-y-1 data-closed:opacity-0"
      >
        {children}
      </DisclosurePanel>
    </HuiDisclosure>
  );
}

/** A stack of disclosures sharing one border treatment. */
export function DisclosureGroup({
  items,
  className = "",
}: {
  items: { key: string; title: ReactNode; content: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map((item) => (
        <DisclosureItem key={item.key} title={item.title}>
          {item.content}
        </DisclosureItem>
      ))}
    </div>
  );
}
