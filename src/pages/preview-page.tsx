import { useRef, useState } from "react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { InboxIcon, MenuIcon } from "lucide-react"
import { toast } from "sonner"

type Status = "pending" | "doing" | "done"

type Row = {
  code: string
  store: string
  type: string
  qty: number
  status: Status
  date: string
}

const MENUS = ["Yêu cầu", "Cửa hàng", "POSM", "Kho", "Báo cáo", "Cài đặt"]
const STORES = ["Tất cả", "Shondo Quận 1", "Shondo Quận 12", "Shondo Thủ Đức"]
const TYPES = ["Tất cả", "Standee", "Wobbler", "Poster"]
const STATUSES = ["Tất cả", "Chờ duyệt", "Đang làm", "Đã xong"]

const ROWS: Row[] = [
  {
    code: "POSM-2401",
    store: "Shondo 22 Nguyễn Ảnh Thủ – Trung Mỹ Tây, Quận 12, TP. Hồ Chí Minh",
    type: "Standee",
    qty: 12,
    status: "pending",
    date: "12/11/2026",
  },
  { code: "POSM-2402", store: "Shondo Quận 1", type: "Wobbler", qty: 40, status: "doing", date: "11/11/2026" },
  { code: "POSM-2403", store: "Shondo Thủ Đức", type: "Poster", qty: 8, status: "pending", date: "10/11/2026" },
  { code: "POSM-2404", store: "Shondo Quận 12", type: "Standee", qty: 4, status: "doing", date: "09/11/2026" },
  { code: "POSM-2405", store: "Shondo Quận 1", type: "Poster", qty: 20, status: "done", date: "08/11/2026" },
  { code: "POSM-2406", store: "Shondo Thủ Đức", type: "Wobbler", qty: 15, status: "pending", date: "07/11/2026" },
  { code: "POSM-2407", store: "Shondo Quận 12", type: "Poster", qty: 6, status: "doing", date: "06/11/2026" },
  { code: "POSM-2408", store: "Shondo Quận 1", type: "Standee", qty: 2, status: "done", date: "05/11/2026" },
]

const STATUS_BADGE = {
  pending: { variant: "warning", label: "Chờ duyệt" },
  doing: { variant: "info", label: "Đang làm" },
  done: { variant: "success", label: "Đã xong" },
} as const

function MenuList({ current, onPick }: { current: string; onPick: (item: string) => void }) {
  return (
    <Stack gap={1}>
      {MENUS.map((item) => (
        <Button
          key={item}
          variant="ghost"
          className={item === current ? "w-full justify-start bg-sidebar-primary text-sidebar-primary-foreground" : "w-full justify-start"}
          aria-current={item === current ? "page" : undefined}
          onClick={() => onPick(item)}
        >
          {item}
        </Button>
      ))}
    </Stack>
  )
}

