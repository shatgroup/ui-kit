import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  FileIcon,
  FolderIcon,
  HouseIcon,
  ImageIcon,
  InfoIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TriangleAlertIcon,
  UserIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert } from "@/components/ui/alert.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { CheckboxField } from "@/components/ui/checkbox.tsx"
import { DateInput } from "@/components/ui/date-input.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
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
import { SwitchField } from "@/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { TagsInput } from "@/components/ui/tags-input.tsx"
import { useThemeTransition } from "@/components/ui/theme-toggle.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"

const SWATCHES = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card" },
  { name: "muted", className: "bg-muted" },
  { name: "primary", className: "bg-primary" },
  { name: "primary-foreground", className: "bg-primary-foreground" },
  { name: "sidebar-primary", className: "bg-sidebar-primary" },
  { name: "sidebar-primary-foreground", className: "bg-sidebar-primary-foreground" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
]
const INTENTIONAL = new Set(["primary", "primary-foreground", "sidebar-primary", "sidebar-primary-foreground"])
const TYPE_ROWS = [
  { name: "Title L", weight: "bold" as const, size: "3xl" as const },
  { name: "Title M", weight: "semibold" as const, size: "2xl" as const },
  { name: "Title S", weight: "semibold" as const, size: "xl" as const },
  { name: "Headline", weight: "medium" as const, size: "lg" as const },
  { name: "Body", weight: "normal" as const, size: "base" as const },
  { name: "Caption", weight: "medium" as const, size: "sm" as const },
  { name: "Micro", weight: "medium" as const, size: "xs" as const },
]
const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const
const BUTTON_STATES = ["default", "hover", "pressed", "focus", "disabled", "loading"] as const
const SPACES = [1, 2, 3, 4, 6, 8] as const
const RADII = ["sm", "md", "lg", "xl", "full"] as const
const ICONS = [HouseIcon, SearchIcon, BellIcon, SettingsIcon, UserIcon, FolderIcon, FileIcon, ImageIcon]
const black = [0, 0, 0] as const
const white = [255, 255, 255] as const

function channel(value: number) {
  const unit = value / 255
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
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

function readBackground(node: HTMLElement) {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return black
  context.fillStyle = getComputedStyle(node).backgroundColor
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return [r, g, b] as const
}

function KitCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <Text size="xs" tone="muted">{children}</Text>
}

