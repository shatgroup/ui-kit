import { useLayoutEffect, useState, type MouseEvent } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"

function isReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduceMotion === "true"
}

function useThemeTransition(onChange?: (dark: boolean) => void) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  useLayoutEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark")
    setDark(next)
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle("dark", next)
      onChange?.(next)
    }
    if (isReduced() || typeof document.startViewTransition !== "function") {
      apply()
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    root.style.setProperty("--theme-x", `${x}px`)
    root.style.setProperty("--theme-y", `${y}px`)
    root.style.setProperty("--theme-r", `${radius}px`)
    document.startViewTransition(apply)
  }

  return { dark, toggle }
}

function ThemeToggle({ onChange }: { onChange?: (dark: boolean) => void }) {
  const { dark, toggle } = useThemeTransition(onChange)
  return (
    <ToggleGroup type="single" variant="outline" size="default" value={dark ? "dark" : "light"} onValueChange={() => undefined} aria-label="Light or dark">
      <ToggleGroupItem value="light" aria-label="Light" onClick={(event) => { if (document.documentElement.classList.contains("dark")) toggle(event) }}>
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark" onClick={(event) => { if (!document.documentElement.classList.contains("dark")) toggle(event) }}>
        <MoonIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export { ThemeToggle, isReduced, useThemeTransition }
