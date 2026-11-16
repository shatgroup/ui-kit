import { useMemo, useState } from "react"
import {
  BarChart3Icon,
  ClipboardListIcon,
  MoreHorizontalIcon,
  PackageIcon,
  SettingsIcon,
  StoreIcon,
  WarehouseIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AppShell, type AppNavGroup } from "@/components/patterns/app-shell.tsx"
import { DataTable, type DataColumn } from "@/components/patterns/data-table.tsx"
import { FilterBar, type FilterItem } from "@/components/patterns/filter-bar.tsx"
import { FormLayout } from "@/components/patterns/form-layout.tsx"
import { PageHeader } from "@/components/patterns/page-header.tsx"
import { StatCard } from "@/components/patterns/stat-card.tsx"
import { StatusTimeline } from "@/components/patterns/status-timeline.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { toast } from "sonner"

type Status = "pending" | "doing" | "done"

type RequestRow = {
  id: string
  code: string
  store: string
  type: string
  qty: number
  status: Status
  date: string
}

const LONG_STORE = "Shondo 22 Nguyễn Ảnh Thủ – Trung Mỹ Tây, Quận 12, TP. Hồ Chí Minh"
const STORES = ["Shondo Quận 1", LONG_STORE, "Shondo Thủ Đức"]
const TYPES = ["Standee", "Wobbler", "Poster"]
const STATUS_CYCLE: Status[] = ["pending", "doing", "done"]
const STATUS_LABEL: Record<Status, string> = { pending: "Chờ duyệt", doing: "Đang làm", done: "Đã xong" }
const STATUS_BADGE = { pending: "warning", doing: "info", done: "success" } as const

const ROWS: RequestRow[] = Array.from({ length: 40 }, (_, index) => ({
  id: String(index + 1),
  code: `POSM-${2400 + index}`,
  store: index % 5 === 0 ? LONG_STORE : STORES[index % STORES.length] ?? STORES[0],
  type: TYPES[index % TYPES.length] ?? "Standee",
  qty: (index % 9) + 1,
  status: STATUS_CYCLE[index % STATUS_CYCLE.length] ?? "pending",
  date: `${String((index % 27) + 1).padStart(2, "0")}/11/2026`,
}))

const GROUPS: AppNavGroup[] = [
  {
    label: "Vận hành",
    items: [
      { id: "requests", label: "Yêu cầu", icon: ClipboardListIcon },
      { id: "stores", label: "Cửa hàng", icon: StoreIcon },
      { id: "posm", label: "POSM", icon: PackageIcon },
      { id: "stock", label: "Kho", icon: WarehouseIcon },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { id: "reports", label: "Báo cáo", icon: BarChart3Icon },
      { id: "settings", label: "Cài đặt", icon: SettingsIcon },
    ],
  },
]

