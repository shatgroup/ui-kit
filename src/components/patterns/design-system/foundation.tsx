import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"
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
  { name: "Nhỏ", token: "text-xs", size: "xs", weight: "normal" },
  { name: "Chú thích", token: "text-sm", size: "sm", weight: "normal" },
  { name: "Nội dung", token: "text-base", size: "base", weight: "normal" },
  { name: "Lớn", token: "text-lg", size: "lg", weight: "normal" },
  { name: "Tiêu đề", token: "text-xl", size: "xl", weight: "medium" },
  { name: "Tiêu đề lớn", token: "text-2xl", size: "2xl", weight: "semibold" },
  { name: "Tiêu đề trang", token: "text-3xl", size: "3xl", weight: "bold" },
] as const

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
      <Text as="h2" id="nen-tang" size="xl" weight="semibold" className="scroll-mt-16">Nền tảng</Text>
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
            <div className="min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Tên", "Class", "Độ đậm", "Cỡ chữ", "Line-height", "Letter spacing"].map((label) => (
                    <TableHead key={label}>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {TYPE_ROWS.map((row, index) => (
                  <TableRow key={row.token}>
                    <TableCell>
                      <Text id={`type-${row.token}`} as="span" size={row.size} weight={row.weight}>{row.name}</Text>
                    </TableCell>
                    <TableCell>{row.token}</TableCell>
                    <TableCell>{metrics[index]?.weight}</TableCell>
                    <TableCell>{metrics[index]?.size}</TableCell>
                    <TableCell>{metrics[index]?.line}</TableCell>
                    <TableCell>{metrics[index]?.tracking}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
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
  { title: "Trạng thái", names: ["success", "warning", "info", "destructive", "badge-neutral", "badge-success", "badge-warning", "badge-info", "badge-destructive", "badge-primary"] },
  { title: "Chart", names: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { title: "Sidebar", names: ["sidebar", "sidebar-primary", "sidebar-accent", "sidebar-border", "sidebar-ring"] },
] as const

function ColorRows() {
  const hex = useTokenHex()
  const choice = useColorChoice()
  return (
    <Stack gap={4}>
      {COLOR_GROUPS.map((group) => (
        <Stack key={group.title} gap={2}>
          <Text size="sm" weight="medium">{group.title}</Text>
          <Inline gap={3}>
            {group.names.map((name) => {
              const item = SWATCHES.find((entry) => entry.name === name)
              if (!item) return null
              return (
                <Stack key={name} gap={1} align="center">
                  <div data-swatch={name} data-hex={hex[name] ?? ""} className={`size-14 rounded-md ${item.bg} ${choice[name]?.edge ? "border border-border" : ""}`} />
                  <Text size="xs">{name}</Text>
                  <Text size="xs" tone="muted">{hex[name] || "…"}</Text>
                </Stack>
              )
            })}
          </Inline>
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
      <Text as="h2" id="token" size="xl" weight="semibold" className="scroll-mt-16">Token</Text>
      <Grid columns={{ base: 1, md: 2, xl: 4 }} gap={4} className="kit-grid items-stretch">
        <TokenCard title="Khoảng cách">
          <Grid columns={2} gap={2}>
            {SPACE_BARS.map((item) => (
              <Inline key={item.level} gap={2} align="center">
                <span className={`h-3 ${item.bar} rounded-sm bg-primary`} />
                <Text size="xs" tone="muted">{item.level} · {item.px}</Text>
              </Inline>
            ))}
          </Grid>
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
