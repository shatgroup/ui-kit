import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, Line, LineChart } from "recharts"
import { MinusIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Calendar } from "@/components/ui/calendar.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx"
import { CheckboxField } from "@/components/ui/checkbox.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { FormField } from "@/components/ui/form-field.tsx"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { RadioField, RadioGroup } from "@/components/ui/radio-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { enUS } from "date-fns/locale"

const revenue = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 180 },
  { day: "Wed", value: 140 },
  { day: "Thu", value: 220 },
  { day: "Fri", value: 260 },
  { day: "Sat", value: 210 },
  { day: "Sun", value: 300 },
]

const subs = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 120 },
  { day: "Fri", value: 160 },
  { day: "Sat", value: 150 },
  { day: "Sun", value: 190 },
]

const exercise = [
  { day: "Mon", run: 20, lift: 12 },
  { day: "Tue", run: 32, lift: 18 },
  { day: "Wed", run: 28, lift: 22 },
  { day: "Thu", run: 40, lift: 16 },
  { day: "Fri", run: 36, lift: 30 },
  { day: "Sat", run: 48, lift: 24 },
  { day: "Sun", run: 30, lift: 20 },
]

const goal = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 70 },
  { name: "Wed", value: 55 },
  { name: "Thu", value: 90 },
  { name: "Fri", value: 60 },
]

const payments = [
  { id: "1", email: "ken99@example.com", status: "Success", amount: "$316.00" },
  { id: "2", email: "abe45@example.com", status: "Processing", amount: "$242.00" },
  { id: "3", email: "monserrat44@example.com", status: "Failed", amount: "$837.00" },
]

