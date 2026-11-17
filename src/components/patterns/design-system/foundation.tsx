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
  { name: "Nhỏ", token: "text-xs", size: "xs", weight: "normal", tone: "muted", color: "muted-foreground" },
  { name: "Chú thích", token: "text-sm", size: "sm", weight: "normal", tone: "muted", color: "muted-foreground" },
  { name: "Nội dung", token: "text-base", size: "base", weight: "normal", tone: "default", color: "foreground" },
  { name: "Lớn", token: "text-lg", size: "lg", weight: "normal", tone: "default", color: "foreground" },
  { name: "Tiêu đề", token: "text-xl", size: "xl", weight: "medium", tone: "default", color: "foreground" },
  { name: "Tiêu đề lớn", token: "text-2xl", size: "2xl", weight: "semibold", tone: "default", color: "foreground" },
  { name: "Tiêu đề trang", token: "text-3xl", size: "3xl", weight: "bold", tone: "default", color: "foreground" },
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
  { label: "Nhanh", token: "--duration-fast", ease: "--ease-standard" },
  { label: "Vừa", token: "--duration-normal", ease: "--ease-standard" },
  { label: "Chậm", token: "--duration-slow", ease: "--ease-standard" },
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
      <Button type="button" size="sm" variant="outline" onClick={run}>Chạy</Button>
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
          <Text size="sm" tone="muted">Bộ token, chữ và component dùng chung cho mọi màn hình.</Text>
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

  useLayoutEffect(() => {
    setMetrics(TYPE_ROWS.map((row) => {
      const node = document.getElementById(`type-${row.token}`)
      if (!node) return { weight: "", size: "", line: "", tracking: "" }
      const style = getComputedStyle(node)
      const size = Math.round(Number.parseFloat(style.fontSize))
      const line = Math.round(Number.parseFloat(style.lineHeight))
      const tracking = style.letterSpacing === "normal" ? "0px" : style.letterSpacing
      return { weight: style.fontWeight, size: `${size}px`, line: `${line}px`, tracking }
    }))
  }, [])

  return (
    <Stack gap={4}>
      <Text as="h2" id="nen-tang" size="xl" weight="semibold" className="scroll-mt-nav">Nền tảng</Text>
      <div className="grid min-w-0 items-start gap-6 md:grid-cols-auto-fr">
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
              <Text size="xs" tone="muted" className="w-1/3">KIỂU</Text>
              <Text size="xs" tone="muted" className="min-w-0 flex-1 border-l border-dashed border-border px-3">MẪU</Text>
              <Text size="xs" tone="muted" className="w-32 text-right">ÁP DỤNG</Text>
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
            <ColorRows />
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}

const COLOR_GROUPS = [
  { title: "Nền và chữ", names: ["background", "card", "popover", "muted", "secondary", "accent", "border", "input", "ring"] },
  { title: "Thương hiệu", names: ["primary"] },
  { title: "Trạng thái", names: ["success", "warning", "info", "destructive"] },
  { title: "Trạng thái nhạt", names: ["badge-neutral", "badge-primary", "badge-success", "badge-warning", "badge-info", "badge-destructive"] },
  { title: "Chart", names: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { title: "Sidebar", names: ["sidebar", "sidebar-primary", "sidebar-accent", "sidebar-border", "sidebar-ring"] },
] as const

function shortColorName(name: string) {
  if (name.startsWith("badge-")) return name.slice("badge-".length)
  if (name.startsWith("chart-")) return name.slice("chart-".length)
  if (name.startsWith("sidebar-")) return name.slice("sidebar-".length)
  return name
}

function ColorRows() {
  const hex = useTokenHex()
  const choice = useColorChoice()
  const paired = new Set<string>(PAIRS.map((item) => item.name))
  return (
    <Stack gap={6}>
      {COLOR_GROUPS.map((group) => (
        <Stack key={group.title} gap={3}>
          <Text size="sm" weight="medium">{group.title}</Text>
          <div data-color-grid={group.title} className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-9">
            {group.names.map((name) => {
              const item = SWATCHES.find((entry) => entry.name === name)
              if (!item) return null
              const ink = paired.has(name) ? item.fg : choice[name]?.ink
              return (
                <Tooltip key={name}>
                  <TooltipTrigger
                    data-swatch={name}
                    data-hex={hex[name] ?? ""}
                    className={cn("flex aspect-square w-full flex-col items-center justify-center rounded-md border-0 p-1 text-center", item.bg, ink, choice[name]?.edge && "border border-border")}
                  >
                    <span className="text-xs font-medium">{shortColorName(name)}</span>
                    <span className="text-xs">{hex[name] || "…"}</span>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
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

function Tokens() {
  return (
    <Stack gap={4}>
      <Text as="h2" id="token" size="xl" weight="semibold" className="scroll-mt-nav">Token</Text>
      <Grid columns={{ base: 1, md: 2, xl: 4 }} gap={4} className="kit-grid items-stretch">
        <TokenCard title="Khoảng cách">
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
        <TokenCard title="Bo góc">
          <Inline gap={3}>
            {RADII.map((item) => (
              <Stack key={item.name} gap={1} align="center">
                <span className={`size-16 border border-border bg-muted ${item.className}`} />
                <Text size="xs" tone="muted">{item.name}</Text>
              </Stack>
            ))}
          </Inline>
        </TokenCard>
        <TokenCard title="Chuyển động">
          {MOTION.map((item) => (
            <MotionRow key={item.token} label={item.label} token={item.token} ease={item.ease} />
          ))}
        </TokenCard>
        <TokenCard title="Breakpoint">
          {BREAKS.map((item) => (
            <Stack key={item.name} gap={1}>
              <span className={`h-2 ${item.width} rounded-full bg-primary`} />
              <Text size="xs" tone="muted">{item.name} · {item.value}</Text>
            </Stack>
          ))}
        </TokenCard>
      </Grid>
    </Stack>
  )
}

export { Header, Tokens, TypeAndColor }
