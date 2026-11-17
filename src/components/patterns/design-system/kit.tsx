import { useState, type ReactNode } from "react"
import { Bar, BarChart, Cell, XAxis } from "recharts"
import { toast } from "sonner"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, PlusIcon, TriangleAlertIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert } from "@/components/ui/alert.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { ChartContainer } from "@/components/ui/chart.tsx"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Icons } from "./icons.tsx"

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const STATES = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover" },
  { key: "focus", label: "Focus" },
  { key: "disabled", label: "Disabled" },
] as const
const CHART = [
  { name: "1", value: 40, fill: "var(--chart-1)" },
  { name: "2", value: 65, fill: "var(--chart-2)" },
  { name: "3", value: 30, fill: "var(--chart-3)" },
  { name: "4", value: 80, fill: "var(--chart-4)" },
  { name: "5", value: 50, fill: "var(--chart-5)" },
]
const chartConfig = { value: { label: "Mẫu", color: "var(--chart-1)" } }

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Stack gap={4}>
      <Text as="h2" id={id} size="xl" weight="semibold" className="scroll-mt-nav">{title}</Text>
      <Grid columns={{ base: 1, md: 6, xl: 12 }} gap={4} className="kit-grid items-stretch">{children}</Grid>
    </Stack>
  )
}

function Span({ at, children }: { at: string; children: ReactNode }) {
  return <div className={`col-span-1 h-full ${at}`}>{children}</div>
}

function Quiet({ name }: { name: string }) {
  return <span className="sr-only">{name}</span>
}

function KitCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="h-full min-w-0">
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
  const [boxOn, setBoxOn] = useState(true)
  const [boxOff, setBoxOff] = useState(false)
  const [partial, setPartial] = useState(true)
  const [radioOn, setRadioOn] = useState("bat")
  const [radioOff, setRadioOff] = useState("khac")
  const [choice, setChoice] = useState("selected")
  const [switchOn, setSwitchOn] = useState(true)
  const [switchOff, setSwitchOff] = useState(false)
  const [amount, setAmount] = useState(12)
  const [tags, setTags] = useState(["Keyword", "Keyword"])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 20))
  const [segment, setSegment] = useState("bookings")
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, error: true })

  return (
    <Stack gap={8}>
      <Section id="hanh-dong" title="Hành động">
        <Span at="md:col-span-4 xl:col-span-8">
          <KitCard title="Buttons">
            <div data-button-matrix className="min-w-0 overflow-x-auto">
              <Grid columns={5} gap={3} className="w-max justify-items-start">
                <span />
                {STATES.map((state) => <Text key={state.key} size="xs" tone="muted">{state.label}</Text>)}
                {VARIANTS.map((variant) => (
                  <span key={variant} className="contents">
                    <Text size="xs">{variant}</Text>
                    <Button variant={variant} className="w-fit">Button</Button>
                    <Button variant={variant} forceState="hover" className="w-fit">Button</Button>
                    <Button variant={variant} forceState="focus" className="w-fit">Button</Button>
                    <Button variant={variant} disabled className="w-fit">Button</Button>
                  </span>
                ))}
                <Text size="xs">Kích thước</Text>
                <div className="col-span-4">
                  <Grid columns={5} gap={3} className="w-max justify-items-start">
                    <Button size="sm" className="w-fit">sm</Button>
                    <Button className="w-fit">default</Button>
                    <Button size="lg" className="w-fit">lg</Button>
                    <Button className="w-fit"><PlusIcon />Thêm</Button>
                    <Button size="icon" aria-label="Thêm"><PlusIcon /></Button>
                  </Grid>
                </div>
              </Grid>
            </div>
          </KitCard>
        </Span>
        <Span at="md:col-span-2 xl:col-span-4">
          <KitCard title="Controls">
            <div className="min-w-0 overflow-x-auto">
            <ToggleGroup type="single" variant="outline" value={segment} onValueChange={(value) => { if (value) setSegment(value) }} aria-label="Nhóm">
              <ToggleGroupItem value="bookings">Bookings</ToggleGroupItem>
              <ToggleGroupItem value="coaches">Coaches</ToggleGroupItem>
              <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
            </ToggleGroup>
            </div>
            <div className="min-w-0 overflow-x-auto">
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="coaches">Coaches</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </Tabs>
            </div>
          </KitCard>
        </Span>
      </Section>

      <Section id="nhap-lieu" title="Nhập liệu">
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Text Inputs">
            <Grid columns={{ base: 1, md: 2 }} gap={3}>
              <FormField label="Label"><Input defaultValue="Christian Bal" /></FormField>
              <FormField label="Lỗi" error="Không hợp lệ"><Input defaultValue="???" /></FormField>
              <FormField label="Tắt"><Input defaultValue="Không sửa" disabled /></FormField>
              <FormField label="Website"><InputGroup prefix="https://" aria-label="Website" placeholder="example.com" /></FormField>
              <FormField label="Đơn vị"><InputGroup suffix="px" aria-label="Đơn vị" defaultValue="123" /></FormField>
              <FormField label="Mật khẩu"><PasswordInput aria-label="Mật khẩu" defaultValue="secret" /></FormField>
              <FormField label="Ngày"><DateInput value={date} onValueChange={setDate} /></FormField>
              <FormField label="Tags"><TagsInput value={tags} onValueChange={setTags} /></FormField>
              <FormField label="Ghi chú"><Textarea defaultValue="Nội dung nhiều dòng" /></FormField>
            </Grid>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
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
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Stepper">
            <FormField label="Mặc định"><NumberInput value={amount} onValueChange={setAmount} min={0} max={40} /></FormField>
            <FormField label="Đơn vị"><InputGroup suffix="px" aria-label="Stepper đơn vị" defaultValue="123" /></FormField>
            <FormField label="Lỗi" error="Không hợp lệ"><InputGroup suffix="px" aria-label="Stepper lỗi" defaultValue="123" aria-invalid /></FormField>
            <FormField label="Tắt"><InputGroup suffix="px" aria-label="Stepper tắt" defaultValue="123" disabled /></FormField>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Lựa chọn">
            <Grid columns={6} gap={2} className="items-center">
              <span />
              {["Bật", "Tắt", "Disabled bật", "Disabled tắt", "Indeterminate"].map((label) => (
                <Text key={label} size="xs" tone="muted">{label}</Text>
              ))}
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Checkbox</Text>
              <CheckboxField label={<Quiet name="Checkbox bật" />} checked={boxOn} onCheckedChange={(value) => setBoxOn(value === true)} />
              <CheckboxField label={<Quiet name="Checkbox tắt" />} checked={boxOff} onCheckedChange={(value) => setBoxOff(value === true)} />
              <CheckboxField label={<Quiet name="Checkbox disabled bật" />} checked disabled />
              <CheckboxField label={<Quiet name="Checkbox disabled tắt" />} checked={false} disabled />
              <CheckboxField label={<Quiet name="Checkbox indeterminate" />} indeterminate={partial} checked={false} onCheckedChange={() => setPartial(false)} />
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Radio</Text>
              <RadioGroup value={radioOn} onValueChange={setRadioOn} aria-label="Radio bật">
                <RadioField value="bat" label={<Quiet name="Radio bật" />} />
              </RadioGroup>
              <RadioGroup value={radioOff} onValueChange={setRadioOff} aria-label="Radio tắt">
                <RadioField value="tat" label={<Quiet name="Radio tắt" />} />
              </RadioGroup>
              <RadioGroup value="bat" aria-label="Radio disabled bật">
                <RadioField value="bat" label={<Quiet name="Radio disabled bật" />} disabled />
              </RadioGroup>
              <RadioGroup value="khac" aria-label="Radio disabled tắt">
                <RadioField value="tat" label={<Quiet name="Radio disabled tắt" />} disabled />
              </RadioGroup>
              <span />
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Switch</Text>
              <SwitchField label={<Quiet name="Switch bật" />} checked={switchOn} onCheckedChange={setSwitchOn} />
              <SwitchField label={<Quiet name="Switch tắt" />} checked={switchOff} onCheckedChange={setSwitchOff} />
              <SwitchField label={<Quiet name="Switch disabled bật" />} checked disabled />
              <SwitchField label={<Quiet name="Switch disabled tắt" />} checked={false} disabled />
              <span />
            </Grid>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Selectors">
            <RadioGroup value={choice} onValueChange={setChoice} aria-label="Thẻ chọn">
              <div className={choice === "selected" ? "rounded-lg border border-primary p-3" : "rounded-lg border border-border p-3"}>
                <RadioField value="selected" label="Selected" />
              </div>
              <div className={choice === "open" ? "rounded-lg border border-primary p-3" : "rounded-lg border border-border p-3"}>
                <RadioField value="open" label="Unselected" />
              </div>
            </RadioGroup>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Slider">
            <Slider defaultValue={[40]} aria-label="Mức" />
          </KitCard>
        </Span>
      </Section>

      <Section id="phan-hoi" title="Phản hồi">
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Alerts">
            {alerts.info ? <Alert variant="line" tone="info" title="Đây là một thông tin cần biết" icon={<InfoIcon className="size-4 text-info" />} onClose={() => setAlerts((current) => ({ ...current, info: false }))} /> : null}
            {alerts.success ? <Alert variant="line" tone="success" title="Đã lưu thông tin" icon={<CircleCheckIcon className="size-4 text-success" />} onClose={() => setAlerts((current) => ({ ...current, success: false }))} /> : null}
            {alerts.warning ? <Alert variant="line" tone="warning" title="Cần điền đủ dữ liệu" icon={<TriangleAlertIcon className="size-4 text-warning" />} onClose={() => setAlerts((current) => ({ ...current, warning: false }))} /> : null}
            {alerts.error ? <Alert variant="line" tone="error" title="Không lưu được" icon={<CircleAlertIcon className="size-4 text-destructive" />} onClose={() => setAlerts((current) => ({ ...current, error: false }))} /> : null}
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Badges">
            <Inline gap={2}>
              <StatusBadge status="done" label="Done" />
              <StatusBadge status="pending" label="Pending" />
              <StatusBadge status="in_progress" label="In progress" />
              <StatusBadge status="failed" label="Failed" />
              <StatusBadge status="draft" label="Draft" />
            </Inline>
            <Inline gap={2}>
              <Badge variant="outline">Nhãn</Badge>
              <Badge variant="outline">Phân loại</Badge>
              <Badge>+2</Badge>
            </Inline>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Progress">
            {[1, 3, 5, 8].map((step) => (
              <Stack key={step} gap={1}>
                <Text size="xs">Step {step} of 8</Text>
                <Progress value={(step / 8) * 100} />
              </Stack>
            ))}
            <Inline gap={3} align="center">
              <Spinner />
              <Spinner className="size-8" />
            </Inline>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-12">
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
          </KitCard>
        </Span>
      </Section>

      <Section id="du-lieu" title="Dữ liệu">
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Cover</TableCell><TableCell>Xong</TableCell><TableCell>18</TableCell></TableRow>
                <TableRow><TableCell>Summary</TableCell><TableCell>Đang làm</TableCell><TableCell>29</TableCell></TableRow>
                <TableRow><TableCell>Appendix</TableCell><TableCell>Nháp</TableCell><TableCell>7</TableCell></TableRow>
              </TableBody>
            </Table>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Calendar">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Chart">
            <ChartContainer config={chartConfig} className="aspect-auto h-32 w-full">
              <BarChart data={CHART}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <Bar dataKey="value" radius={4}>
                  {CHART.map((item) => <Cell key={item.name} fill={item.fill} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-12">
          <KitCard title="Trạng thái dữ liệu">
            <Inline gap={4} align="center">
              <Inline gap={2} align="center">
                <Avatar size="lg"><AvatarFallback>JH</AvatarFallback></Avatar>
                <Stack gap={0}>
                  <Text size="sm" weight="medium">Jan H.</Text>
                  <Text size="xs" tone="primary">View profile</Text>
                </Stack>
              </Inline>
              <Stack gap={2} className="min-w-0 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </Stack>
              <EmptyState title="Chưa có mục" description="Danh sách trống." />
            </Inline>
          </KitCard>
        </Span>
      </Section>

      <Icons />
    </Stack>
  )
}

export { Kit }
