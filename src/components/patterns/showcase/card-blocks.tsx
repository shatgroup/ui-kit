import { useState } from "react"
import { addDays, format } from "date-fns"
import { enUS } from "date-fns/locale"
import { CalendarIcon, MinusIcon, PlusIcon, StarIcon } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts"
import { type DateRange } from "react-day-picker"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { ChartCard } from "@/components/patterns/chart-card.tsx"
import { ChatPanel } from "@/components/patterns/chat-panel.tsx"
import { DataTable, type DataColumn } from "@/components/patterns/data-table.tsx"
import { FormLayout, FormSurface } from "@/components/patterns/form-layout.tsx"
import { RepoCard } from "@/components/patterns/repo-card.tsx"
import { ShareList } from "@/components/patterns/share-list.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { PasswordInput } from "@/components/ui/password-input.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import { RadioField, RadioGroup } from "@/components/ui/radio-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { StatusBadge } from "@/components/ui/status-badge.tsx"
import { SwitchField } from "@/components/ui/switch.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import {
  chatMessages,
  cookies,
  exerciseSeries,
  goalSeries,
  issueAreas,
  issueLevels,
  payments,
  plans,
  revenueSeries,
  sharePeople,
  teamMembers,
  teamRoles,
  tweakcnRepo,
} from "@/fixtures/cards.ts"

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig
const subscriptionConfig = { subscription: { label: "Subscriptions", color: "var(--chart-2)" } } satisfies ChartConfig
const exerciseConfig = {
  today: { label: "Today", color: "var(--chart-1)" },
  average: { label: "Average", color: "var(--chart-2)" },
} satisfies ChartConfig
const goalConfig = { goal: { label: "Goal", color: "var(--chart-1)" } } satisfies ChartConfig

const paymentStatus = {
  success: "done",
  processing: "in_progress",
  failed: "failed",
  pending: "pending",
} as const

export function CardsStats() {
  return (
    <Grid columns={{ base: 1, xl: 2 }} gap={4}>
      <ChartCard title="$15,231.89" description="Total Revenue" footer="+20.1% from last month">
        <ChartContainer config={revenueConfig} className="h-24 w-full">
          <LineChart data={revenueSeries} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </ChartCard>
      <ChartCard title="+2,350" description="Subscriptions" footer="+180.1% from last month">
        <ChartContainer config={subscriptionConfig} className="h-24 w-full">
          <AreaChart data={revenueSeries}>
            <Area dataKey="subscription" stroke="var(--color-subscription)" fill="var(--color-subscription)" fillOpacity={0.2} />
          </AreaChart>
        </ChartContainer>
      </ChartCard>
    </Grid>
  )
}

export function CardsCalendar() {
  const start = new Date(2025, 5, 5)
  return (
    <Card>
      <CardContent>
        <Calendar mode="range" weekStartsOn={0} locale={enUS} defaultMonth={start} selected={{ from: start, to: addDays(start, 8) }} />
      </CardContent>
    </Card>
  )
}

export function CardsActivityGoal() {
  const [goal, setGoal] = useState(350)
  return (
    <ChartCard title="Move Goal" description={`${goal} calories`} footer="Set your daily activity goal.">
      <Stack gap={3}>
        <Inline gap={2} align="center">
          <Button variant="outline" size="sm" aria-label="Decrease" onClick={() => setGoal((value) => Math.max(200, value - 10))}>
            <MinusIcon />
          </Button>
          <Text size="xl" weight="semibold">{goal}</Text>
          <Button variant="outline" size="sm" aria-label="Increase" onClick={() => setGoal((value) => Math.min(400, value + 10))}>
            <PlusIcon />
          </Button>
        </Inline>
        <ChartContainer config={goalConfig} className="h-24 w-full">
          <BarChart data={goalSeries}>
            <Bar dataKey="goal" fill="var(--color-goal)" />
          </BarChart>
        </ChartContainer>
      </Stack>
    </ChartCard>
  )
}

