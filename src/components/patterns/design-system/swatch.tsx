import { useLayoutEffect, useState, type ReactNode } from "react"

function toHex(value: string) {
  const probe = document.createElement("canvas")
  probe.width = 1
  probe.height = 1
  const context = probe.getContext("2d")
  if (!context) return ""
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
  return `#${[red, green, blue].map((part) => part.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

const TOKEN_NAMES = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "muted", "muted-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground",
  "primary", "primary-foreground", "primary-text", "border", "input", "ring",
  "success", "success-foreground", "warning", "warning-foreground", "info", "info-foreground",
  "destructive", "destructive-foreground",
  "badge-neutral", "badge-primary", "badge-success", "badge-warning", "badge-info", "badge-destructive",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  "sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-accent", "sidebar-border", "sidebar-ring",
]

function rgbOf(value: string) {
  const probe = document.createElement("canvas")
  probe.width = 1
  probe.height = 1
  const context = probe.getContext("2d")
  if (!context) return [0, 0, 0]
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const data = context.getImageData(0, 0, 1, 1).data
  return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0]
}

function channel(value: number) {
  const unit = value / 255
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

function ratio(left: number[], right: number[]) {
  const lum = (rgb: number[]) => 0.2126 * channel(rgb[0] ?? 0) + 0.7152 * channel(rgb[1] ?? 0) + 0.0722 * channel(rgb[2] ?? 0)
  const a = lum(left)
  const b = lum(right)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

type Ink = "text-foreground" | "text-background"

function useColorChoice() {
  const [choice, setChoice] = useState<Record<string, { ink: Ink; edge: boolean }>>({})

  useLayoutEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement)
      const page = rgbOf(styles.getPropertyValue("--background"))
      const inkOn = rgbOf(styles.getPropertyValue("--foreground"))
      const next: Record<string, { ink: Ink; edge: boolean }> = {}
      for (const name of TOKEN_NAMES) {
        const fill = rgbOf(styles.getPropertyValue(`--${name}`))
        const onForeground = ratio(fill, inkOn)
        const onBackground = ratio(fill, page)
        next[name] = {
          ink: onForeground >= onBackground ? "text-foreground" : "text-background",
          edge: name === "background" || name === "card" || name === "popover" || ratio(fill, page) < 1.2,
        }
      }
      setChoice(next)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return choice
}

function useTokenHex() {
  const [hex, setHex] = useState<Record<string, string>>({})

  useLayoutEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const name of TOKEN_NAMES) {
        const value = styles.getPropertyValue(`--${name}`).trim()
        if (value) next[name] = toHex(value)
      }
      setHex(next)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return hex
}

function Swatch({
  name,
  bg,
  fg,
  hex,
  bordered = false,
  children,
}: {
  name: string
  bg: string
  fg?: string
  hex: string
  bordered?: boolean
  children?: ReactNode
}) {
  return (
    <div data-swatch={name} data-hex={hex} className={`${bg} ${fg ?? ""} flex h-24 flex-col items-center justify-center rounded-lg px-3 ${bordered ? "border border-border" : ""}`}>
      <span className="text-sm font-medium">{children ?? name}</span>
      <span className="text-xs">{hex || "…"}</span>
    </div>
  )
}

export { Swatch, useColorChoice, useTokenHex }
