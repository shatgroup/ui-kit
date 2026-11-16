import { useLayoutEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

type TruncatedProps = {
  children?: ReactNode
  className?: string
}

export function Truncated({ children, className }: TruncatedProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => {
      const text = (el.textContent ?? "").trim()
      const cut = el.scrollWidth > el.clientWidth + 1
      if (cut && text) el.title = text
      else el.removeAttribute("title")
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  })

  return (
    <span ref={ref} className={cn("block min-w-0 truncate", className)}>
      {children}
    </span>
  )
}
