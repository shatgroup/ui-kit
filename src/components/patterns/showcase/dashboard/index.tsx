/* Nguồn: shadcn/ui apps/v4/registry/bases/base/blocks/dashboard-01 (MIT)
   và tweakcn chart-pie-donut / chart-bar-mixed (Apache-2.0).
   Sidebar giữ AppShell của kit. Bảng kéo thả dùng @dnd-kit. */
import { useMemo, useState, type ReactNode } from "react"
import {
  BarChart3Icon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AppShell, type AppNavGroup } from "@/components/patterns/app-shell.tsx"
import { DataTable, type DataColumn } from "@/components/patterns/data-table.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { BarMixed, PieDonut, VisitorsChart } from "./charts.tsx"
import { documents, type DocumentRow } from "@/fixtures/documents.ts"

const GROUPS: AppNavGroup[] = [
  {
    label: "Platform",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
      { id: "lifecycle", label: "Lifecycle", icon: ListIcon },
      { id: "analytics", label: "Analytics", icon: BarChart3Icon },
      { id: "projects", label: "Projects", icon: FolderIcon },
      { id: "team", label: "Team", icon: UsersIcon },
    ],
  },
  {
    label: "Documents",
    items: [
      { id: "library", label: "Data Library", icon: DatabaseIcon },
      { id: "reports", label: "Reports", icon: FileTextIcon },
      { id: "assistant", label: "Word Assistant", icon: FileTextIcon },
    ],
  },
  {
    label: "More",
    items: [
      { id: "settings", label: "Settings", icon: SettingsIcon },
      { id: "help", label: "Get Help", icon: LifeBuoyIcon },
      { id: "search", label: "Search", icon: SearchIcon },
    ],
  },
]

const STATS = [
  { label: "Total Revenue", value: "$1,250.00", delta: "+12.5%", trend: "up" as const, line: "Trending up this month", note: "Visitors for the last 6 months" },
  { label: "New Customers", value: "1,234", delta: "-20%", trend: "down" as const, line: "Down 20% this period", note: "Acquisition needs attention" },
  { label: "Active Accounts", value: "45,678", delta: "+12.5%", trend: "up" as const, line: "Strong user retention", note: "Engagement exceed targets" },
  { label: "Growth Rate", value: "4.5%", delta: "+4.5%", trend: "up" as const, line: "Steady performance increase", note: "Meets growth projections" },
]

const REVIEWERS = ["Eddie Lake", "Jamik Tashpulatov", "Assign reviewer"]

export function ShowcaseDashboard({ leading, topbar }: { leading: ReactNode; topbar?: ReactNode }) {
  const [menu, setMenu] = useState("dashboard")
  return (
    <AppShell
      logo={<Text weight="semibold">Acme Inc.</Text>}
      mark={<Text size="sm" weight="semibold">AI</Text>}
      groups={GROUPS}
      activeId={menu}
      onNavigate={setMenu}
      leading={leading}
      topbar={topbar}
      maxWidth={false}
      inset
      title="Documents"
      account={{ name: "shadcn", email: "m@example.com" }}
      sidebarAction={
        <Button className="w-full">
          <PlusIcon />
          Quick Create
        </Button>
      }
    >
      <div data-showcase="">
      <Stack gap={4} className="@container py-4">
        <Grid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
          {STATS.map((item) => (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              delta={item.delta}
              direction={item.trend}
              line={item.line}
              note={item.note}
              wash
            />
          ))}
        </Grid>
        <VisitorsChart />
        <DocumentTable />
        <Grid columns={{ base: 1, lg: 2 }} gap={4}>
          <PieDonut />
          <BarMixed />
        </Grid>
      </Stack>
      </div>
    </AppShell>
  )
}

function DocumentTable() {
  const [rows, setRows] = useState(documents)
  const [tab, setTab] = useState("outline")
  const columns = useMemo<DataColumn<DocumentRow>[]>(() => [
    { id: "header", header: "Header", accessor: (row) => row.header, minWidth: 180, grow: true },
    { id: "type", header: "Section Type", accessor: (row) => row.type, minWidth: 140, cell: (row) => <Badge variant="outline">{row.type}</Badge> },
    {
      id: "target",
      header: "Target",
      accessor: (row) => row.target,
      minWidth: 96,
      numeric: true,
      editable: "number",
      editLabel: (row) => `Target ${row.header}`,
    },
    {
      id: "limit",
      header: "Limit",
      accessor: (row) => row.limit,
      minWidth: 96,
      numeric: true,
      editable: "number",
      editLabel: (row) => `Limit ${row.header}`,
    },
    {
      id: "reviewer",
      header: "Reviewer",
      accessor: (row) => row.reviewer,
      minWidth: 180,
      cell: (row) =>
        row.reviewer === "Assign reviewer" ? (
          <Select
            value={row.reviewer}
            onValueChange={(value) =>
              setRows((current) => current.map((item) => (item.id === row.id ? { ...item, reviewer: value ?? item.reviewer } : item)))
            }
          >
            <SelectTrigger size="sm" className="w-40" aria-label={`Reviewer ${row.header}`}>
              <span>Assign reviewer</span>
            </SelectTrigger>
            <SelectContent>
              {REVIEWERS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          row.reviewer
        ),
    },
  ], [])

  return (
    <Tabs value={tab} onValueChange={setTab}>
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(row) => String(row.id)}
          selectable
          selectColumn
          reorderable
          columnVisibility
          framed
          pageSizes={["10", "20", "30", "40", "50"]}
          onReorder={(ids) => {
            setRows((current) => {
              const byId = new Map(current.map((row) => [String(row.id), row]))
              return ids.flatMap((id) => {
                const row = byId.get(id)
                return row ? [row] : []
              })
            })
          }}
          onCellChange={(row, columnId, value) => {
            setRows((current) =>
              current.map((item) => {
                if (item.id !== row.id) return item
                if (columnId === "target") return { ...item, target: value }
                if (columnId === "limit") return { ...item, limit: value }
                if (columnId === "reviewer") return { ...item, reviewer: value }
                return item
              }),
            )
          }}
          rowActions={(row) => [
            { id: "edit", label: "Edit" },
            { id: "delete", label: "Delete", onSelect: () => setRows((current) => current.filter((item) => item.id !== row.id)) },
          ]}
          actionLabel={(row) => `Actions ${row.header}`}
          toolbar={({ columnsButton }) => (
            <Inline gap={2} align="center" justify="between">
              <div className="lg:hidden">
                <Select value={tab} onValueChange={(value) => setTab(value ?? "outline")}>
                  <SelectTrigger size="sm" className="w-44" aria-label="View">
                    <span>{tab}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="past-performance">Past Performance</SelectItem>
                    <SelectItem value="key-personnel">Key Personnel</SelectItem>
                    <SelectItem value="focus-documents">Focus Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden lg:block">
                <TabsList>
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="past-performance">
                    Past Performance <Badge variant="neutral">3</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="key-personnel">
                    Key Personnel <Badge variant="neutral">2</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList>
              </div>
              <Inline gap={2} align="center">
                {columnsButton}
                <Button variant="outline" size="sm">
                  <PlusIcon />
                  Add Section
                </Button>
              </Inline>
            </Inline>
          )}
        />
    </Tabs>
  )
}
