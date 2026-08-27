"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  CommandPalette,
  CopyButton,
  Divider,
  Drawer,
  Input,
  Kbd,
  KbdCombo,
  Pagination,
  Progress,
  SearchInput,
  Spinner,
  Stat,
  Steps,
  Table,
  TBody,
  TD,
  TEmpty,
  TH,
  THead,
  Tag,
  Tooltip,
  TR,
  ToastProvider,
  useToast,
  type SortDirection,
} from "@/components/ui";
import {
  GearSixIcon,
  InfoIcon,
  StackIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import { GallerySection, Row } from "./section";

const DEPLOYS = [
  { id: "d-4821", env: "production", by: "Amara Okonkwo", ms: 47_200, status: "live" },
  { id: "d-4820", env: "staging", by: "Hendrik Vasilyev", ms: 12_840, status: "live" },
  { id: "d-4819", env: "production", by: "Priya Raghunathan", ms: 91_060, status: "rolled back" },
];

export function GalleryExtra() {
  return (
    <ToastProvider>
      <ExtraSections />
    </ToastProvider>
  );
}

function ExtraSections() {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortDirection>("desc");
  const [tags, setTags] = useState(["production", "eu-west-1", "worker"]);

  return (
    <>
      {/* ── Table ── */}
      <GallerySection
        id="table"
        title="Table"
        description="A scroll container, a clipped rounded surface and sortable headers. The wrapper's overflow is what lets a wide table scroll inside its own box instead of making the page scroll sideways — and it doubles as the clip that keeps row backgrounds inside the rounded corners."
        usage={`<Table>
  <THead><TR><TH sortable sorted={sort} onSort={toggle}>Duration</TH></TR></THead>
  <TBody>…</TBody>
</Table>`}
      >
        <Table>
          <THead>
            <TR>
              <TH>Deploy</TH>
              <TH>Environment</TH>
              <TH>Triggered by</TH>
              <TH
                align="right"
                sortable
                sorted={sort}
                onSort={() => setSort(sort === "asc" ? "desc" : "asc")}
              >
                Duration
              </TH>
              <TH align="right" srOnlyLabel="Status" />
            </TR>
          </THead>
          <TBody>
            {DEPLOYS.map((d) => (
              <TR key={d.id} interactive>
                <TD className="font-mono text-xs">{d.id}</TD>
                <TD>{d.env}</TD>
                <TD>{d.by}</TD>
                <TD align="right" numeric>
                  {(d.ms / 1000).toFixed(1)}s
                </TD>
                <TD align="right">
                  <Badge tone={d.status === "live" ? "success" : "warning"}>
                    {d.status}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        <p className="mt-4 mb-2 text-xs tracking-wide text-base-content/50 uppercase">
          Empty state, keeping the header
        </p>
        <Table size="sm">
          <THead>
            <TR>
              <TH>Deploy</TH>
              <TH>Environment</TH>
            </TR>
          </THead>
          <TBody>
            <TEmpty colSpan={2}>No deploys in the last 30 days.</TEmpty>
          </TBody>
        </Table>
      </GallerySection>

      {/* ── Cards & metrics ── */}
      <GallerySection
        id="surfaces"
        title="Card, Stat and Divider"
        description="Use a card only when elevation means something — a thing sitting above the page. For peers in a list, rules and whitespace read better and weigh less. Stat pairs its trend colour with an arrow, because colour alone doesn't convey direction to a colour-blind reader."
        usage={`<Card><CardHeader title="Usage" actions={…} /></Card>
<Stat label="Error rate" value="0.42%" change={-18} goodWhen="down" />`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader
              title="Worker throughput"
              description="Jobs completed in the last hour."
              actions={<Button size="xs">Details</Button>}
            />
            <Divider className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Completed" value="1,284" change={12} hint="vs. last hour" />
              <Stat
                label="Error rate"
                value="0.42%"
                change={-18}
                goodWhen="down"
                hint="vs. last hour"
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Storage" description="Across all regions." />
            <div className="mt-5 flex flex-col gap-4">
              <Progress label="eu-west-1" value={73} showValue />
              <Progress label="us-east-2" value={41} showValue tone="success" />
              <Progress label="ap-south-1" value={94} showValue tone="warning" />
              <Divider>indeterminate</Divider>
              <Progress label="Rebuilding index" />
            </div>
          </Card>
        </div>
      </GallerySection>

      {/* ── Navigation ── */}
      <GallerySection
        id="navigation"
        title="Breadcrumbs, Pagination and Steps"
        description="Pagination renders links, not buttons — so every page is shareable, opens in a new tab and works with the back button. The final breadcrumb is plain text with aria-current, not a link to the page you're already on."
        usage={`<Breadcrumbs items={[{ label: "Orbit", href: "/orbit" }, { label: "Users" }]} />
<Pagination page={2} totalPages={9} buildHref={(p) => \`?page=\${p}\`} />`}
      >
        <div className="flex flex-col gap-8">
          <Breadcrumbs
            items={[
              { label: "Orbit", href: "/orbit" },
              { label: "Queues", href: "/orbit/queues" },
              { label: "send-email" },
            ]}
          />
          <Steps
            current={1}
            steps={[
              { label: "Connect database", description: "Postgres 14+" },
              { label: "Run migrations", description: "pnpm db:migrate" },
              { label: "Create an admin", description: "pnpm make:admin" },
            ]}
          />
          <Pagination
            page={2}
            totalPages={9}
            totalItems={214}
            itemNoun="deploy"
            buildHref={(p) => `/ui?page=${p}`}
          />
        </div>
      </GallerySection>

      {/* ── Overlays ── */}
      <GallerySection
        id="overlays-2"
        title="Drawer, Tooltip and Command palette"
        description="A drawer keeps the list behind it visible, so use it for editing a record; keep the centred Modal for a short confirmation. The command palette is a Headless UI Combobox inside a Dialog — type-ahead and arrow keys from one, focus trap and scroll lock from the other."
        usage={`<Drawer isOpen={open} onClose={close} title="Edit user" footer={…}>…</Drawer>
<Tooltip label="Runs every 5 minutes"><Badge>cron</Badge></Tooltip>`}
      >
        <Row>
          <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Button onClick={() => setPaletteOpen(true)}>
            Command palette <KbdCombo keys={["⌘", "K"]} />
          </Button>
          {/* Inert child, so the wrapper takes the tab stop (the default). */}
          <Tooltip label="Reachable by keyboard: tab to this badge">
            <Badge tone="info">Hover or tab to me</Badge>
          </Tooltip>
          {/* Already-focusable child, so no second tab stop. */}
          <Tooltip label="No extra tab stop — the button is the trigger" focusable={false}>
            <Button size="sm">Button with a tooltip</Button>
          </Tooltip>
        </Row>

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Edit deploy target"
          description="The list stays visible behind the panel."
          footer={
            <>
              <Button size="sm" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setDrawerOpen(false);
                  toast({ tone: "success", title: "Deploy target saved" });
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-5">
            <Input label="Target name" defaultValue="production-eu" />
            <Input label="Region" defaultValue="eu-west-1" />
            <Alert tone="warning" title="This target serves live traffic">
              Changes apply on the next deploy.
            </Alert>
          </div>
        </Drawer>

        <CommandPalette
          isOpen={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          commands={[
            {
              id: "users",
              group: "Navigate",
              label: "Users",
              icon: <UsersIcon size={16} />,
              onSelect: () => toast({ tone: "info", title: "Would open Users" }),
            },
            {
              id: "queues",
              group: "Navigate",
              label: "Queues",
              icon: <StackIcon size={16} />,
              onSelect: () => toast({ tone: "info", title: "Would open Queues" }),
            },
            {
              id: "settings",
              group: "Account",
              label: "Settings",
              keywords: "theme preferences appearance",
              icon: <GearSixIcon size={16} />,
              onSelect: () => toast({ tone: "info", title: "Would open Settings" }),
            },
          ]}
        />
      </GallerySection>

      {/* ── Toast ── */}
      <GallerySection
        id="toast"
        title="Toast"
        description="Announced through an aria-live region, so a screen reader hears it without losing its place. Errors use role=alert and do not auto-dismiss — a message you might not have read isn't one you can act on. Focus is never moved to a toast."
        usage={`const { toast } = useToast();
toast({ tone: "success", title: "Profile updated" });`}
      >
        <Row>
          <Button onClick={() => toast({ tone: "success", title: "Profile updated" })}>
            Success
          </Button>
          <Button
            onClick={() =>
              toast({
                tone: "info",
                title: "Worker restarted",
                description: "Queued jobs resume automatically.",
              })
            }
          >
            Info
          </Button>
          <Button
            onClick={() =>
              toast({ tone: "warning", title: "3 jobs waiting with no handler" })
            }
          >
            Warning
          </Button>
          <Button
            variant="error"
            onClick={() =>
              toast({
                tone: "error",
                title: "Connection failed",
                description: "The database refused the connection.",
              })
            }
          >
            Error (stays)
          </Button>
        </Row>
      </GallerySection>

      {/* ── Small parts ── */}
      <GallerySection
        id="small"
        title="Search, Tag, Spinner, Kbd and Copy"
        description="SearchInput debounces the callback while keeping the field itself instantly responsive. Tag is removable; Badge is read-only status — if it can be dismissed it's a Tag."
        usage={`<SearchInput value={query} onChange={setQuery} debounceMs={250} />
<Tag onRemove={() => remove(t)} label={t}>{t}</Tag>`}
      >
        <div className="flex flex-col gap-6">
          <div className="max-w-sm">
            <SearchInput value={query} onChange={setQuery} placeholder="Search deploys…" />
            <p className="mt-2 text-xs text-base-content/60">
              Debounced value: <span className="font-mono">{query || "—"}</span>
            </p>
          </div>

          <Row label="Tags">
            {tags.length === 0 ? (
              <span className="text-sm text-base-content/60">All removed.</span>
            ) : (
              tags.map((t) => (
                <Tag
                  key={t}
                  label={t}
                  onRemove={() => setTags(tags.filter((x) => x !== t))}
                >
                  {t}
                </Tag>
              ))
            )}
            {tags.length < 3 && (
              <Button
                size="xs"
                onClick={() => setTags(["production", "eu-west-1", "worker"])}
              >
                Reset
              </Button>
            )}
          </Row>

          <Row label="Spinner">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <span className="text-sm text-base-content/60">
              Prefer Skeleton when you know the shape of what's loading.
            </span>
          </Row>

          <Row label="Keyboard">
            <KbdCombo keys={["⌘", "K"]} />
            <KbdCombo keys={["Ctrl", "Shift", "P"]} />
            <Kbd>Esc</Kbd>
          </Row>

          <Row label="Copy to clipboard">
            <code className="rounded-field bg-base-200 px-2.5 py-1.5 font-mono text-xs">
              pnpm make:admin you@example.com
            </code>
            <CopyButton
              value="pnpm make:admin you@example.com"
              label="command"
            />
          </Row>

          <Row label="Divider">
            <div className="w-full max-w-sm">
              <Divider>or</Divider>
            </div>
          </Row>

          <Row label="Info">
            <InfoIcon size={16} className="text-base-content/50" aria-hidden="true" />
            <span className="text-sm text-base-content/60">
              Every component here is a Headless UI primitive styled with DaisyUI tokens.
            </span>
          </Row>
        </div>
      </GallerySection>
    </>
  );
}
