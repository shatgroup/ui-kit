import { TriangleIcon } from "lucide-react"
import { Inline, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Card } from "@/components/ui/card.tsx"

type TickerItem = {
  symbol: string
  avatar: string
  price: string
  change: string
  up: boolean
}

function Ticker({ items }: { items: TickerItem[] }) {
  return (
    <Card className="gap-2 py-2">
      <div data-scroll-x="true" className="overflow-x-auto">
        <Inline gap={0} align="center" wrap={false}>
          {items.map((item, index) => (
            <Inline
              key={item.symbol}
              gap={2}
              align="center"
              wrap={false}
              className={index > 0 ? "shrink-0 border-l border-border px-3" : "shrink-0 px-3"}
            >
              <Avatar size="sm">
                <AvatarFallback>{item.avatar}</AvatarFallback>
              </Avatar>
              <Text size="sm" weight="semibold" className="whitespace-nowrap">
                {item.symbol}
              </Text>
              <Text size="sm" tone="muted" className="whitespace-nowrap tabular-nums">
                {item.price}
              </Text>
              <Inline gap={1} align="center" wrap={false} className="shrink-0">
                <TriangleIcon className={item.up ? "size-3 fill-chart-1 text-chart-1" : "size-3 rotate-180 fill-destructive text-destructive"} />
                <Text size="sm" className={item.up ? "whitespace-nowrap text-chart-1" : "whitespace-nowrap text-destructive"}>
                  {item.change}
                </Text>
              </Inline>
            </Inline>
          ))}
        </Inline>
      </div>
    </Card>
  )
}

export { Ticker }
export type { TickerItem }
