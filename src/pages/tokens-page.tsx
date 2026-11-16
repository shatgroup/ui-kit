import { useLayoutEffect, useState } from "react"
import { Box, Container, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import type { Space } from "@/components/layout/index.ts"

type Mode = "light" | "dark"

type Pair = {
  name: string
  bg: string
  fg: string
}

type Row = {
  name: string
  bg: string
  fg: string
  bgHex: string
  fgHex: string
  ratio: number
}

const PAIRS: Pair[] = [
  { name: "background / foreground", bg: "bg-background", fg: "bg-foreground" },
  { name: "card / card-foreground", bg: "bg-card", fg: "bg-card-foreground" },
  { name: "popover / popover-foreground", bg: "bg-popover", fg: "bg-popover-foreground" },
  { name: "primary / primary-foreground", bg: "bg-primary", fg: "bg-primary-foreground" },
  { name: "background / primary-text", bg: "bg-background", fg: "bg-primary-text" },
  { name: "secondary / secondary-foreground", bg: "bg-secondary", fg: "bg-secondary-foreground" },
  { name: "muted / muted-foreground", bg: "bg-muted", fg: "bg-muted-foreground" },
  { name: "accent / accent-foreground", bg: "bg-accent", fg: "bg-accent-foreground" },
  { name: "destructive / destructive-foreground", bg: "bg-destructive", fg: "bg-destructive-foreground" },
  { name: "sidebar / sidebar-foreground", bg: "bg-sidebar", fg: "bg-sidebar-foreground" },
  { name: "sidebar-primary / sidebar-primary-foreground", bg: "bg-sidebar-primary", fg: "bg-sidebar-primary-foreground" },
  { name: "sidebar-accent / sidebar-accent-foreground", bg: "bg-sidebar-accent", fg: "bg-sidebar-accent-foreground" },
  { name: "success / success-foreground", bg: "bg-success", fg: "bg-success-foreground" },
  { name: "warning / warning-foreground", bg: "bg-warning", fg: "bg-warning-foreground" },
  { name: "info / info-foreground", bg: "bg-info", fg: "bg-info-foreground" },
]

const CHARTS = [
  { name: "chart-1", bg: "bg-chart-1" },
  { name: "chart-2", bg: "bg-chart-2" },
  { name: "chart-3", bg: "bg-chart-3" },
  { name: "chart-4", bg: "bg-chart-4" },
  { name: "chart-5", bg: "bg-chart-5" },
]

const SAMPLE = "Giày Shondo – Quỹ đạo ấm áp, bước chân vững vàng"

const SIZES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const

const SPACE_BAR: Record<Space, string> = {
  0: "w-0",
  1: "w-1",
  2: "w-2",
  3: "w-3",
  4: "w-4",
  5: "w-5",
  6: "w-6",
  8: "w-8",
  10: "w-10",
  12: "w-12",
  16: "w-16",
}

const SPACES: Space[] = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16]

