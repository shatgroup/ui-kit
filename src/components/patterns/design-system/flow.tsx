import { memo, useCallback, useState, type ReactNode } from "react"
import { Background, Handle, Panel, Position, ReactFlow, addEdge, useConnection, useEdgesState, useNodesState, useReactFlow, type Connection, type ConnectionState, type Edge, type EdgeProps, type FitViewOptions, type Node, type NodeProps } from "@xyflow/react"
import { MousePointerClick, Plus, Rocket } from "lucide-react"
import { Stack, Text } from "@/components/layout/index.ts"
import { Grid } from "@/components/layout/grid.tsx"
import type { GridSpan } from "@/components/layout/types.ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  AnimatedSvgEdge,
  BaseHandle,
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  ButtonEdge,
  ButtonHandle,
  DataEdge,
  DatabaseSchemaNode,
  DatabaseSchemaNodeBody,
  DatabaseSchemaNodeHeader,
  DatabaseSchemaTableCell,
  DatabaseSchemaTableRow,
  DevTools,
  FlowCanvas,
  GroupNode,
  LabeledHandle,
  MindMapNode,
  NodeAppendix,
  NodeSearch,
  NodeStatusIndicator,
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

function OfficialDemo({
  title,
  span = "third",
  height = "h-96",
  children,
}: {
  title: string
  span?: GridSpan
  height?: "h-96" | "h-120"
  children: ReactNode
}) {
  return (
    <Grid span={span} className="h-full">
      <Stack gap={2} className="min-w-0">
        <div data-flow-demo={title} className={`${height} overflow-hidden rounded-lg border border-border`}>
          {children}
        </div>
        <Text size="xs" tone="muted">{title}</Text>
      </Stack>
    </Grid>
  )
}

const baseNodeFitView: FitViewOptions = { padding: "100px" }
const tightFit: FitViewOptions = { padding: 0.3 }

const BaseNodeFullDemo = memo(() => {
  return (
    <BaseNode className="w-96">
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>Header</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <h3 className="text-lg font-bold">Content</h3>
        <p className="text-xs">
          This is a full-featured node with a header, content, and footer. You
          can customize it as needed.
        </p>
      </BaseNodeContent>
      <BaseNodeFooter>
        <h4 className="text-md self-start font-bold">Footer</h4>
        <Button variant="outline" className="nodrag w-full">
          Action 1
        </Button>
      </BaseNodeFooter>
    </BaseNode>
  )
})

const LoadingNode = () => {
  return (
    <NodeStatusIndicator status="loading" variant="border">
      <BaseNode>
        <BaseNodeContent>This node is loading...</BaseNodeContent>
      </BaseNode>
    </NodeStatusIndicator>
  )
}

const NodeAppendixDemo = () => {
  return (
    <BaseNode>
      <NodeAppendix position="bottom" className="p-2">
        Add custom content to the node appendix.
      </NodeAppendix>
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>Custom Node</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p>Node Content goes here.</p>
      </BaseNodeContent>
    </BaseNode>
  )
}

const NodeTooltipDemo = memo(() => {
  return (
    <NodeTooltip>
      <NodeTooltipContent position={Position.Top} className="text-center">
        You can display any content here, like text, images, or even components.{" "}
        <br />
        The tooltip will appear when you hover over the trigger.
      </NodeTooltipContent>
      <BaseNode className="w-64 text-center">
        <BaseNodeContent className="flex flex-col items-center">
          <NodeTooltipTrigger className="rounded border border-border p-2 text-lg font-bold">
            Hover me! ⭐️
          </NodeTooltipTrigger>
          <span>
            You can add more content that does not trigger the tooltip.
          </span>
        </BaseNodeContent>
      </BaseNode>
    </NodeTooltip>
  )
})

type DatabaseSchemaNodeData = {
  data: {
    label: string
    schema: { title: string; type: string }[]
  }
}

