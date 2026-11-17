import { cloneElement, useId, useState, type ReactElement, type ReactNode } from "react"
import { Bar, BarChart, Cell, XAxis } from "recharts"
import { toast } from "sonner"
import { BoldIcon, CircleAlertIcon, CircleCheckIcon, InfoIcon, ItalicIcon, PlusIcon, SearchIcon, TriangleAlertIcon, UnderlineIcon, UserIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Stepper } from "@/components/media/stepper.tsx"
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
import { Label } from "@/components/ui/label.tsx"
import { ProgressCircle } from "@/components/ui/progress-circle.tsx"
import { ProgressSegments } from "@/components/ui/progress-segments.tsx"
import { StepsBar } from "@/components/ui/steps-bar.tsx"
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
import { ThemeToggle } from "@/components/ui/theme-toggle.tsx"
import { Toggle } from "@/components/ui/toggle.tsx"
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
const chartConfig = { value: { label: "Sample", color: "var(--chart-1)" } }

type Wired = {
  id?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

function ProgressSample({ n, children, extra }: { n: number; children: ReactNode; extra?: ReactNode }) {
  return (
    <div data-progress-sample={n}>
      <Stack gap={1}>
        <Inline gap={3} align="center" wrap={false}>
          <SampleIndex n={n} />
          <div data-sample-control className="min-w-0 flex-1">{children}</div>
        </Inline>
        {extra ? (
          <Inline gap={3} wrap={false}>
            <span className="w-8 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">{extra}</div>
          </Inline>
        ) : null}
      </Stack>
    </div>
  )
}

function SampleIndex({ n }: { n: number }) {
  return (
    <span data-sample-index={n} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
      <Text as="span" size="xs" weight="semibold">{n}</Text>
    </span>
  )
}

function FieldSample({
  n,
  label,
  hint,
  error,
  inline = false,
  children,
}: {
  n: number
  label: string
  hint?: string
  error?: string
  inline?: boolean
  children: ReactElement<Wired>
}) {
  const id = useId()
  const message = error || hint || ""
  const messageId = message ? `${id}-message` : undefined
  const control = cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": messageId,
  })
  const note = message ? (
    <Text id={messageId} as="p" size="sm" tone={error ? "destructive" : "muted"}>{message}</Text>
  ) : null
  if (inline) {
    return (
      <div data-field-sample={n}>
        <Inline gap={3} align="center" wrap={false}>
          <SampleIndex n={n} />
          <Inline gap={3} align="center" wrap={false} className="min-w-0 flex-1">
            <Label htmlFor={id}>{label}</Label>
            <div data-sample-control className="min-w-0 flex-1">{control}</div>
          </Inline>
        </Inline>
      </div>
    )
  }
  return (
    <div data-field-sample={n}>
      <Stack gap={1}>
        <Inline gap={3} align="end" wrap={false}>
          <span className="w-8 shrink-0" aria-hidden="true" />
          <Label htmlFor={id} className="min-w-0 flex-1">{label}</Label>
        </Inline>
        <Inline gap={3} align="center" wrap={false}>
          <SampleIndex n={n} />
          <div data-sample-control className="min-w-0 flex-1">{control}</div>
        </Inline>
        {note ? (
          <Inline gap={3} wrap={false}>
            <span className="w-8 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">{note}</div>
          </Inline>
        ) : null}
      </Stack>
    </div>
  )
}

function TypeCell({
  name,
  label,
  children,
  note,
  className,
}: {
  name: string
  label: string
  children: ReactNode
  note?: ReactNode
  className?: string
}) {
  return (
    <div data-input-type={name} className={`flex h-full min-w-0 flex-col gap-3 border-r border-b border-border p-6 ${className ?? ""}`}>
      <Label>{label}</Label>
      <div data-sample-control className="min-w-0">{children}</div>
      {note}
      <span className="flex-1" />
      <span data-type-name className="block text-center">
        <Text size="sm" weight="medium">{name}</Text>
      </span>
    </div>
  )
}

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

