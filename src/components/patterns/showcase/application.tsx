import { useMemo, useState } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { CalendarIcon, CheckIcon, DollarSignIcon, FileIcon, PaperclipIcon, PhoneIcon, SendIcon, VideoIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Ticker } from "@/components/patterns/ticker.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { Input } from "@/components/ui/input.tsx"
import { InputGroup } from "@/components/ui/input-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { activity, appMessages, stockMonths, ticker, transactions } from "@/fixtures/application.ts"

const priceConfig = { price: { label: "Price", color: "var(--chart-1)" } } satisfies ChartConfig
const RANGES = ["1W", "1M", "1Y"] as const

const CHIP_ICON = {
  meet: CalendarIcon,
  file: PaperclipIcon,
  task: CheckIcon,
} as const

export function ShowcaseApplication() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1M")
  const [period, setPeriod] = useState("month")
  const [tx, setTx] = useState("completed")
  const [feed, setFeed] = useState("all")
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const shown = useMemo(
    () =>
      activity.filter((item) => {
        const text = `${item.name} ${item.text} ${item.chip}`.toLowerCase()
        if (query && !text.includes(query.trim().toLowerCase())) return false
        if (feed === "tasks") return item.kind === "task"
        if (feed === "meetings") return item.kind === "meet"
        return true
      }),
    [feed, query],
  )
  const rows = transactions[tx as keyof typeof transactions]

  return (
    <Stack gap={4}>
      <Ticker items={ticker} />
      <div className="grid items-start gap-4 xl:grid-cols-3">
        <Stack gap={4}>
          <Card>
            <CardHeader>
              <Inline gap={2} align="center">
                <DollarSignIcon className="size-4" />
                <CardTitle>Stock Market</CardTitle>
              </Inline>
            </CardHeader>
            <CardContent>
              <Stack gap={4}>
                <div className="grid grid-cols-3 gap-1 rounded-md bg-muted p-1">
                  {RANGES.map((item) => (
                    <Button key={item} size="sm" variant={range === item ? "secondary" : "ghost"} onClick={() => setRange(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
                <Inline justify="between" align="end">
                  <Stack gap={1}>
                    <Text size="3xl" weight="bold">$120,748.00</Text>
                    <Text size="sm" tone="muted">Shadcn Inc. (SDCN)</Text>
                  </Stack>
                  <Badge variant="success">+1.25% ↗</Badge>
                </Inline>
                <ChartContainer config={priceConfig} className="h-40 w-full">
                  <AreaChart data={stockMonths} margin={{ left: 16, right: 16, top: 8, bottom: 0 }}>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} padding={{ left: 16, right: 16 }} />
                    <YAxis hide domain={[0, 100]} />
                    <Area dataKey="price" type="linear" fill="var(--color-price)" fillOpacity={0.2} stroke="var(--color-price)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
                <div className="grid grid-cols-2">
                  <Stack gap={1} className="border-r border-border pr-4">
                    <Text size="xs" tone="muted">Market Cap</Text>
                    <Text weight="semibold">$119K</Text>
                  </Stack>
                  <Stack gap={1} className="pl-4">
                    <Text size="xs" tone="muted">Volume</Text>
                    <Text weight="semibold">$122K</Text>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Inline justify="between" align="center">
                <Inline gap={2} align="center">
                  <DollarSignIcon className="size-4" />
                  <CardTitle>Transactions</CardTitle>
                </Inline>
                <Select value={period} onValueChange={(value) => setPeriod(value ?? "month")}>
                  <SelectTrigger size="sm" className="w-32" aria-label="Period">
                    <span>Last month</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last month</SelectItem>
                    <SelectItem value="quarter">Last quarter</SelectItem>
                  </SelectContent>
                </Select>
              </Inline>
            </CardHeader>
            <CardContent>
              <Tabs value={tx} onValueChange={setTx}>
                <TabsList fullWidth>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value={tx}>
                  {rows.length === 0 ? (
                    <EmptyState title="No transactions" />
                  ) : (
                    <Stack gap={3}>
                      {rows.map((item) => (
                        <Inline key={item.title} gap={3} align="center" justify="between">
                          <Inline gap={3} align="center" className="min-w-0">
                            <span className="flex size-8 items-center justify-center rounded-md bg-muted">
                              <DollarSignIcon className="size-4" />
                            </span>
                            <Stack gap={0} className="min-w-0">
                              <Text size="sm" weight="medium">{item.title}</Text>
                              <Text size="xs" tone="muted">{item.detail}</Text>
                            </Stack>
                          </Inline>
                          <Stack gap={0} align="end">
                            <Text size="sm" weight="medium" className="text-primary-text">{item.amount}</Text>
                            <Text size="xs" tone="muted">{item.date}</Text>
                          </Stack>
                        </Inline>
                      ))}
                      <Button variant="outline" className="w-full">View all</Button>
                    </Stack>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Stack>
        <Card>
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." aria-label="Search activity" />
              <Tabs value={feed} onValueChange={setFeed}>
                <TabsList fullWidth>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>
              </Tabs>
              <Stack gap={0}>
                {shown.map((item, index) => {
                  const Icon = CHIP_ICON[item.kind as keyof typeof CHIP_ICON]
                  return (
                    <Inline key={`${item.name}-${item.time}`} gap={3} align="start" className="relative">
                      <Stack gap={0} align="center">
                        <Avatar size="sm">
                          <AvatarImage src={item.photo} alt="" />
                          <AvatarFallback>{item.initials}</AvatarFallback>
                        </Avatar>
                        {index < shown.length - 1 ? <Separator orientation="vertical" className="h-8" /> : null}
                      </Stack>
                      <Stack gap={1} className="min-w-0 flex-1 pb-3">
                        <Inline justify="between" align="center" gap={2}>
                          <Text size="sm" weight="medium">{item.name}</Text>
                          <Text size="xs" tone="muted">{item.time}</Text>
                        </Inline>
                        <Text size="sm" tone="muted">{item.text}</Text>
                        {item.chip ? (
                          <Badge variant="outline">
                            <Icon />
                            {item.chip}
                          </Badge>
                        ) : null}
                      </Stack>
                    </Inline>
                  )
                })}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Inline justify="between" align="center">
              <Inline gap={2} align="center">
                <span className="relative">
                  <Avatar size="sm">
                    <AvatarImage src="/samples/avatars/02.svg" alt="" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <span className="absolute right-0 bottom-0 size-2 rounded-full bg-chart-2" />
                </span>
                <Stack gap={0}>
                  <Text size="sm" weight="medium">Alex Rivera</Text>
                  <Text size="xs" className="text-primary-text">Online</Text>
                </Stack>
              </Inline>
              <Inline gap={1}>
                <Button variant="ghost" size="sm" className="size-8 p-0" aria-label="Call"><PhoneIcon /></Button>
                <Button variant="ghost" size="sm" className="size-8 p-0" aria-label="Video"><VideoIcon /></Button>
              </Inline>
            </Inline>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              {appMessages.map((message) => (
                <Stack key={message.time + message.text} gap={1} className={message.from === "me" ? "items-end" : "items-start"}>
                  <Inline gap={2} align="center">
                    <Text size="xs" weight="medium" className="text-primary-text">{message.name}</Text>
                    <Text size="xs" tone="muted">{message.time}</Text>
                  </Inline>
                  <div className={`relative ${message.from === "me" ? "max-w-full rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground" : "max-w-full rounded-lg bg-muted px-3 py-2 text-sm"}`}>
                    {message.file ? (
                      <Inline gap={2} align="center">
                        <FileIcon className="size-4" />
                        <Stack gap={0}>
                          <span>{message.text}</span>
                          <span className="text-xs opacity-80">{message.file}</span>
                        </Stack>
                      </Inline>
                    ) : (
                      message.text
                    )}
                    {"reaction" in message && message.reaction ? (
                      <span className="absolute -right-1 -bottom-2 rounded-full border border-border bg-card px-1 text-xs text-foreground">{message.reaction}</span>
                    ) : null}
                  </div>
                </Stack>
              ))}
              <Inline gap={1} align="center">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <span className="size-1.5 rounded-full bg-muted-foreground" />
              </Inline>
              <InputGroup
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your message..."
                aria-label="Message"
                suffix={
                  <Button size="sm" className="size-8 rounded-full p-0" aria-label="Send">
                    <SendIcon />
                  </Button>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}
