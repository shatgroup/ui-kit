import { useEffect, type ReactNode } from "react"
import { Inline, Text } from "@/components/layout/index.ts"
import { ThemeToggle } from "@/components/ui/theme-toggle.tsx"

function currentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/"
}

function SiteBar({ search }: { search?: ReactNode }) {
  const path = currentPath()
  const design = path === "/design-system" || path === "/" || path === "/tokens" || path === "/kit"
  const components = path === "/components" || path.startsWith("/components/")
  const showcase = path === "/showcase" || path === "/preview" || path === "/preview-motion"

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select"))) return
      const key = event.key.toLowerCase()
      if (key === "d") window.location.assign("/design-system")
      if (key === "s" && !showcase) window.location.assign("/showcase")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showcase])

  return (
    <header className="flex h-full min-h-0 items-center gap-4 overflow-hidden border-b border-border bg-background px-4">
      <Inline gap={4} align="center" wrap={false} className="min-w-0 flex-1">
        <Text size="sm" weight="semibold">UI Kit</Text>
        <a href="/design-system" className={design ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>
          Design System
        </a>
        <a href="/components" className={components ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>
          Components
        </a>
        <a href="/showcase" className={showcase ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>
          Showcase
        </a>
      </Inline>
      {search}
      <div className="flex flex-1 justify-end">
        <ThemeToggle />
      </div>
    </header>
  )
}

export { SiteBar }
