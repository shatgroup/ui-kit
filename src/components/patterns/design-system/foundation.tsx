import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Swatch, useColorChoice, useTokenHex } from "./swatch.tsx"

const STACK = [
  { name: "background", bg: "bg-background", fg: "text-foreground" },
  { name: "muted", bg: "bg-muted", fg: "text-muted-foreground" },
  { name: "border", bg: "bg-border", fg: "text-foreground" },
  { name: "secondary", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "accent", bg: "bg-accent", fg: "text-accent-foreground" },
  { name: "primary", bg: "bg-primary", fg: "text-primary-foreground" },
] as const

const TYPE_ROWS = [
  { name: "Caption", token: "text-xs", size: "xs", weight: "normal", tone: "muted", color: "muted-foreground" },
  { name: "Small", token: "text-sm", size: "sm", weight: "normal", tone: "muted", color: "muted-foreground" },
  { name: "Body", token: "text-base", size: "base", weight: "normal", tone: "default", color: "foreground" },
  { name: "Large", token: "text-lg", size: "lg", weight: "normal", tone: "default", color: "foreground" },
  { name: "Title", token: "text-xl", size: "xl", weight: "medium", tone: "default", color: "foreground" },
  { name: "Heading", token: "text-2xl", size: "2xl", weight: "semibold", tone: "default", color: "foreground" },
  { name: "Page title", token: "text-3xl", size: "3xl", weight: "bold", tone: "default", color: "foreground" },
] as const

const WEIGHT_NAME: Record<string, string> = {
  "400": "Regular",
  "500": "Medium",
  "600": "Semibold",
  "700": "Bold",
}

const WEIGHTS = [
  { label: "regular", className: "font-normal" },
  { label: "medium", className: "font-medium" },
  { label: "semibold", className: "font-semibold" },
  { label: "bold", className: "font-bold" },
] as const

const SPACE_BARS = [
  { level: "0", bar: "w-0", px: "0px" },
  { level: "1", bar: "w-1", px: "4px" },
  { level: "2", bar: "w-2", px: "8px" },
  { level: "3", bar: "w-3", px: "12px" },
  { level: "4", bar: "w-4", px: "16px" },
  { level: "5", bar: "w-5", px: "20px" },
  { level: "6", bar: "w-6", px: "24px" },
  { level: "8", bar: "w-8", px: "32px" },
  { level: "10", bar: "w-10", px: "40px" },
  { level: "12", bar: "w-12", px: "48px" },
  { level: "16", bar: "w-16", px: "64px" },
] as const

const RADII = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "full", className: "rounded-full" },
] as const

const BREAKS = [
  { name: "sm", width: "w-1/2", value: "40rem · 640px" },
  { name: "md", width: "w-3/5", value: "48rem · 768px" },
  { name: "lg", width: "w-4/5", value: "64rem · 1024px" },
  { name: "xl", width: "w-full", value: "80rem · 1280px" },
] as const

const MOTION = [
  { label: "Fast", token: "--duration-fast", ease: "--ease-standard" },
  { label: "Normal", token: "--duration-normal", ease: "--ease-standard" },
  { label: "Slow", token: "--duration-slow", ease: "--ease-standard" },
  { label: "Theme", token: "--duration-theme", ease: "--ease-out" },
] as const

