import { useState, type ReactNode } from "react"
import { LayoutDashboardIcon, ListIcon, SettingsIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AudioPlayer } from "@/components/media/audio-player.tsx"
import { Dropzone } from "@/components/media/dropzone.tsx"
import { JobStatus } from "@/components/media/job-status.tsx"
import { MediaPreview } from "@/components/media/media-preview.tsx"
import { Meter } from "@/components/media/meter.tsx"
import { AppShell } from "@/components/patterns/app-shell.tsx"
import { DataTable } from "@/components/patterns/data-table.tsx"
import { FilterBar } from "@/components/patterns/filter-bar.tsx"
import { FormLayout } from "@/components/patterns/form-layout.tsx"
import { PageHeader } from "@/components/patterns/page-header.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"
import { StatusTimeline } from "@/components/patterns/status-timeline.tsx"
import { Ticker } from "@/components/patterns/ticker.tsx"
import { FlowDemo } from "@/components/patterns/design-system/flow.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { DateInput } from "@/components/ui/date-input.tsx"
import { Field, FieldLabel } from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { NumberInput } from "@/components/ui/number-input.tsx"
import { PasswordInput } from "@/components/ui/password-input.tsx"
import { ProgressCircle } from "@/components/ui/progress-circle.tsx"
import { ProgressSegments } from "@/components/ui/progress-segments.tsx"
import { StatusBadge } from "@/components/ui/status-badge.tsx"
import { StepsBar } from "@/components/ui/steps-bar.tsx"
import { TagsInput } from "@/components/ui/tags-input.tsx"
import { ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import { Truncated } from "@/components/ui/truncated.tsx"

type LocalGroup = "Kit" | "Flow" | "Patterns"

type LocalPage = {
  name: string
  title: string
  group: LocalGroup
  description: string
  usage: string
  code: string
  tall?: boolean
  wide?: boolean
  Preview: () => ReactNode
}

const FLOW = [
  "flow-canvas",
  "base-node",
  "base-handle",
  "button-handle",
  "button-edge",
  "labeled-handle",
  "labeled-group-node",
  "node-status-indicator",
  "node-tooltip",
  "node-appendix",
  "node-search",
  "placeholder-node",
  "database-schema-node",
  "data-edge",
  "animated-svg-edge",
  "zoom-slider",
  "zoom-select",
  "devtools",
  "mind-map-node",
  "workflow-node",
] as const

function titleOf(name: string) {
  return name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
}

function flowPage(name: string): LocalPage {
  return {
    name,
    title: titleOf(name),
    group: "Flow",
    description: `Mẫu ${titleOf(name)} trên canvas React Flow.`,
    usage: "Đặt component trong FlowCanvas. Các mẫu dưới đây là đúng bản đang dùng trong kit.",
    code: `import { ${titleOf(name).replaceAll(" ", "")} } from "@/components/flow"\n\n<FlowCanvas nodes={nodes} edges={edges} />`,
    tall: true,
    wide: true,
    Preview: () => <FlowDemo name={name} />,
  }
}

function DatePreview() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 20))
  return <DateInput value={date} onValueChange={setDate} placeholder="Select a date" removeLabel="Clear" />
}

function TagsPreview() {
  const [tags, setTags] = useState(["Design", "System"])
  return <TagsInput value={tags} onValueChange={setTags} placeholder="Add a tag" removeLabel="Remove" />
}

function NumberPreview() {
  const [amount, setAmount] = useState(12)
  return <NumberInput value={amount} onValueChange={setAmount} min={0} max={40} label="Quantity" />
}

function StatusPreview() {
  return (
    <Inline gap={2}>
      <StatusBadge status="done" label="Done" />
      <StatusBadge status="pending" label="Pending" />
      <StatusBadge status="in_progress" label="In progress" />
      <StatusBadge status="failed" label="Failed" />
      <StatusBadge status="draft" label="Draft" />
    </Inline>
  )
}

function StepsPreview() {
  return (
    <StepsBar steps={[
      { label: "Step 1", status: "done" },
      { label: "Step 2", status: "current" },
      { label: "Step 3", status: "todo" },
    ]} />
  )
}

function CirclePreview() {
  return (
    <Inline gap={3} align="center" wrap={false}>
      <ProgressCircle value={2} max={5}>2 of 5</ProgressCircle>
      <Stack gap={1}>
        <Text size="sm" weight="semibold">Step name 2</Text>
        <Text size="xs" tone="muted">Next: Step name 3</Text>
      </Stack>
    </Inline>
  )
}

