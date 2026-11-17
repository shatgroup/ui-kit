import { useCallback, type ReactNode } from "react"
import { Panel, Position, addEdge, useEdgesState, useNodesState, type Connection, type Edge, type EdgeProps, type EdgeTypes, type Node, type NodeProps, type NodeTypes } from "@xyflow/react"
import { Stack, Text } from "@/components/layout/index.ts"
import { Grid } from "@/components/layout/grid.tsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  AnimatedSvgEdge,
  BaseNode,
  ButtonEdge,
  ButtonHandle,
  DataEdge,
  DatabaseSchemaNode,
  DatabaseSchemaNodeBody,
  DatabaseSchemaNodeHeader,
  DatabaseSchemaTableCell,
  DatabaseSchemaTableRow,
  FlowCanvas,
  GroupNode,
  LabeledHandle,
  MindMapNode,
  NodeAppendix,
  NodeSearch,
  NodeTooltip,
  NodeTooltipContent,
  NodeTooltipTrigger,
  PlaceholderNode,
  WorkflowNode,
  ZoomSelect,
  ZoomSlider,
  useTreeLayout,
  type MindMapNodeType,
  type WorkflowNodeType,
} from "@/components/flow/index.ts"

const mindTypes = { mind: MindMapNode }
const workflowTypes = { workflow: WorkflowNode }

function mindNode(id: string, label: string, level: MindMapNodeType["data"]["level"], planned = false): MindMapNodeType {
  return {
    id,
    type: "mind",
    position: { x: 0, y: 0 },
    data: { label, level, planned },
    width: Math.max(144, label.length * 8 + 40),
    height: 40,
  }
}

const MIND_NODES: MindMapNodeType[] = [
  mindNode("root", "Investor role", "root"),
  mindNode("loans", "New loans", "branch"),
  mindNode("investments", "My investments", "branch"),
  mindNode("analytics", "Analytics", "branch"),
  mindNode("finances", "Finances", "branch"),
  mindNode("profile", "Profile", "branch"),
  mindNode("primary", "Primary market", "leaf"),
  mindNode("secondary", "Secondary market", "leaf"),
  mindNode("company", "Company card", "leaf"),
  mindNode("deposit", "Deposit balance", "leaf"),
  mindNode("withdraw", "Withdraw funds", "leaf"),
  mindNode("edit", "Edit profile", "leaf"),
  mindNode("alerts", "Market alerts", "leaf", true),
  mindNode("notes", "Notifications", "leaf", true),
]

const MIND_EDGES: Edge[] = [
  ["loans", "investments", "analytics", "finances", "profile"].map((id) => ({
    id: `root-${id}`,
    source: "root",
    target: id,
    className: "flow-edge-primary",
  })),
  ["primary", "secondary"].map((id) => ({ id: `loans-${id}`, source: "loans", target: id })),
  { id: "investments-company", source: "investments", target: "company" },
  { id: "analytics-alerts", source: "analytics", target: "alerts" },
  ["deposit", "withdraw"].map((id) => ({ id: `finances-${id}`, source: "finances", target: id })),
  ["edit", "notes"].map((id) => ({ id: `profile-${id}`, source: "profile", target: id })),
].flat()

function workflowNode(
  id: string,
  data: WorkflowNodeType["data"],
): WorkflowNodeType {
  return {
    id,
    type: "workflow",
    position: { x: 0, y: 0 },
    data: { ...data, menuLabel: "More actions", items: [
      { id: "edit", label: "Edit" },
      { id: "duplicate", label: "Duplicate" },
      { id: "delete", label: "Delete" },
    ] },
    width: 224,
    height: 168,
  }
}

