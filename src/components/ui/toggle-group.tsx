import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cn } from "@/lib/utils.ts"
import { toggleVariants } from "./toggle.tsx"

function ToggleGroup({ className, children, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn("inline-flex max-w-full flex-wrap items-center gap-1 rounded-md bg-muted p-1", className)}
      {...props}
    >
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