function TruncatedPreview() {
  return <Truncated className="block w-48">Một dòng rất dài sẽ được cắt và hiện đủ khi rê chuột.</Truncated>
}

function AppShellPreview() {
  const [active, setActive] = useState("home")
  return (
    <div data-app-preview className="relative z-0 h-96 contain-paint overflow-hidden rounded-lg border border-border">
      <AppShell
        inset
        logo={<Text size="sm" weight="semibold">Studio</Text>}
        mark={<Text size="sm" weight="semibold">S</Text>}
        groups={[{
          label: "Menu",
          items: [
            { id: "home", label: "Home", icon: LayoutDashboardIcon },
            { id: "list", label: "List", icon: ListIcon },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ],
        }]}
        activeId={active}
        onNavigate={setActive}
        title="Overview"
        account={{ name: "Alex Kim", email: "alex@studio.com" }}
        collapseLabel="Collapse"
        collapseAriaLabel="Collapse sidebar"
        expandLabel="Expand sidebar"
        menuLabel="Open menu"
      >
        <Grid>
          <Grid span="quarter" className="h-full">
            <Card className="h-full"><CardContent><Text size="sm">Quarter</Text></CardContent></Card>
          </Grid>
          <Grid span="half" className="h-full">
            <Card className="h-full"><CardContent><Text size="sm">Half</Text></CardContent></Card>
          </Grid>
          <Grid span="full" className="h-full">
            <Card className="h-full"><CardContent><Text size="sm">Full</Text></CardContent></Card>
          </Grid>
        </Grid>
      </AppShell>
    </div>
  )
}

function DataTablePreview() {
  const rows = [
    { id: "1", name: "Studio", status: "Done" },
    { id: "2", name: "Kit", status: "Draft" },
  ]
  return (
    <DataTable
      data={rows}
      getRowId={(row) => row.id}
      columns={[
        { id: "name", header: "Name", accessor: (row) => row.name },
        { id: "status", header: "Status", accessor: (row) => row.status },
      ]}
    />
  )
}

function FilterPreview() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  return (
    <FilterBar
      query={query}
      onQueryChange={setQuery}
      resultCount={2}
      onClear={() => { setQuery(""); setStatus("all") }}
      filters={[{
        id: "status",
        label: "Status",
        value: status,
        allValue: "all",
        options: [
          { value: "all", label: "All" },
          { value: "done", label: "Done" },
          { value: "draft", label: "Draft" },
        ],
        onChange: setStatus,
      }]}
    />
  )
}

function FormPreview() {
  return (
    <FormLayout
      onSubmit={() => undefined}
      sections={[{
        title: "Account",
        description: "Name shown on the page.",
        children: (
          <Field>
            <FieldLabel htmlFor="kit-name">Name</FieldLabel>
            <Input id="kit-name" defaultValue="Studio" />
          </Field>
        ),
      }]}
    />
  )
}

function PageHeaderPreview() {
  return (
    <PageHeader
      title="Projects"
      description="Work currently in review."
      crumbs={[{ label: "Home" }, { label: "Projects" }]}
    />
  )
}

function TimelinePreview() {
  return (
    <StatusTimeline items={[
      { id: "1", title: "Created", time: "09:00", state: "done" },
      { id: "2", title: "Review", time: "11:30", note: "Waiting for a note.", state: "current" },
      { id: "3", title: "Ship", time: "—", state: "todo" },
    ]} />
  )
}

