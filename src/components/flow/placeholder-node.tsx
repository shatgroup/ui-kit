import { useCallback, type ReactNode } from "react"
import { Handle, Position, useNodeId, useReactFlow, type NodeProps } from "@xyflow/react"
import { Text } from "@/components/layout/index.ts"
import { BaseNode } from "@/components/flow/base-node.tsx"

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode
  label?: string
}

export function PlaceholderNode({ children, label = "Thêm bước" }: PlaceholderNodeProps) {
  const id = useNodeId()
  const { setNodes, setEdges } = useReactFlow()

  const handleClick = useCallback(() => {
    if (!id) return
    setEdges((edges) => edges.map((edge) => (edge.target === id ? { ...edge, animated: false } : edge)))
    setNodes((nodes) => nodes.map((node) => (
      node.id === id ? { ...node, data: { ...node.data, label }, type: "default" } : node
    )))
  }, [id, label, setEdges, setNodes])

  return (
    <BaseNode
      className="w-36 border-dashed p-2 text-center text-muted-foreground"
      onClick={handleClick}
    >
      {children ?? <Text size="sm" tone="muted">{label}</Text>}
      <Handle type="target" className="invisible" position={Position.Top} isConnectable={false} />
      <Handle type="source" className="invisible" position={Position.Bottom} isConnectable={false} />
    </BaseNode>
  )
}
