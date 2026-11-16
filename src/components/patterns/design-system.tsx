import { useLayoutEffect, useState, type ReactNode } from "react"
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
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"

const SWATCHES = [
  { name: "background", className: "bg-background", ink: "text-foreground" },
  { name: "foreground", className: "bg-foreground", ink: "text-background" },
  { name: "primary", className: "bg-primary", ink: "text-primary-foreground" },
  { name: "primary-text", className: "bg-primary-text", ink: "text-background" },
  { name: "muted", className: "bg-muted", ink: "text-foreground" },
  { name: "accent", className: "bg-accent", ink: "text-accent-foreground" },
  { name: "destructive", className: "bg-destructive", ink: "text-destructive-foreground" },
  { name: "chart-1", className: "bg-chart-1", ink: "text-foreground" },
  { name: "chart-2", className: "bg-chart-2", ink: "text-foreground" },
  { name: "chart-3", className: "bg-chart-3", ink: "text-foreground" },
  { name: "chart-4", className: "bg-chart-4", ink: "text-foreground" },
  { name: "chart-5", className: "bg-chart-5", ink: "text-foreground" },
]
const TYPE_ROWS = [
  { name: "Tiêu đề", weight: "bold" as const, size: "3xl" as const },
  { name: "Mục", weight: "semibold" as const, size: "xl" as const },
  { name: "Nội dung", weight: "medium" as const, size: "base" as const },
  { name: "Phụ", weight: "normal" as const, size: "sm" as const },
]
const ICONS = [HouseIcon, SearchIcon, BellIcon, SettingsIcon, UserIcon, FolderIcon, FileIcon, ImageIcon]

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
  const [hex, setHex] = useState<Record<string, string>>({})

  useLayoutEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    for (const item of SWATCHES) next[item.name] = style.getPropertyValue(`--${item.name}`).trim()
    setHex(next)
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
            {SWATCHES.map((item) => (
              <Box key={item.name} className={`${item.className} ${item.ink} rounded-lg border border-border p-3`}>
                <Text size="sm" weight="medium" className={item.ink}>{item.name}</Text>
                <Text size="xs" className={item.ink}>{hex[item.name] || item.name}</Text>
              </Box>
            ))}
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
                {TYPE_ROWS.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell><Text size={row.size} weight={row.weight}>{row.name}</Text></TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>1.5</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Grid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
          <Card><CardHeader><CardTitle>Khoảng cách</CardTitle></CardHeader><CardContent><Text size="sm" tone="muted">0–16 theo thang 4px</Text></CardContent></Card>
          <Card><CardHeader><CardTitle>Bo góc</CardTitle></CardHeader><CardContent><Text size="sm" tone="muted">sm −4 · md −2 · lg · xl +4</Text></CardContent></Card>
          <Card><CardHeader><CardTitle>Control</CardTitle></CardHeader><CardContent><Text size="sm" tone="muted">sm 32 · md 36 · lg 44</Text></CardContent></Card>
          <Card><CardHeader><CardTitle>Chart</CardTitle></CardHeader><CardContent><Inline gap={2}>{["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"].map((item) => <span key={item} className={`size-6 rounded-md ${item}`} />)}</Inline></CardContent></Card>
        </Grid>
      </Stack>

      <Stack gap={4}>
        <Text as="h2" size="xl" weight="semibold">UI Kit</Text>
        <Grid columns={{ base: 1, lg: 2 }} gap={4}>
          <Section label="Buttons">
            <Inline gap={2} wrap>
              <Button>Default</Button>
              <Button variant="secondary">Hover</Button>
              <Button variant="outline">Pressed</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </Inline>
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
            <Stack gap={2}>
              <Select defaultValue="one">
                <SelectTrigger aria-label="Chọn mục"><span>Mục một</span></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">Mục một</SelectItem>
                  <SelectItem value="two">Mục hai</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border border-border bg-popover p-1 text-sm">
                <div className="rounded-md bg-accent px-2 py-2 text-accent-foreground">Mục đang trỏ</div>
                <div className="px-2 py-2">Mục đã chọn</div>
              </div>
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
                <Progress key={index} value={((index + 1) / 8) * 100} />
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