export function CardsExerciseMinutes() {
  return (
    <ChartCard title="Exercise Minutes" description="Your exercise minutes are ahead of where you normally are.">
      <ChartContainer config={exerciseConfig} className="h-48 w-full">
        <LineChart data={exerciseSeries} margin={{ top: 5, right: 10, left: 16, bottom: 0 }}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value: string) => value.slice(0, 3)} />
          <Line type="monotone" dataKey="today" stroke="var(--color-today)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="average" stroke="var(--color-average)" strokeWidth={2} strokeOpacity={0.5} dot={false} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function CardsForms() {
  const [plan, setPlan] = useState("starter")
  return (
    <Card>
      <CardContent>
        <FormSurface>
          <FormLayout
            submitLabel="Upgrade plan"
            onSubmit={() => undefined}
            sections={[
              {
                title: "Upgrade your subscription",
                description: "You are currently on the free plan. Upgrade to the pro plan to get access to all features.",
                children: (
                  <>
                    <FormField label="Name">{(field) => <Input {...field} placeholder="Evil Rabbit" />}</FormField>
                    <FormField label="Email">{(field) => <Input {...field} placeholder="example@acme.com" />}</FormField>
                    <FormField label="Card number">{(field) => <Input {...field} placeholder="1234 1234 1234 1234" />}</FormField>
                    <FormField label="Expiry">{(field) => <Input {...field} placeholder="MM/YY" />}</FormField>
                    <FormField label="CVC">{(field) => <Input {...field} placeholder="CVC" />}</FormField>
                    <Stack gap={2}>
                      <Text size="sm" weight="medium">Plan</Text>
                      <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
                        {plans.map((item) => (
                          <RadioField key={item.id} value={item.id} label={`${item.name} ${item.price}`} />
                        ))}
                      </RadioGroup>
                    </Stack>
                  </>
                ),
              },
            ]}
          />
        </FormSurface>
      </CardContent>
    </Card>
  )
}

export function CardsTeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent>
        <ShareList
          people={teamMembers}
          trailing={(person) => (
            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm">{person.role}</Button>} />
              <PopoverContent>
                <Stack gap={2}>
                  {teamRoles.map((role) => (
                    <Stack key={role.name} gap={1}>
                      <Text size="sm" weight="medium">{role.name}</Text>
                      <Text size="xs" tone="muted">{role.description}</Text>
                    </Stack>
                  ))}
                </Stack>
              </PopoverContent>
            </Popover>
          )}
        />
      </CardContent>
    </Card>
  )
}

export function CardsCookieSettings() {
  return (
    <Card>
      <CardContent>
        <FormSurface>
          <FormLayout
            submitLabel="Save preferences"
            onSubmit={() => undefined}
            sections={[
              {
                title: "Cookie Settings",
                description: "Manage your cookie settings here.",
                children: (
                  <>
                    {cookies.map((item) => (
                      <SwitchField key={item.id} label={item.label} defaultChecked={item.defaultOn} aria-label={item.label} />
                    ))}
                  </>
                ),
              },
            ]}
          />
        </FormSurface>
      </CardContent>
    </Card>
  )
}

export function CardsCreateAccount() {
  return (
    <Card>
      <CardContent>
        <FormSurface>
          <FormLayout
            submitLabel="Create account"
            onSubmit={() => undefined}
            sections={[
              {
                title: "Create an account",
                description: "Enter your email below to create your account",
                children: (
                  <>
                    <Inline gap={2}>
                      <Button variant="outline" className="flex-1">GitHub</Button>
                      <Button variant="outline" className="flex-1">Google</Button>
                    </Inline>
                    <FormField label="Email">{(field) => <Input {...field} type="email" placeholder="m@example.com" />}</FormField>
                    <FormField label="Password">{(field) => <PasswordInput {...field} />}</FormField>
                  </>
                ),
              },
            ]}
          />
        </FormSurface>
      </CardContent>
    </Card>
  )
}