const DatabaseSchemaDemo = memo(({ data }: DatabaseSchemaNodeData) => {
  return (
    <DatabaseSchemaNode className="p-0">
      <DatabaseSchemaNodeHeader>{data.label}</DatabaseSchemaNodeHeader>
      <DatabaseSchemaNodeBody>
        {data.schema.map((entry) => (
          <DatabaseSchemaTableRow key={entry.title}>
            <DatabaseSchemaTableCell className="pl-0 pr-6 font-light">
              <LabeledHandle
                id={entry.title}
                title={entry.title}
                type="target"
                position={Position.Left}
              />
            </DatabaseSchemaTableCell>
            <DatabaseSchemaTableCell className="pr-0 font-thin">
              <LabeledHandle
                id={entry.title}
                title={entry.type}
                type="source"
                position={Position.Right}
                className="p-0"
                handleClassName="p-0"
                labelClassName="p-0 w-full pr-3 text-right"
              />
            </DatabaseSchemaTableCell>
          </DatabaseSchemaTableRow>
        ))}
      </DatabaseSchemaNodeBody>
    </DatabaseSchemaNode>
  )
})

const schemaNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Products",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "warehouse_id", type: "uuid" },
        { title: "supplier_id", type: "uuid" },
        { title: "price", type: "money" },
        { title: "quantity", type: "int4" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 350, y: -100 },
    type: "databaseSchema",
    data: {
      label: "Warehouses",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "address", type: "varchar" },
        { title: "capacity", type: "int4" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 350, y: 200 },
    type: "databaseSchema",
    data: {
      label: "Suppliers",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "country", type: "varchar" },
      ],
    },
  },
]

const schemaEdges: Edge[] = [
  {
    id: "products-warehouses",
    source: "1",
    target: "2",
    sourceHandle: "warehouse_id",
    targetHandle: "id",
  },
  {
    id: "products-suppliers",
    source: "1",
    target: "3",
    sourceHandle: "supplier_id",
    targetHandle: "id",
  },
]

const PlaceholderNodeDemo = memo(() => {
  return (
    <PlaceholderNode label="Node">
      <div>+</div>
    </PlaceholderNode>
  )
})

const LabeledGroupNodeDemo = memo(() => <GroupNode label="Label" />)

const BaseHandleDemo = memo(() => {
  return (
    <BaseNode>
      <BaseNodeContent>
        <BaseHandle id="target-1" type="target" position={Position.Left} />
        <div>A node with two handles</div>
        <BaseHandle id="source-1" type="source" position={Position.Right} />
      </BaseNodeContent>
    </BaseNode>
  )
})

const LabeledHandleDemo = memo(() => {
  return (
    <BaseNode className="flex px-0 py-5">
      <LabeledHandle id="target-1" title="Some Input" type="target" position={Position.Left} />
      <LabeledHandle id="source-1" title="Some Output" type="source" position={Position.Right} />
    </BaseNode>
  )
})

const buttonHandleClick = () => {
  window.alert("Handle button has been clicked!")
}

const buttonHandleSelector = (connection: ConnectionState) => {
  return connection.inProgress
}

const ButtonHandleDemo = () => {
  const connectionInProgress = useConnection(buttonHandleSelector)
  return (
    <BaseNode>
      <BaseNodeContent>
        Node with a handle button
        <ButtonHandle type="target" position={Position.Bottom} showButton={!connectionInProgress}>
          <Button onClick={buttonHandleClick} size="sm" variant="secondary" className="rounded-full">
            <Plus size={10} />
          </Button>
        </ButtonHandle>
      </BaseNodeContent>
    </BaseNode>
  )
}

const ButtonEdgeDemo = memo((props: EdgeProps) => {
  const onEdgeClick = () => {
    window.alert("Edge has been clicked!")
  }
  return (
    <ButtonEdge {...props}>
      <Button onClick={onEdgeClick} size="icon" variant="secondary">
        <MousePointerClick size={16} />
      </Button>
    </ButtonEdge>
  )
})

type CounterNodeType = Node<{ value: number }>

const CounterNode = memo(({ id, data }: NodeProps<CounterNodeType>) => {
  const { updateNodeData } = useReactFlow()
  return (
    <BaseNode>
      <BaseNodeContent className="p-5">
        <Slider
          value={[data.value]}
          min={0}
          max={100}
          step={1}
          className="nopan nodrag w-24"
          onValueChange={([value]) => {
            updateNodeData(id, (node) => ({
              ...node.data,
              value,
            }))
          }}
        />
        <Handle type="source" position={Position.Bottom} />
      </BaseNodeContent>
    </BaseNode>
  )
})