const COLUMNS: DataColumn<RequestRow>[] = [
  { id: "code", header: "Mã", accessor: (row) => row.code, minWidth: 120 },
  { id: "store", header: "Cửa hàng", accessor: (row) => row.store, minWidth: 240, grow: true },
  { id: "type", header: "Loại POSM", accessor: (row) => row.type, minWidth: 120 },
  { id: "qty", header: "Số lượng", accessor: (row) => row.qty, minWidth: 96, numeric: true },
  {
    id: "status",
    header: "Trạng thái",
    accessor: (row) => STATUS_LABEL[row.status],
    minWidth: 120,
    cell: (row) => <Badge variant={STATUS_BADGE[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  { id: "date", header: "Ngày", accessor: (row) => row.date, minWidth: 112 },
]

export function PreviewPage() {
  const [menu, setMenu] = useState("requests")
  const [query, setQuery] = useState("")
  const [store, setStore] = useState("all")
  const [type, setType] = useState("all")
  const [status, setStatus] = useState("all")
  const [detail, setDetail] = useState<RequestRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState<RequestRow | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [storeField, setStoreField] = useState("")
  const [typeField, setTypeField] = useState("")
  const [qty, setQty] = useState("")
  const [note, setNote] = useState("")
  const [urgent, setUrgent] = useState(false)
  const [storeError, setStoreError] = useState("")
  const [saving, setSaving] = useState(false)

  const rows = useMemo(
    () =>
      ROWS.filter((row) => {
        const text = `${row.code} ${row.store}`.toLowerCase()
        if (query && !text.includes(query.trim().toLowerCase())) return false
        if (store === "q1" && !row.store.includes("Quận 1")) return false
        if (store === "q12" && !row.store.includes("Quận 12")) return false
        if (store === "td" && !row.store.includes("Thủ Đức")) return false
        if (type !== "all" && row.type !== type) return false
        if (status !== "all" && row.status !== status) return false
        return true
      }),
    [query, store, type, status],
  )

  const filters: FilterItem[] = [
    {
      id: "store",
      label: "Cửa hàng",
      value: store,
      allValue: "all",
      onChange: setStore,
      options: [
        { value: "all", label: "Tất cả" },
        { value: "q1", label: "Shondo Quận 1" },
        { value: "q12", label: "Shondo Quận 12" },
        { value: "td", label: "Shondo Thủ Đức" },
      ],
    },
    {
      id: "type",
      label: "Loại POSM",
      value: type,
      allValue: "all",
      onChange: setType,
      options: [
        { value: "all", label: "Tất cả" },
        ...TYPES.map((item) => ({ value: item, label: item })),
      ],
    },
    {
      id: "status",
      label: "Trạng thái",
      value: status,
      allValue: "all",
      onChange: setStatus,
      options: [
        { value: "all", label: "Tất cả" },
        { value: "pending", label: "Chờ duyệt" },
        { value: "doing", label: "Đang làm" },
        { value: "done", label: "Đã xong" },
      ],
    },
  ]

  function save() {
    if (!storeField) {
      setStoreError("Chọn cửa hàng")
      return
    }
    setStoreError("")
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      setCreateOpen(false)
      setStoreField("")
      setQty("")
      setNote("")
      setUrgent(false)
      toast.success("Đã tạo yêu cầu POSM")
    }, 1000)
  }

  return (
    <AppShell
      logo={
        <Text as="span" size="lg" weight="bold" tone="primary">
          POSM
        </Text>
      }
      mark={
        <Text as="span" size="sm" weight="bold" tone="primary">
          PO
        </Text>
      }
      groups={GROUPS}
      activeId={menu}
      onNavigate={setMenu}
      topbar={<ThemeToggle />}
    >
      <Stack gap={4}>
        <PageHeader
          title="Yêu cầu POSM"
          description="Theo dõi in ấn và bàn giao POSM cho cửa hàng."
          crumbs={[{ label: "POSM" }, { label: "Yêu cầu" }]}
          actions={<Button onClick={() => setCreateOpen(true)}>Tạo yêu cầu</Button>}
        />
        <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
          <StatCard label="Đang mở" value="24" delta="+8%" direction="up" description="Chờ duyệt và đang làm" />
          <StatCard label="Đang làm" value="11" delta="+2" direction="up" description="Xưởng đang in" />
          <StatCard label="Đã xong" value="16" delta="-3%" direction="down" description="Bảy ngày gần nhất" />
          <StatCard label="Giá trị" value="1.250.000.000 ₫" description="Tổng đơn đã duyệt" />
        </Grid>
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          resultCount={rows.length}
          onClear={() => {
            setQuery("")
            setStore("all")
            setType("all")
            setStatus("all")
          }}
        />
        <DataTable
          data={rows}
          columns={COLUMNS}
          getRowId={(row) => row.id}
          stickyFirstColumn
          selectable
          bulkActions={(ids) => (
            <Button variant="outline" size="sm" onClick={() => toast.success(`Đã chọn ${ids.length} dòng`)}>
              Thao tác hàng loạt
            </Button>
          )}
          renderActions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="w-8 px-0" aria-label={`Thao tác ${row.code}`}>
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { setDetail(row); setSheetOpen(true) }}>Xem</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteRow(row)}>
                  Xoá
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </Stack>

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => setSheetOpen(open)}
        onOpenChangeComplete={(open) => {
          if (!open) setDetail(null)
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{detail?.code}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <Stack gap={4}>
              <Text>{detail?.store}</Text>
              <Calendar locale={vi} weekStartsOn={1} />
              <StatusTimeline
                items={[
                  { id: "created", title: "Tạo yêu cầu", time: detail?.date ?? "", note: detail?.type, state: "done" },
                  {
                    id: "work",
                    title: "Đang sản xuất",
                    time: "Hôm nay",
                    note: "Xưởng in standee và đóng gói theo cửa hàng.",
                    state: detail?.status === "pending" ? "todo" : "current",
                  },
                  { id: "done", title: "Bàn giao", time: "Chưa tới", state: detail?.status === "done" ? "done" : "todo" },
                ]}
              />
            </Stack>
          </SheetBody>
        </SheetContent>
      </Sheet>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu POSM</DialogTitle>
            <DialogDescription>Cửa hàng là bắt buộc.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <FormLayout
              columns={1}
              saving={saving}
              onSubmit={save}
              onCancel={() => setCreateOpen(false)}
              sections={[
                {
                  title: "Nội dung",
                  description: "Điền đủ trước khi gửi xưởng.",
                  children: (
                    <Stack gap={3}>
                      <FormField label="Cửa hàng" required error={storeError}>
                        {(field) => (
                          <Select
                            value={storeField}
                            onValueChange={(value) => {
                              setStoreField(value ?? "")
                              if (value) setStoreError("")
                            }}
                          >
                            <SelectTrigger {...field}>
                              <SelectValue placeholder="Chọn cửa hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="q1">Shondo Quận 1</SelectItem>
                              <SelectItem value="q12">Shondo Quận 12</SelectItem>
                              <SelectItem value="td">Shondo Thủ Đức</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </FormField>
                      <FormField label="Loại POSM" hint="Standee, wobbler hoặc poster">
                        {(field) => (
                          <Select value={typeField} onValueChange={(value) => setTypeField(value ?? "")}>
                            <SelectTrigger {...field}>
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                              {TYPES.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormField>
                      <FormField label="Số lượng">
                        {(field) => (
                          <Input {...field} type="number" value={qty} onChange={(event) => setQty(event.target.value)} />
                        )}
                      </FormField>
                      <FormField label="Ghi chú">
                        {(field) => <Textarea {...field} value={note} onChange={(event) => setNote(event.target.value)} />}
                      </FormField>
                      <FormField label="Gấp" choice>
                        {(field) => <Switch {...field} checked={urgent} onCheckedChange={setUrgent} />}
                      </FormField>
                    </Stack>
                  ),
                },
              ]}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteRow !== null} onOpenChange={(open) => !open && setDeleteRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá yêu cầu</DialogTitle>
            <DialogDescription>Xoá {deleteRow?.code}. Thao tác không hoàn tác.</DialogDescription>
          </DialogHeader>
          <Inline gap={2} justify="end">
            <Button variant="outline" onClick={() => setDeleteRow(null)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success(`Đã xoá ${deleteRow?.code}`)
                setDeleteRow(null)
              }}
            >
              Xoá
            </Button>
          </Inline>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