const localPages: LocalPage[] = [
  {
    name: "number-input",
    title: "Number Input",
    group: "Kit",
    description: "Ô số có nút giảm và tăng.",
    usage: "Truyền value và onValueChange. min, max và step giới hạn giá trị.",
    code: `<NumberInput value={12} onValueChange={setAmount} min={0} max={40} label="Quantity" />`,
    Preview: NumberPreview,
  },
  {
    name: "password-input",
    title: "Password Input",
    group: "Kit",
    description: "Ô mật khẩu, bấm để hiện hoặc ẩn.",
    usage: "Dùng như input. showPasswordLabel và hidePasswordLabel đổi nhãn nút.",
    code: `<PasswordInput aria-label="Password" defaultValue="secret" />`,
    Preview: () => <PasswordInput aria-label="Password" defaultValue="secret" />,
  },
  {
    name: "tags-input",
    title: "Tags Input",
    group: "Kit",
    description: "Danh sách tag. Enter để thêm, Backspace hoặc nút x để xoá.",
    usage: "value là mảng chuỗi. onValueChange nhận mảng mới.",
    code: `<TagsInput value={["Design", "System"]} onValueChange={setTags} placeholder="Add a tag" removeLabel="Remove" />`,
    wide: true,
    Preview: TagsPreview,
  },
  {
    name: "date-input",
    title: "Date Input",
    group: "Kit",
    description: "Ô ngày, bấm để mở lịch.",
    usage: "value là Date hoặc undefined. Ngày hiển thị dạng dd/MM/yyyy.",
    code: `<DateInput value={date} onValueChange={setDate} placeholder="Select a date" removeLabel="Clear" />`,
    Preview: DatePreview,
  },
  {
    name: "status-badge",
    title: "Status Badge",
    group: "Kit",
    description: "Trạng thái nền nhạt: done, pending, in progress, failed, draft.",
    usage: "status chọn màu. label thay dòng chữ mặc định.",
    code: `<StatusBadge status="done" label="Done" />`,
    wide: true,
    Preview: StatusPreview,
  },
  {
    name: "progress-circle",
    title: "Progress Circle",
    group: "Kit",
    description: "Vòng tiến độ.",
    usage: "value và max. children là chữ ở giữa vòng.",
    code: `<ProgressCircle value={2} max={5}>2 of 5</ProgressCircle>`,
    Preview: CirclePreview,
  },
  {
    name: "progress-segments",
    title: "Progress Segments",
    group: "Kit",
    description: "Thanh tiến độ chia đoạn.",
    usage: "value là số đoạn đã xong. max là tổng số đoạn.",
    code: `<ProgressSegments value={2} max={6} />`,
    wide: true,
    Preview: () => <ProgressSegments value={2} max={6} />,
  },
  {
    name: "steps-bar",
    title: "Steps Bar",
    group: "Kit",
    description: "Thanh bước. Thay cho stepper cũ của kit.",
    usage: "Mỗi bước có label và status done, current hoặc todo.",
    code: `<StepsBar steps={[{ label: "Step 1", status: "done" }, { label: "Step 2", status: "current" }, { label: "Step 3", status: "todo" }]} />`,
    wide: true,
    Preview: StepsPreview,
  },
  {
    name: "truncated",
    title: "Truncated",
    group: "Kit",
    description: "Cắt chữ tràn và hiện đủ khi rê chuột.",
    usage: "Bọc chữ trong khung có chiều ngang giới hạn.",
    code: `<Truncated>Một dòng rất dài</Truncated>`,
    Preview: TruncatedPreview,
  },
  {
    name: "theme-toggle",
    title: "Theme Toggle",
    group: "Kit",
    description: "Chuyển sáng và tối.",
    usage: "Gắn một lần trên thanh đầu trang. onChange nhận trạng thái tối.",
    code: `<ThemeToggle />`,
    Preview: () => <ThemeToggle />,
  },
  {
    name: "audio-player",
    title: "Audio Player",
    group: "Kit",
    description: "Phát một file tiếng.",
    usage: "src là đường dẫn file. Có nút phát, thanh tua và tốc độ.",
    code: `<AudioPlayer src="/samples/tone.mp3" />`,
    wide: true,
    Preview: () => <AudioPlayer src="/samples/tone.mp3" />,
  },
  {
    name: "media-preview",
    title: "Media Preview",
    group: "Kit",
    description: "Khung xem ảnh hoặc video.",
    usage: "kind là image hoặc video. status empty hoặc error hiện trạng thái trống và lỗi.",
    code: `<MediaPreview kind="image" src="/samples/still.png" alt="Still" />`,
    wide: true,
    Preview: () => <MediaPreview kind="image" src="/samples/still.png" alt="Still" />,
  },
  {
    name: "dropzone",
    title: "Dropzone",
    group: "Kit",
    description: "Kéo thả file.",
    usage: "accept, maxSize và maxFiles giới hạn file. File đã chọn hiện kèm thanh tiến độ.",
    code: `<Dropzone />`,
    wide: true,
    tall: true,
    Preview: () => <Dropzone />,
  },
  {
    name: "job-status",
    title: "Job Status",
    group: "Kit",
    description: "Trạng thái một tác vụ: chờ, đang chạy, xong, lỗi, đã huỷ.",
    usage: "status chọn nhãn. progress từ 0 đến 100 khi đang chạy.",
    code: `<JobStatus name="Export" status="running" progress={40} />`,
    wide: true,
    Preview: () => <JobStatus name="Export" status="running" progress={40} />,
  },
  {
    name: "meter",
    title: "Meter",
    group: "Kit",
    description: "Thanh phần trăm.",
    usage: "value từ 0 đến 100.",
    code: `<Meter value={40} />`,
    wide: true,
    Preview: () => <Meter value={40} />,
  },
  ...FLOW.map(flowPage),
  {
    name: "app-shell",
    title: "App Shell",
    group: "Patterns",
    description: "Khung app: sidebar, thanh trên và nội dung.",
    usage: "groups là menu. inset bọc sidebar trong khung xem trước. Dưới 768px sidebar mở bằng Sheet.",
    code: `<AppShell logo="Studio" groups={groups} activeId={active} onNavigate={setActive} title="Overview" />`,
    tall: true,
    wide: true,
    Preview: AppShellPreview,
  },
  {
    name: "data-table",
    title: "Data Table",
    group: "Patterns",
    description: "Bảng có sắp xếp và phân trang.",
    usage: "columns mô tả từng cột. getRowId trả id ổn định. Danh sách trống dùng Empty.",
    code: `<DataTable data={rows} columns={columns} getRowId={(row) => row.id} />`,
    tall: true,
    wide: true,
    Preview: DataTablePreview,
  },
  {
    name: "filter-bar",
    title: "Filter Bar",
    group: "Patterns",
    description: "Ô tìm, bộ lọc và số kết quả.",
    usage: "Mọi control cùng cỡ. onClear xoá query và đưa filter về all.",
    code: `<FilterBar query={query} onQueryChange={setQuery} filters={filters} onClear={clear} resultCount={2} />`,
    wide: true,
    Preview: FilterPreview,
  },
  {
    name: "form-layout",
    title: "Form Layout",
    group: "Patterns",
    description: "Form chia section, nút Lưu và Huỷ ở đáy.",
    usage: "Mỗi section có title và children. Nhãn và ô dùng Field.",
    code: `<FormLayout sections={[{ title: "Account", children }]} onSubmit={save} />`,
    tall: true,
    wide: true,
    Preview: FormPreview,
  },
  {
    name: "page-header",
    title: "Page Header",
    group: "Patterns",
    description: "Tiêu đề trang, mô tả và breadcrumb.",
    usage: "actions là nút bên phải. crumbs là các mục đường dẫn.",
    code: `<PageHeader title="Projects" description="Work currently in review." crumbs={[{ label: "Home" }, { label: "Projects" }]} />`,
    wide: true,
    Preview: PageHeaderPreview,
  },
  {
    name: "stat-card",
    title: "Stat Card",
    group: "Patterns",
    description: "Số liệu, hướng tăng giảm và dòng chú thích.",
    usage: "delta và direction vẽ badge. line và note là hai dòng dưới số.",
    code: `<StatCard label="Revenue" value="128" delta="12%" direction="up" line="This week" note="Compared with last week" />`,
    Preview: () => <StatCard label="Revenue" value="128" delta="12%" direction="up" line="This week" note="Compared with last week" />,
  },
  {
    name: "status-timeline",
    title: "Status Timeline",
    group: "Patterns",
    description: "Các mốc trạng thái theo thời gian.",
    usage: "state là done, current hoặc todo. note là dòng phụ.",
    code: `<StatusTimeline items={[{ id: "1", title: "Created", time: "09:00", state: "done" }]} />`,
    Preview: TimelinePreview,
  },
  {
    name: "ticker",
    title: "Ticker",
    group: "Patterns",
    description: "Một dòng mã, giá và phần trăm.",
    usage: "Mỗi item có symbol, avatar, price, change và up.",
    code: `<Ticker items={[{ symbol: "TEAL", avatar: "T", price: "12.40", change: "1.2%", up: true }]} />`,
    wide: true,
    Preview: () => <Ticker items={[{ symbol: "TEAL", avatar: "T", price: "12.40", change: "1.2%", up: true }]} />,
  },
]

const localGroups = (["Kit", "Flow", "Patterns"] as const).map((name) => ({
  name,
  pages: localPages.filter((page) => page.group === name),
}))

export type { LocalPage }
export { localGroups, localPages }
