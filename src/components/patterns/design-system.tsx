import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import {
  BellIcon,
  FileIcon,
  FolderIcon,
  HouseIcon,
  ImageIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"
import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert } from "@/components/ui/alert.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { DateInput } from "@/components/ui/date-input.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { Input } from "@/components/ui/input.tsx"
import { InputGroup } from "@/components/ui/input-group.tsx"
import { NumberInput } from "@/components/ui/number-input.tsx"
import { PasswordInput } from "@/components/ui/password-input.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { RadioField, RadioGroup } from "@/components/ui/radio-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Slider } from "@/components/ui/slider.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { StatusBadge } from "@/components/ui/status-badge.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { TagsInput } from "@/components/ui/tags-input.tsx"
import { MotionReduceToggle, ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import standardMd from "../../../docs/STANDARD.md?raw"
import { toast } from "sonner"

const SWATCHES = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "primary-text", className: "bg-primary-text" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
  { name: "chart-1", className: "bg-chart-1" },
  { name: "chart-2", className: "bg-chart-2" },
  { name: "chart-3", className: "bg-chart-3" },
  { name: "chart-4", className: "bg-chart-4" },
  { name: "chart-5", className: "bg-chart-5" },
]
const INTENTIONAL = new Set<string>()
const TYPE_ROWS = [
  { name: "Tiêu đề", weight: "bold" as const, size: "3xl" as const },
  { name: "Mục", weight: "semibold" as const, size: "xl" as const },
  { name: "Nội dung", weight: "medium" as const, size: "base" as const },
  { name: "Phụ", weight: "normal" as const, size: "sm" as const },
]
const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const
const ICONS = [HouseIcon, SearchIcon, BellIcon, SettingsIcon, UserIcon, FolderIcon, FileIcon, ImageIcon]

function channel(value: number) {
  const unit = value / 255
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

function parseRgb(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return null
  const parts = match[1].split(",").map((part) => Number.parseFloat(part))
  if (parts.slice(0, 3).some((part) => Number.isNaN(part))) return null
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0] as const
}

function luminance(rgb: readonly [number, number, number]) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
}

function contrast(a: readonly [number, number, number], b: readonly [number, number, number]) {
  const left = luminance(a)
  const right = luminance(b)
  const light = Math.max(left, right)
  const dark = Math.min(left, right)
  return (light + 0.05) / (dark + 0.05)
}

function toHex(rgb: readonly [number, number, number]) {
  return `#${rgb.map((part) => Math.round(part).toString(16).padStart(2, "0")).join("")}`
}

function standardSection(title: string) {
  const chunk = standardMd.split(/^## /m).find((part) => part.startsWith(title))
  if (!chunk) return ""
  return chunk.split("\n").slice(1).join(" ").replace(/\s+/g, " ").trim()
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={2}>
      <Text size="xs" tone="muted" weight="medium">{label}</Text>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </Stack>
  )
}