const searchNodes: Node<{ label: string }>[] = Array.from({ length: 20 }, (_, index) => {
  const cols = Math.ceil(Math.sqrt(20))
  const col = index % cols
  const row = Math.floor(index / cols)
  return {
    id: `node-${index}`,
    data: { label: `Node ${index}` },
    position: { x: 100 + col * 200, y: 100 + row * 200 },
  }
})

const baseNodeTypes = { baseNodeFull: BaseNodeFullDemo }
const statusNodeTypes = { loadingNode: LoadingNode }
const appendixNodeTypes = { appendixNode: NodeAppendixDemo }
const tooltipNodeTypes = { nodeTooltip: NodeTooltipDemo }
const schemaNodeTypes = { databaseSchema: DatabaseSchemaDemo }
const placeholderNodeTypes = { placeholderNode: PlaceholderNodeDemo }
const groupNodeTypes = { labeledGroupNode: LabeledGroupNodeDemo }
const baseHandleNodeTypes = { baseHandle: BaseHandleDemo }
const labeledHandleNodeTypes = { labeledHandle: LabeledHandleDemo }
const buttonHandleNodeTypes = { sourceHandleDemo: ButtonHandleDemo }
const buttonEdgeTypes = { buttonedge: ButtonEdgeDemo }
const dataEdgeNodeTypes = { counterNode: CounterNode }
const dataEdgeTypes = { dataEdge: DataEdge }
const animatedEdgeTypes = { animatedSvgEdge: AnimatedSvgEdge }

