/* Tab Application dựng lại theo mô tả, không chép code shadcncraft Pro. */
import { useState } from "react"
import { Area, AreaChart } from "recharts"
import {
  ArrowUpIcon,
  CalendarIcon,
  CheckIcon,
  DollarSignIcon,
  FileIcon,
  PaperclipIcon,
  PhoneIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Ticker } from "@/components/patterns/ticker.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"

const ticker = [
  { symbol: "SDCN", avatar: "SH", price: "$120,748.00", change: "1.25%", up: true },
  { symbol: "ACME", avatar: "AC", price: "$84,231.50", change: "-0.42%", up: false },
  { symbol: "TWKN", avatar: "TW", price: "$45,019.75", change: "2.18%", up: true },
  { symbol: "VEGA", avatar: "VE", price: "$9,874.20", change: "-1.07%", up: false },
]

const prices = [118, 121, 119, 124, 123, 128, 126, 131, 129, 134, 132, 128].map((price, index) => ({ day: index + 1, price }))

const priceConfig = { price: { label: "Price", color: "var(--chart-1)" } } satisfies ChartConfig

const transactions = {
  completed: [
    { title: "Stripe payout", detail: "Invoice 1042 settled", amount: "+$2,480.00", date: "Apr 12" },
    { title: "Figma", detail: "Team subscription", amount: "+$144.00", date: "Apr 09" },
    { title: "AWS", detail: "Monthly usage", amount: "+$86.20", date: "Apr 02" },
  ],
  pending: [{ title: "Client retainer", detail: "Waiting for bank", amount: "+$1,200.00", date: "Apr 18" }],
  cancelled: [{ title: "Domain renewal", detail: "Cancelled by owner", amount: "+$18.00", date: "Mar 30" }],
}

const activity = [
  { name: "Sofia Davis", time: "2:14 PM", photo: "/samples/avatars/01.svg", lead: "assigned you", rest: " to Cover page", chip: "Today", icon: CalendarIcon },
  { name: "Jackson Lee", time: "1:02 PM", photo: "", lead: "marked", rest: " Executive summary as done", chip: "Done", icon: CheckIcon },
  { name: "Isabella Nguyen", time: "11:40 AM", photo: "/samples/avatars/03.svg", lead: "attached", rest: " the brand deck", chip: "brand.pdf", icon: PaperclipIcon },
]