function DesignSystem() {
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState("a")
  const [on, setOn] = useState(true)
  const [segment, setSegment] = useState<string[]>(["list"])
  const [amount, setAmount] = useState(2)
  const [tags, setTags] = useState(["Standee"])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 16))
  const [alert, setAlert] = useState(true)
  const swatchRefs = useRef<Record<string, HTMLElement | null>>({})
  const typeRefs = useRef<Array<HTMLElement | null>>([])
  const spaceRef = useRef<HTMLDivElement>(null)
  const radiusRef = useRef<HTMLDivElement>(null)
  const controlSm = useRef<HTMLButtonElement>(null)
  const controlMd = useRef<HTMLButtonElement>(null)
  const controlLg = useRef<HTMLButtonElement>(null)
  const [ink, setInk] = useState<Array<{ name: string; className: string; hex: string; ink: "text-ink-black" | "text-ink-white"; ratio: string; label: string }>>([])
  const [typeMetrics, setTypeMetrics] = useState<Array<{ weight: string; size: string; line: string; tracking: string }>>([])
  const [measured, setMeasured] = useState({ space: "", radius: "", sm: "", md: "", lg: "" })

  useLayoutEffect(() => {
    const black = [0, 0, 0] as const
    const white = [255, 255, 255] as const
    setInk(SWATCHES.map((item) => {
      const rgb = parseRgb(getComputedStyle(swatchRefs.current[item.name]!).backgroundColor) ?? black
      const onBlack = contrast(rgb, black)
      const onWhite = contrast(rgb, white)
      const tone = onBlack >= onWhite ? "text-ink-black" as const : "text-ink-white" as const
      const ratio = Math.max(onBlack, onWhite)
      const label = INTENTIONAL.has(item.name) ? "NGOẠI LỆ" : ratio >= 4.5 ? "ĐẠT" : "KHÔNG ĐẠT"
      return { ...item, hex: toHex(rgb), ink: tone, ratio: ratio.toFixed(2), label }
    }))
    setTypeMetrics(TYPE_ROWS.map((_, index) => {
      const style = getComputedStyle(typeRefs.current[index]!)
      return { weight: style.fontWeight, size: style.fontSize, line: style.lineHeight, tracking: style.letterSpacing }
    }))
    const spaceStyle = spaceRef.current ? getComputedStyle(spaceRef.current) : null
    const radius = radiusRef.current ? getComputedStyle(radiusRef.current).borderRadius : ""
    setMeasured({
      space: spaceStyle?.gap ?? "",
      radius,
      sm: controlSm.current ? getComputedStyle(controlSm.current).height : "",
      md: controlMd.current ? getComputedStyle(controlMd.current).height : "",
      lg: controlLg.current ? getComputedStyle(controlLg.current).height : "",
    })
  }, [])

  return (
    <Stack gap={8}>
      <Inline justify="between" align="end" gap={4}>
        <Stack gap={2}>
          <Text as="h1" size="3xl" weight="bold">UI Kit</Text>
          <Text tone="muted">Bộ giao diện dùng chung. Màu teal, không bóng.</Text>
        </Stack>
        <Inline gap={4} align="center">
          <Text size="3xl" tone="muted" weight="medium">Be Vietnam Pro</Text>
          <MotionReduceToggle />
          <ThemeToggle />
        </Inline>
      </Inline>

      <Stack gap={4}>
        <Text as="h2" size="xl" weight="semibold">Brand</Text>
        <Grid columns={{ base: 1, lg: 2 }} gap={4}>
          <Card>
            <CardHeader><CardTitle>Be Vietnam Pro</CardTitle></CardHeader>
            <CardContent>
              <Stack gap={2}>
                <Text size="3xl" weight="bold">Aa1</Text>
                <Text>regular → medium → semibold → bold</Text>
              </Stack>
            </CardContent>
          </Card>
          <Stack gap={2}>
            {SWATCHES.map((item) => {
              const row = ink.find((entry) => entry.name === item.name)
              const tone = row?.ink ?? "text-ink-black"
              return (
                <div
                  key={item.name}
                  ref={(node) => { swatchRefs.current[item.name] = node }}
                  className={`${item.className} ${tone} rounded-lg border border-border p-3`}
                >
                  <Text size="sm" weight="medium" className={tone}>{item.name}</Text>
                  <Text size="xs" className={tone}>{row ? `${row.hex} · ${row.ratio}:1 · ${row.label}` : item.name}</Text>
                </div>
              )
            })}
          </Stack>
        </Grid>
        <Card>
          <CardHeader><CardTitle>Thang chữ</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Độ đậm</TableHead>
                  <TableHead>Cỡ</TableHead>
                  <TableHead>Line height</TableHead>
                  <TableHead>Giãn chữ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TYPE_ROWS.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <span ref={(node) => { typeRefs.current[index] = node?.firstElementChild instanceof HTMLElement ? node.firstElementChild : null }}>
                        <Text size={row.size} weight={row.weight}>{row.name}</Text>
                      </span>
                    </TableCell>
                    <TableCell>{typeMetrics[index]?.weight ?? row.weight}</TableCell>
                    <TableCell>{typeMetrics[index]?.size ?? row.size}</TableCell>
                    <TableCell>{typeMetrics[index]?.line ?? ""}</TableCell>
                    <TableCell>{typeMetrics[index]?.tracking ?? ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Grid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
          <Card>
            <CardHeader><CardTitle>Khoảng cách</CardTitle></CardHeader>
            <CardContent>
              <div ref={spaceRef} className="flex flex-col gap-4">
                <Text size="sm">Đo gap 4: {measured.space}</Text>
                <Text size="xs" tone="muted">{standardSection("Khoảng cách")}</Text>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Bo góc</CardTitle></CardHeader>
            <CardContent>
              <Stack gap={2}>
                <span ref={radiusRef} className="size-8 rounded-md border border-border" />
                <Text size="sm">Đo rounded-md: {measured.radius}</Text>
                <Text size="xs" tone="muted">{standardSection("Bo góc")}</Text>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Control</CardTitle></CardHeader>
            <CardContent>
              <Stack gap={2}>
                <Inline gap={2}>
                  <Button ref={controlSm} size="sm">sm</Button>
                  <Button ref={controlMd} size="default">default</Button>
                  <Button ref={controlLg} size="lg">lg</Button>
                </Inline>
                <Text size="sm">Đo: sm {measured.sm} · default {measured.md} · lg {measured.lg}</Text>
                <Text size="xs" tone="muted">{standardSection("Control")}</Text>
              </Stack>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Chart</CardTitle></CardHeader><CardContent><Inline gap={2}>{["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"].map((item) => <span key={item} className={`size-6 rounded-md ${item}`} />)}</Inline></CardContent></Card>
        </Grid>
      </Stack>

      <Stack gap={4}>
        <Text as="h2" size="xl" weight="semibold">UI Kit</Text>
        <Grid columns={{ base: 1, lg: 2 }} gap={4}>
          <Section label="Buttons">
            <Stack gap={2}>
              {BUTTON_VARIANTS.map((variant) => (
                <Inline key={variant} gap={2} wrap>
                  <Button variant={variant}>{variant}</Button>
                  <Button variant={variant} forceState="hover">Hover</Button>
                  <Button variant={variant} forceState="pressed">Pressed</Button>
                  <Button variant={variant} forceState="focus">Focus</Button>
                  <Button variant={variant} disabled>Disabled</Button>
                  <Button variant={variant} loading>Loading</Button>
                </Inline>
              ))}
            </Stack>
          </Section>
          <Section label="Inputs">
            <Stack gap={2}>
              <Input placeholder="Văn bản" aria-label="Văn bản" />
              <InputGroup prefix="https://" placeholder="domain" aria-label="Tiền tố" />
              <InputGroup suffix="₫" placeholder="0" aria-label="Hậu tố" />
              <PasswordInput aria-label="Mật khẩu" />
              <DateInput value={date} onValueChange={setDate} />
              <NumberInput value={amount} onValueChange={setAmount} min={0} max={20} />
              <TagsInput value={tags} onValueChange={setTags} />
            </Stack>
          </Section>
          <Section label="Dropdown">
            <Stack gap={2} className="min-h-48">
              <Select open modal={false} value="one" onOpenChange={() => undefined}>
                <SelectTrigger aria-label="Chọn mục"><span>Mục một</span></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">Mục một</SelectItem>
                  <SelectItem value="two">Mục hai</SelectItem>
                </SelectContent>
              </Select>
            </Stack>
          </Section>
          <Section label="Checkbox / Radio">
            <Stack gap={2}>
              <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} aria-label="Đã chọn" />
              <Checkbox checked={false} aria-label="Chưa chọn" />
              <Checkbox indeterminate aria-label="Một phần" />
              <Checkbox disabled aria-label="Khoá" />
              <RadioGroup value={radio} onValueChange={setRadio} aria-label="Radio">
                <RadioField value="a" label="Một" />
                <RadioField value="b" label="Hai" />
              </RadioGroup>
            </Stack>
          </Section>
          <Section label="Switch">
            <Switch checked={on} onCheckedChange={setOn} aria-label="Bật tắt" />
          </Section>
          <Section label="Segmented">
            <Inline gap={2} align="center">
              <ToggleGroup value={segment} onValueChange={(value) => value.length > 0 && setSegment(value)}>
                <ToggleGroupItem value="list">Danh sách</ToggleGroupItem>
                <ToggleGroupItem value="board">Bảng</ToggleGroupItem>
              </ToggleGroup>
              <ThemeToggle />
              <SunIcon className="size-4" />
              <MoonIcon className="size-4" />
            </Inline>
          </Section>
          <Section label="Slider">
            <Slider defaultValue={[40]} aria-label="Mức" />
          </Section>
          <Section label="Badges">
            <Inline gap={2} wrap>
              <StatusBadge status="pending" label="Chờ duyệt" />
              <StatusBadge status="in_progress" label="Đang làm" />
              <StatusBadge status="done" label="Xong" />
              <StatusBadge status="failed" label="Lỗi" />
              <StatusBadge status="draft" label="Nháp" />
              <Badge variant="outline">Standee</Badge>
              <Badge variant="outline">Cover page</Badge>
            </Inline>
          </Section>
          <Section label="Alerts">
            {alert ? <Alert tone="info" title="Thông tin" onClose={() => setAlert(false)}>Có thể đóng.</Alert> : <Button size="sm" onClick={() => setAlert(true)}>Hiện lại</Button>}
            <Alert tone="success" title="Đã lưu" />
            <Alert tone="warning" title="Kiểm tra lại" />
            <Alert tone="error" title="Không lưu được" />
          </Section>
          <Section label="Progress">
            <Stack gap={2}>
              {Array.from({ length: 8 }, (_, index) => (
                <Stack key={index} gap={1}>
                  <Text size="xs">Step {index + 1} of 8</Text>
                  <Progress value={((index + 1) / 8) * 100} />
                </Stack>
              ))}
            </Stack>
          </Section>
          <Section label="Spinner">
            <Spinner />
          </Section>
          <Section label="Avatar">
            <Inline gap={2} align="center">
              <Avatar><AvatarFallback>QD</AvatarFallback></Avatar>
              <Stack gap={1}>
                <Text weight="medium">Quoc</Text>
                <Text size="xs" tone="muted">Designer</Text>
              </Stack>
            </Inline>
          </Section>
          <Section label="Icons">
            <Inline gap={3} wrap>
              {ICONS.map((Icon, index) => <Icon key={index} className="size-4" />)}
            </Inline>
          </Section>
          <Section label="Popup">
            <Inline gap={2} wrap>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="sm">Tooltip</Button>} />
                <TooltipContent>Chú thích</TooltipContent>
              </Tooltip>
              <Popover>
                <PopoverTrigger render={<Button variant="outline" size="sm">Popover</Button>} />
                <PopoverContent>Nội dung phụ</PopoverContent>
              </Popover>
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm">Dialog</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Hộp thoại</DialogTitle></DialogHeader>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => toast.success("Đã xong")}>Toast</Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="sm">Menu</Button>} />
                <DropdownMenuContent>
                  <DropdownMenuItem>Một</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Inline>
          </Section>
          <Section label="Bảng">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead numeric>Số</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>POSM-01</TableCell>
                  <TableCell numeric>12</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
          <Section label="Độ bền">
            <Box className="w-60 max-w-full">
              <Text>Yêu cầu in standee khai trương cửa hàng Shondo Nguyễn Ảnh Thủ, chữ dài phải nằm trong khung hẹp.</Text>
            </Box>
          </Section>
        </Grid>
      </Stack>
    </Stack>
  )
}

export { DesignSystem }
