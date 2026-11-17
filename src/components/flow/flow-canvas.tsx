import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useOptionsStore,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react"
import { cn } from "@/lib/utils"
import { DevTools } from "@/components/flow/devtools.tsx"

type FlowCanvasProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  id: string
  nodes: NodeType[]
  edges: EdgeType[]
  onNodesChange?: OnNodesChange<NodeType>
  onEdgesChange?: OnEdgesChange<EdgeType>
  onConnect?: (connection: Connection) => void
  nodeTypes?: NodeTypes
  edgeTypes?: EdgeTypes
  minimap?: boolean
  controls?: boolean
  fitView?: boolean
  devtools?: boolean
  children?: ReactNode
  className?: string
}

function CanvasWheel({ flowId }: { flowId: string }) {
  const { getViewport, zoomTo } = useReactFlow()
  const minZoom = useOptionsStore((state) => state.minZoom)
  const maxZoom = useOptionsStore((state) => state.maxZoom)

  useEffect(() => {
    const node = document.querySelector(`[data-flow="${flowId}"] .react-flow`)
    if (!(node instanceof HTMLElement)) return
    const onWheel = (event: WheelEvent) => {
      if (!event.metaKey || event.ctrlKey) return
      event.preventDefault()
      const next = Math.min(maxZoom, Math.max(minZoom, getViewport().zoom * Math.exp(-event.deltaY * 0.002)))
      void zoomTo(next)
    }
    node.addEventListener("wheel", onWheel, { passive: false })
    return () => node.removeEventListener("wheel", onWheel)
  }, [flowId, getViewport, maxZoom, minZoom, zoomTo])

  return null
}

const MINIMAP_WIDTH = 160
const MINIMAP_HEIGHT = 96
const FRAME_PAD = 24

function useWideScreen() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 48rem)").matches)
  useEffect(() => {
    const query = window.matchMedia("(min-width: 48rem)")
    const update = () => setWide(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return wide
}

type FramePadding = number | { top: number; right: number; bottom: number; left: number }

function FitFrame({ flowId, padding, enabled }: { flowId: string; padding: FramePadding; enabled: boolean }) {
  const { fitBounds, fitView, screenToFlowPosition } = useReactFlow()
  useEffect(() => {
    if (!enabled) return
    const fit = () => {
      const root = document.querySelector(`[data-flow="${flowId}"]`)
      if (!(root instanceof HTMLElement)) {
        void fitView({ padding, duration: 0 })
        return
      }
      let minX = Number.POSITIVE_INFINITY
      let minY = Number.POSITIVE_INFINITY
      let maxX = Number.NEGATIVE_INFINITY
      let maxY = Number.NEGATIVE_INFINITY
      for (const el of root.querySelectorAll(".react-flow__node, .node-appendix, .react-flow__node button, .flow-edge-label")) {
        if (!(el instanceof HTMLElement)) continue
        const rect = el.getBoundingClientRect()
        if (rect.width < 2 || rect.height < 2) continue
        const start = screenToFlowPosition({ x: rect.left, y: rect.top })
        const end = screenToFlowPosition({ x: rect.right, y: rect.bottom })
        minX = Math.min(minX, start.x, end.x)
        minY = Math.min(minY, start.y, end.y)
        maxX = Math.max(maxX, start.x, end.x)
        maxY = Math.max(maxY, start.y, end.y)
      }
      if (!Number.isFinite(minX) || maxX - minX < 1 || maxY - minY < 1) {
        void fitView({ padding, duration: 0 })
        return
      }
      void fitBounds({ x: minX, y: minY, width: maxX - minX, height: maxY - minY }, { padding, duration: 0 })
    }
    const timer = window.setTimeout(() => requestAnimationFrame(fit), 50)
    return () => window.clearTimeout(timer)
  }, [enabled, fitBounds, fitView, flowId, padding, screenToFlowPosition])
  return null
}

export function FlowCanvas<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  id,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  edgeTypes,
  minimap = true,
  controls = true,
  fitView = true,
  devtools = false,
  children,
  className,
}: FlowCanvasProps<NodeType, EdgeType>) {
  const wide = useWideScreen()
  const reserveMinimap = minimap && wide
  const padding = useMemo(
    () => (reserveMinimap ? { top: FRAME_PAD, right: MINIMAP_WIDTH + 32, bottom: MINIMAP_HEIGHT + 32, left: FRAME_PAD } : FRAME_PAD),
    [reserveMinimap],
  )
  return (
    <div data-flow={id} className={cn("relative h-full min-h-0 w-full", className)}>
      <ReactFlow
        id={id}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView}
        fitViewOptions={{ padding, duration: 0 }}
        onInit={(instance) => {
          if (!fitView) return
          void instance.fitView({ padding, duration: 0 })
          requestAnimationFrame(() => { void instance.fitView({ padding, duration: 0 }) })
        }}
        zoomOnScroll={false}
        preventScrolling={false}
        zoomActivationKeyCode={["Meta", "Control"]}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} />
        {controls ? <Controls showInteractive={false} /> : null}
        {minimap ? (
          <MiniMap
            pannable={false}
            zoomable={false}
            // check-ui-ignore-next-line: MiniMap đọc width và height từ style, không có class tĩnh
            style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
          />
        ) : null}
        <FitFrame flowId={id} padding={padding} enabled={fitView} />
        <CanvasWheel flowId={id} />
        {import.meta.env.DEV && devtools ? <DevTools position="top-center" /> : null}
        {children}
      </ReactFlow>
    </div>
  )
}