const WORKFLOW_NODES: WorkflowNodeType[] = [
  workflowNode("trigger", {
    title: "Schedule trigger",
    icon: "clock",
    rows: [
      { label: "Cadence", value: "Every 5 min" },
      { label: "Last run", value: "09:00" },
      { label: "Next", value: "09:05" },
    ],
  }),
  workflowNode("http", {
    title: "HTTP API Request",
    icon: "globe",
    status: "success",
    rows: [
      { label: "Request", value: "GET /v1/orders…" },
      { label: "Duration", value: "0.2s" },
    ],
  }),
  workflowNode("check", {
    title: "Conditional",
    icon: "split",
    branch: true,
    rows: [
      { label: "Rule", value: "order_total > 100" },
      { label: "True", value: "23" },
      { label: "False", value: "14" },
      { label: "Duration", value: "0.8s" },
    ],
  }),
  workflowNode("yes", {
    title: "Approve",
    icon: "check",
    status: "loading",
    rows: [{ label: "Result", value: "Queued" }],
  }),
  workflowNode("no", {
    title: "Skip",
    icon: "x",
    rows: [{ label: "Result", value: "Ignored" }],
  }),
]

const WORKFLOW_EDGES: Edge[] = [
  { id: "w1", source: "trigger", target: "http" },
  { id: "w2", source: "http", target: "check" },
  { id: "w3", source: "check", sourceHandle: "true", target: "yes", className: "flow-edge-success" },
  { id: "w4", source: "check", sourceHandle: "false", target: "no", className: "flow-edge-destructive" },
]

function connect(setEdges: ReturnType<typeof useEdgesState>[1]) {
  return (connection: Connection) => setEdges((current) => addEdge(connection, current))
}

function MindMapSample() {
  const laid = useTreeLayout(MIND_NODES, MIND_EDGES, "LR")
  const [nodes, , onNodesChange] = useNodesState(laid)
  const [edges, setEdges, onEdgesChange] = useEdgesState(MIND_EDGES)
  const onConnect = useCallback(connect(setEdges), [setEdges])
  return (
    <div className="h-120 overflow-hidden rounded-lg border border-border">
      <FlowCanvas
        id="mind"
        devtools={false}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={mindTypes}
      />
    </div>
  )
}

function WorkflowSample() {
  const laid = useTreeLayout(WORKFLOW_NODES, WORKFLOW_EDGES, "LR")
  const [nodes, , onNodesChange] = useNodesState(laid)
  const [edges, setEdges, onEdgesChange] = useEdgesState(WORKFLOW_EDGES)
  const onConnect = useCallback(connect(setEdges), [setEdges])
  return (
    <div className="h-120 overflow-hidden rounded-lg border border-border">
      <FlowCanvas
        id="workflow"
        devtools={false}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={workflowTypes}
      />
    </div>
  )
}

function pair(prefix: string, extra?: Partial<Node>): Node[] {
  return [
    {
      id: `${prefix}-a`,
      position: { x: 0, y: 0 },
      data: { label: "Source", amount: "12" },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 96,
      height: 40,
      ...extra,
    },
    {
      id: `${prefix}-b`,
      position: { x: 220, y: 0 },
      data: { label: "Target" },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      width: 96,
      height: 40,
    },
  ]
}

function AppendixNode() {
  return (
    <div className="pt-12">
      <BaseNode className="px-3 py-2">
        <Text size="sm">Topic</Text>
        <NodeAppendix position="top">Note</NodeAppendix>
      </BaseNode>
    </div>
  )
}

function TooltipNode() {
  return (
    <NodeTooltip>
      <NodeTooltipContent>Details</NodeTooltipContent>
      <NodeTooltipTrigger>
        <BaseNode className="px-3 py-2"><Text size="sm">Hover</Text></BaseNode>
      </NodeTooltipTrigger>
    </NodeTooltip>
  )
}

type SchemaColumn = { name: string; type: string; side?: "source" | "target" }

function readColumns(data: Record<string, unknown>): SchemaColumn[] {
  if (!Array.isArray(data.columns)) return []
  return data.columns.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    if (typeof row.name !== "string" || typeof row.type !== "string") return []
    const side = row.side === "source" || row.side === "target" ? row.side : undefined
    return [{ name: row.name, type: row.type, side }]
  })
}

