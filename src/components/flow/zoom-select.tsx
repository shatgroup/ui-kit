"use client";

import { useCallback, useMemo } from "react";
import {
  Panel,
  useReactFlow,
  useOptionsStore,
  type PanelProps,
} from "@xyflow/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function ZoomSelect({
  className,
  placeholder = "Zoom",
  fitLabel = "Fit view",
  ...props
}: Omit<PanelProps, "children"> & {
  placeholder?: string;
  fitLabel?: string;
}) {
  const { zoomTo, fitView } = useReactFlow();

  const handleZoomChange = useCallback(
    (value: string) => {
      if (value === "best-fit") {
        fitView();
      } else {
        const zoomValue = parseFloat(value);
        if (!isNaN(zoomValue)) {
          zoomTo(zoomValue);
        }
      }
    },
    [fitView, zoomTo],
  );

  const minZoom = useOptionsStore((state) => state.minZoom);
  const maxZoom = useOptionsStore((state) => state.maxZoom);
  const zoomLevels = useMemo(() => {
    const levels = [];
    const zoomIncrement = 50;

    for (
      let i = Math.ceil(minZoom * 100);
      i <= Math.floor(maxZoom * 100);
      i += zoomIncrement
    ) {
      levels.push((i / 100).toString());
    }

    return levels;
  }, [minZoom, maxZoom]);

  return (
    <Panel
      className={cn("bg-primary-foreground text-foreground flex", className)}
      {...props}
    >
      <Select onValueChange={handleZoomChange}>
        <SelectTrigger className="bg-primary-foreground w-[140px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="best-fit">{fitLabel}</SelectItem>
          <div className="mx-2 my-1 border-t" />
          {zoomLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {`${(parseFloat(level) * 100).toFixed(0)}%`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Panel>
  );
}
