import { Position, type Node, type NodeProps } from "@xyflow/react"
import { Text } from "@/components/layout/index.ts"
import { cn } from "@/lib/utils"
import { BaseHandle } from "@/components/flow/base-handle.tsx"

export type MindLevel = "root" | "branch" | "leaf"

export type MindMapNodeData = {
  label: string
  level: MindLevel
  planned?: boolean
}

export type MindMapNodeType = Node<MindMapNodeData, "mind">

const LOOK: Record<MindLevel, string> = {
  root: "border-transparent bg-primary text-primary-foreground",
  branch: "border-transparent bg-muted text-primary-text",
  leaf: "border-border bg-card text-foreground",
}

export function MindMapNode({ data }: NodeProps<MindMapNodeType>) {
  return (
    <div className={cn(
      "flow-node relative w-max rounded-lg border px-3 py-2 whitespace-nowrap",
      LOOK[data.level],
      data.planned && "border-dashed border-border bg-card text-foreground",
    )}>
      {data.level === "root" ? null : <BaseHandle type="target" position={Position.Left} />}
      <Text
        as="span"
        size="sm"
        weight={data.level === "root" ? "semibold" : "medium"}
        className={data.level === "root" ? "text-primary-foreground" : data.level === "branch" && !data.planned ? "text-primary-text" : undefined}
      >
        {data.label}
      </Text>
      {data.level === "leaf" ? null : <BaseHandle type="source" position={Position.Right} />}
    </div>
  )
}
