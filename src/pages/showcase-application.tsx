import { useState } from "react"
import { Area, AreaChart } from "recharts"
import { PaperclipIcon, PhoneIcon, VideoIcon } from "lucide-react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"

const stocks = [
  { symbol: "SDCN", price: "128.40", change: "+2.4%", up: true },
  { symbol: "ACME", price: "86.15", change: "-1.1%", up: false },
  { symbol: "TWKN", price: "54.02", change: "+0.8%", up: true },
  { symbol: "VEGA", price: "19.77", change: "-3.2%", up: false },
]

const series = Array.from({ length: 16 }, (_, index) => ({ day: index + 1, price: 100 + ((index * 13) % 40) }))

const activity = [
  { name: "Sofia Davis", time: "2:14 PM", text: "assigned you to Cover page", chip: "Design", initials: "SD" },
  { name: "Jackson Lee", time: "1:02 PM", text: "commented on Executive summary", chip: "Review", initials: "JL" },
  { name: "Isabella Nguyen", time: "11:40 AM", text: "uploaded the brand deck", chip: "File", initials: "IN" },
]

export function ShowcaseApplication() {
  const [range, setRange] = useState<string[]>(["1M"])
  const [tab, setTab] = useState("all")
  const [query, setQuery] = useState("")

  const items = activity.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()) || item.text.includes(query.trim().toLowerCase()))

  return (
    <Stack gap={4}>
      <div data-scroll-x="true">
        <Inline gap={3} wrap={false}>
          {stocks.map((stock) => (
            <Card key={stock.symbol} className="min-w-40">
              <CardContent>
                <Stack gap={1}>
                  <Text size="sm" weight="semibold">{stock.symbol}</Text>
                  <Text weight="semibold" className="tabular-nums">{stock.price}</Text>
                  <Text size="sm" tone={stock.up ? "success" : "destructive"}>{stock.change}</Text>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Inline>
      </div>
      <Grid columns={{ base: 1, lg: 2 }} gap={4}>
        <Card>
          <CardHeader>
            <Inline justify="between" align="center" gap={2}>
              <CardTitle>Stock Market</CardTitle>
              <ToggleGroup value={range} onValueChange={(value) => { if (value.length > 0) setRange([value[value.length - 1] ?? "1M"]) }}>
                <ToggleGroupItem value="1W">1W</ToggleGroupItem>
                <ToggleGroupItem value="1M">1M</ToggleGroupItem>
                <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
              </ToggleGroup>
            </Inline>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Inline gap={2} align="center">
                <Text size="3xl" weight="bold" className="tabular-nums">$128.40</Text>
                <Badge variant="success">+2.4%</Badge>
              </Inline>
              <ChartContainer config={{ price: { label: "Price", color: "var(--chart-1)" } }} className="h-40">
                <AreaChart data={series}>
                  <Area type="monotone" dataKey="price" name="Price" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ChartContainer>
              <Inline justify="between">
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Market Cap</Text>
                  <Text weight="medium">$12.4B</Text>
                </Stack>
                <Stack gap={1}>
                  <Text size="xs" tone="muted">Volume</Text>
                  <Text weight="medium">3.2M</Text>
                </Stack>
              </Inline>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Input size="md" value={query} aria-label="Search activity" placeholder="Search" onChange={(event) => setQuery(event.target.value)} />
              <Tabs value={tab} onValueChange={(value) => setTab(value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>
              </Tabs>
              <Stack gap={3}>
                {items.map((item) => (
                  <Inline key={item.name} gap={2} align="start">
                    <Avatar size="sm"><AvatarFallback>{item.initials}</AvatarFallback></Avatar>
                    <Stack gap={1} className="min-w-0">
                      <Inline gap={2} align="center" justify="between">
                        <Text size="sm" weight="semibold">{item.name}</Text>
                        <Text size="xs" tone="muted">{item.time}</Text>
                      </Inline>
                      <Text size="sm"><Text as="span" weight="semibold">{item.name}</Text> {item.text}</Text>
                      <Badge variant="neutral">{item.chip}</Badge>
                    </Stack>
                  </Inline>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Card>
        <CardHeader>
          <Inline justify="between" align="center">
            <Inline gap={2} align="center">
              <Avatar><AvatarFallback>SD</AvatarFallback></Avatar>
              <Stack gap={0}>
                <Text weight="semibold">Sofia Davis</Text>
                <Text size="xs" tone="success">Online</Text>
              </Stack>
            </Inline>
            <Inline gap={2}>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Call"><PhoneIcon className="size-4" /></Button>
              <Button variant="outline" size="sm" className="w-8 px-0" aria-label="Video"><VideoIcon className="size-4" /></Button>
            </Inline>
          </Inline>
        </CardHeader>
        <CardContent>
          <Stack gap={3}>
            <Inline justify="start"><Text as="span" size="sm" className="rounded-md bg-muted px-3 py-2">Can you review the deck?</Text></Inline>
            <Inline justify="end"><Text as="span" size="sm" className="rounded-md bg-primary px-3 py-2 text-primary-foreground">On it.</Text></Inline>
            <Inline gap={2} align="center" className="rounded-md border border-border p-2">
              <PaperclipIcon className="size-4" />
              <Text size="sm">brand-deck.pdf</Text>
              <Text size="xs" tone="muted">1.2 MB</Text>
            </Inline>
            <Inline gap={2}>
              <Badge variant="neutral">👍 2</Badge>
              <Badge variant="neutral">🔥 1</Badge>
            </Inline>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