function DesignSystem() {
  const [checked, setChecked] = useState(true)
  const [unchecked, setUnchecked] = useState(false)
  const [partial, setPartial] = useState(true)
  const [radio, setRadio] = useState("checked")
  const [lightOn, setLightOn] = useState(false)
  const [darkOn, setDarkOn] = useState(true)
  const [amount, setAmount] = useState(12)
  const [tags, setTags] = useState(["Keyword", "Keyword"])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 16))
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, error: true })
  const { dark, toggle } = useThemeTransition()
  const probeRefs = useRef<Record<string, HTMLElement | null>>({})
  const typeRefs = useRef<Array<HTMLElement | null>>([])
  const spaceRefs = useRef<Array<HTMLElement | null>>([])
  const radiusRefs = useRef<Array<HTMLElement | null>>([])
  const controlSm = useRef<HTMLButtonElement>(null)
  const controlMd = useRef<HTMLButtonElement>(null)
  const controlLg = useRef<HTMLButtonElement>(null)
  const [ink, setInk] = useState<Array<{ name: string; className: string; hex: string; ink: string; ratio: string; label: string }>>([])
  const [typeMetrics, setTypeMetrics] = useState<Array<{ weight: string; size: string; line: string; tracking: string }>>([])
  const [spaces, setSpaces] = useState<string[]>([])
  const [radii, setRadii] = useState<string[]>([])
  const [controls, setControls] = useState({ sm: "", md: "", lg: "" })

  useLayoutEffect(() => {
    setInk(SWATCHES.map((item) => {
      const node = probeRefs.current[item.name]
      const rgb = node ? readBackground(node) : black
      const onBlack = contrast(rgb, black)
      const onWhite = contrast(rgb, white)
      const tone = onBlack >= onWhite ? "text-ink-black" : "text-ink-white"
      const ratio = Math.max(onBlack, onWhite)
      const label = INTENTIONAL.has(item.name) ? "NGOẠI LỆ" : ratio >= 4.5 ? "ĐẠT" : "KHÔNG ĐẠT"
      return { ...item, hex: toHex(rgb), ink: tone, ratio: ratio.toFixed(2), label }
    }))
    setTypeMetrics(TYPE_ROWS.map((_, index) => {
      const node = typeRefs.current[index]
      if (!node) return { weight: "", size: "", line: "", tracking: "" }
      const style = getComputedStyle(node)
      return { weight: style.fontWeight, size: style.fontSize, line: style.lineHeight, tracking: style.letterSpacing }
    }))
    setSpaces(SPACES.map((_, index) => {
      const node = spaceRefs.current[index]
      return node ? getComputedStyle(node).width : ""
    }))
    setRadii(RADII.map((_, index) => {
      const node = radiusRefs.current[index]
      return node ? getComputedStyle(node).borderRadius : ""
    }))
    setControls({
      sm: controlSm.current ? getComputedStyle(controlSm.current).height : "",
      md: controlMd.current ? getComputedStyle(controlMd.current).height : "",
      lg: controlLg.current ? getComputedStyle(controlLg.current).height : "",
    })
  }, [])

  return (
    <Stack gap={8}>
      <Inline justify="between" align="end" gap={6}>
        <Stack gap={2} className="max-w-xl">
          <Text as="h1" size="3xl" weight="bold">UI Kit</Text>
          <Text tone="muted">
            Bộ giao diện dùng chung. Màu teal, không bóng. Chữ Be Vietnam Pro cho tiếng Việt.
          </Text>
        </Stack>
        <span className="specimen-word font-medium text-muted-foreground">Be Vietnam Pro</span>
      </Inline>

      <Grid columns={{ base: 1, lg: 2 }} gap={6} className="items-start">
        <Card>
          <CardContent>
            <Stack gap={2}>
              <Text size="sm" weight="medium">Font Be Vietnam Pro</Text>
              <span className="specimen-display font-semibold">Aa1</span>
              <Text size="sm" tone="muted">regular → medium → semibold → bold</Text>
            </Stack>
          </CardContent>
        </Card>
        <div className="swatch-stack">
          {SWATCHES.map((item) => {
            const row = ink.find((entry) => entry.name === item.name)
            const tone = row?.ink ?? "text-ink-black"
            return (
              <div key={item.name} className={`${item.className} ${tone} rounded-xl border border-border px-4 py-3`}>
                <span ref={(node) => { probeRefs.current[item.name] = node }} className={`absolute size-0 ${item.className}`} />
                <Text size="sm" weight="medium" className={tone}>{item.name}</Text>
                <Text size="xs" className={tone}>{row ? `${row.hex.toUpperCase()} · ${row.ratio}:1 · ${row.label}` : "…"}</Text>
              </div>
            )
          })}
        </div>
      </Grid>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {["Tên", "Độ đậm", "Cỡ", "Line height", "Giãn chữ"].map((label) => (
                  <TableHead key={label}><span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span></TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TYPE_ROWS.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <span ref={(node) => { typeRefs.current[index] = node?.firstElementChild instanceof HTMLElement ? node.firstElementChild : node }}>
                      <Text size={row.size} weight={row.weight}>{row.name}</Text>
                    </span>
                  </TableCell>
                  <TableCell>{typeMetrics[index]?.weight}</TableCell>
                  <TableCell>{typeMetrics[index]?.size}</TableCell>
                  <TableCell>{typeMetrics[index]?.line}</TableCell>
                  <TableCell>{typeMetrics[index]?.tracking}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Grid columns={{ base: 1, md: 3 }} gap={4}>
        <Card>
          <CardHeader><CardTitle>Khoảng cách</CardTitle></CardHeader>
          <CardContent>
            <Stack gap={3}>
              {SPACES.map((level, index) => (
                <Inline key={level} gap={3} align="center">
                  <span ref={(node) => { spaceRefs.current[index] = node }} className={`h-3 bg-primary ${level === 1 ? "w-1" : level === 2 ? "w-2" : level === 3 ? "w-3" : level === 4 ? "w-4" : level === 6 ? "w-6" : "w-8"}`} />
                  <Note>{level} · {spaces[index]}</Note>
                </Inline>
              ))}
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Bo góc</CardTitle></CardHeader>
          <CardContent>
            <Inline gap={3} wrap>
              {RADII.map((level, index) => (
                <Stack key={level} gap={1} align="center">
                  <span ref={(node) => { radiusRefs.current[index] = node }} className={`size-10 border border-border bg-muted rounded-${level}`} />
                  <Note>{level} · {radii[index]}</Note>
                </Stack>
              ))}
            </Inline>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Control</CardTitle></CardHeader>
          <CardContent>
            <Stack gap={2}>
              <Button ref={controlSm} size="sm">sm · {controls.sm}</Button>
              <Button ref={controlMd} size="default">default · {controls.md}</Button>
              <Button ref={controlLg} size="lg">lg · {controls.lg}</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Stack gap={3}>
        <Text as="h2" size="xl" weight="semibold">UI Kit</Text>
        <div className="kit-masonry">
          <KitCard title="Buttons">
            <Stack gap={3}>
              {BUTTON_VARIANTS.map((variant) => (
                <Inline key={variant} gap={2} wrap>
                  {BUTTON_STATES.map((state) => (
                    <Stack key={state} gap={1} align="center">
                      <Button
                        variant={variant}
                        forceState={state === "hover" || state === "pressed" || state === "focus" ? state : undefined}
                        disabled={state === "disabled"}
                        loading={state === "loading"}
                      >
                        {variant}
                      </Button>
                      <Note>{state === "default" ? "Default" : state[0]?.toUpperCase() + state.slice(1)}</Note>
                    </Stack>
                  ))}
                </Inline>
              ))}
            </Stack>
          </KitCard>

          <KitCard title="Inputs">
            <Stack gap={3}>
              <FormField label="Trống"><Input placeholder="Nhập chữ" /></FormField>
              <Stack gap={1}>
                <FormField label="Focus"><Input defaultValue="Christian Bal" data-force-state="focus" className="border-ring ring-2 ring-ring" /></FormField>
                <Note>Focus</Note>
              </Stack>
              <FormField label="Đã điền"><Input defaultValue="Christian Bal" /></FormField>
              <FormField label="Lỗi" error="Không hợp lệ"><Input defaultValue="???" aria-invalid /></FormField>
              <FormField label="Tiền tố"><InputGroup prefix="$" placeholder="0.00" aria-label="Tiền tố" /></FormField>
              <FormField label="Mật khẩu"><PasswordInput aria-label="Mật khẩu" /></FormField>
              <FormField label="Ngày"><DateInput value={date} onValueChange={setDate} /></FormField>
              <FormField label="Số"><NumberInput value={amount} onValueChange={setAmount} min={0} max={40} /></FormField>
              <FormField label="Tag"><TagsInput value={tags} onValueChange={setTags} /></FormField>
            </Stack>
          </KitCard>

          <KitCard title="Dropdown">
            <Stack gap={2} className="min-h-48">
              <Select open modal={false} value="figma" onOpenChange={() => undefined}>
                <SelectTrigger aria-label="Dropdown"><span>Figma</span></SelectTrigger>
                <SelectContent>
                  <SelectItem value="framer">Framer</SelectItem>
                  <SelectItem value="sketch">Sketch</SelectItem>
                  <SelectItem value="invision">InVision Studio</SelectItem>
                  <SelectItem value="figma">Figma</SelectItem>
                  <SelectItem value="adobe">Adobe XD</SelectItem>
                </SelectContent>
              </Select>
            </Stack>
          </KitCard>

          <KitCard title="Checkbox">
            <Stack gap={2}>
              <CheckboxField label="Checked" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
              <CheckboxField label="Unchecked" checked={unchecked} onCheckedChange={(value) => setUnchecked(value === true)} />
              <CheckboxField label="Indeterminate" indeterminate={partial} checked={false} onCheckedChange={() => setPartial(false)} />
              <CheckboxField label="Disabled" disabled />
            </Stack>
          </KitCard>

          <KitCard title="Radio">
            <RadioGroup value={radio} onValueChange={setRadio} aria-label="Radio">
              <RadioField value="checked" label="Checked" />
              <RadioField value="unchecked" label="Unchecked" />
              <RadioField value="disabled" label="Disabled" disabled />
            </RadioGroup>
          </KitCard>

          <KitCard title="Switch">
            <Stack gap={3}>
              <SwitchField label="Light" checked={lightOn} onCheckedChange={setLightOn} />
              <SwitchField label="Dark" checked={darkOn} onCheckedChange={setDarkOn} />
              <SwitchField label="Disabled" disabled />
              <Inline gap={1} className="w-fit rounded-lg border border-border p-1">
                <Button size="sm" variant={dark ? "ghost" : "secondary"} aria-label="Sáng" onClick={(event) => { if (dark) toggle(event) }}>
                  <SunIcon />
                </Button>
                <Button size="sm" variant={dark ? "secondary" : "ghost"} aria-label="Tối" onClick={(event) => { if (!dark) toggle(event) }}>
                  <MoonIcon />
                </Button>
              </Inline>
            </Stack>
          </KitCard>

          <KitCard title="Alerts">
            <Stack gap={2}>
              {alerts.info ? <Alert variant="line" tone="info" title="Here is something that you might like to know" icon={<InfoIcon className="size-4 text-info" />} onClose={() => setAlerts((current) => ({ ...current, info: false }))} /> : null}
              {alerts.success ? <Alert variant="line" tone="success" title="All the informations have been correctly saved" icon={<CircleCheckIcon className="size-4 text-success" />} onClose={() => setAlerts((current) => ({ ...current, success: false }))} /> : null}
              {alerts.warning ? <Alert variant="line" tone="warning" title="Please fill all the necessary data" icon={<TriangleAlertIcon className="size-4 text-warning" />} onClose={() => setAlerts((current) => ({ ...current, warning: false }))} /> : null}
              {alerts.error ? <Alert variant="line" tone="error" title="Here is something that you might like to know" icon={<CircleAlertIcon className="size-4 text-destructive" />} onClose={() => setAlerts((current) => ({ ...current, error: false }))} /> : null}
            </Stack>
          </KitCard>

          <KitCard title="Stepper">
            <NumberInput value={amount} onValueChange={setAmount} min={0} max={40} />
          </KitCard>

          <KitCard title="Tags & Badges">
            <Inline gap={2} wrap>
              <Badge>Paid</Badge>
              <Badge variant="neutral">Unpaid</Badge>
              <Badge variant="warning">Overdue</Badge>
              <Badge variant="outline">Draft</Badge>
            </Inline>
          </KitCard>

          <KitCard title="Progress">
            <Stack gap={2}>
              {Array.from({ length: 8 }, (_, index) => (
                <Stack key={index} gap={1}>
                  <Text size="xs">Step {index + 1} of 8</Text>
                  <Progress value={((index + 1) / 8) * 100} />
                </Stack>
              ))}
            </Stack>
          </KitCard>

          <KitCard title="Spinner">
            <Inline gap={3} align="center">
              <Spinner />
              <Button loading>Loading</Button>
            </Inline>
          </KitCard>

          <KitCard title="Slider">
            <Slider defaultValue={[40]} aria-label="Mức" />
          </KitCard>

          <KitCard title="Avatar">
            <Inline gap={2} align="center">
              <Avatar>
                <AvatarFallback>JH</AvatarFallback>
              </Avatar>
              <Stack gap={0}>
                <Text size="sm" weight="medium">Jan H.</Text>
                <Text size="xs" className="text-primary-text">View profile</Text>
              </Stack>
            </Inline>
          </KitCard>

          <KitCard title="Icons">
            <Inline gap={2} wrap>
              {ICONS.map((Icon) => (
                <span key={Icon.displayName} className="flex size-8 items-center justify-center rounded-md border border-border">
                  <Icon className="size-4" />
                </span>
              ))}
            </Inline>
          </KitCard>

          <KitCard title="Popup">
            <Inline gap={2} wrap>
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm">Dialog</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Hộp thoại</DialogTitle></DialogHeader>
                  <Text size="sm">Nội dung nằm trong khung, không đè nút mở.</Text>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="sm">Menu</Button>} />
                <DropdownMenuContent>
                  <DropdownMenuItem>Sửa</DropdownMenuItem>
                  <DropdownMenuItem>Xoá</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger render={<Button variant="outline" size="sm">Popover</Button>} />
                <PopoverContent>Nội dung phụ.</PopoverContent>
              </Popover>
            </Inline>
          </KitCard>

          <KitCard title="Bảng">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead numeric>Số</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Cover page</TableCell>
                  <TableCell numeric>18</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Executive summary</TableCell>
                  <TableCell numeric>29</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </KitCard>

          <KitCard title="Độ bền">
            <Text size="sm">
              Chuỗi dài không được tràn khung: Shondo 22 Nguyễn Ảnh Thủ – Trung Mỹ Tây, Quận 12, TP. Hồ Chí Minh, máy quay đi ngang quầy khai trương và chữ tiếng Việt có dấu vẫn nằm trong card.
            </Text>
          </KitCard>
        </div>
      </Stack>
    </Stack>
  )
}

export { DesignSystem }
