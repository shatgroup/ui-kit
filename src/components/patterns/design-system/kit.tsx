import { useState, type ReactNode } from "react"
import { Bar, BarChart, Cell, XAxis } from "recharts"
import { toast } from "sonner"
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  EyeIcon,
  FileIcon,
  FolderIcon,
  HouseIcon,
  ImageIcon,
  InfoIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TriangleAlertIcon,
  UserIcon,
  XIcon,
} from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert } from "@/components/ui/alert.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart.tsx"
import { CheckboxField } from "@/components/ui/checkbox-field.tsx"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command.tsx"
import { DateInput } from "@/components/ui/date-input.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { InputGroup } from "@/components/ui/input-group.tsx"
import { NumberInput } from "@/components/ui/number-input.tsx"
import { PasswordInput } from "@/components/ui/password-input.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { RadioGroup } from "@/components/ui/radio-group.tsx"
import { RadioField } from "@/components/ui/radio-field.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Slider } from "@/components/ui/slider.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { StatusBadge } from "@/components/ui/status-badge.tsx"
import { SwitchField } from "@/components/ui/switch-field.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { TagsInput } from "@/components/ui/tags-input.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useThemeTransition } from "@/components/ui/theme-toggle.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const ICONS = [HouseIcon, SearchIcon, BellIcon, SettingsIcon, UserIcon, FolderIcon, FileIcon, ImageIcon, PlusIcon, CheckIcon, XIcon, MinusIcon, EyeIcon, CalendarIcon, ChevronDownIcon, SunIcon, MoonIcon, InfoIcon]
const CHART = [
  { name: "1", value: 40, fill: "var(--chart-1)" },
  { name: "2", value: 65, fill: "var(--chart-2)" },
  { name: "3", value: 30, fill: "var(--chart-3)" },
  { name: "4", value: 80, fill: "var(--chart-4)" },
  { name: "5", value: 50, fill: "var(--chart-5)" },
]
const chartConfig = {
  value: { label: "Mẫu", color: "var(--chart-1)" },
} satisfies ChartConfig

function Note({ children }: { children: ReactNode }) {
  return <Text size="xs" tone="muted">{children}</Text>
}

function KitCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <Text size="sm" tone="muted">{title}</Text>
      </CardHeader>
      <CardContent>
        <Stack gap={3}>{children}</Stack>
      </CardContent>
    </Card>
  )
}

