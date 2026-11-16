import { useState, type ReactNode } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  BarChart3Icon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { AppShell, type AppNavGroup } from "@/components/patterns/app-shell.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"

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

const visitors = Array.from({ length: 30 }, (_, index) => ({
  day: String(index + 1),
  desktop: 80 + ((index * 37) % 140),
  mobile: 40 + ((index * 23) % 100),
}))

const rows = [
  { header: "Cover page", type: "Cover page", status: "In Process", target: "18", limit: "5", reviewer: "Eddie Lake" },
  { header: "Table of contents", type: "Table of contents", status: "Done", target: "29", limit: "24", reviewer: "Eddie Lake" },
  { header: "Executive summary", type: "Narrative", status: "Done", target: "10", limit: "13", reviewer: "Eddie Lake" },
  { header: "Technical approach", type: "Narrative", status: "Done", target: "27", limit: "23", reviewer: "Jamik Tashpulatov" },
  { header: "Design", type: "Narrative", status: "In Process", target: "2", limit: "16", reviewer: "Jamik Tashpulatov" },
  { header: "Capabilities", type: "Narrative", status: "In Process", target: "20", limit: "8", reviewer: "Jamik Tashpulatov" },
]

export function ShowcaseDashboard({ leading, topbar }: { leading: ReactNode; topbar: ReactNode }) {
  const [menu, setMenu] = useState("library")
  const [range, setRange] = useState<string[]>(["30"])
  const [limits, setLimits] = useState(rows.map((row) => row.limit))

  return (
    <AppShell
      logo={<Text weight="semibold">Acme Inc.</Text>}
      groups={GROUPS}
      activeId={menu}
      onNavigate={setMenu}
      leading={
        <Inline gap={3} align="center" className="min-w-0">
          <Text weight="semibold">Documents</Text>
          {leading}
        </Inline>
      }
      topbar={topbar}
      footer={
        <Inline gap={2} align="center" className="min-w-0">
          <Avatar size="sm"><AvatarFallback>CN</AvatarFallback></Avatar>
          <Stack gap={0} className="min-w-0">
            <Text size="sm" weight="medium" truncate>shadcn</Text>
            <Text size="xs" tone="muted" truncate>m@example.com</Text>
          </Stack>
        </Inline>
      }
    >
      <Stack gap={4}>
        <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
          <StatCard label="Total Revenue" value="$1,250.00" description="Trending up this month" action={<Badge variant="success">+12.5%</Badge>} />
          <StatCard label="New Customers" value="1,234" description="Down 20% this period" action={<Badge variant="destructive">-20%</Badge>} />
          <StatCard label="Active Accounts" value="45,678" description="Strong user retention" action={<Badge variant="success">+12.5%</Badge>} />
          <StatCard label="Growth Rate" value="4.5%" description="Steady performance" action={<Badge variant="success">+4.5%</Badge>} />
        </Grid>
        <Card>
          <CardHeader>
            <Inline justify="between" align="center" gap={2}>
              <Stack gap={1}>
                <CardTitle>Total Visitors</CardTitle>
                <CardDescription>Total for the last 3 months</CardDescription>
              </Stack>
              <ToggleGroup value={range} onValueChange={(value) => { if (value.length > 0) setRange([value[value.length - 1] ?? "30"]) }}>
                <ToggleGroupItem value="90">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
              </ToggleGroup>
            </Inline>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ desktop: { label: "Desktop", color: "var(--chart-1)" }, mobile: { label: "Mobile", color: "var(--chart-2)" } }}
              className="h-64"
            >
              <AreaChart data={visitors}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="desktop" name="Desktop" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
                <Area type="monotone" dataKey="mobile" name="Mobile" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Drag and drop is not included.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Section Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead>Reviewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.header}>
                    <TableCell>{row.header}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell><Badge variant={row.status === "Done" ? "success" : "info"}>{row.status}</Badge></TableCell>
                    <TableCell>{row.target}</TableCell>
                    <TableCell>
                      <Input
                        size="sm"
                        aria-label={`Limit ${row.header}`}
                        value={limits[index]}
                        className="w-16"
                        onChange={(event) => setLimits((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
                      />
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={row.reviewer}>
                        <SelectTrigger size="sm" className="w-40" aria-label={`Reviewer ${row.header}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                          <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  )
}