function SchemaNode({ data }: NodeProps) {
  const record = data as Record<string, unknown>
  const title = typeof record.title === "string" ? record.title : ""
  return (
    <DatabaseSchemaNode>
      <DatabaseSchemaNodeHeader>{title}</DatabaseSchemaNodeHeader>
      <DatabaseSchemaNodeBody>
        {readColumns(record).map((column) => (
          <DatabaseSchemaTableRow key={column.name}>
            {column.side === "target" ? <LabeledHandle type="target" position={Position.Left} id={column.name} title="" /> : null}
            <DatabaseSchemaTableCell><Text size="xs">{column.name}</Text></DatabaseSchemaTableCell>
            <DatabaseSchemaTableCell align="end"><Text size="xs" tone="muted">{column.type}</Text></DatabaseSchemaTableCell>
            {column.side === "source" ? <LabeledHandle type="source" position={Position.Right} id={column.name} title="" /> : null}
          </DatabaseSchemaTableRow>
        ))}
      </DatabaseSchemaNodeBody>
    </DatabaseSchemaNode>
  )
}

function GroupDemoNode() {
  return <GroupNode label="Group" position="top-left" />
}

function HandleDemoNode() {
  return (
    <div className="flex items-center">
      <BaseNode className="px-3 py-2">
        <Text size="sm">Step</Text>
        <ButtonHandle type="source" position={Position.Right}>
          <Button size="sm" variant="outline" className="nodrag">Add</Button>
        </ButtonHandle>
      </BaseNode>
      <div className="w-32" />
    </div>
  )
}

function ButtonEdgeDemo(props: EdgeProps) {
  return (
    <ButtonEdge {...props}>
      <Button size="sm" variant="secondary" className="nodrag rounded-full border-0 bg-card">Run</Button>
    </ButtonEdge>
  )
}

function PlaceholderDemo(props: NodeProps) {
  return <PlaceholderNode {...props} label="Add step">Add step</PlaceholderNode>
}

const appendixTypes = { appendix: AppendixNode }
const tooltipTypes = { tooltip: TooltipNode }
const schemaTypes = { schema: SchemaNode }
const placeholderTypes = { placeholder: PlaceholderDemo }
const groupTypes = { labeledGroup: GroupDemoNode }
const handleTypes = { handle: HandleDemoNode }
const buttonEdgeTypes = { button: ButtonEdgeDemo } as EdgeTypes
const dataEdgeTypes = { data: DataEdge } as EdgeTypes
const animatedTypes = { animated: AnimatedSvgEdge } as EdgeTypes

