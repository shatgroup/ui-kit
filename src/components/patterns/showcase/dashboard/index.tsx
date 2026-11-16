/* Nguồn: shadcn/ui apps/v4/registry/bases/base/blocks/dashboard-01 (MIT)
   và tweakcn chart-pie-donut / chart-bar-mixed (Apache-2.0).
   Sidebar giữ AppShell của kit. Bảng kéo thả dùng @dnd-kit. */
import { useMemo, useState, type ReactNode } from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  BarChart3Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleCheckIcon,
  Columns3Icon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  GripVerticalIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AppShell, type AppNavGroup } from "@/components/patterns/app-shell.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { StatusBadge } from "@/components/ui/status-badge.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
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

const COLUMNS = ["header", "type", "status", "target", "limit", "reviewer"] as const

export function ShowcaseDashboard({ leading, topbar }: { leading: ReactNode; topbar: ReactNode }) {
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
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<number[]>([])
  const [hidden, setHidden] = useState<string[]>([])
  const [tab, setTab] = useState("outline")
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const visible = rows.slice(page * pageSize, page * pageSize + pageSize)
  const ids = visible.map((row) => row.id)
  const show = (id: string) => !hidden.includes(id)

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setRows((current) => {
      const oldIndex = current.findIndex((row) => row.id === active.id)
      const newIndex = current.findIndex((row) => row.id === over.id)
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  function toggle(id: number, on: boolean) {
    setSelected((current) => (on ? [...current, id] : current.filter((item) => item !== id)))
  }

  const allOnPage = visible.every((row) => selected.includes(row.id))
  const someOnPage = visible.some((row) => selected.includes(row.id))
  const selectedCount = useMemo(() => selected.filter((id) => rows.some((row) => row.id === id)).length, [rows, selected])

  return (
    <Tabs value={tab} onValueChange={setTab}>
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
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <Columns3Icon />
              Customize Columns
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {COLUMNS.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={!hidden.includes(column)}
                  onCheckedChange={(checked) =>
                    setHidden((current) => (checked ? current.filter((item) => item !== column) : [...current, column]))
                  }
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Section
          </Button>
        </Inline>
      </Inline>
      <TabsContent value="outline">
        <Stack gap={4}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead wrap> </TableHead>
                    <TableHead wrap>
                      <Checkbox
                        checked={allOnPage}
                        indeterminate={someOnPage && !allOnPage}
                        aria-label="Select all"
                        onCheckedChange={(checked) => {
                          const pageIds = visible.map((row) => row.id)
                          setSelected((current) =>
                            checked === true ? [...new Set([...current, ...pageIds])] : current.filter((id) => !pageIds.includes(id)),
                          )
                        }}
                      />
                    </TableHead>
                    {show("header") ? <TableHead>Header</TableHead> : null}
                    {show("type") ? <TableHead>Section Type</TableHead> : null}
                    {show("status") ? <TableHead>Status</TableHead> : null}
                    {show("target") ? <TableHead numeric>Target</TableHead> : null}
                    {show("limit") ? <TableHead numeric>Limit</TableHead> : null}
                    {show("reviewer") ? <TableHead>Reviewer</TableHead> : null}
                    <TableHead wrap> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((row) => (
                    <DocumentLine key={row.id} row={row} selected={selected.includes(row.id)} onSelect={toggle} show={show} />
                  ))}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
          <Inline gap={2} align="center" justify="between">
            <Text size="sm" tone="muted">
              {selectedCount} of {rows.length} row(s) selected.
            </Text>
            <Inline gap={2} align="center">
              <Text size="sm">Rows per page</Text>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value ?? "10"))
                  setPage(0)
                }}
              >
                <SelectTrigger size="sm" className="w-20" aria-label="Rows per page">
                  <span>{pageSize}</span>
                </SelectTrigger>
                <SelectContent>
                  {["10", "20", "30", "40", "50"].map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Text size="sm">
                Page {page + 1} of {pageCount}
              </Text>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Go to first page" disabled={page === 0} onClick={() => setPage(0)}>
                <ChevronsLeftIcon />
              </Button>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Go to previous page" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Go to next page" disabled={page >= pageCount - 1} onClick={() => setPage((current) => current + 1)}>
                <ChevronRightIcon />
              </Button>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Go to last page" disabled={page >= pageCount - 1} onClick={() => setPage(pageCount - 1)}>
                <ChevronsRightIcon />
              </Button>
            </Inline>
          </Inline>
        </Stack>
      </TabsContent>
    </Tabs>
  )
}

function DocumentLine({
  row,
  selected,
  onSelect,
  show,
}: {
  row: DocumentRow
  selected: boolean
  onSelect: (id: number, on: boolean) => void
  show: (id: string) => boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })
  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging ? "true" : undefined}
      // check-ui-ignore-next-line: dnd-kit đặt transform theo pixel lúc kéo, không có class tĩnh
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <TableCell wrap>
        <Button variant="ghost" size="sm" className="w-8 px-0" aria-label="Drag to reorder" {...attributes} {...listeners}>
          <GripVerticalIcon />
        </Button>
      </TableCell>
      <TableCell wrap>
        <Checkbox checked={selected} aria-label={`Select ${row.header}`} onCheckedChange={(checked) => onSelect(row.id, checked === true)} />
      </TableCell>
      {show("header") ? <TableCell wrap>{row.header}</TableCell> : null}
      {show("type") ? (
        <TableCell wrap>
          <Badge variant="outline">{row.type}</Badge>
        </TableCell>
      ) : null}
      {show("status") ? (
        <TableCell wrap>
          <StatusBadge
            status={row.status === "Done" ? "done" : "in_progress"}
            label={row.status}
            icon={row.status === "Done" ? <CircleCheckIcon /> : <LoaderIcon />}
          />
        </TableCell>
      ) : null}
      {show("target") ? (
        <TableCell numeric wrap>
          <Input aria-label={`Target ${row.header}`} size="sm" defaultValue={row.target} className="w-16 text-right" />
        </TableCell>
      ) : null}
      {show("limit") ? (
        <TableCell numeric wrap>
          <Input aria-label={`Limit ${row.header}`} size="sm" defaultValue={row.limit} className="w-16 text-right" />
        </TableCell>
      ) : null}
      {show("reviewer") ? (
        <TableCell wrap>
          {row.reviewer === "Assign reviewer" ? (
            <Select>
              <SelectTrigger size="sm" className="w-40" aria-label={`Reviewer ${row.header}`}>
                <span>Assign reviewer</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            row.reviewer
          )}
        </TableCell>
      ) : null}
      <TableCell wrap>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="w-8 px-0" aria-label={`Actions ${row.header}`} />}>
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
