import { useLayoutEffect, useRef } from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cn } from "@/lib/utils.ts"
import { toggleVariants } from "./toggle.tsx"

type ToggleCommon = Omit<ToggleGroupPrimitive.Props, "value" | "defaultValue" | "onValueChange"> & {
  variant?: string
}

type ToggleSingle = ToggleCommon & {
  type: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ToggleMany = ToggleCommon & {
  type?: "multiple"
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
}

function ToggleGroup(props: ToggleSingle): ReturnType<typeof ToggleGroupPrimitive>
function ToggleGroup(props: ToggleMany): ReturnType<typeof ToggleGroupPrimitive>
function ToggleGroup({
  className,
  children,
  value,
  defaultValue,
  onValueChange,
  type,
  variant: _variant,
  ...props
}: ToggleSingle | ToggleMany) {
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
      value={typeof value === "string" ? [value] : value}
      defaultValue={typeof defaultValue === "string" ? [defaultValue] : defaultValue}
      onValueChange={(next) => {
        if (type === "single" || typeof value === "string") {
          const picked = next[next.length - 1] ?? (typeof value === "string" ? value : "")
          ;(onValueChange as ((value: string) => void) | undefined)?.(picked)
          return
        }
        ;(onValueChange as ((value: string[]) => void) | undefined)?.([...next])
      }}
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
      className={cn(
        toggleVariants({ size: "sm", variant: "default" }),
        "h-6 shrink-0 px-2 data-pressed:border data-pressed:border-border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