export function PreviewPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  const [menu, setMenu] = useState("Yêu cầu")
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")
  const [store, setStore] = useState("Tất cả")
  const [type, setType] = useState("Tất cả")
  const [status, setStatus] = useState("Tất cả")
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [storeField, setStoreField] = useState("")
  const [typeField, setTypeField] = useState("")
  const [qty, setQty] = useState("")
  const [note, setNote] = useState("")
  const [urgent, setUrgent] = useState(false)
  const [storeError, setStoreError] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleteCode, setDeleteCode] = useState<string | null>(null)
  const deleteTrigger = useRef<HTMLButtonElement | null>(null)

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    setDark(next)
  }

  function resetFilters() {
    setStore("Tất cả")
    setType("Tất cả")
    setStatus("Tất cả")
  }

  const rows = ROWS.filter((row) => {
    const text = `${row.code} ${row.store}`.toLowerCase()
    if (query && !text.includes(query.trim().toLowerCase())) return false
    if (store !== "Tất cả" && !row.store.includes(store.replace("Tất cả", ""))) return false
    if (store === "Shondo Quận 12" && !row.store.includes("Quận 12")) return false
    if (store === "Shondo Quận 1" && !row.store.includes("Quận 1")) return false
    if (store === "Shondo Thủ Đức" && !row.store.includes("Thủ Đức")) return false
    if (type !== "Tất cả" && row.type !== type) return false
    if (status !== "Tất cả" && STATUS_BADGE[row.status].label !== status) return false
    if (tab === "pending" && row.status !== "pending") return false
    if (tab === "doing" && row.status !== "doing") return false
    return true
  })

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
      setTypeField("")
      setQty("")
      setNote("")
      setUrgent(false)
      toast.success("Đã tạo yêu cầu POSM")
    }, 1000)
  }

  function closeDelete(open: boolean) {
    setDeleteCode(open ? deleteCode : null)
    if (!open) deleteTrigger.current?.focus()
  }

  return (
    <Box className="min-h-dvh">
      <Inline align="stretch" wrap={false} className="min-h-dvh">
        <Box tone="card" border className="hidden w-60 shrink-0 md:block">
          <Stack gap={4} className="p-4">
            <Text as="h1" size="lg" weight="bold" tone="primary">
              POSM
            </Text>
            <MenuList current={menu} onPick={setMenu} />
          </Stack>
        </Box>
        <Stack gap={4} className="min-w-0 flex-1 p-4">
          <Inline justify="between" align="center" gap={2}>
            <Inline gap={2} align="center" className="min-w-0">
              <Button variant="outline" className="w-8 px-0 md:hidden" aria-label="Mở menu" onClick={() => setMenuOpen(true)}>
                <MenuIcon />
              </Button>
              <Text as="h1" size="2xl" weight="semibold" truncate>
                Yêu cầu POSM
              </Text>
            </Inline>
            <Button variant="secondary" onClick={toggleTheme}>
              {dark ? "Sáng" : "Tối"}
            </Button>
          </Inline>

          <Inline gap={2} align="center">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm mã, cửa hàng"
              aria-label="Tìm mã, cửa hàng"
              className="w-60"
            />
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger render={<Button />}>Tạo yêu cầu</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo yêu cầu POSM</DialogTitle>
                  <DialogDescription>Điền cửa hàng trước khi lưu.</DialogDescription>
                </DialogHeader>
                <DialogBody>
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
                          <SelectTrigger {...field} className="w-full">
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
                          <SelectTrigger {...field} className="w-full">
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standee">Standee</SelectItem>
                            <SelectItem value="wobbler">Wobbler</SelectItem>
                            <SelectItem value="poster">Poster</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </FormField>
                    <FormField label="Số lượng" hint="Số bộ cần in">
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          inputMode="numeric"
                          value={qty}
                          onChange={(event) => setQty(event.target.value)}
                        />
                      )}
                    </FormField>
                    <FormField label="Ghi chú">
                      {(field) => <Textarea {...field} value={note} onChange={(event) => setNote(event.target.value)} />}
                    </FormField>
                    <FormField label="Gấp" choice>
                      {(field) => <Switch {...field} checked={urgent} onCheckedChange={setUrgent} />}
                    </FormField>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Huỷ
                  </Button>
                  <Button loading={saving} onClick={save}>
                    Lưu
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Inline>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="doing">Đang làm</TabsTrigger>
              <TabsTrigger value="done">Đã xong</TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>
              <Stack gap={3}>
                <Inline gap={2} align="center">
                  <Select value={store} onValueChange={(value) => setStore(value ?? "Tất cả")}>
                    <SelectTrigger className="w-48" aria-label="Cửa hàng">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={type} onValueChange={(value) => setType(value ?? "Tất cả")}>
                    <SelectTrigger className="w-48" aria-label="Loại POSM">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={status} onValueChange={(value) => setStatus(value ?? "Tất cả")}>
                    <SelectTrigger className="w-48" aria-label="Trạng thái">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={resetFilters}>
                    Xoá lọc
                  </Button>
                </Inline>
                <Inline gap={2} align="center">
                  <Switch checked={loading} onCheckedChange={setLoading} id="loading-toggle" aria-labelledby="loading-label" />
                  <Text id="loading-label" as="span" size="sm">
                    Đang tải
                  </Text>
                </Inline>
                {loading ? (
                  <Stack gap={2}>
                    {Array.from({ length: 8 }, (_, index) => (
                      <Skeleton key={index} className="h-control-md w-full" />
                    ))}
                  </Stack>
                ) : tab === "done" || rows.length === 0 ? (
                  <EmptyState
                    icon={<InboxIcon className="size-8 text-muted-foreground" />}
                    title={tab === "done" ? "Chưa có yêu cầu đã xong" : "Không có yêu cầu"}
                    description={tab === "done" ? "Các yêu cầu hoàn tất sẽ hiện ở đây." : "Đổi bộ lọc hoặc tạo yêu cầu mới."}
                  />
                ) : (
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã</TableHead>
                        <TableHead>Cửa hàng</TableHead>
                        <TableHead>Loại POSM</TableHead>
                        <TableHead numeric>Số lượng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.code}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell>{row.store}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell numeric>{row.qty}</TableCell>
                          <TableCell>
                            <Badge variant={STATUS_BADGE[row.status].variant}>{STATUS_BADGE[row.status].label}</Badge>
                          </TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell wrap>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={<Button variant="ghost" size="sm" className="w-8 px-0" aria-label={`Thao tác ${row.code}`} />}
                                onClick={(event) => {
                                  deleteTrigger.current = event.currentTarget
                                }}
                              >
                                ···
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Xem</DropdownMenuItem>
                                <DropdownMenuItem>Sửa</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => setDeleteCode(row.code)}>
                                  Xoá
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Stack>
            </TabsContent>
          </Tabs>
        </Stack>
      </Inline>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>POSM</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <MenuList
              current={menu}
              onPick={(item) => {
                setMenu(item)
                setMenuOpen(false)
              }}
            />
          </SheetBody>
        </SheetContent>
      </Sheet>

      <Dialog open={deleteCode !== null} onOpenChange={closeDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá yêu cầu</DialogTitle>
            <DialogDescription>Xoá {deleteCode}. Thao tác không hoàn tác.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDelete(false)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success(`Đã xoá ${deleteCode}`)
                closeDelete(false)
              }}
            >
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
