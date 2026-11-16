import { useId, useMemo, type ComponentProps, type ReactNode } from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils.ts"

export type ChartConfig = Record<string, { label?: ReactNode; color?: string }>

function ChartContainer({
  id,
  className,
  config,
  children,
}: ComponentProps<"div"> & {
  config: ChartConfig
  children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
}) {
  const autoId = useId().replace(/:/g, "")
  const chartId = id ?? autoId
  const styleText = Object.entries(config)
    .filter((entry) => entry[1].color)
    .map(([key, item]) => `--color-${key}: ${item.color};`)
    .join("")

  return (
    <div data-slot="chart" data-chart={chartId} className={cn("flex w-full min-w-0 justify-center text-sm", className)}>
      <style>{`[data-chart="${chartId}"] { ${styleText} }`}</style>
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip
const ChartLegend = RechartsPrimitive.Legend

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string | number }>
  label?: string
}) {
  const rows = useMemo(() => payload?.filter((item) => item.value !== undefined) ?? [], [payload])
  if (!active || rows.length === 0) return null
  return (
    <div className="grid min-w-32 gap-1 rounded-lg border border-border bg-background px-2 py-2 text-sm shadow-md">
      {label ? <span className="font-medium">{label}</span> : null}
      {rows.map((item) => (
        <span key={String(item.dataKey)} className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-medium tabular-nums">{item.value}</span>
        </span>
      ))}
    </div>
  )
}

function ChartLegendContent({
  payload,
}: {
  payload?: Array<{ value?: string; color?: string; dataKey?: string | number }>
}) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-sm">
      {payload.map((item) => (
        <span key={String(item.dataKey)} className="inline-flex items-center gap-2">
          <span
            className="size-2 rounded-sm bg-chart-1"
            // check-ui-ignore-next-line: màu legend là biến --chart của từng series, Recharts không có class tĩnh
            style={{ background: item.color }}
          />
          {item.value}
        </span>
      ))}
    </div>
  )
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent }
