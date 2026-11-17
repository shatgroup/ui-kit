import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
  useNodesStore,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react"

export type DataEdge<T extends Node = Node> = Edge<{
  key?: keyof T["data"]
  path?: "bezier" | "smoothstep" | "step" | "straight"
}>

export function DataEdge({
  data = { path: "bezier" },
  id,
  markerEnd,
  source,
  sourcePosition,
  sourceX,
  sourceY,
  style,
  targetPosition,
  targetX,
  targetY,
}: EdgeProps<DataEdge>) {
  const label = useNodesStore((state) => {
    if (!data.key) return ""
    const nodeData = state.nodeLookup.get(source)?.data
    if (!nodeData) return ""
    const value = nodeData[data.key]
    if (typeof value === "string" || typeof value === "number") return String(value)
    if (value && typeof value === "object") return JSON.stringify(value)
    return ""
  })
  const [edgePath, labelX, labelY] = getPath({
    type: data.path ?? "bezier",
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const transform = `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {data.key ? (
        <EdgeLabelRenderer>
          <div
            className="absolute rounded-lg border border-border bg-card px-1 text-card-foreground"
            // check-ui-ignore-next-line: vị trí nhãn dây là toạ độ động của React Flow, không có class tĩnh
            style={{ transform }}
          >
            <pre className="text-xs">{label}</pre>
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}

function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: {
  type: "bezier" | "smoothstep" | "step" | "straight"
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
}) {
  if (type === "straight") return getStraightPath({ sourceX, sourceY, targetX, targetY })
  if (type === "smoothstep" || type === "step") {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: type === "step" ? 0 : undefined,
    })
  }
  return getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
}
