import { useCallback, useMemo } from "react"
import { Panel, useOptionsStore, useReactFlow, type PanelProps } from "@xyflow/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function ZoomSelect({
  className,
  placeholder = "Thu phóng",
  fitLabel = "Vừa khung",
  ...props
}: Omit<PanelProps, "children"> & { placeholder?: string; fitLabel?: string }) {
  const { zoomTo, fitView } = useReactFlow()
  const minZoom = useOptionsStore((state) => state.minZoom)
  const maxZoom = useOptionsStore((state) => state.maxZoom)
  const zoomLevels = useMemo(() => {
    const levels: string[] = []
    for (let percent = Math.ceil(minZoom * 100); percent <= Math.floor(maxZoom * 100); percent += 50) {
      levels.push((percent / 100).toString())
    }
    return levels
  }, [minZoom, maxZoom])

  const handleZoomChange = useCallback((value: string | null) => {
    if (!value) return
    if (value === "best-fit") void fitView()
    else {
      const zoomValue = Number.parseFloat(value)
      if (!Number.isNaN(zoomValue)) void zoomTo(zoomValue)
    }
  }, [fitView, zoomTo])

  return (
    <Panel data-flow-zoom="select" className={cn("nodrag nopan flex rounded-lg border border-border bg-card", className)} {...props}>
      <Select onValueChange={handleZoomChange}>
        <SelectTrigger className="w-36 bg-card">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="best-fit">{fitLabel}</SelectItem>
          {zoomLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {`${(Number.parseFloat(level) * 100).toFixed(0)}%`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Panel>
  )
}
