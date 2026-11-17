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
  children,
}: {
  name: string
  bg: string
  fg?: string
  hex: string
  children?: ReactNode
}) {
  return (
    <div data-swatch={name} data-hex={hex} className={`${bg} ${fg ?? ""} flex h-24 flex-col items-center justify-center rounded-lg px-3`}>
      <span className="text-sm font-medium">{children ?? name}</span>
      <span className="text-xs">{hex || "…"}</span>
    </div>
  )
}

export { Swatch, useTokenHex }
