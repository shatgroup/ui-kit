import type { ComponentProps, ReactNode } from "react"
import { Panel, type NodeProps, type PanelPosition } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { BaseNode } from "@/components/flow/base-node.tsx"

export type GroupNodeLabelProps = ComponentProps<"div">

export function GroupNodeLabel({ children, className, ...props }: GroupNodeLabelProps) {
  return (
    <div className="h-full w-full" {...props}>
      <div className={cn("w-fit bg-secondary p-2 text-xs text-secondary-foreground", className)}>
        {children}
      </div>
    </div>
  )
}

export type GroupNodeProps = Partial<NodeProps> & {
  label?: ReactNode
  position?: PanelPosition
}

function labelClass(position?: PanelPosition) {
  switch (position) {
    case "top-center":
      return "rounded-b-sm"
    case "top-right":
      return "rounded-bl-sm"
    case "bottom-left":
      return "rounded-tr-sm"
    case "bottom-right":
      return "rounded-tl-sm"
    case "bottom-center":
      return "rounded-t-sm"
    default:
      return "rounded-br-sm"
  }
}

export function GroupNode({ label, position, ...props }: GroupNodeProps) {
  return (
    <BaseNode className="h-full overflow-hidden rounded-lg bg-muted" {...props}>
      <Panel className="p-0" position={position}>
        {label ? <GroupNodeLabel className={labelClass(position)}>{label}</GroupNodeLabel> : null}
      </Panel>
    </BaseNode>
  )
}
