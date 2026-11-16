import { useState, type MouseEvent } from "react"
import { Button } from "@/components/ui/button.tsx"

function isReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.reduceMotion === "true"
}

function useThemeTransition(onChange?: (dark: boolean) => void) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark")
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle("dark", next)
      setDark(next)
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

function ThemeToggle({
  lightLabel = "Sáng",
  darkLabel = "Tối",
  onChange,
}: {
  lightLabel?: string
  darkLabel?: string
  onChange?: (dark: boolean) => void
}) {
  const { dark, toggle } = useThemeTransition(onChange)
  return (
    <Button variant="secondary" onClick={toggle}>
      {dark ? lightLabel : darkLabel}
    </Button>
  )
}

function MotionReduceToggle() {
  const [on, setOn] = useState(() => document.documentElement.dataset.reduceMotion === "true")

  function click() {
    const next = document.documentElement.dataset.reduceMotion !== "true"
    if (next) document.documentElement.dataset.reduceMotion = "true"
    else delete document.documentElement.dataset.reduceMotion
    setOn(next)
  }

  return (
    <Button variant="outline" aria-pressed={on} onClick={click}>
      Giảm chuyển động
    </Button>
  )
}

export { MotionReduceToggle, ThemeToggle, isReduced, useThemeTransition }
