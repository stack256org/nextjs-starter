"use client";

import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Checkbox,
  Combobox,
  DisclosureGroup,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownSeparator,
  EmptyState,
  FormFieldset,
  Input,
  Modal,
  NativeSelect,
  PopoverMenu,
  RadioGroup,
  Select,
  Skeleton,
  SkeletonTable,
  SkeletonText,
  Tabs,
  Textarea,
  Toggle,
} from "@/components/ui";
import {
  MagnifyingGlassIcon,
  TrayIcon,
  FunnelIcon,
} from "@phosphor-icons/react/dist/ssr";
import { GallerySection, Row } from "./section";

const REGIONS = [
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
];

const TEAM = [
  { value: "amara", label: "Amara Okonkwo", description: "Platform" },
  { value: "hendrik", label: "Hendrik Vasilyev", description: "Billing" },
  { value: "priya", label: "Priya Raghunathan", description: "Infrastructure" },
  { value: "tomasz", label: "Tomasz Wieczorek", description: "Support" },
];

export function Gallery() {
  const [modalOpen, setModalOpen] = useState(false);
  const [notify, setNotify] = useState(true);
  const [region, setRegion] = useState<string | undefined>("eu-west-1");
  const [member, setMember] = useState<string | null>("priya");
  const [plan, setPlan] = useState("team");
  const [email, setEmail] = useState("");

  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Enter a complete email address."
      : undefined;

  return (
    <div className="flex flex-col gap-12">
      {/* ── Buttons ── */}
      <GallerySection
        id="button"
        title="Button"
        description="Headless UI Button with DaisyUI classes. Colour is opt-in — a plain btn is the default, so most buttons on a page pass no variant. ButtonLink renders the same styling as an anchor, because navigation must be a link."
        usage={`<Button variant="primary" loading={saving}>Save</Button>
<ButtonLink href="/dashboard">Dashboard</ButtonLink>`}
      >
        <Row label="Variants">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Status">
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="info">Info</Button>
        </Row>
        <Row label="Sizes">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States">
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button active>Active</Button>
          <ButtonLink href="/ui">As a link</ButtonLink>
          <ButtonLink href="/ui" disabled>
            Disabled link
          </ButtonLink>
        </Row>
      </GallerySection>

      {/* ── Text inputs ── */}
      <GallerySection
        id="input"
        title="Input and Textarea"
        description="Built on Headless UI Field, so the label, description and error text are wired to the control with the right id and aria-describedby. Label above, helper text below, error below that."
        usage={`<Input label="Email" type="email" error={emailError} />`}
      >
        <div className="grid max-w-xl gap-5">
          <Input
            label="Workspace name"
            placeholder="Northwind Logistics"
            description="Shown to everyone you invite."
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            startIcon={<MagnifyingGlassIcon size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <Input label="Disabled" value="Locked value" disabled readOnly />
          <Textarea
            label="Release notes"
            description="Markdown is supported."
            placeholder="Fixed the retry backoff on the email queue."
          />
        </div>
      </GallerySection>

      {/* ── Choice controls ── */}
      <GallerySection
        id="choice"
        title="Checkbox, Radio and Toggle"
        description="DaisyUI's checkbox and toggle classes style a real input[type=checkbox], which Headless UI does not render — so these draw the control from theme tokens instead of borrowing those classes."
        usage={`<Checkbox label="Email me" checked={on} onChange={setOn} />
<RadioGroup variant="card" options={plans} value={plan} onChange={setPlan} />`}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <FormFieldset
            legend="Notifications"
            description="Applies to this workspace only."
          >
            <Checkbox
              label="Deployment failures"
              description="Sent within a minute of a failed run."
              defaultChecked
            />
            <Checkbox
              label="Weekly digest"
              description="Every Monday at 09:00 in your timezone."
            />
            <Checkbox label="Partially selected" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Toggle
              label="Pause all notifications"
              checked={notify}
              onChange={setNotify}
            />
          </FormFieldset>

          <RadioGroup
            variant="card"
            label="Plan"
            value={plan}
            onChange={setPlan}
            options={[
              {
                value: "solo",
                label: "Solo",
                description: "One seat, 5k jobs a month.",
              },
              {
                value: "team",
                label: "Team",
                description: "Up to 12 seats, 120k jobs a month.",
              },
              {
                value: "scale",
                label: "Scale",
                description: "Unlimited seats, dedicated worker pool.",
              },
            ]}
          />
        </div>
      </GallerySection>

      {/* ── Select ── */}
      <GallerySection
        id="select"
        title="Select, NativeSelect and Combobox"
        description="Listbox for rich options, a native select for forms that post natively and for mobile OS pickers, and a Combobox when the list is long enough to need type-ahead."
        usage={`<Select options={regions} value={region} onChange={setRegion} />
<Combobox items={team} value={member} onChange={setMember} />`}
      >
        <div className="grid max-w-xl gap-5">
          <Select
            label="Region (Listbox)"
            options={REGIONS}
            value={region}
            onChange={setRegion}
          />
          <NativeSelect
            label="Region (native select)"
            description="Better on mobile — opens the OS picker."
            options={REGIONS}
            defaultValue="us-east-2"
          />
          <Combobox
            label="Assign to (Combobox)"
            description="Type to filter."
            items={TEAM}
            value={member}
            onChange={setMember}
          />
        </div>
      </GallerySection>

      {/* ── Overlays ── */}
      <GallerySection
        id="overlays"
        title="Dropdown, Popover and Modal"
        description="Dropdown wraps Menu and is for lists of actions — it provides roving-tabindex keyboard navigation. Popover is for rich floating content. Neither uses DaisyUI's dropdown-content class, which is hidden unless its wrapper is in an open state Headless UI never sets."
        usage={`<Dropdown trigger={<Avatar name={user.name} />}>
  <DropdownItem href="/profile">Profile</DropdownItem>
  <DropdownItem onClick={signOut} destructive>Sign out</DropdownItem>
</Dropdown>`}
      >
        <Row>
          <Dropdown label="Actions" triggerClassName="btn" trigger="Actions menu">
            <DropdownHeader>amara@northwind.dev</DropdownHeader>
            <DropdownItem href="/ui">Profile</DropdownItem>
            <DropdownItem href="/ui">Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem destructive>Delete workspace</DropdownItem>
          </Dropdown>

          <PopoverMenu
            triggerClassName="btn"
            trigger={
              <>
                <FunnelIcon size={15} aria-hidden="true" />
                Filters
              </>
            }
          >
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Filter jobs</p>
              <Checkbox label="Failed only" defaultChecked />
              <Checkbox label="Include cancelled" />
              <Input placeholder="Search payload…" size="sm" />
            </div>
          </PopoverMenu>

          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        </Row>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Rotate the signing key?"
          description="Every active session is invalidated. Everyone signs in again."
        >
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="error" onClick={() => setModalOpen(false)}>
              Rotate key
            </Button>
          </div>
        </Modal>
      </GallerySection>

      {/* ── Tabs & disclosure ── */}
      <GallerySection
        id="disclosure"
        title="Tabs and Disclosure"
        description="Headless UI supplies the arrow-key navigation and aria-controls wiring that DaisyUI's CSS-only tabs can't. Disclosure is preferred over DaisyUI's collapse when the panel contains interactive content, because collapse leaves it in the accessibility tree while visually closed."
        usage={`<Tabs items={[{ key: "a", label: "Overview", content: <Overview /> }]} />`}
      >
        <div className="flex flex-col gap-8">
          <Tabs
            items={[
              {
                key: "overview",
                label: "Overview",
                content: (
                  <p className="text-sm text-base-content/70">
                    Arrow keys move between tabs; Home and End jump to the ends.
                  </p>
                ),
              },
              {
                key: "activity",
                label: "Activity",
                content: (
                  <p className="text-sm text-base-content/70">
                    Panels are only mounted when selected.
                  </p>
                ),
              },
              { key: "archived", label: "Archived", content: null, disabled: true },
            ]}
          />

          <DisclosureGroup
            items={[
              {
                key: "retry",
                title: "How do retries work?",
                content:
                  "A handler that throws propagates the error so pgBoss applies its retry policy. Attempts and the retry limit show on each job row in Orbit.",
              },
              {
                key: "worker",
                title: "Why is nothing processing?",
                content:
                  "The worker runs as its own process. pnpm dev starts it alongside the web server; in production run pnpm worker separately.",
              },
            ]}
          />
        </div>
      </GallerySection>

      {/* ── Feedback ── */}
      <GallerySection
        id="feedback"
        title="Alert, Badge and Avatar"
        description="Alerts default to role=status; pass assertive for errors that should interrupt a screen reader. Avatar falls back to initials rather than a generic person icon."
        usage={`<Alert tone="error" title="Couldn't save" assertive>…</Alert>`}
      >
        <div className="flex flex-col gap-4">
          <Alert tone="info" title="Worker restarted">
            Queued jobs resume automatically.
          </Alert>
          <Alert tone="success" title="Profile updated" />
          <Alert tone="warning" title="3 jobs are waiting with no handler">
            Register one in src/lib/queue/worker.ts.
          </Alert>
          <Alert tone="error" title="Connection failed" assertive>
            The database refused the connection. Check DATABASE_URL.
          </Alert>

          <Row label="Badges">
            <Badge>Default</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success">Completed</Badge>
            <Badge tone="warning">Retrying</Badge>
            <Badge tone="error">Failed</Badge>
            <Badge tone="info" outline>
              Outline
            </Badge>
          </Row>

          <Row label="Avatars">
            <Avatar name="Amara Okonkwo" size="xs" />
            <Avatar name="Hendrik Vasilyev" size="sm" />
            <Avatar name="Priya Raghunathan" size="md" />
            <Avatar name="Tomasz Wieczorek" size="lg" shape="squircle" />
            <Avatar
              name="Ingrid Halvorsen"
              size="xl"
              shape="squircle"
              src="https://picsum.photos/seed/ingrid-halvorsen/128/128"
            />
          </Row>
        </div>
      </GallerySection>

      {/* ── Loading & empty ── */}
      <GallerySection
        id="states"
        title="Loading and empty states"
        description="Skeletons match the shape of the content they replace, so nothing reflows when data lands. Empty states say what is missing and how to fix it."
        usage={`export default function Loading() {
  return <SkeletonTable rows={6} columns={5} />;
}`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1">
                <SkeletonText lines={2} />
              </div>
            </div>
            <SkeletonTable rows={3} columns={4} />
          </div>

          <EmptyState
            icon={<TrayIcon size={40} aria-hidden="true" />}
            title="No jobs in this queue"
            description="Jobs appear here as soon as something calls sendJob(). Nothing has been sent to send-email yet."
            action={<Button size="sm">Read the worker guide</Button>}
          />
        </div>
      </GallerySection>
    </div>
  );
}
