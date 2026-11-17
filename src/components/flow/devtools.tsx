import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import {
  Panel,
  ViewportPortal,
  useNodes,
  useReactFlow,
  useReactFlowStoreApi,
  useViewportStore,
  type NodeChange,
  type OnNodesChange,
  type PanelPosition,
  type XYPosition,
} from "@xyflow/react"
import { Stack } from "@/components/layout/index.ts"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Text } from "@/components/layout/index.ts"

export function ViewportLogger() {
  const viewport = useViewportStore((state) => `x: ${state.transform[0].toFixed(2)}, y: ${state.transform[1].toFixed(2)}, zoom: ${state.transform[2].toFixed(2)}`)
  return <Text size="xs">{viewport}</Text>
}

type ChangeLoggerProps = { limit?: number; emptyLabel?: string }

function ChangeInfo({ change }: { change: NodeChange }) {
  const id = "id" in change ? change.id : "-"
  const { type } = change
  let detail = ""
  if (type === "add") detail = JSON.stringify(change.item)
  if (type === "dimensions") detail = `dimensions: ${change.dimensions?.width} × ${change.dimensions?.height}`
  if (type === "position") detail = `position: ${change.position?.x.toFixed(1)}, ${change.position?.y.toFixed(1)}`
  if (type === "remove") detail = "remove"
  if (type === "select") detail = change.selected ? "select" : "unselect"
  return (
    <Stack gap={1}>
      <Text size="xs">node id: {id}</Text>
      {detail ? <Text size="xs">{detail}</Text> : null}
    </Stack>
  )
}

export function ChangeLogger({ limit = 20, emptyLabel = "Chưa có thay đổi" }: ChangeLoggerProps) {
  const [changes, setChanges] = useState<NodeChange[]>([])
  const store = useReactFlowStoreApi()

  const handleNodeChanges: OnNodesChange = useCallback((next) => {
    setChanges((previous) => [...next, ...previous].slice(0, limit))
  }, [limit])

  useEffect(() => {
    store.optionsStore.setState({ onNodesChange: handleNodeChanges })
    return () => store.optionsStore.setState({ onNodesChange: undefined })
  }, [handleNodeChanges, store])

  if (changes.length === 0) return <Text size="xs">{emptyLabel}</Text>
  return (
    <Stack gap={3}>
      {changes.map((change, index) => <ChangeInfo key={`${change.type}-${index}`} change={change} />)}
    </Stack>
  )
}

export function NodeInspector() {
  const { getInternalNode } = useReactFlow()
  const nodes = useNodes()

  return (
    <ViewportPortal>
      <div className="text-secondary-foreground">
        {nodes.map((node) => {
          const internalNode = getInternalNode(node.id)
          if (!internalNode) return null
          return (
            <NodeInfo
              key={node.id}
              id={node.id}
              selected={!!node.selected}
              type={node.type || "default"}
              position={node.position}
              absPosition={internalNode.internals.positionAbsolute}
              width={node.measured?.width ?? 0}
              height={node.measured?.height ?? 0}
              data={node.data}
            />
          )
        })}
      </div>
    </ViewportPortal>
  )
}

function NodeInfo({
  id,
  type,
  selected,
  position,
  absPosition,
  width,
  height,
  data,
}: {
  id: string
  type: string
  selected: boolean
  position: XYPosition
  absPosition: XYPosition
  width?: number
  height?: number
  data: object
}) {
  if (!width || !height) return null
  return (
    <div
      // check-ui-ignore-next-line: toạ độ inspector là pixel động của từng node, không có class tĩnh
      style={{ position: "absolute", transform: `translate(${absPosition.x}px, ${absPosition.y + height}px)`, width: width * 2 }}
      className="text-xs"
    >
      <Text size="xs">id: {id}</Text>
      <Text size="xs">type: {type}</Text>
      <Text size="xs">selected: {selected ? "Selected" : "Not Selected"}</Text>
      <Text size="xs">position: {position.x.toFixed(1)}, {position.y.toFixed(1)}</Text>
      <Text size="xs">dimensions: {width} × {height}</Text>
      <Text size="xs">data: {JSON.stringify(data)}</Text>
    </div>
  )
}

type Tool = {
  active: boolean
  setActive: Dispatch<SetStateAction<boolean>>
  label: string
  value: string
}

const DEFAULT_LABELS = {
  inspector: "Sơ đồ node",
  changes: "Nhật ký đổi",
  viewport: "Khung nhìn",
}

export function DevTools({
  position,
  labels = DEFAULT_LABELS,
}: {
  position: PanelPosition
  labels?: { inspector?: string; changes?: string; viewport?: string; empty?: string }
}) {
  if (!import.meta.env.DEV) return null
  return <DevToolsPanel position={position} labels={labels} />
}

function DevToolsPanel({
  position,
  labels,
}: {
  position: PanelPosition
  labels: { inspector?: string; changes?: string; viewport?: string; empty?: string }
}) {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false)
  const [changeLoggerActive, setChangeLoggerActive] = useState(false)
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false)
  const tools: Tool[] = [
    { active: nodeInspectorActive, setActive: setNodeInspectorActive, label: labels.inspector ?? DEFAULT_LABELS.inspector, value: "node-inspector" },
    { active: changeLoggerActive, setActive: setChangeLoggerActive, label: labels.changes ?? DEFAULT_LABELS.changes, value: "change-logger" },
    { active: viewportLoggerActive, setActive: setViewportLoggerActive, label: labels.viewport ?? DEFAULT_LABELS.viewport, value: "viewport-logger" },
  ]

  return (
    <>
      <Panel position={position} className="rounded-lg border border-border bg-card p-1" data-flow-devtools="">
        <ToggleGroup type="multiple">
          {tools.map(({ active, setActive, label, value }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              onClick={() => setActive((previous) => !previous)}
              aria-pressed={active}
              className="bg-card text-card-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Panel>
      {changeLoggerActive ? (
        <Panel className="max-h-64 overflow-y-auto rounded-lg border border-border bg-card p-4" position="bottom-right">
          <ChangeLogger emptyLabel={labels.empty} />
        </Panel>
      ) : null}
      {nodeInspectorActive ? <NodeInspector /> : null}
      {viewportLoggerActive ? (
        <Panel position="bottom-left">
          <ViewportLogger />
        </Panel>
      ) : null}
    </>
  )
}