export function CardsChat() {
  return <ChatPanel name="Sofia Davis" status="Online" photo="/samples/avatars/01.svg" messages={chatMessages} />
}

export function GithubCard() {
  return (
    <RepoCard
      name={tweakcnRepo.name}
      description={tweakcnRepo.description}
      language={tweakcnRepo.language}
      stars={tweakcnRepo.stars}
      updated={tweakcnRepo.updated}
      action={
        <Button variant="secondary" size="sm" render={<a href={tweakcnRepo.href} />}>
          <StarIcon />
          Star
        </Button>
      }
    />
  )
}

export function DatePickerWithRange() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })
  const label = date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} – ${format(date.to, "LLL dd, y")}` : format(date.from, "LLL dd, y")) : "Pick a date"
  return (
    <Card>
      <CardHeader>
        <CardTitle>Date picker with range</CardTitle>
        <CardDescription>Select a date range.</CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" aria-label="Date range"><CalendarIcon />{label}</Button>} />
          <PopoverContent>
            <Calendar mode="range" locale={enUS} selected={date} onSelect={setDate} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}

export function CardsReportIssue() {
  const [area, setArea] = useState(issueAreas[1] ?? "Billing")
  const [level, setLevel] = useState(issueLevels[1] ?? "Severity 2")
  return (
    <Card>
      <CardContent>
        <FormSurface>
          <FormLayout
            submitLabel="Submit"
            cancelLabel="Cancel"
            onCancel={() => undefined}
            onSubmit={() => undefined}
            sections={[
              {
                title: "Report an issue",
                description: "What area are you having problems with?",
                children: (
                  <>
                    <FormField label="Area">
                      {(field) => (
                        <Select value={area} onValueChange={(value) => setArea(value ?? area)}>
                          <SelectTrigger {...field} className="w-full" aria-label="Area"><span>{area}</span></SelectTrigger>
                          <SelectContent>
                            {issueAreas.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </FormField>
                    <FormField label="Security Level">
                      {(field) => (
                        <Select value={level} onValueChange={(value) => setLevel(value ?? level)}>
                          <SelectTrigger {...field} className="w-full" aria-label="Security Level"><span>{level}</span></SelectTrigger>
                          <SelectContent>
                            {issueLevels.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </FormField>
                    <FormField label="Subject">{(field) => <Input {...field} placeholder="I need help with..." />}</FormField>
                    <FormField label="Description">{(field) => <Textarea {...field} placeholder="Please include all information relevant to your issue." />}</FormField>
                  </>
                ),
              },
            ]}
          />
        </FormSurface>
      </CardContent>
    </Card>
  )
}

const paymentColumns: DataColumn<(typeof payments)[number]>[] = [
  { id: "email", header: "Email", accessor: (row) => row.email, grow: true },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    cell: (row) => <StatusBadge status={paymentStatus[row.status as keyof typeof paymentStatus]} label={row.status} />,
  },
  { id: "amount", header: "Amount", accessor: (row) => row.amount, numeric: true, cell: (row) => <Text size="sm">${row.amount}</Text> },
]

export function CardsPayments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>Manage your payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable data={payments} columns={paymentColumns} getRowId={(row) => row.id} selectable pageSizes={["5", "10"]} />
      </CardContent>
    </Card>
  )
}

export function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>Anyone with the link can view this document.</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack gap={3}>
          <Inline gap={2} align="center" wrap={false}>
            <Input readOnly value="http://example.com/link/to/document" aria-label="Link" />
            <Button variant="outline" size="sm">Copy Link</Button>
          </Inline>
          <Text size="sm" weight="medium">People with access</Text>
          <ShareList
            people={sharePeople}
            trailing={() => (
              <Select defaultValue="edit">
                <SelectTrigger size="sm" className="w-28" aria-label="Access"><span>Can edit</span></SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
