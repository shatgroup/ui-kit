import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/lib/utils.ts"

function Separator({ className, orientation = "horizontal", ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(orientation === "vertical" ? "h-full w-px" : "h-px w-full", "bg-border", className)}
      {...props}
    />
  )
}

export { Separator }
