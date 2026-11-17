import { Maximize, Minus, Plus } from "lucide-react"
import { Panel, useOptionsStore, useReactFlow, useViewport, type PanelProps } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function ZoomSlider({
  className,
  orientation = "horizontal",
  zoomOutLabel = "Thu nhỏ",
  zoomInLabel = "Phóng to",
  resetLabel = "Đặt 100%",
  fitLabel = "Vừa khung",
  ...props
}: Omit<PanelProps, "children"> & {
  orientation?: "horizontal" | "vertical"
  zoomOutLabel?: string
  zoomInLabel?: string
  resetLabel?: string
  fitLabel?: string
}) {
  const { zoom } = useViewport()
  const { zoomTo, zoomIn, zoomOut, fitView } = useReactFlow()
  const minZoom = useOptionsStore((state) => state.minZoom)
  const maxZoom = useOptionsStore((state) => state.maxZoom)

  return (
    <Panel
      data-flow-zoom="slider"
      className={cn(
        "nodrag nopan flex max-w-full gap-1 rounded-lg border border-border bg-card p-1 text-foreground",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    >
      <div className={cn("flex gap-1", orientation === "horizontal" ? "flex-row" : "flex-col-reverse")}>
        <Button variant="ghost" size="icon" aria-label={zoomOutLabel} onClick={() => void zoomOut({ duration: 300 })}>
          <Minus />
        </Button>
        <Slider
          className={orientation === "horizontal" ? "w-16 min-w-0 flex-1" : "h-16 min-h-0 flex-1"}
          orientation={orientation}
          value={[zoom]}
          min={minZoom}
          max={maxZoom}
          step={0.01}
          onValueChange={(values) => void zoomTo(values[0] ?? zoom)}
        />
        <Button variant="ghost" size="icon" aria-label={zoomInLabel} onClick={() => void zoomIn({ duration: 300 })}>
          <Plus />
        </Button>
      </div>
      <Button variant="ghost" className="w-12 shrink-0 tabular-nums" aria-label={resetLabel} onClick={() => void zoomTo(1, { duration: 300 })}>
        {(100 * zoom).toFixed(0)}%
      </Button>
      <Button variant="ghost" size="icon" aria-label={fitLabel} onClick={() => void fitView({ duration: 300 })}>
        <Maximize />
      </Button>
    </Panel>
  )
}
