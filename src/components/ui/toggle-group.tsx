import { useLayoutEffect, useRef } from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cn } from "@/lib/utils.ts"
import { toggleVariants } from "./toggle.tsx"

function ToggleGroup({ className, children, value, ...props }: ToggleGroupPrimitive.Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const place = () => {
      let item: HTMLElement | null = null
      for (const child of root.querySelectorAll("*")) {
        if (child instanceof HTMLElement && child.dataset.slot === "toggle-group-item" && child.dataset.pressed !== undefined) item = child
      }
      if (!item) return
      const rootBox = root.getBoundingClientRect()
      const itemBox = item.getBoundingClientRect()
      root.style.setProperty("--active-tab-left", `${itemBox.left - rootBox.left}px`)
      root.style.setProperty("--active-tab-top", `${itemBox.top - rootBox.top}px`)
      root.style.setProperty("--active-tab-width", `${itemBox.width}px`)
      root.style.setProperty("--active-tab-height", `${itemBox.height}px`)
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(root)
    return () => observer.disconnect()
  }, [value])

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-slot="toggle-group"
      className={cn("inline-flex max-w-full flex-wrap items-center gap-1 rounded-md bg-muted p-1", className)}
      value={value}
      {...props}
    >
      <span data-slot="toggle-indicator" />
      {children}
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(toggleVariants({ size: "sm", variant: "default" }), "h-6 px-2 shadow-none data-pressed:shadow-sm", className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
