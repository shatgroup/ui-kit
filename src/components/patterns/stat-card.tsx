import type { ReactNode } from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Truncated } from "@/components/ui/truncated.tsx"

type StatCardProps = {
  label: string
  value: string
  delta?: string
  direction?: "up" | "down"
  description?: string
  action?: ReactNode
}

export function StatCard({ label, value, delta, direction, description, action }: StatCardProps) {
  const Icon = direction === "down" ? ArrowDownIcon : ArrowUpIcon
  return (
    <div data-stat="true" className="min-w-0">
      <Card>
        <CardContent>
        <Stack gap={2}>
          <Inline align="start" justify="between" gap={2}>
            <Text size="sm" tone="muted">
              {label}
            </Text>
            {action}
          </Inline>
          <Tooltip>
            <TooltipTrigger render={<span className="block min-w-0" />}>
              <Truncated className="stat-value text-2xl font-semibold tabular-nums">{value}</Truncated>
            </TooltipTrigger>
            <TooltipContent>{value}</TooltipContent>
          </Tooltip>
          {delta ? (
            <Inline gap={1} align="center">
              <Icon className={direction === "down" ? "size-4 text-destructive" : "size-4 text-success"} />
              <Text as="span" size="sm" tone={direction === "down" ? "destructive" : "success"}>
                {delta}
              </Text>
            </Inline>
          ) : null}
          {description ? (
            <Text size="sm" tone="muted">
              {description}
            </Text>
          ) : null}
        </Stack>
        </CardContent>
      </Card>
    </div>
  )
}
