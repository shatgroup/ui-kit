import { useState } from "react"
import { Area, AreaChart } from "recharts"
import { PhoneIcon, SearchIcon, VideoIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { ActivityTimeline } from "@/components/patterns/activity-timeline.tsx"
import { ChartCard } from "@/components/patterns/chart-card.tsx"
import { ChatPanel } from "@/components/patterns/chat-panel.tsx"
import { Ticker } from "@/components/patterns/ticker.tsx"
import { TransactionList } from "@/components/patterns/transaction-list.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import { activity, appMessages, prices, ticker, transactions } from "@/fixtures/application.ts"

const priceConfig = { price: { label: "Price", color: "var(--chart-1)" } } satisfies ChartConfig

export function ShowcaseApplication() {
  const [range, setRange] = useState<string[]>(["1M"])
  const [period, setPeriod] = useState("month")
  const [tx, setTx] = useState("completed")
  const [feed, setFeed] = useState("all")
  const [query, setQuery] = useState("")
  const shown = activity.filter((item) => {
    const text = `${item.name} ${item.lead} ${item.rest}`.toLowerCase()
    if (query && !text.includes(query.trim().toLowerCase())) return false
    if (feed === "tasks") return item.chip === "Done"
    if (feed === "meetings") return item.chip === "Today"
    return true
  })
  const periodLabel = period === "quarter" ? "Last quarter" : "Last month"

  return (
    <Stack gap={4}>
      <Ticker items={ticker} />
      <Grid columns={{ base: 1, lg: 2 }} gap={4}>
        <ChartCard
          title="Stock Market"
          description="SHOP"
          footer={<Badge variant="success">+1.25%</Badge>}
          note="$128.40"
        >
          <Stack gap={3}>
            <ToggleGroup
              value={range}
              onValueChange={(value) => {
                if (value.length > 0) setRange([value[value.length - 1] ?? "1M"])
              }}
            >
              <ToggleGroupItem value="1W">1W</ToggleGroupItem>
              <ToggleGroupItem value="1M">1M</ToggleGroupItem>
              <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
            </ToggleGroup>
            <ChartContainer config={priceConfig} className="h-40 w-full">
              <AreaChart data={prices}>
                <Area type="monotone" dataKey="price" stroke="var(--color-price)" fill="var(--color-price)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
            <Inline gap={4} justify="between">
              <Stack gap={1}>
                <Text size="xs" tone="muted">Market Cap</Text>
                <Text weight="medium">$12.4B</Text>
              </Stack>
              <Stack gap={1}>
                <Text size="xs" tone="muted">Volume</Text>
                <Text weight="medium">2.1M</Text>
              </Stack>
            </Inline>
          </Stack>
        </ChartCard>
        <Card>
          <CardHeader>
            <Inline justify="between" align="center">
              <CardTitle>Transactions</CardTitle>
              <Select value={period} onValueChange={(value) => setPeriod(value ?? "month")}>
                <SelectTrigger size="sm" className="w-36" aria-label="Period">
                  <span>{periodLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last month</SelectItem>
                  <SelectItem value="quarter">Last quarter</SelectItem>
                </SelectContent>
              </Select>
            </Inline>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Tabs value={tx} onValueChange={setTx}>
                <TabsList fullWidth>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                {(["completed", "pending", "cancelled"] as const).map((key) => (
                  <TabsContent key={key} value={key}>
                    <TransactionList items={transactions[key]} />
                  </TabsContent>
                ))}
              </Tabs>
              <Button variant="secondary">View all</Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Inline gap={2} align="center" wrap={false}>
                <SearchIcon className="size-4" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search activity" />
              </Inline>
              <Tabs value={feed} onValueChange={setFeed}>
                <TabsList fullWidth>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>
              </Tabs>
              <ActivityTimeline items={shown} />
            </Stack>
          </CardContent>
        </Card>
        <ChatPanel
          name="Sofia Davis"
          status="Online"
          photo="/samples/avatars/01.svg"
          messages={appMessages}
          actions={
            <Inline gap={1}>
              <Button variant="ghost" size="sm" className="w-8 px-0" aria-label="Call"><PhoneIcon /></Button>
              <Button variant="ghost" size="sm" className="w-8 px-0" aria-label="Video"><VideoIcon /></Button>
            </Inline>
          }
        />
      </Grid>
    </Stack>
  )
}