function channel(value: number) {
  const ratio = value / 255
  return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

function parseRgb(input: string): [number, number, number] | null {
  const match = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function toHex(rgb: [number, number, number]) {
  return (
    "#" +
    rgb
      .map((part) => Math.round(part).toString(16).padStart(2, "0"))
      .join("")
  )
}

function contrast(bg: [number, number, number], fg: [number, number, number]) {
  const l1 = 0.2126 * channel(bg[0]) + 0.7152 * channel(bg[1]) + 0.0722 * channel(bg[2])
  const l2 = 0.2126 * channel(fg[0]) + 0.7152 * channel(fg[1]) + 0.0722 * channel(fg[2])
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function readBg(className: string): [number, number, number] | null {
  const probe = document.createElement("div")
  probe.className = className
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).backgroundColor
  probe.remove()
  const parsed = parseRgb(color)
  if (parsed) return parsed
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return null
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const pixel = context.getImageData(0, 0, 1, 1).data
  return [pixel[0], pixel[1], pixel[2]]
}

function measure(pair: Pair): Row | null {
  const bg = readBg(pair.bg)
  const fg = readBg(pair.fg)
  if (!bg || !fg) return null
  return {
    name: pair.name,
    bg: pair.bg,
    fg: pair.fg,
    bgHex: toHex(bg),
    fgHex: toHex(fg),
    ratio: contrast(bg, fg),
  }
}

export function TokensPage() {
  const [mode, setMode] = useState<Mode>("light")
  const [rows, setRows] = useState<Row[]>([])
  const [charts, setCharts] = useState<{ name: string; bg: string; hex: string }[]>([])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
    setRows(PAIRS.map(measure).filter((row): row is Row => row !== null))
    setCharts(
      CHARTS.map((chart) => {
        const bg = readBg(chart.bg)
        return { name: chart.name, bg: chart.bg, hex: bg ? toHex(bg) : "" }
      }),
    )
  }, [mode])

  return (
    <Container size="lg">
      <Stack gap={8} className="py-8">
        <Inline justify="between" align="center">
          <Text as="h1" size="3xl" weight="semibold">
            Token
          </Text>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMode((current) => (current === "light" ? "dark" : "light"))}
          >
            {mode === "light" ? "Tối" : "Sáng"}
          </Button>
        </Inline>

        <Stack gap={4}>
          <Text as="h2" size="2xl" weight="semibold">
            Màu
          </Text>
          <Grid columns={{ base: 1, md: 2 }} gap={4}>
            {rows.map((row) => (
              <ColorRow key={row.name} row={row} />
            ))}
          </Grid>
          <Grid columns={{ base: 1, md: 2 }} gap={4}>
            {charts.map((chart) => (
              <Box key={chart.name} padding={3} tone="card" border radius="md">
                <Inline gap={3} align="center">
                  <Box border radius="md" className={`h-12 w-12 ${chart.bg}`} />
                  <Stack gap={1}>
                    <Text size="sm" weight="medium">
                      {chart.name}
                    </Text>
                    <Text size="xs" tone="muted">
                      {chart.hex}
                    </Text>
                  </Stack>
                </Inline>
              </Box>
            ))}
          </Grid>
        </Stack>

        <Stack gap={4}>
          <Text as="h2" size="2xl" weight="semibold">
            Chữ
          </Text>
          <Stack gap={3}>
            {SIZES.map((size) => (
              <Stack key={size} gap={1}>
                <Text size="xs" tone="muted">
                  {size}
                </Text>
                <Text size={size}>{SAMPLE}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack gap={4}>
          <Text as="h2" size="2xl" weight="semibold">
            Khoảng cách
          </Text>
          <Stack gap={2}>
            {SPACES.map((step) => (
              <Inline key={step} gap={3} align="center">
                <Box className={`h-4 ${SPACE_BAR[step]} bg-primary`} />
                <Text size="sm">{step}</Text>
              </Inline>
            ))}
          </Stack>
        </Stack>

        <Stack gap={4}>
          <Text as="h2" size="2xl" weight="semibold">
            Chiều cao control
          </Text>
          <Stack gap={3}>
            <Inline gap={3} align="center">
              <Box className="h-control-sm w-16 bg-primary" />
              <Text size="sm">control-sm 32px</Text>
            </Inline>
            <Inline gap={3} align="center">
              <Box className="h-control-md w-16 bg-primary" />
              <Text size="sm">control-md 40px</Text>
            </Inline>
            <Inline gap={3} align="center">
              <Box className="h-control-lg w-16 bg-primary" />
              <Text size="sm">control-lg 48px</Text>
            </Inline>
          </Stack>
        </Stack>

        <Stack gap={4}>
          <Text as="h2" size="2xl" weight="semibold">
            Thử độ bền
          </Text>
          <Box padding={4} tone="card" border radius="md" className="w-60 max-w-full">
            <Stack gap={3}>
              <Text weight="semibold">
                Giày Shondo Quỹ Đạo Ấm Áp Bước Chân Vững Vàng Phiên Bản Giới Hạn Mùa Mưa Không Thấm
              </Text>
              <Text size="sm" tone="muted">
                khachhang.sieutap.khongcodaucach@shondo-example.com
              </Text>
              <Text weight="medium">1.250.000.000 ₫</Text>
              <Inline gap={2}>
                <Text size="sm">Nhãn giao hàng hoả tốc nội thành</Text>
                <Text size="sm">Bảo hành keo đế mười hai tháng</Text>
                <Text size="sm">Phiên bản giới hạn mùa mưa</Text>
                <Text size="sm">Không đổi trả sau khi xỏ</Text>
                <Text size="sm">Quà tặng kèm tất cotton dài</Text>
              </Inline>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Container>
  )
}

function ColorRow({ row }: { row: Row }) {
  const pass = row.ratio >= 4.5
  return (
    <Box padding={3} tone="card" border radius="md">
      <Stack gap={2}>
        <Inline gap={3} align="center">
          <Box border radius="md" className={`h-12 w-12 ${row.bg}`} />
          <Box border radius="md" className={`h-12 w-12 ${row.fg}`} />
        </Inline>
        <Text size="sm" weight="medium">
          {row.name}
        </Text>
        <Text size="xs" tone="muted">
          {row.bgHex} / {row.fgHex}
        </Text>
        <Text size="sm" weight="semibold" tone={pass ? "success" : "destructive"}>
          {row.ratio.toFixed(2)}:1 — {pass ? "ĐẠT" : "KHÔNG ĐẠT"}
        </Text>
      </Stack>
    </Box>
  )
}
