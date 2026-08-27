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
 *  - No native form controls. There is no `<select>`, no bare `<input>` and no
 *    bare `<button>` in the app — every control is a Headless UI primitive so
 *    keyboard behaviour, focus management and ARIA are consistent, and DaisyUI
 *    supplies only the styling.
 */

// ── Layout ────────────────────────────────────────────────────
export { Container } from "./container";
export type { ContainerProps, ContainerSize } from "./container";

export {
  Page,
  PageHeader,
  Section,
  Stack,
  DetailList,
  MetricBand,
} from "./layout";
export type { PageHeaderProps, SectionProps, Gap } from "./layout";

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

export { Combobox } from "./combobox";
export type { ComboboxProps, ComboboxItem } from "./combobox";

export { SearchInput } from "./search-input";
export type { SearchInputProps } from "./search-input";

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

export { Drawer } from "./drawer";
export type { DrawerProps } from "./drawer";

export { Tooltip } from "./tooltip";
export type { TooltipProps } from "./tooltip";

export { ToastProvider, useToast } from "./toast";
export type { Toast, ToastTone } from "./toast";

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

// ── Data display ──────────────────────────────────────────────
export { Table, THead, TBody, TR, TH, TD, TEmpty } from "./table";
export type { THProps, SortDirection } from "./table";

export { Card, CardHeader } from "./card";
export type { CardProps } from "./card";

export { Stat } from "./stat";
export type { StatProps } from "./stat";

export { Progress } from "./progress";
export type { ProgressProps } from "./progress";

export { Steps } from "./steps";
export type { Step } from "./steps";

// ── Navigation ────────────────────────────────────────────────
export { Breadcrumbs } from "./breadcrumbs";
export type { Crumb } from "./breadcrumbs";

export { Pagination } from "./pagination";
export type { PaginationProps } from "./pagination";

export { CommandPalette } from "./command-palette";
export type { Command, CommandPaletteProps } from "./command-palette";

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

export { Tag } from "./tag";
export type { TagProps } from "./tag";

export { Spinner } from "./spinner";
export type { SpinnerProps } from "./spinner";

export { Divider } from "./divider";
export type { DividerProps } from "./divider";

export { Kbd, KbdCombo } from "./kbd";

export { CopyButton } from "./copy-button";
export type { CopyButtonProps } from "./copy-button";
export type {
  AlertProps,
  AlertTone,
  BadgeProps,
  BadgeTone,
  EmptyStateProps,
} from "./feedback";