const PAIRS = [
  { name: "background", bg: "bg-background", fg: "text-foreground" },
  { name: "card", bg: "bg-card", fg: "text-card-foreground" },
  { name: "popover", bg: "bg-popover", fg: "text-popover-foreground" },
  { name: "muted", bg: "bg-muted", fg: "text-muted-foreground" },
  { name: "secondary", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "accent", bg: "bg-accent", fg: "text-accent-foreground" },
  { name: "primary", bg: "bg-primary", fg: "text-primary-foreground" },
  { name: "success", bg: "bg-success", fg: "text-success-foreground" },
  { name: "warning", bg: "bg-warning", fg: "text-warning-foreground" },
  { name: "info", bg: "bg-info", fg: "text-info-foreground" },
  { name: "destructive", bg: "bg-destructive", fg: "text-destructive-foreground" },
  { name: "badge-neutral", bg: "bg-badge-neutral", fg: "text-badge-neutral-foreground" },
  { name: "badge-primary", bg: "bg-badge-primary", fg: "text-badge-primary-foreground" },
  { name: "badge-success", bg: "bg-badge-success", fg: "text-badge-success-foreground" },
  { name: "badge-warning", bg: "bg-badge-warning", fg: "text-badge-warning-foreground" },
  { name: "badge-info", bg: "bg-badge-info", fg: "text-badge-info-foreground" },
  { name: "badge-destructive", bg: "bg-badge-destructive", fg: "text-badge-destructive-foreground" },
  { name: "sidebar", bg: "bg-sidebar", fg: "text-sidebar-foreground" },
  { name: "sidebar-primary", bg: "bg-sidebar-primary", fg: "text-sidebar-primary-foreground" },
  { name: "sidebar-accent", bg: "bg-sidebar-accent", fg: "text-sidebar-accent-foreground" },
] as const

const CHIPS = [
  { name: "border", bg: "bg-border", fg: "text-foreground" },
  { name: "input", bg: "bg-input", fg: "text-foreground" },
  { name: "ring", bg: "bg-ring", fg: "text-foreground" },
  { name: "chart-1", bg: "bg-chart-1", fg: "text-foreground" },
  { name: "chart-2", bg: "bg-chart-2", fg: "text-foreground" },
  { name: "chart-3", bg: "bg-chart-3", fg: "text-foreground" },
  { name: "chart-4", bg: "bg-chart-4", fg: "text-foreground" },
  { name: "chart-5", bg: "bg-chart-5", fg: "text-foreground" },
  { name: "sidebar-border", bg: "bg-sidebar-border", fg: "text-foreground" },
  { name: "sidebar-ring", bg: "bg-sidebar-ring", fg: "text-foreground" },
] as const

const SWATCHES = [...PAIRS, ...CHIPS]

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduceMotion === "true"
}

function MotionRow({ label, token, ease }: { label: string; token: string; ease: string }) {
  const dot = useRef<HTMLSpanElement>(null)
  const [ms, setMs] = useState("")

  useLayoutEffect(() => {
    setMs(getComputedStyle(document.documentElement).getPropertyValue(token).trim())
  }, [token])

  function run() {
    const node = dot.current
    const track = node?.parentElement
    if (!node || !track) return
    const styles = getComputedStyle(document.documentElement)
    const duration = Number.parseFloat(styles.getPropertyValue(token))
    const easing = styles.getPropertyValue(ease).trim()
    const distance = Math.max(0, track.clientWidth - node.offsetWidth)
    node.animate(
      [{ transform: "translateX(0px)" }, { transform: `translateX(${distance}px)` }],
      { duration: reduced() || Number.isNaN(duration) ? 0 : duration, easing: easing || "ease", fill: "none" },
    )
  }

  return (
    <Inline gap={3} align="center">
      <Button type="button" size="sm" variant="outline" onClick={run}>Run</Button>
      <div className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
        <span ref={dot} className="absolute top-0 left-0 size-3 rounded-full bg-primary" />
      </div>
      <Text size="xs" tone="muted">{label} · {ms}</Text>
    </Inline>
  )
}

function Header() {
  return (
    <Stack gap={4}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Stack gap={2} className="max-w-md">
          <Text as="h1" size="3xl" weight="bold">Design System</Text>
          <Text size="sm" tone="muted">Tokens, type, and components shared across every screen.</Text>
        </Stack>
        <span className="specimen-word block min-w-0 font-medium break-words text-muted-foreground xl:shrink-0 xl:text-right">Be Vietnam Pro</span>
      </div>
    </Stack>
  )
}