const team = [
  { name: "Sofia Davis", email: "m@example.com", role: "Owner", initials: "SD" },
  { name: "Jackson Lee", email: "p@example.com", role: "Developer", initials: "JL" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Billing", initials: "IN" },
]

export function ShowcaseCards() {
  const [goalValue, setGoalValue] = useState(350)
  const [plan, setPlan] = useState("starter")
  const [messages, setMessages] = useState([
    { side: "them", text: "Hi, how can I help you today?" },
    { side: "me", text: "Hey, I'm having trouble with my account." },
    { side: "them", text: "What seems to be the problem?" },
  ])
  const [draft, setDraft] = useState("")

  return (
    <Grid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">$15,231.89</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm" tone="muted">+20.1% from last month</Text>
          <ChartContainer config={{ value: { label: "Revenue", color: "var(--chart-1)" } }} className="h-16">
            <LineChart data={revenue}>
              <Line type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 2, fill: "var(--chart-1)" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Subscriptions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">+2,350</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm" tone="muted">+180.1% from last month</Text>
          <ChartContainer config={{ value: { label: "Subscriptions", color: "var(--chart-2)" } }} className="h-16">
            <AreaChart data={subs}>
              <Area type="monotone" dataKey="value" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Pick one or more days.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="multiple" locale={enUS} weekStartsOn={0} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Move Goal</CardTitle>
          <CardDescription>Set your daily activity goal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <Inline align="center" justify="center" gap={4}>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Decrease goal" onClick={() => setGoalValue((value) => Math.max(0, value - 10))}>
                <MinusIcon className="size-4" />
              </Button>
              <Stack gap={0} align="center">
                <Text as="span" size="3xl" weight="bold" className="tabular-nums">{goalValue}</Text>
                <Text size="xs" tone="muted">CALORIES/DAY</Text>
              </Stack>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Increase goal" onClick={() => setGoalValue((value) => value + 10)}>
                <PlusIcon className="size-4" />
              </Button>
            </Inline>
            <ChartContainer config={{ value: { label: "Calories", color: "var(--chart-1)" } }} className="h-24">
              <BarChart data={goal}>
                <Bar dataKey="value" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
            <Button className="w-full">Set Goal</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade your subscription</CardTitle>
          <CardDescription>You are currently on the free plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <FormField label="Name">{(field) => <Input {...field} placeholder="Sofia Davis" />}</FormField>
            <FormField label="Email">{(field) => <Input {...field} placeholder="m@example.com" />}</FormField>
            <Inline gap={2} align="end">
              <FormField label="Card Number">{(field) => <Input {...field} placeholder="1234 1234 1234 1234" />}</FormField>
              <FormField label="MM/YY">{(field) => <Input {...field} placeholder="MM/YY" className="w-24" />}</FormField>
              <FormField label="CVC">{(field) => <Input {...field} placeholder="CVC" className="w-20" />}</FormField>
            </Inline>
            <Stack gap={2}>
              <Text size="sm" weight="medium">Plan</Text>
              <RadioGroup value={plan} onValueChange={(value) => setPlan(value)}>
                <RadioField value="starter" label="Starter Plan — $9 per month" />
                <RadioField value="pro" label="Pro Plan — $29 per month" />
              </RadioGroup>
            </Stack>
            <FormField label="Notes">{(field) => <Textarea {...field} placeholder="Share anything we should know." />}</FormField>
            <CheckboxField label="I agree to the terms and conditions" />
            <CheckboxField label="Allow us to send you emails" />
            <Inline gap={2} justify="end">
              <Button variant="outline">Cancel</Button>
              <Button>Upgrade</Button>
            </Inline>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your email below to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <Grid columns={2} gap={2}>
              <Button variant="outline">GitHub</Button>
              <Button variant="outline">Google</Button>
            </Grid>
            <Inline gap={2} align="center">
              <Separator />
              <Text size="xs" tone="muted" className="shrink-0">OR CONTINUE WITH</Text>
              <Separator />
            </Inline>
            <FormField label="Email">{(field) => <Input {...field} placeholder="m@example.com" />}</FormField>
            <FormField label="Password">{(field) => <Input {...field} type="password" />}</FormField>
            <Button className="w-full">Create account</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Minutes</CardTitle>
          <CardDescription>Your exercise minutes are ahead of where you normally are.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ run: { label: "Run", color: "var(--chart-1)" }, lift: { label: "Lift", color: "var(--chart-2)" } }}
            className="h-40"
          >
            <LineChart data={exercise}>
              <Line type="monotone" dataKey="run" name="Run" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="lift" name="Lift" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Invite your team members to collaborate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            {team.map((member) => (
              <Inline key={member.email} gap={2} align="center" justify="between">
                <Inline gap={2} align="center" className="min-w-0">
                  <Avatar size="sm"><AvatarFallback>{member.initials}</AvatarFallback></Avatar>
                  <HoverCard>
                    <HoverCardTrigger render={<Button variant="link" size="sm" />}>{member.name}</HoverCardTrigger>
                    <HoverCardContent>{member.email}</HoverCardContent>
                  </HoverCard>
                </Inline>
                <Select defaultValue={member.role}>
                  <SelectTrigger size="sm" className="w-32" aria-label={`Role ${member.name}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </Inline>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Messages stay inside the card.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            {messages.map((message, index) => (
              <Inline key={index} justify={message.side === "me" ? "end" : "start"}>
                <BoxTone mine={message.side === "me"}>{message.text}</BoxTone>
              </Inline>
            ))}
            <Inline gap={2} align="center">
              <Input size="md" value={draft} aria-label="Message" placeholder="Type your message..." onChange={(event) => setDraft(event.target.value)} />
              <Button
                onClick={() => {
                  if (!draft.trim()) return
                  setMessages((current) => [...current, { side: "me", text: draft.trim() }])
                  setDraft("")
                }}
              >
                Send
              </Button>
            </Inline>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Manage your payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead numeric>Amount</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Inline gap={2} align="center">
                        <CheckboxField label="" />
                        <Text as="span" size="sm">{row.email}</Text>
                      </Inline>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Failed" ? "destructive" : row.status === "Success" ? "success" : "warning"}>{row.status}</Badge>
                    </TableCell>
                    <TableCell numeric>{row.amount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="w-8 px-0" aria-label={`Actions ${row.email}`} />}>
                          <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Copy ID</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Inline justify="end" gap={2}>
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </Inline>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookie Settings</CardTitle>
          <CardDescription>Manage your cookie settings here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <CookieRow title="Strictly Necessary" description="These cookies are essential." />
            <CookieRow title="Functional Cookies" description="These cookies allow the site to remember choices." />
            <CookieRow title="Performance Cookies" description="These cookies help us improve the site." />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}

function BoxTone({ mine, children }: { mine: boolean; children: string }) {
  return (
    <Text as="span" size="sm" className={mine ? "rounded-md bg-primary px-3 py-2 text-primary-foreground" : "rounded-md bg-muted px-3 py-2"}>
      {children}
    </Text>
  )
}

function CookieRow({ title, description }: { title: string; description: string }) {
  return (
    <Inline justify="between" align="center" gap={3}>
      <Stack gap={1} className="min-w-0">
        <Text weight="medium">{title}</Text>
        <Text size="sm" tone="muted">{description}</Text>
      </Stack>
      <Switch aria-label={title} />
    </Inline>
  )
}
