/**
 * The shared component set — Headless UI primitives styled with DaisyUI.
 *
 * Everything here is documented and demoed at /ui.
 *
 * Design rules these components follow:
 *  - Colour comes from DaisyUI semantic tokens (`primary`, `base-200`,
 *    `error`, …), never hard-coded hex. Swapping the theme restyles them all.
 *  - Behaviour comes from Headless UI, so keyboard navigation, focus
 *    management and ARIA wiring are handled rather than reimplemented.
 *  - DaisyUI classes that depend on a hidden `input` (`dropdown-content`,
 *    `collapse`, `checkbox`, `toggle`) are NOT reused, because Headless UI
 *    renders its own markup and the two open/closed models fight each other.
 */

// ── Actions ───────────────────────────────────────────────────
export { Button, ButtonLink } from "./button";
export type { ButtonProps, ButtonLinkProps, ButtonVariant, ButtonSize } from "./button";

// ── Form fields ───────────────────────────────────────────────
export {
  FormField,
  FormFieldset,
  Field,
  Fieldset,
  Label,
  Legend,
  Description,
} from "./field";
export type { FormFieldProps } from "./field";

export { Input } from "./input";
export type { InputProps, InputSize } from "./input";

export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";

export { Checkbox } from "./checkbox";
export type { CheckboxProps } from "./checkbox";

export { RadioGroup } from "./radio-group";
export type { RadioGroupProps, RadioOption } from "./radio-group";

export { Toggle, Switch } from "./toggle";
export type { ToggleProps, SwitchProps } from "./toggle";

export { Select, Listbox } from "./select";
export type { SelectProps, SelectOption } from "./select";

export { NativeSelect } from "./native-select";
export type { NativeSelectProps, NativeSelectOption } from "./native-select";

export { Combobox } from "./combobox";
export type { ComboboxProps, ComboboxItem } from "./combobox";

// ── Overlays ──────────────────────────────────────────────────
export {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "./dropdown";
export type { DropdownProps, DropdownItemProps } from "./dropdown";

export { Modal, Dialog, DialogPanel, DialogTitle, DialogDescription } from "./modal";
export type { ModalProps } from "./modal";

export { PopoverMenu, Popover, PopoverButton, PopoverPanel, PopoverGroup } from "./popover";
export type { PopoverMenuProps } from "./popover";

// ── Disclosure & navigation ───────────────────────────────────
export { Tabs, TabGroup, TabList, Tab, TabPanels, TabPanel } from "./tabs";
export type { TabsProps, TabItem } from "./tabs";

export {
  DisclosureItem,
  DisclosureGroup,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "./disclosure";
export type { DisclosureItemProps } from "./disclosure";

// ── Display & feedback ────────────────────────────────────────
export { Avatar } from "./avatar";
export type { AvatarProps, AvatarSize } from "./avatar";

export {
  Alert,
  Badge,
  Skeleton,
  SkeletonText,
  SkeletonTable,
  EmptyState,
} from "./feedback";
export type {
  AlertProps,
  AlertTone,
  BadgeProps,
  BadgeTone,
  EmptyStateProps,
} from "./feedback";
