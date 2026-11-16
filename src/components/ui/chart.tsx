import { cloneElement, isValidElement, useEffect, useId, useMemo, useState, type ComponentProps, type ReactElement, type ReactNode } from "react"
import * as RechartsPrimitive from "recharts"
import { isReduced } from "@/components/ui/theme-toggle.tsx"
import { cn } from "@/lib/utils.ts"

export type ChartConfig = Record<string, { label?: ReactNode; color?: string }>

const drawnCharts = new Set<string>()

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
  const [draw, setDraw] = useState(false)

  useEffect(() => {
    if (!styleText || isReduced() || drawnCharts.has(styleText)) return
    setDraw(true)
    const duration = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--duration-chart"))
    const timer = window.setTimeout(() => drawnCharts.add(styleText), duration)
    return () => window.clearTimeout(timer)
  }, [styleText])

  const chart = isValidElement(children)
    ? cloneElement(children as ReactElement<{ isAnimationActive?: boolean }>, { isAnimationActive: false })
    : children

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      data-draw={draw ? "true" : undefined}
      className={cn(
        "flex aspect-video w-full min-w-0 justify-center text-sm",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        className,
      )}
    >
      <style>{`[data-chart="${chartId}"] { ${styleText} }`}</style>
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
        {chart}
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
  hideLabel,
  labelFormatter,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string | number }>
  label?: string | number
  hideLabel?: boolean
  indicator?: string
  labelFormatter?: (value: string | number) => ReactNode
}) {
  const rows = useMemo(() => payload?.filter((item) => item.value !== undefined) ?? [], [payload])
  const caption = hideLabel || label == null ? null : labelFormatter ? labelFormatter(label) : label
  if (!active || rows.length === 0) return null
  return (
    <div className="grid min-w-32 gap-1 rounded-lg border border-border bg-background px-2 py-2 text-sm">
      {caption ? <span className="font-medium">{caption}</span> : null}
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