function TypeAndColor() {
  const hex = useTokenHex()
  const choice = useColorChoice()
  const [metrics, setMetrics] = useState<Array<{ weight: string; size: string; line: string; tracking: string }>>([])
  const [viMetric, setViMetric] = useState<{ weight: string; size: string; line: string; tracking: string } | null>(null)

  useLayoutEffect(() => {
    const read = (node: HTMLElement | null) => {
      if (!node) return { weight: "", size: "", line: "", tracking: "" }
      const style = getComputedStyle(node)
      const size = Math.round(Number.parseFloat(style.fontSize))
      const line = Math.round(Number.parseFloat(style.lineHeight))
      const tracking = style.letterSpacing === "normal" ? "0px" : style.letterSpacing
      return { weight: style.fontWeight, size: `${size}px`, line: `${line}px`, tracking }
    }
    setMetrics(TYPE_ROWS.map((row) => read(document.getElementById(`type-${row.token}`))))
    setViMetric(read(document.getElementById("type-vi")))
  }, [])

  return (
    <Stack gap={4}>
      <Text as="h2" id="nen-tang" size="xl" weight="semibold" className="scroll-mt-nav">Foundations</Text>
      <div data-layout="type-color" className="min-w-0 items-start">
        <Stack gap={4} className="min-w-0">
          <Card className="min-w-0">
            <CardContent>
              <Stack gap={3}>
                <Text size="sm" weight="medium">Font Be Vietnam Pro</Text>
                <Inline gap={2}>
                  {WEIGHTS.map((item) => (
                    <span key={item.label} className={`text-sm ${item.className}`}>{item.label}</span>
                  ))}
                </Inline>
                <span className="specimen-display font-bold">Aa1</span>
              </Stack>
            </CardContent>
          </Card>
          <div className="swatch-stack">
            {STACK.map((item) => (
              <Swatch
                key={item.name}
                name={item.name}
                bg={item.bg}
                fg={item.name === "border" ? choice[item.name]?.ink : item.fg}
                hex={hex[item.name] ?? ""}
                bordered={choice[item.name]?.edge}
              />
            ))}
          </div>
        </Stack>
        <Card className="min-w-0">
          <CardContent>
            <div className="flex min-w-0 items-end border-b border-border pb-2">
              <Text size="xs" tone="muted" className="w-1/3">STYLE</Text>
              <Text size="xs" tone="muted" className="min-w-0 flex-1 border-l border-dashed border-border px-3">SAMPLE</Text>
              <Text size="xs" tone="muted" className="w-32 text-right">APPLIED</Text>
            </div>
            {TYPE_ROWS.map((row, index) => {
              const metric = metrics[index]
              const weight = metric ? WEIGHT_NAME[metric.weight] ?? metric.weight : "…"
              const size = metric?.size.replace("px", "") ?? "…"
              const line = metric?.line.replace("px", "") ?? "…"
              const tracking = metric?.tracking ?? "…"
              return (
                <div key={row.token} data-type-row={row.token} className="flex min-w-0 items-center border-b border-border py-3">
                  <Stack gap={1} className="w-1/3 pe-3">
                    <Text size="xs" weight="semibold">{row.name}</Text>
                    <span data-type-meta>
                      <Text size="xs" tone="muted">Be Vietnam Pro / {weight} · {size}/{line} · {tracking}</Text>
                    </span>
                  </Stack>
                  <div className="min-w-0 flex-1 border-l border-dashed border-border px-3">
                    <Text id={`type-${row.token}`} as="span" size={row.size} weight={row.weight} tone={row.tone}>{row.name}</Text>
                  </div>
                  <Stack gap={1} align="end" className="w-32">
                    <Text size="xs">{row.token}</Text>
                    <Text size="xs" tone="muted">{row.color}</Text>
                  </Stack>
                </div>
              )
            })}
            <div data-type-row="vi" className="flex min-w-0 items-center border-b border-border py-3">
              <Stack gap={1} className="w-1/3 pe-3">
                <Text size="xs" weight="semibold">Vietnamese</Text>
                <span data-type-meta>
                  <Text size="xs" tone="muted">Be Vietnam Pro / {viMetric ? WEIGHT_NAME[viMetric.weight] ?? viMetric.weight : "…"} · {viMetric?.size.replace("px", "") ?? "…"}/{viMetric?.line.replace("px", "") ?? "…"} · {viMetric?.tracking ?? "…"}</Text>
                </span>
              </Stack>
              <div className="min-w-0 flex-1 border-l border-dashed border-border px-3">
                <Text id="type-vi" as="span" size="base">{`Tiếng Việt có dấu`}</Text>
              </div>
              <Stack gap={1} align="end" className="w-32">
                <Text size="xs">text-base</Text>
                <Text size="xs" tone="muted">foreground</Text>
              </Stack>
            </div>
            <ColorRows />
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}

const COLOR_GROUPS = [
  { title: "Surface and text", names: ["background", "card", "popover", "muted", "secondary", "accent", "border", "input", "ring"] },
  { title: "Brand", names: ["primary"] },
  { title: "Status", names: ["success", "warning", "info", "destructive"] },
  { title: "Soft status", names: ["badge-neutral", "badge-primary", "badge-success", "badge-warning", "badge-info", "badge-destructive"] },
  { title: "Chart", names: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { title: "Sidebar", names: ["sidebar", "sidebar-primary", "sidebar-accent", "sidebar-border", "sidebar-ring"] },
] as const

function shortColorName(name: string) {
  if (name.startsWith("badge-")) return name.slice("badge-".length)
  if (name.startsWith("chart-")) return name.slice("chart-".length)
  if (name.startsWith("sidebar-")) return name.slice("sidebar-".length)
  return name
}

function ColorSwatch({ name, hex, ink, edge }: { name: string; hex: string; ink?: string; edge?: boolean }) {
  const item = SWATCHES.find((entry) => entry.name === name)
  if (!item) return null
  return (
    <Tooltip>
      <TooltipTrigger
        data-swatch={name}
        data-hex={hex}
        className={cn("flex aspect-square w-full flex-col items-center justify-center rounded-md border-0 p-1 text-center", item.bg, ink, edge && "border border-border")}
      >
        <span className="text-xs font-medium">{shortColorName(name)}</span>
        <span className="text-xs">{hex || "…"}</span>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}

function ColorRows() {
  const hex = useTokenHex()
  const choice = useColorChoice()
  const paired = new Set<string>(PAIRS.map((item) => item.name))
  const paint = (name: string) => {
    const item = SWATCHES.find((entry) => entry.name === name)
    if (!item) return null
    return <ColorSwatch key={name} name={name} hex={hex[name] ?? ""} ink={paired.has(name) ? item.fg : choice[name]?.ink} edge={choice[name]?.edge} />
  }
  const rest = COLOR_GROUPS.filter((group) => group.title !== "Brand" && group.title !== "Status")
  const brand = COLOR_GROUPS.find((group) => group.title === "Brand")
  const status = COLOR_GROUPS.find((group) => group.title === "Status")
  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Grid columns={{ base: 3, md: 4, xl: 9 }} gap={3}>
          <Text size="sm" weight="medium">Brand</Text>
          <Text size="sm" weight="medium" className="col-span-2 md:col-span-3 xl:col-span-8">Status</Text>
        </Grid>
        <Grid data-color-grid="Status" columns={{ base: 3, md: 4, xl: 9 }} gap={3}>
          {[...(brand?.names ?? []), ...(status?.names ?? [])].map((name) => paint(name))}
        </Grid>
      </Stack>
      {rest.map((group) => (
        <Stack key={group.title} gap={3}>
          <Text size="sm" weight="medium">{group.title}</Text>
          <Grid data-color-grid={group.title} columns={{ base: 3, md: 4, xl: 9 }} gap={3}>
            {group.names.map((name) => paint(name))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  )
}

function TokenCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="h-full min-w-0">
      <CardContent>
        <Stack gap={3}>
          <Text size="sm" weight="medium">{title}</Text>
          {children}
        </Stack>
      </CardContent>
    </Card>
  )
}

function ColumnBars({ count }: { count: number }) {
  return (
    <div className="flex min-w-0 gap-1">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="h-6 min-w-0 flex-1 rounded-sm bg-primary/15" />
      ))}
    </div>
  )
}

function FrameDiagram() {
  return (
    <Stack gap={4}>
      <Grid>
        <Grid span="half">
          <Stack gap={2}>
            <Text size="xs" weight="medium">Desktop</Text>
            <div className="overflow-hidden rounded-md border border-border">
              <div className="flex min-w-0">
                <div className="flex w-16 shrink-0 items-center justify-center bg-muted px-1">
                  <Text size="xs">256</Text>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex h-14 items-center bg-muted px-2">
                    <Text size="xs">56</Text>
                  </div>
                  <div className="p-2">
                    <ColumnBars count={12} />
                  </div>
                </div>
              </div>
            </div>
            <Text size="xs" tone="muted">12 columns · margin 24 · gutter 16</Text>
          </Stack>
        </Grid>
        <Grid span="half">
          <Stack gap={2}>
            <Text size="xs" weight="medium">Mobile</Text>
            <div className="overflow-hidden rounded-md border border-border">
              <div className="flex h-14 items-center bg-muted px-2">
                <Text size="xs">56</Text>
              </div>
              <div className="p-2">
                <ColumnBars count={4} />
              </div>
              <div className="flex h-14 items-center bg-muted px-2">
                <Text size="xs">56</Text>
              </div>
            </div>
            <Text size="xs" tone="muted">4 columns · margin 16 · gutter 16 · tab bar 56</Text>
          </Stack>
        </Grid>
      </Grid>
      <Grid data-measure-grid>
        <Grid span="quarter" className="rounded-md bg-primary/15 px-2 py-2">
          <Text size="xs">Quarter</Text>
        </Grid>
        <Grid span="half" className="rounded-md bg-primary/15 px-2 py-2">
          <Text size="xs">Half</Text>
        </Grid>
        <Grid span="full" className="rounded-md bg-primary/15 px-2 py-2">
          <Text size="xs">Full</Text>
        </Grid>
      </Grid>
    </Stack>
  )
}

function Tokens() {
  return (
    <Stack gap={4}>
      <Text as="h2" id="token" size="xl" weight="semibold" className="scroll-mt-nav">Tokens</Text>
      <Grid className="kit-grid items-stretch">
        <Grid span="quarter" className="h-full">
        <TokenCard title="Spacing">
          <div data-space-grid className="grid grid-flow-col grid-rows-6 gap-2">
            {SPACE_BARS.map((item) => (
              <Inline key={item.level} gap={2} align="center" wrap={false}>
                <span className="flex w-16 shrink-0">
                  <span data-space-level={item.level} className={`h-3 ${item.bar} rounded-sm bg-primary`} />
                </span>
                <Text size="xs" tone="muted" className="whitespace-nowrap">{item.level} · {item.px}</Text>
              </Inline>
            ))}
          </div>
        </TokenCard>
        </Grid>
        <Grid span="quarter" className="h-full">
        <TokenCard title="Radius">
          <Inline gap={3}>
            {RADII.map((item) => (
              <Stack key={item.name} gap={1} align="center">
                <span className={`size-16 border border-border bg-muted ${item.className}`} />
                <Text size="xs" tone="muted">{item.name}</Text>
              </Stack>
            ))}
          </Inline>
        </TokenCard>
        </Grid>
        <Grid span="quarter" className="h-full">
        <TokenCard title="Motion">
          {MOTION.map((item) => (
            <MotionRow key={item.token} label={item.label} token={item.token} ease={item.ease} />
          ))}
        </TokenCard>
        </Grid>
        <Grid span="quarter" className="h-full">
        <TokenCard title="Breakpoint">
          {BREAKS.map((item) => (
            <Stack key={item.name} gap={1}>
              <span className={`h-2 ${item.width} rounded-full bg-primary`} />
              <Text size="xs" tone="muted">{item.name} · {item.value}</Text>
            </Stack>
          ))}
        </TokenCard>
        </Grid>
        <Grid span="full" className="h-full">
          <TokenCard title="Grid & Layout">
            <FrameDiagram />
          </TokenCard>
        </Grid>
      </Grid>
    </Stack>
  )
}

export { Header, Tokens, TypeAndColor }
