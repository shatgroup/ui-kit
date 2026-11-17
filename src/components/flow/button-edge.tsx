import type { ReactNode } from "react"
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"

export function ButtonEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  children,
}: EdgeProps & { children: ReactNode }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          data-edge-label
          className="flow-edge-label nodrag nopan pointer-events-auto absolute z-10 rounded-full border border-border bg-card p-1"
          // check-ui-ignore-next-line: vị trí nút trên dây là toạ độ động của React Flow, không có class tĩnh
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        >
          {children}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