export function ShowcaseApplication() {
  const [range, setRange] = useState<string[]>(["1M"])
  const [period, setPeriod] = useState("month")
  const [tx, setTx] = useState("completed")
  const [feed, setFeed] = useState("all")
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const shown = activity.filter((item) => {
    const text = `${item.name} ${item.lead} ${item.rest}`.toLowerCase()
    if (query && !text.includes(query.trim().toLowerCase())) return false
    if (feed === "tasks") return item.chip === "Done"
    if (feed === "meetings") return item.chip === "Today"
    return true
  })

  return (
    <Stack gap={4}>
      <Ticker items={ticker} />
      <Grid columns={{ base: 1, lg: 2 }} gap={4}>
        <Card>
          <CardHeader>
            <Inline gap={2} align="center">
              <DollarSignIcon className="size-4" />
              <CardTitle>Stock Market</CardTitle>
            </Inline>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <ToggleGroup
                value={range}
                onValueChange={(value) => {
                  if (value.length > 0) setRange([value[value.length - 1] ?? "1M"])
                }}
                className="grid w-full grid-cols-3"
              >
                <ToggleGroupItem value="1W" className="w-full">1W</ToggleGroupItem>
                <ToggleGroupItem value="1M" className="w-full">1M</ToggleGroupItem>
                <ToggleGroupItem value="1Y" className="w-full">1Y</ToggleGroupItem>
              </ToggleGroup>
              <Inline justify="between" align="end">
                <Stack gap={1}>
                  <Text size="3xl" weight="bold" className="tabular-nums">$128.40</Text>
                  <Text size="sm" tone="muted">SHOP</Text>
                </Stack>
                <Badge variant="success">+1.25% ↗</Badge>
              </Inline>
              <ChartContainer config={priceConfig} className="h-40 w-full">
                <AreaChart data={prices}>
                  <Area type="monotone" dataKey="price" stroke="var(--color-price)" fill="var(--color-price)" fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <Inline gap={0} align="stretch">
                <Stack gap={1} className="flex-1">
                  <Text size="xs" tone="muted">Market Cap</Text>
                  <Text weight="medium">$12.4B</Text>
                </Stack>
                <span className="w-px bg-border" />
                <Stack gap={1} className="flex-1 px-4">
                  <Text size="xs" tone="muted">Volume</Text>
                  <Text weight="medium">2.1M</Text>
                </Stack>
              </Inline>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <Inline gap={2} align="center">
              <DollarSignIcon className="size-4" />
              <CardTitle>Transactions</CardTitle>
            </Inline>
            <Select value={period} onValueChange={(value) => setPeriod(value ?? "month")}>
              <SelectTrigger size="sm" className="w-36" aria-label="Period">
                <span>Last month</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="quarter">Last quarter</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Separator />
              <Tabs value={tx} onValueChange={setTx}>
                <TabsList fullWidth>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                {(["completed", "pending", "cancelled"] as const).map((key) => (
                  <TabsContent key={key} value={key}>
                    <Stack gap={3}>
                      {transactions[key].map((item) => (
                        <Inline key={item.title} gap={3} align="center" justify="between">
                          <Inline gap={3} align="center">
                            <span className="flex size-10 items-center justify-center rounded-md bg-muted">
                              <DollarSignIcon className="size-4" />
                            </span>
                            <Stack gap={1}>
                              <Text size="sm" weight="medium">{item.title}</Text>
                              <Text size="sm" tone="muted">{item.detail}</Text>
                            </Stack>
                          </Inline>
                          <Stack gap={1} align="end">
                            <Text size="sm" weight="medium" tone="success">{item.amount}</Text>
                            <Text size="xs" tone="muted">{item.date}</Text>
                          </Stack>
                        </Inline>
                      ))}
                    </Stack>
                  </TabsContent>
                ))}
              </Tabs>
              <Button variant="secondary" className="w-full">View all</Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Inline gap={2} align="center">
                <SearchIcon className="size-4 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search activity" />
              </Inline>
              <Tabs value={feed} onValueChange={setFeed}>
                <TabsList fullWidth>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>
              </Tabs>
              <Stack gap={0}>
                {shown.map((item, index) => (
                  <Inline key={item.name} gap={3} align="start">
                    <Stack gap={0} align="center" className="self-stretch">
                      <Avatar>
                        {item.photo ? <AvatarImage src={item.photo} alt="" /> : null}
                        <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      {index < shown.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                    </Stack>
                    <Stack gap={2} className="pb-4">
                      <Inline justify="between" align="center" gap={2}>
                        <Text size="sm" weight="medium">{item.name}</Text>
                        <Text size="xs" tone="muted">{item.time}</Text>
                      </Inline>
                      <Text size="sm">
                        <span className="font-semibold">{item.lead}</span>
                        {item.rest}
                      </Text>
                      <Badge variant="outline">
                        <item.icon />
                        {item.chip}
                      </Badge>
                    </Stack>
                  </Inline>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <Inline gap={3} align="center">
              <span className="relative">
                <Avatar>
                  <AvatarImage src="/samples/avatars/01.svg" alt="" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <span className="absolute right-0 bottom-0 size-2 rounded-full bg-success" />
              </span>
              <Stack gap={1}>
                <Text size="sm" weight="medium">Sofia Davis</Text>
                <Text size="xs" tone="success">Online</Text>
              </Stack>
            </Inline>
            <Inline gap={1}>
              <Button variant="ghost" size="sm" className="w-8 px-0" aria-label="Call"><PhoneIcon /></Button>
              <Button variant="ghost" size="sm" className="w-8 px-0" aria-label="Video"><VideoIcon /></Button>
            </Inline>
          </CardHeader>
          <CardContent>
            <Stack gap={4}>
              <Stack gap={1}>
                <Inline justify="between">
                  <Text size="sm" tone="primary">Sofia Davis</Text>
                  <Text size="xs" tone="muted">2:10 PM</Text>
                </Inline>
                <span className="relative w-fit max-w-full rounded-lg bg-muted px-3 py-2 text-sm">
                  The deck is ready for review.
                  <span className="absolute right-2 -bottom-2 rounded-full border border-border bg-card px-1 text-xs">❤️ 1</span>
                </span>
              </Stack>
              <Stack gap={1} align="end">
                <Inline justify="between" className="w-full">
                  <Text size="sm" tone="primary">You</Text>
                  <Text size="xs" tone="muted">2:12 PM</Text>
                </Inline>
                <span className="relative rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                  I will look after lunch.
                  <span className="absolute right-2 -bottom-2 rounded-full border border-border bg-card px-1 text-xs text-foreground">👍 1</span>
                </span>
              </Stack>
              <Inline gap={2} align="center" className="w-fit rounded-lg bg-muted px-3 py-2">
                <span className="flex size-10 items-center justify-center rounded-md bg-background">
                  <FileIcon className="size-4" />
                </span>
                <Stack gap={1}>
                  <Text size="sm" weight="medium">brand.pdf</Text>
                  <Text size="xs" tone="muted">2.4 MB</Text>
                </Stack>
              </Inline>
              <Inline gap={1} align="center" className="w-fit rounded-full bg-muted px-3 py-2" aria-label="Typing">
                <span className="size-1 rounded-full bg-muted-foreground" />
                <span className="size-1 rounded-full bg-muted-foreground" />
                <span className="size-1 rounded-full bg-muted-foreground" />
              </Inline>
              <form className="relative" onSubmit={(event) => event.preventDefault()}>
                <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your message..." aria-label="Message" className="pr-10" />
                <Button type="submit" size="sm" className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded-full" aria-label="Send">
                  <ArrowUpIcon className="size-3.5" />
                </Button>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Stack>
  )
}
