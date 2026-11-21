import { Position, type Node, type NodeProps } from "@xyflow/react"
import { ClockIcon, CircleCheckIcon, CircleXIcon, EllipsisIcon, GlobeIcon, SplitIcon, type LucideIcon } from "lucide-react"
import { Inline, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { BaseHandle } from "@/components/flow/base-handle.tsx"
import { BaseNode, BaseNodeHeader } from "@/components/flow/base-node.tsx"
import { NodeStatusIndicator, type NodeStatus } from "@/components/flow/node-status-indicator.tsx"

export type WorkflowIcon = "clock" | "globe" | "split" | "check" | "x"

const ICONS: Record<WorkflowIcon, LucideIcon> = {
  clock: ClockIcon,
  globe: GlobeIcon,
  split: SplitIcon,
  check: CircleCheckIcon,
  x: CircleXIcon,
}

export type WorkflowNodeData = {
  title: string
  icon?: WorkflowIcon
  rows: { label: string; value: string }[]
  status?: NodeStatus
  branch?: boolean
  menuLabel?: string
  items?: { id: string; label: string }[]
}

export type WorkflowNodeType = Node<WorkflowNodeData, "workflow">

const DEFAULT_ITEMS = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete" },
]

export function WorkflowNode({ data }: NodeProps<WorkflowNodeType>) {
  const Icon = data.icon ? ICONS[data.icon] : null
  const items = data.items ?? DEFAULT_ITEMS
  return (
    <NodeStatusIndicator status={data.status} variant="border">
      <BaseNode className="w-56">
        <BaseHandle type="target" position={Position.Left} />
        <BaseNodeHeader>
          <Inline gap={2} align="center" className="min-w-0">
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <Text as="h3" size="sm" weight="semibold" truncate>{data.title}</Text>
          </Inline>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="nodrag nopan" aria-label={data.menuLabel ?? "More actions"}>
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {items.map((item) => <DropdownMenuItem key={item.id}>{item.label}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </BaseNodeHeader>
        <div className="flex flex-col">
          {data.rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2 bg-muted px-3 py-1">
              <Text size="xs" tone="muted">{row.label}</Text>
              <Text size="xs">{row.value}</Text>
            </div>
          ))}
        </div>
        {data.branch ? (
          <>
            <BaseHandle type="source" position={Position.Right} id="true" className={cn("top-1/3")} />
            <BaseHandle type="source" position={Position.Right} id="false" className={cn("top-2/3")} />
          </>
        ) : (
          <BaseHandle type="source" position={Position.Right} />
        )}
      </BaseNode>
    </NodeStatusIndicator>
  )
}