function ZoomSliderDemo() {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal")
  return (
    <div className="h-full w-full">
      <ReactFlow id="demo-zoom-slider" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: { label: "Node" } }]} fitView>
        <Background />
        <ZoomSlider position="top-left" orientation={orientation} />
        <Panel position="bottom-right">
          <Button
            onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
          >
            Toggle orientation
          </Button>
        </Panel>
      </ReactFlow>
    </div>
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
                <OfficialDemo title="Base Node" span="half">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-base-node" defaultNodes={[{ id: "2", position: { x: 200, y: 200 }, data: {}, type: "baseNodeFull" }]} nodeTypes={baseNodeTypes} fitView fitViewOptions={baseNodeFitView}>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Node Status">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-status" defaultNodes={[{ id: "1", position: { x: 120, y: 160 }, type: "loadingNode", data: {} }]} nodeTypes={statusNodeTypes} fitView>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Node Appendix" span="half" height="h-120">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-appendix" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: {}, type: "appendixNode" }]} nodeTypes={appendixNodeTypes} minZoom={0.2} maxZoom={1} fitView fitViewOptions={tightFit}>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Node Tooltip" span="half">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-tooltip" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: {}, type: "nodeTooltip" }]} nodeTypes={tooltipNodeTypes} fitView>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Database Schema" span="full" height="h-120">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-schema" defaultNodes={schemaNodes} defaultEdges={schemaEdges} nodeTypes={schemaNodeTypes} fitView>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Placeholder" span="half">
                  <div className="h-full w-full">
                    <ReactFlow
                      id="demo-placeholder"
                      defaultNodes={[
                        { id: "1", data: { label: "Original Node" }, position: { x: 0, y: 0 }, type: "default" },
                        { id: "2", data: {}, position: { x: 0, y: 150 }, type: "placeholderNode" },
                      ]}
                      defaultEdges={[{ id: "1=>2", source: "1", target: "2", type: "default", animated: true }]}
                      nodeTypes={placeholderNodeTypes}
                      fitView
                    >
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Labeled Group" span="half">
                  <div className="h-full w-full">
                    <ReactFlow
                      id="demo-group"
                      defaultNodes={[
                        { id: "1", position: { x: 200, y: 200 }, data: { label: "Group Node" }, width: 380, height: 200, type: "labeledGroupNode" },
                        { id: "2", position: { x: 50, y: 100 }, data: { label: "Node" }, type: "default", parentId: "1", extent: "parent" },
                        { id: "3", position: { x: 200, y: 50 }, data: { label: "Node" }, type: "default", parentId: "1", extent: "parent" },
                      ]}
                      nodeTypes={groupNodeTypes}
                      fitView
                    >
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Base Handle">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-base-handle" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: {}, type: "baseHandle" }]} nodeTypes={baseHandleNodeTypes} minZoom={0.2} maxZoom={1} fitView fitViewOptions={tightFit}>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Labeled Handle">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-labeled-handle" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: {}, type: "labeledHandle" }]} nodeTypes={labeledHandleNodeTypes} minZoom={0.2} maxZoom={1} fitView fitViewOptions={tightFit}>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Button Handle" span="half" height="h-120">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-button-handle" defaultNodes={[{ id: "1", position: { x: 0, y: 0 }, data: { label: "Node" }, type: "sourceHandleDemo" }]} nodeTypes={buttonHandleNodeTypes} minZoom={0.2} maxZoom={1} fitView fitViewOptions={tightFit}>
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Button Edge" span="half">
                  <div className="h-full w-full">
                    <ReactFlow
                      id="demo-button-edge"
                      defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: { label: "Node" } }, { id: "2", position: { x: 500, y: 500 }, data: { label: "Node" } }]}
                      defaultEdges={[{ id: "e1-2", source: "1", target: "2", type: "buttonedge" }]}
                      edgeTypes={buttonEdgeTypes}
                      fitView
                    >
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Data Edge" span="half">
                  <div className="h-full w-full">
                    <ReactFlow
                      id="demo-data-edge"
                      defaultNodes={[
                        { id: "1", position: { x: 100, y: 100 }, type: "counterNode", data: { value: 10 } },
                        { id: "2", position: { x: 300, y: 300 }, data: { label: "Output" } },
                      ]}
                      nodeTypes={dataEdgeNodeTypes}
                      defaultEdges={[{ id: "1->2", source: "1", target: "2", type: "dataEdge", data: { key: "value" } } satisfies DataEdge<CounterNodeType>]}
                      edgeTypes={dataEdgeTypes}
                      fitView
                    >
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Animated SVG Edge" span="half">
                  <div className="h-full w-full">
                    <ReactFlow
                      id="demo-animated"
                      defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: { label: "A" } }, { id: "2", position: { x: 400, y: 400 }, data: { label: "B" } }]}
                      defaultEdges={[{
                        id: "1->2",
                        source: "1",
                        target: "2",
                        type: "animatedSvgEdge",
                        data: { duration: 2, shape: "package", path: "smoothstep" },
                      } satisfies AnimatedSvgEdge]}
                      edgeTypes={animatedEdgeTypes}
                      fitView
                    >
                      <Background />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Node Search" span="full" height="h-120">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-search" defaultNodes={searchNodes} defaultEdges={[]} minZoom={0.05} fitView fitViewOptions={{ padding: 0.2 }}>
                      <Background />
                      <Panel className="bg-primary-foreground text-foreground flex gap-1 rounded-md p-1" position="top-left">
                        <NodeSearch placeholder="Search nodes..." emptyLabel="No results found." groupLabel="Nodes" />
                      </Panel>
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="Zoom Slider" span="half">
                  <ZoomSliderDemo />
                </OfficialDemo>
                <OfficialDemo title="Zoom Select">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-zoom-select" defaultNodes={[{ id: "1", position: { x: 200, y: 200 }, data: { label: "Node" } }]} fitView>
                      <Background />
                      <ZoomSelect position="top-left" placeholder="Zoom" fitLabel="Best Fit" />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
                <OfficialDemo title="DevTools" span="half">
                  <div className="h-full w-full">
                    <ReactFlow id="demo-devtools" defaultNodes={[{ id: "1a", type: "input", data: { label: "Node 1" }, position: { x: 250, y: 5 } }]} fitView>
                      <Background />
                      <DevTools
                        position="top-left"
                        labels={{
                          inspector: "Node Inspector",
                          changes: "Change Logger",
                          viewport: "Viewport Logger",
                          selected: "Selected",
                          idle: "Not Selected",
                          empty: "No Changes Triggered",
                        }}
                      />
                    </ReactFlow>
                  </div>
                </OfficialDemo>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export { FlowSection }
