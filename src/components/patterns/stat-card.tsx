import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"

type StatCardProps = {
  label: string
  value: string
  delta?: string
  direction?: "up" | "down"
  line?: string
  note?: string
  description?: string
  action?: ReactNode
}

function StatCard({ label, value, delta, direction = "up", line, note, description, action, wash = false }: StatCardProps & { wash?: boolean }) {
  const Icon = direction === "down" ? TrendingDownIcon : TrendingUpIcon
  const detail = note ?? description
  return (
    <div data-stat="true" className="@container min-w-0">
      <Card className={wash ? "bg-gradient-to-b from-card to-muted" : undefined}>
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @md:text-3xl">{value}</CardTitle>
          </div>
          {delta ? (
            <Badge variant="outline">
              <Icon />
              {delta}
            </Badge>
          ) : null}
          {action}
        </CardHeader>
        {line || detail ? (
          <CardFooter className="flex-col items-start gap-1 text-sm">
            {line ? (
              <div className="flex items-center gap-2 font-medium">
                {line}
                <Icon className="size-4" />
              </div>
            ) : null}
            {detail ? <div className="text-muted-foreground">{detail}</div> : null}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

export { StatCard }
