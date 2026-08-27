"use client";

import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@headlessui/react";
import type { ReactNode } from "react";

export { TabGroup, TabList, Tab, TabPanels, TabPanel };

export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  variant?: "border" | "box" | "lift";
  className?: string;
}

const listVariants = {
  border: "tabs-border",
  box: "tabs-box",
  lift: "tabs-lift",
} as const;

/**
 * DaisyUI-styled tabs built on Headless UI's `TabGroup`.
 *
 * Headless UI supplies the roving-tabindex keyboard behaviour (arrow keys,
 * Home/End) and the `aria-selected`/`aria-controls` wiring that DaisyUI's
 * CSS-only tabs don't provide.
 */
export function Tabs({
  items,
  defaultIndex = 0,
  selectedIndex,
  onChange,
  variant = "border",
  className = "",
}: TabsProps) {
  return (
    <TabGroup
      defaultIndex={defaultIndex}
      selectedIndex={selectedIndex}
      onChange={onChange}
      className={className}
    >
      <TabList className={`tabs ${listVariants[variant]}`}>
        {items.map((item) => (
          <Tab
            key={item.key}
            disabled={item.disabled}
            className="tab data-selected:tab-active data-disabled:cursor-not-allowed data-disabled:opacity-50"
          >
            {item.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-4">
        {items.map((item) => (
          <TabPanel key={item.key} className="focus:outline-none">
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