function DemoFrame({
  title,
  id,
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  children,
}: {
  title: string
  id: string
  nodes: Node[]
  edges: Edge[]
  nodeTypes?: NodeTypes
  edgeTypes?: EdgeTypes
  children?: ReactNode
}) {
  const [liveNodes, , onNodesChange] = useNodesState(nodes)
  const [liveEdges, setEdges, onEdgesChange] = useEdgesState(edges)
  const onConnect = useCallback(connect(setEdges), [setEdges])
  return (
    <Grid span="third" className="h-full">
      <Stack gap={2} className="min-w-0">
        <div data-flow-demo={title} className="h-40 overflow-hidden rounded-lg border border-border">
          <FlowCanvas
            id={id}
            devtools={false}
            minimap={false}
            controls={false}
            nodes={liveNodes}
            edges={liveEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            {children}
          </FlowCanvas>
        </div>
        <Text size="xs" tone="muted">{title}</Text>
      </Stack>
    </Grid>
  )
}

function FlowSection() {
  return (
    <Stack gap={4}>
      <Text as="h2" id="flow" size="xl" weight="semibold" className="scroll-mt-nav">Flow</Text>
      <Grid className="kit-grid items-stretch">
        <Grid span="full" className="h-full">
          <Card className="h-full">
            <CardHeader><Text size="sm" tone="muted">Mind map</Text></CardHeader>
            <CardContent><MindMapSample /></CardContent>
          </Card>
        </Grid>
        <Grid span="full" className="h-full">
          <Card className="h-full">
            <CardHeader><Text size="sm" tone="muted">Workflow</Text></CardHeader>
            <CardContent><WorkflowSample /></CardContent>
          </Card>
        </Grid>
        <Grid span="full" className="h-full">
          <Card className="h-full">
            <CardHeader><Text size="sm" tone="muted">Flow components</Text></CardHeader>
            <CardContent>
            <Grid className="kit-grid items-stretch">
              <DemoFrame title="Appendix" id="demo-appendix" nodes={[{ id: "n", type: "appendix", position: { x: 40, y: 48 }, data: {} }]} edges={[]} nodeTypes={appendixTypes} />
              <DemoFrame title="Tooltip" id="demo-tooltip" nodes={[{ id: "n", type: "tooltip", position: { x: 40, y: 40 }, data: {}, width: 120, height: 40 }]} edges={[]} nodeTypes={tooltipTypes} />
              <DemoFrame
                title="Database Schema"
                id="demo-schema"
                nodes={[
                  { id: "orders", type: "schema", position: { x: 0, y: 0 }, width: 210, data: { title: "orders", columns: [{ name: "id", type: "uuid" }, { name: "user_id", type: "uuid", side: "source" }] } },
                  { id: "users", type: "schema", position: { x: 280, y: 0 }, width: 180, data: { title: "users", columns: [{ name: "id", type: "uuid", side: "target" }, { name: "name", type: "text" }] } },
                ]}
                edges={[{ id: "fk", source: "orders", sourceHandle: "user_id", target: "users", targetHandle: "id" }]}
                nodeTypes={schemaTypes}
              />
              <DemoFrame title="Placeholder" id="demo-placeholder" nodes={[{ id: "n", type: "placeholder", position: { x: 40, y: 40 }, data: { label: "Add step" }, width: 144, height: 40 }]} edges={[]} nodeTypes={placeholderTypes} />
              <DemoFrame title="Labeled Group" id="demo-group" nodes={[{ id: "n", type: "labeledGroup", position: { x: 16, y: 8 }, data: {}, width: 180, height: 96 }]} edges={[]} nodeTypes={groupTypes} />
              <DemoFrame title="Button Handle" id="demo-handle" nodes={[{ id: "n", type: "handle", position: { x: 24, y: 40 }, data: {} }]} edges={[]} nodeTypes={handleTypes} />
              <DemoFrame title="Edge with Button" id="demo-button-edge" nodes={pair("button")} edges={[{ id: "e", source: "button-a", target: "button-b", type: "button" }]} edgeTypes={buttonEdgeTypes} />
              <DemoFrame title="Edge with Node Data" id="demo-data-edge" nodes={pair("data")} edges={[{ id: "e", source: "data-a", target: "data-b", type: "data", data: { key: "amount" } }]} edgeTypes={dataEdgeTypes} />
              <DemoFrame title="Animated SVG Edge" id="demo-animated" nodes={pair("move")} edges={[{ id: "e", source: "move-a", target: "move-b", type: "animated", data: { duration: 2, shape: "circle" } }]} edgeTypes={animatedTypes} />
              <DemoFrame title="Node Search" id="demo-search" nodes={[{ id: "n", position: { x: 80, y: 70 }, data: { label: "Orders" }, width: 96, height: 40 }]} edges={[]}>
                <Panel position="top-left" className="w-36">
                  <NodeSearch placeholder="Search nodes" emptyLabel="No results" groupLabel="Nodes" />
                </Panel>
              </DemoFrame>
              <DemoFrame title="Zoom Slider" id="demo-slider" nodes={[{ id: "n", position: { x: 80, y: 48 }, data: { label: "Canvas" }, width: 96, height: 40 }]} edges={[]}>
                <ZoomSlider zoomOutLabel="Zoom out" zoomInLabel="Zoom in" resetLabel="Reset zoom" fitLabel="Fit view" />
              </DemoFrame>
              <DemoFrame title="Zoom Select" id="demo-zoom" nodes={[{ id: "n", position: { x: 80, y: 48 }, data: { label: "Canvas" }, width: 96, height: 40 }]} edges={[]}>
                <ZoomSelect placeholder="Zoom" fitLabel="Best fit" />
              </DemoFrame>
            </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export { FlowSection }
