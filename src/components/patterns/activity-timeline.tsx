import type { LucideIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"

type ActivityItem = {
  name: string
  time: string
  photo?: string
  lead: string
  rest: string
  chip: string
  icon: LucideIcon
}

function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <Stack gap={0}>
      {items.map((item, index) => (
        <Inline key={item.name} gap={3} align="start">
          <Stack gap={0} align="center" className="self-stretch">
            <Avatar>
              {item.photo ? <AvatarImage src={item.photo} alt="" /> : null}
              <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            {index < items.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
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
  )
}

export { ActivityTimeline }
export type { ActivityItem }
