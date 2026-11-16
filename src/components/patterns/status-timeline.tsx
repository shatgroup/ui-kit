import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { cn } from "@/lib/utils.ts"

export type TimelineItem = {
  id: string
  title: string
  time: string
  note?: string
  state: "done" | "current" | "todo"
}

const DOT = {
  done: "bg-success",
  current: "bg-primary",
  todo: "bg-muted",
} as const

export function StatusTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <Stack gap={4}>
      {items.map((item) => (
        <Inline key={item.id} gap={3} align="start">
          <span className={cn("size-3 shrink-0 rounded-full", item.state === "current" && "size-4", DOT[item.state])} />
          <Stack gap={1} className="min-w-0">
            <Text weight={item.state === "current" ? "semibold" : "medium"} tone={item.state === "current" ? "primary" : "default"}>
              {item.title}
            </Text>
            <Text size="sm" tone="muted">
              {item.time}
            </Text>
            {item.note ? <Text size="sm">{item.note}</Text> : null}
          </Stack>
        </Inline>
      ))}
    </Stack>
  )
}