function Kit() {
  const [checked, setChecked] = useState(true)
  const [openBox, setOpenBox] = useState(false)
  const [partial, setPartial] = useState(true)
  const [radio, setRadio] = useState("checked")
  const [choice, setChoice] = useState("selected")
  const [lightOn, setLightOn] = useState(false)
  const [darkOn, setDarkOn] = useState(true)
  const [disabledOn, setDisabledOn] = useState(true)
  const [amount, setAmount] = useState(12)
  const [tags, setTags] = useState(["Keyword", "Keyword"])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 20))
  const [segment, setSegment] = useState("bookings")
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, error: true })
  const { dark, toggle } = useThemeTransition()

  return (
    <Stack gap={4}>
      <Text as="h2" id="component" size="2xl" weight="bold">Component</Text>
      <div className="kit-masonry">
        <KitCard title="Buttons">
          {VARIANTS.map((variant) => (
            <Inline key={variant} gap={2}>
              <Stack gap={1} align="center">
                <Button variant={variant}>{variant}</Button>
                <Note>Default</Note>
              </Stack>
              <Stack gap={1} align="center">
                <Button variant={variant} forceState="hover">{variant}</Button>
                <Note>Hover</Note>
              </Stack>
              <Stack gap={1} align="center">
                <Button variant={variant} disabled>{variant}</Button>
                <Note>Disabled</Note>
              </Stack>
            </Inline>
          ))}
          <Inline gap={2}>
            <Stack gap={1} align="center">
              <Button><PlusIcon />Thêm</Button>
              <Note>Icon</Note>
            </Stack>
            <Stack gap={1} align="center">
              <Button size="icon" aria-label="Thêm"><PlusIcon /></Button>
              <Note>Chỉ icon</Note>
            </Stack>
          </Inline>
          <Stack gap={2}>
            <Stack gap={1}>
              <Button size="sm">sm</Button>
              <Note>32</Note>
            </Stack>
            <Stack gap={1}>
              <Button size="default">md</Button>
              <Note>36</Note>
            </Stack>
            <Stack gap={1}>
              <Button size="lg">lg</Button>
              <Note>40</Note>
            </Stack>
          </Stack>
        </KitCard>

        <KitCard title="Tags và Badges">
          <Inline gap={2}>
            <StatusBadge status="done" label="Done" />
            <StatusBadge status="pending" label="Pending" />
            <StatusBadge status="in_progress" label="In progress" />
            <StatusBadge status="failed" label="Failed" />
            <StatusBadge status="draft" label="Draft" />
          </Inline>
          <Note>StatusBadge nền nhạt</Note>
          <Inline gap={2}>
            <Badge variant="outline">Nhãn</Badge>
            <Badge variant="outline">Phân loại</Badge>
            <Badge>+2</Badge>
          </Inline>
          <Note>Outline và số thêm</Note>
        </KitCard>

        <KitCard title="Alerts">
          {alerts.info ? <Alert variant="line" tone="info" title="Đây là một thông tin cần biết" icon={<InfoIcon className="size-4 text-info" />} onClose={() => setAlerts((current) => ({ ...current, info: false }))} /> : null}
          {alerts.success ? <Alert variant="line" tone="success" title="Đã lưu thông tin" icon={<CircleCheckIcon className="size-4 text-success" />} onClose={() => setAlerts((current) => ({ ...current, success: false }))} /> : null}
          {alerts.warning ? <Alert variant="line" tone="warning" title="Cần điền đủ dữ liệu" icon={<TriangleAlertIcon className="size-4 text-warning" />} onClose={() => setAlerts((current) => ({ ...current, warning: false }))} /> : null}
          {alerts.error ? <Alert variant="line" tone="error" title="Không lưu được" icon={<CircleAlertIcon className="size-4 text-destructive" />} onClose={() => setAlerts((current) => ({ ...current, error: false }))} /> : null}
          <Note>Info, success, warning, destructive</Note>
        </KitCard>

        <KitCard title="Checkboxes">
          <CheckboxField label="Checked" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
          <CheckboxField label="Unchecked" checked={openBox} onCheckedChange={(value) => setOpenBox(value === true)} />
          <CheckboxField label="Indeterminate" indeterminate={partial} checked={false} onCheckedChange={() => setPartial(false)} />
          <CheckboxField label="Disabled checked" checked disabled />
          <CheckboxField label="Disabled unchecked" checked={false} disabled />
        </KitCard>

        <KitCard title="Radios">
          <RadioGroup value={radio} onValueChange={setRadio} aria-label="Radio">
            <RadioField value="checked" label="Checked" />
            <RadioField value="unchecked" label="Unchecked" />
          </RadioGroup>
          <RadioGroup value="on" aria-label="Radio tắt">
            <RadioField value="on" label="Disabled checked" disabled />
            <RadioField value="off" label="Disabled unchecked" disabled />
          </RadioGroup>
        </KitCard>

        <KitCard title="Switches">
          <SwitchField label="Light" checked={lightOn} onCheckedChange={setLightOn} />
          <SwitchField label="Dark" checked={darkOn} onCheckedChange={setDarkOn} />
          <SwitchField label="Disabled bật" checked={disabledOn} onCheckedChange={setDisabledOn} disabled />
          <SwitchField label="Disabled tắt" checked={false} disabled />
        </KitCard>

        <KitCard title="Selectors">
          <RadioGroup value={choice} onValueChange={setChoice} aria-label="Thẻ chọn">
            <div className={choice === "selected" ? "rounded-lg border border-primary p-3" : "rounded-lg border border-border p-3"}>
              <RadioField value="selected" label="Selected" />
            </div>
            <div className={choice === "open" ? "rounded-lg border border-primary p-3" : "rounded-lg border border-border p-3"}>
              <RadioField value="open" label="Unselected" />
            </div>
          </RadioGroup>
          <Note>Selected / Unselected</Note>
        </KitCard>

        <KitCard title="Text Inputs">
          <FormField label="Label"><Input defaultValue="Christian Bal" /></FormField>
          <Note>Default</Note>
          <FormField label="Lỗi" error="Không hợp lệ"><Input defaultValue="???" /></FormField>
          <Note>Lỗi</Note>
          <FormField label="Tắt"><Input defaultValue="Không sửa" disabled /></FormField>
          <Note>Disabled</Note>
          <Note>Focus hiện khi bấm vào ô. Input không có forceState.</Note>
          <FormField label="Website"><InputGroup prefix="https://" aria-label="Website" placeholder="example.com" /></FormField>
          <Note>Tiền tố</Note>
          <FormField label="Đơn vị"><InputGroup suffix="px" aria-label="Đơn vị" defaultValue="123" /></FormField>
          <Note>Hậu tố</Note>
          <FormField label="Mật khẩu"><PasswordInput aria-label="Mật khẩu" defaultValue="secret" /></FormField>
          <Note>Password</Note>
          <FormField label="Ngày"><DateInput value={date} onValueChange={setDate} /></FormField>
          <Note>Date</Note>
          <FormField label="Tags"><TagsInput value={tags} onValueChange={setTags} /></FormField>
          <Note>Tags. Badge của kit là outline, không tô xanh và cam.</Note>
          <FormField label="Ghi chú"><Textarea defaultValue="Nội dung nhiều dòng" /></FormField>
          <Note>Textarea</Note>
        </KitCard>

        <KitCard title="Dropdown">
          <Select defaultValue="figma">
            <SelectTrigger aria-label="Dropdown"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="framer">Framer</SelectItem>
              <SelectItem value="sketch">Sketch</SelectItem>
              <SelectItem value="invision">InVision Studio</SelectItem>
              <SelectItem value="figma">Figma</SelectItem>
              <SelectItem value="adobe">Adobe XD</SelectItem>
            </SelectContent>
          </Select>
          <Note>Select bấm để mở</Note>
          <Command className="rounded-lg border border-border">
            <CommandList>
              <CommandGroup>
                <CommandItem value="framer">Framer</CommandItem>
                <CommandItem value="sketch">Sketch</CommandItem>
                <CommandItem value="invision">InVision Studio</CommandItem>
                <CommandItem value="figma">Figma</CommandItem>
                <CommandItem value="adobe">Adobe XD</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <Note>Danh sách tĩnh, dòng đầu đang chọn</Note>
        </KitCard>

        <KitCard title="Steppers">
          <NumberInput value={amount} onValueChange={setAmount} min={0} max={40} />
          <Note>Default. Nút giảm và tăng nằm ở hai đầu.</Note>
          <InputGroup suffix="px" aria-label="Stepper đơn vị" defaultValue="123" />
          <Note>Đơn vị px. NumberInput không còn chỗ cho hậu tố.</Note>
          <InputGroup suffix="px" aria-label="Stepper lỗi" defaultValue="123" aria-invalid />
          <Note>Lỗi</Note>
          <InputGroup suffix="px" aria-label="Stepper tắt" defaultValue="123" disabled />
          <Note>Disabled</Note>
          <Note>Focus hiện khi bấm. Không có forceState.</Note>
        </KitCard>

        <KitCard title="Controls">
          <ToggleGroup type="single" variant="outline" value={segment} onValueChange={(value) => { if (value) setSegment(value) }}>
            <ToggleGroupItem value="bookings">Bookings</ToggleGroupItem>
            <ToggleGroupItem value="coaches">Coaches</ToggleGroupItem>
            <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
          </ToggleGroup>
          <Note>Toggle đang chọn</Note>
          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </Tabs>
          <Note>Tabs đang chọn</Note>
          <Inline gap={1} className="w-fit rounded-lg border border-border p-1">
            <Button size="sm" variant={dark ? "ghost" : "secondary"} aria-label="Sáng" onClick={(event) => { if (dark) toggle(event) }}>
              <SunIcon />
            </Button>
            <Button size="sm" variant={dark ? "secondary" : "ghost"} aria-label="Tối" onClick={(event) => { if (!dark) toggle(event) }}>
              <MoonIcon />
            </Button>
          </Inline>
          <Note>Sáng / Tối</Note>
        </KitCard>

        <KitCard title="Slider và Progress">
          <Slider defaultValue={[40]} aria-label="Mức" />
          <Note>Một giá trị</Note>
          {[1, 3, 5, 8].map((step) => (
            <Stack key={step} gap={1}>
              <Text size="xs">Step {step} of 8</Text>
              <Progress value={(step / 8) * 100} />
            </Stack>
          ))}
          <Note>Rút còn 4 dòng</Note>
        </KitCard>

        <KitCard title="Spinners">
          <Inline gap={3} align="center">
            <Spinner />
            <Spinner className="size-8" />
          </Inline>
          <Note>16px và 32px</Note>
        </KitCard>

        <KitCard title="Avatar">
          <Inline gap={2} align="center">
            <Avatar size="lg">
              <AvatarFallback>JH</AvatarFallback>
            </Avatar>
            <Stack gap={0}>
              <Text size="sm" weight="medium">Jan H.</Text>
              <Text size="xs" tone="primary">View profile</Text>
            </Stack>
          </Inline>
          <Note>Chữ viết tắt. Không có ảnh người dùng trong kit.</Note>
        </KitCard>

        <KitCard title="Overlay">
          <Inline gap={2}>
            <Dialog>
              <DialogTrigger asChild><Button variant="outline" size="sm">Dialog</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Hộp thoại</DialogTitle></DialogHeader>
                <Text size="sm">Nội dung trong khung.</Text>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm">Sheet</Button></SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Bảng cạnh</SheetTitle></SheetHeader>
                <Text size="sm">Trượt từ mép màn hình.</Text>
              </SheetContent>
            </Sheet>
            <Drawer>
              <DrawerTrigger asChild><Button variant="outline" size="sm">Drawer</Button></DrawerTrigger>
              <DrawerContent>
                <DrawerHeader><DrawerTitle>Ngăn kéo</DrawerTitle></DrawerHeader>
                <Text size="sm">Trượt từ đáy.</Text>
              </DrawerContent>
            </Drawer>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="sm">Tooltip</Button></TooltipTrigger>
              <TooltipContent>Chú thích</TooltipContent>
            </Tooltip>
            <HoverCard>
              <HoverCardTrigger asChild><Button variant="outline" size="sm">HoverCard</Button></HoverCardTrigger>
              <HoverCardContent>Nội dung khi rê chuột.</HoverCardContent>
            </HoverCard>
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" size="sm">Popover</Button></PopoverTrigger>
              <PopoverContent>Nội dung phụ.</PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Mở menu</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Sửa</DropdownMenuItem>
                <DropdownMenuItem>Xoá</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => toast("Đã lưu mẫu")}>Toast</Button>
          </Inline>
          <Note>Bấm để mở thật</Note>
        </KitCard>

        <KitCard title="Data">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>Xong</TableCell>
                <TableCell>18</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Summary</TableCell>
                <TableCell>Đang làm</TableCell>
                <TableCell>29</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Appendix</TableCell>
                <TableCell>Nháp</TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Note>Table</Note>
          <Stack gap={2}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Stack>
          <Note>Skeleton</Note>
          <EmptyState title="Chưa có mục" description="Danh sách trống." />
          <Note>EmptyState</Note>
          <Calendar mode="single" selected={date} onSelect={setDate} />
          <Note>Calendar</Note>
        </KitCard>

        <KitCard title="Chart">
          <ChartContainer config={chartConfig} className="aspect-auto h-32 w-full">
            <BarChart data={CHART}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <Bar dataKey="value" radius={4}>
                {CHART.map((item) => (
                  <Cell key={item.name} fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <Note>Năm màu chart</Note>
        </KitCard>

        <KitCard title="Icons">
          <Inline gap={3}>
            {ICONS.map((Icon) => (
              <Stack key={Icon.name} gap={1} align="center">
                <Icon className="size-4" />
                <Icon className="size-5" />
              </Stack>
            ))}
          </Inline>
          <Note>16px và 20px</Note>
        </KitCard>
      </div>
    </Stack>
  )
}

export { Kit }
