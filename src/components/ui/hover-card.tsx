import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "@/lib/utils.ts"

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  ...props
}: PreviewCardPrimitive.Popup.Props & Pick<PreviewCardPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} className="isolate z-50">
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn("w-64 rounded-lg bg-popover p-3 text-sm text-popover-foreground shadow-md outline-none", className)}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
