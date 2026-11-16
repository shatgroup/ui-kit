import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { isValidElement, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

function TooltipProvider({
  delay = 300,
  delayDuration,
  ...props
}: TooltipPrimitive.Provider.Props & { delayDuration?: number }) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delayDuration ?? delay} {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: TooltipPrimitive.Trigger.Props & { asChild?: boolean; children?: ReactNode }) {
  const render = asChild && isValidElement(children) ? children : undefined
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" render={render} {...props}>
      {render ? undefined : children}
    </TooltipPrimitive.Trigger>
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn("max-w-60 rounded-md border border-border bg-foreground px-2 py-1 text-xs text-background", className)}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