function SampleButton({ variant, state }: { variant: (typeof VARIANTS)[number]; state: (typeof STATES)[number]["key"] }) {
  if (state === "hover") return <Button variant={variant} forceState="hover" className="w-fit">Button</Button>
  if (state === "focus") return <Button variant={variant} forceState="focus" className="w-fit">Button</Button>
  if (state === "disabled") return <Button variant={variant} disabled className="w-fit">Button</Button>
  return <Button variant={variant} className="w-fit">Button</Button>
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
  const [radioOn, setRadioOn] = useState("on")
  const [radioOff, setRadioOff] = useState("other")
  const [choice, setChoice] = useState("selected")
  const [switchOn, setSwitchOn] = useState(true)
  const [switchOff, setSwitchOff] = useState(false)
  const [amount, setAmount] = useState(12)
  const [tags, setTags] = useState(["Design", "System"])
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 20))
  const [segment, setSegment] = useState("bookings")
  const [alerts, setAlerts] = useState({ info: true, success: true, warning: true, error: true })

  return (
    <Stack gap={8}>
      <Section id="hanh-dong" title="Actions">
        <Span at="md:col-span-4 xl:col-span-8">
          <KitCard title="Buttons">
            <Stack gap={6}>
              <div data-button-matrix className="min-w-0">
                <div className="hidden xl:block">
                  <Grid columns={5} gap={3} className="w-max justify-items-start">
                    <span />
                    {STATES.map((state) => <Text key={state.key} size="xs" tone="muted">{state.label}</Text>)}
                    {VARIANTS.map((variant) => (
                      <span key={variant} className="contents">
                        <Text size="xs">{variant}</Text>
                        {STATES.map((state) => <SampleButton key={state.key} variant={variant} state={state.key} />)}
                      </span>
                    ))}
                  </Grid>
                </div>
                <div className="xl:hidden">
                  <Stack gap={4}>
                    {VARIANTS.map((variant) => (
                      <Stack key={variant} gap={2}>
                        <Text size="xs">{variant}</Text>
                        <Inline gap={3}>
                          {STATES.map((state) => (
                            <Stack key={state.key} gap={1} align="start">
                              <Text size="xs" tone="muted">{state.label}</Text>
                              <SampleButton variant={variant} state={state.key} />
                            </Stack>
                          ))}
                        </Inline>
                      </Stack>
                    ))}
                  </Stack>
                </div>
              </div>
              <Stack gap={3}>
                <Text size="xs" tone="muted">Sizes</Text>
                <div data-button-sizes className="min-w-0">
                  <div className="flex flex-wrap items-end gap-3">
                    <Stack slot="size-item" gap={1} align="center">
                      <Button size="sm" className="w-fit">Small</Button>
                      <Text size="xs" tone="muted" className="whitespace-nowrap">Small · 32px</Text>
                    </Stack>
                    <Stack slot="size-item" gap={1} align="center">
                      <Button className="w-fit">Default</Button>
                      <Text size="xs" tone="muted" className="whitespace-nowrap">Default · 36px</Text>
                    </Stack>
                    <Stack slot="size-item" gap={1} align="center">
                      <Button size="lg" className="w-fit">Large</Button>
                      <Text size="xs" tone="muted" className="whitespace-nowrap">Large · 40px</Text>
                    </Stack>
                    <Stack slot="size-item" gap={1} align="center">
                      <Button className="w-fit"><PlusIcon />With icon</Button>
                      <Text size="xs" tone="muted" className="whitespace-nowrap">With icon · 36px</Text>
                    </Stack>
                    <Stack slot="size-item" gap={1} align="center">
                      <Button size="icon" aria-label="Add"><PlusIcon /></Button>
                      <Text size="xs" tone="muted" className="whitespace-nowrap">Icon only · 36px</Text>
                    </Stack>
                  </div>
                </div>
              </Stack>
            </Stack>
          </KitCard>
        </Span>
        <Span at="md:col-span-2 xl:col-span-4">
          <KitCard title="Controls">
            <div data-controls>
              <Stack gap={6}>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Segmented</Text>
                  <ToggleGroup type="single" variant="outline" value={segment} onValueChange={(value) => { if (value) setSegment(value) }} aria-label="Segments" className="max-w-full flex-wrap">
                    <ToggleGroupItem value="bookings">Bookings</ToggleGroupItem>
                    <ToggleGroupItem value="coaches">Coaches</ToggleGroupItem>
                    <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
                  </ToggleGroup>
                </Stack>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Tabs</Text>
                  <Tabs defaultValue="bookings" className="max-w-full">
                    <TabsList className="!h-auto max-w-full flex-wrap">
                      <TabsTrigger value="bookings" className="h-8 flex-none">Bookings</TabsTrigger>
                      <TabsTrigger value="coaches" className="h-8 flex-none">Coaches</TabsTrigger>
                      <TabsTrigger value="notes" className="h-8 flex-none">Notes</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </Stack>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Theme</Text>
                  <ThemeToggle />
                </Stack>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Toggle</Text>
                  <Inline gap={2}>
                    <Toggle variant="outline" aria-label="Bold"><BoldIcon /></Toggle>
                    <Toggle variant="outline" aria-label="Italic"><ItalicIcon /></Toggle>
                    <Toggle variant="outline" aria-label="Underline"><UnderlineIcon /></Toggle>
                  </Inline>
                </Stack>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Dropdown</Text>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="w-fit">Options</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Stack>
              </Stack>
            </div>
          </KitCard>
        </Span>
      </Section>

      <Section id="nhap-lieu" title="Inputs">
        <Span at="md:col-span-6 xl:col-span-12">
          <KitCard title="Input states">
            <div data-input-states className="grid grid-cols-1 gap-6 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
              <FieldSample n={1} label="Default"><Input placeholder="Type here" /></FieldSample>
              <FieldSample n={2} label="Filled"><Input defaultValue="Alex Kim" /></FieldSample>
              <FieldSample n={3} label="With icon"><InputGroup prefix={<UserIcon className="size-4" />} aria-label="Username" placeholder="Username" /></FieldSample>
              <FieldSample n={4} label="Focus"><Input forceState="focus" defaultValue="Focused" /></FieldSample>
              <FieldSample n={5} label="Error" error="This field is invalid"><Input defaultValue="???" /></FieldSample>
              <FieldSample n={6} label="Disabled"><Input defaultValue="Not editable" disabled /></FieldSample>
              <FieldSample n={7} label="Email" inline><Input placeholder="name@studio.com" /></FieldSample>
              <FieldSample n={8} label="With helper text" hint="Shown under the field"><Input placeholder="Add a note" /></FieldSample>
            </div>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-12">
          <KitCard title="Input types">
            <div data-input-types className="grid min-w-0 grid-cols-1 border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
              <TypeCell name="Text input" label="Name">
                <Input placeholder="Text" />
              </TypeCell>
              <TypeCell name="Search field" label="Search">
                <InputGroup prefix={<SearchIcon className="size-4" />} aria-label="Search field" placeholder="Search" />
              </TypeCell>
              <TypeCell name="Textarea" label="Note" className="xl:row-span-2" note={<Text size="xs" tone="muted" className="text-right">0 / 320</Text>}>
                <Textarea className="min-h-16 flex-1" placeholder="Write a note" />
              </TypeCell>
              <TypeCell name="Date" label="Date">
                <DateInput value={date} onValueChange={setDate} placeholder="Select a date" />
              </TypeCell>
              <TypeCell name="Select" label="Tool">
                <Select defaultValue="figma">
                  <SelectTrigger aria-label="Tool"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="framer">Framer</SelectItem>
                    <SelectItem value="sketch">Sketch</SelectItem>
                    <SelectItem value="invision">InVision Studio</SelectItem>
                    <SelectItem value="figma">Figma</SelectItem>
                    <SelectItem value="adobe">Adobe XD</SelectItem>
                  </SelectContent>
                </Select>
              </TypeCell>
              <TypeCell name="Prefix input" label="Website">
                <InputGroup prefix="https://" aria-label="Website" placeholder="example.com" />
              </TypeCell>
              <TypeCell name="Multi-select" label="Tags">
                <TagsInput value={tags} onValueChange={setTags} placeholder="Add a tag" />
              </TypeCell>
              <TypeCell name="Input with stepper" label="Quantity">
                <NumberInput value={amount} onValueChange={setAmount} min={0} max={40} label="Quantity" />
              </TypeCell>
              <TypeCell name="Password" label="Password" note={<Text size="sm" tone="success">Strong</Text>}>
                <PasswordInput aria-label="Password" defaultValue="secret" />
              </TypeCell>
              <TypeCell name="Number only" label="Width">
                <InputGroup suffix="px" aria-label="Width" inputMode="numeric" defaultValue="16" />
              </TypeCell>
              <TypeCell name="Dropdown list" label="Apps">
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
              </TypeCell>
            </div>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Selection">
            <Grid columns={6} gap={2} className="items-center">
              <span />
              {["On", "Off", "Disabled on", "Disabled off", "Indeterminate"].map((label) => (
                <Text key={label} size="xs" tone="muted">{label}</Text>
              ))}
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Checkbox</Text>
              <CheckboxField label={<Quiet name="Checkbox on" />} checked={boxOn} onCheckedChange={(value) => setBoxOn(value === true)} />
              <CheckboxField label={<Quiet name="Checkbox off" />} checked={boxOff} onCheckedChange={(value) => setBoxOff(value === true)} />
              <CheckboxField label={<Quiet name="Checkbox disabled on" />} checked disabled />
              <CheckboxField label={<Quiet name="Checkbox disabled off" />} checked={false} disabled />
              <CheckboxField label={<Quiet name="Checkbox indeterminate" />} indeterminate={partial} checked={false} onCheckedChange={() => setPartial(false)} />
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Radio</Text>
              <RadioGroup value={radioOn} onValueChange={setRadioOn} aria-label="Radio on">
                <RadioField value="on" label={<Quiet name="Radio on" />} />
              </RadioGroup>
              <RadioGroup value={radioOff} onValueChange={setRadioOff} aria-label="Radio off">
                <RadioField value="off" label={<Quiet name="Radio off" />} />
              </RadioGroup>
              <RadioGroup value="on" aria-label="Radio disabled on">
                <RadioField value="on" label={<Quiet name="Radio disabled on" />} disabled />
              </RadioGroup>
              <RadioGroup value="other" aria-label="Radio disabled off">
                <RadioField value="off" label={<Quiet name="Radio disabled off" />} disabled />
              </RadioGroup>
              <span />
            </Grid>
            <Grid columns={6} gap={2} className="items-center">
              <Text size="xs">Switch</Text>
              <SwitchField label={<Quiet name="Switch on" />} checked={switchOn} onCheckedChange={setSwitchOn} />
              <SwitchField label={<Quiet name="Switch off" />} checked={switchOff} onCheckedChange={setSwitchOff} />
              <SwitchField label={<Quiet name="Switch disabled on" />} checked disabled />
              <SwitchField label={<Quiet name="Switch disabled off" />} checked={false} disabled />
              <span />
            </Grid>
          </KitCard>
        </Span>
        <Span at="md:col-span-3 xl:col-span-3">
          <KitCard title="Selectors">
            <RadioGroup value={choice} onValueChange={setChoice} aria-label="Choice">
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
            <Slider defaultValue={[40]} aria-label="Level" />
          </KitCard>
        </Span>
      </Section>

      <Section id="phan-hoi" title="Feedback">
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Alerts">
            {alerts.info ? <Alert variant="line" tone="info" title="Something you should know" icon={<InfoIcon className="size-4 text-info" />} onClose={() => setAlerts((current) => ({ ...current, info: false }))} /> : null}
            {alerts.success ? <Alert variant="line" tone="success" title="Saved" icon={<CircleCheckIcon className="size-4 text-success" />} onClose={() => setAlerts((current) => ({ ...current, success: false }))} /> : null}
            {alerts.warning ? <Alert variant="line" tone="warning" title="Fill in the required fields" icon={<TriangleAlertIcon className="size-4 text-warning" />} onClose={() => setAlerts((current) => ({ ...current, warning: false }))} /> : null}
            {alerts.error ? <Alert variant="line" tone="error" title="Could not save" icon={<CircleAlertIcon className="size-4 text-destructive" />} onClose={() => setAlerts((current) => ({ ...current, error: false }))} /> : null}
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Badges">
            <Inline gap={2}>
              <StatusBadge status="done" label="Done" />
              <StatusBadge status="pending" label="Pending" />
              <StatusBadge status="in_progress" label="In progress" />
              <StatusBadge status="failed" label="Failed" />
              <StatusBadge status="draft" label="Draft" />
            </Inline>
            <Inline gap={2}>
              <Badge variant="outline">Label</Badge>
              <Badge variant="outline">Category</Badge>
              <Badge>+2</Badge>
            </Inline>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-12">
          <KitCard title="Progress">
            <div data-progress-samples className="grid grid-cols-1 gap-6 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
              <ProgressSample n={1}>
                <Stepper className="flex-row" steps={[
                  { id: "create", label: "Create", status: "done" },
                  { id: "review", label: "Review", status: "current" },
                  { id: "ship", label: "Ship", status: "todo" },
                ]} />
              </ProgressSample>
              <ProgressSample n={2} extra={<Text size="sm" className="text-center">40%</Text>}>
                <Progress value={40} aria-label="40 percent" />
              </ProgressSample>
              <ProgressSample n={3}>
                <Slider defaultValue={[40]} tip="40%" aria-label="Percent" data-slider-tip="40%" />
              </ProgressSample>
              <ProgressSample n={4}>
                <ProgressSegments value={2} max={6} />
              </ProgressSample>
              <ProgressSample n={5}>
                <Inline gap={3} align="center" wrap={false}>
                  <ProgressCircle value={2} max={5}>2 of 5</ProgressCircle>
                  <Stack gap={1}>
                    <Text size="sm" weight="semibold">Step name 2</Text>
                    <Text size="xs" tone="muted">Next: Step name 3</Text>
                  </Stack>
                </Inline>
              </ProgressSample>
              <ProgressSample n={6}>
                <Inline gap={3} align="center" wrap={false}>
                  <Spinner />
                  <Text size="sm">Loading… 25%</Text>
                </Inline>
              </ProgressSample>
              <ProgressSample n={7}>
                <StepsBar steps={[
                  { label: "Step 1", status: "done" },
                  { label: "Step 2", status: "current" },
                  { label: "Step 3", status: "todo" },
                ]} />
              </ProgressSample>
              <ProgressSample n={8}>
                <div className="overflow-hidden rounded-md bg-muted">
                  <Inline gap={3} align="center" wrap={false} className="p-3">
                    <Text size="sm" className="min-w-0 flex-1">25% Update in progress…</Text>
                    <Text size="sm" tone="muted">5s left</Text>
                  </Inline>
                  <Progress value={25} aria-label="Update" className="h-1 rounded-none" />
                </div>
              </ProgressSample>
            </div>
          </KitCard>
        </Span>
        <Span at="md:col-span-6 xl:col-span-12">
          <KitCard title="Overlay">
            <Inline gap={2}>
              <Dialog>
                <DialogTrigger asChild><Button variant="outline" size="sm">Dialog</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Dialog</DialogTitle></DialogHeader>
                  <Text size="sm">Content in the frame.</Text>
                </DialogContent>
              </Dialog>
              <Sheet>
                <SheetTrigger asChild><Button variant="outline" size="sm">Sheet</Button></SheetTrigger>
                <SheetContent>
                  <SheetHeader><SheetTitle>Sheet</SheetTitle></SheetHeader>
                  <Text size="sm">Slides in from the edge.</Text>
                </SheetContent>
              </Sheet>
              <Drawer>
                <DrawerTrigger asChild><Button variant="outline" size="sm">Drawer</Button></DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader><DrawerTitle>Drawer</DrawerTitle></DrawerHeader>
                  <Text size="sm">Slides up from the bottom.</Text>
                </DrawerContent>
              </Drawer>
              <Tooltip>
                <TooltipTrigger asChild><Button variant="outline" size="sm">Tooltip</Button></TooltipTrigger>
                <TooltipContent>Note</TooltipContent>
              </Tooltip>
              <HoverCard>
                <HoverCardTrigger asChild><Button variant="outline" size="sm">HoverCard</Button></HoverCardTrigger>
                <HoverCardContent>Shown on hover.</HoverCardContent>
              </HoverCard>
              <Popover>
                <PopoverTrigger asChild><Button variant="outline" size="sm">Popover</Button></PopoverTrigger>
                <PopoverContent>Extra content.</PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Open menu</Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => toast("Sample saved")}>Toast</Button>
            </Inline>
          </KitCard>
        </Span>
      </Section>

      <Section id="du-lieu" title="Data">
        <Span at="md:col-span-6 xl:col-span-6">
          <KitCard title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Cover</TableCell><TableCell>Done</TableCell><TableCell>18</TableCell></TableRow>
                <TableRow><TableCell>Summary</TableCell><TableCell>In progress</TableCell><TableCell>29</TableCell></TableRow>
                <TableRow><TableCell>Appendix</TableCell><TableCell>Draft</TableCell><TableCell>7</TableCell></TableRow>
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
          <KitCard title="Empty and loading">
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
              <EmptyState title="Nothing here" description="The list is empty." />
            </Inline>
          </KitCard>
        </Span>
      </Section>

      <Icons />
    </Stack>
  )
}

export { Kit }
