"use client";

import {
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  useNodes,
  Panel,
  useViewportStore,
  useReactFlowStoreApi,
  ViewportPortal,
  useReactFlow,
  PanelPosition,
  type OnNodesChange,
  type NodeChange,
  type XYPosition,
} from "@xyflow/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const ViewportLogger = () => {
  const viewport = useViewportStore(
    (s) =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(2)}, zoom: ${s.transform[2].toFixed(2)}`,
  );

  return <div>{viewport}</div>;
};

type ChangeLoggerProps = {
  color?: string;
  limit?: number;
  emptyLabel?: string;
};

type ChangeInfoProps = {
  change: NodeChange;
};

const ChangeInfo = ({ change }: ChangeInfoProps) => {
  const id = "id" in change ? change.id : "-";
  const { type } = change;

  return (
    <div className="mb-3">
      <div>node id: {id}</div>
      <div>
        {type === "add" ? JSON.stringify(change.item, null, 2) : null}
        {type === "dimensions"
          ? `dimensions: ${change.dimensions?.width} × ${change.dimensions?.height}`
          : null}
        {type === "position"
          ? `position: ${change.position?.x.toFixed(1)}, ${change.position?.y.toFixed(1)}`
          : null}
        {type === "remove" ? "remove" : null}
        {type === "select" ? (change.selected ? "select" : "unselect") : null}
      </div>
    </div>
  );
};

function NoChanges({ label = "No changes yet" }: { label?: string }) {
  return <div>{label}</div>;
}

export const ChangeLogger = ({
  limit = 20,
  emptyLabel,
}: ChangeLoggerProps) => {
  const [changes, setChanges] = useState<NodeChange[]>([]);
  const store = useReactFlowStoreApi();

  // Memoize the callback for handling node changes
  const handleNodeChanges: OnNodesChange = useCallback(
    (newChanges) => {
      setChanges((prevChanges) =>
        [...newChanges, ...prevChanges].slice(0, limit),
      );
    },
    [limit],
  );

  useEffect(() => {
    store.optionsStore.setState({ onNodesChange: handleNodeChanges });

    return () => store.optionsStore.setState({ onNodesChange: undefined });
  }, [handleNodeChanges, store]);

  return (
    <>
      {changes.length === 0 ? (
        <NoChanges label={emptyLabel} />
      ) : (
        changes.map((change, index) => (
          <ChangeInfo key={index} change={change} />
        ))
      )}
    </>
  );
};

export const NodeInspector = ({
  selectedLabel,
  idleLabel,
}: {
  selectedLabel?: string;
  idleLabel?: string;
}) => {
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();

  return (
    <ViewportPortal>
      <div className="text-secondary-foreground">
        {nodes.map((node) => {
          const internalNode = getInternalNode(node.id);
          if (!internalNode) {
            return null;
          }

          const absPosition = internalNode?.internals.positionAbsolute;

          return (
            <NodeInfo
              key={node.id}
              id={node.id}
              selected={!!node.selected}
              type={node.type || "default"}
              position={node.position}
              absPosition={absPosition}
              width={node.measured?.width ?? 0}
              height={node.measured?.height ?? 0}
              data={node.data}
              selectedLabel={selectedLabel}
              idleLabel={idleLabel}
            />
          );
        })}
      </div>
    </ViewportPortal>
  );
};

type NodeInfoProps = {
  id: string;
  type: string;
  selected: boolean;
  position: XYPosition;
  absPosition: XYPosition;
  width?: number;
  height?: number;
  data: object;
  selectedLabel?: string;
  idleLabel?: string;
};

const NodeInfo = ({
  id,
  type,
  selected,
  position,
  absPosition,
  width,
  height,
  data,
  selectedLabel = "Selected",
  idleLabel = "None selected",
}: NodeInfoProps) => {
  if (!width || !height) return null;

  const absoluteTransform = `translate(${absPosition.x}px, ${absPosition.y + height}px)`;
  const formattedPosition = `${position.x.toFixed(1)}, ${position.y.toFixed(1)}`;
  const formattedDimensions = `${width} × ${height}`;
  const selectionStatus = selected ? selectedLabel : idleLabel;

  return (
    <div
      style={{
        position: "absolute",
        transform: absoluteTransform,
        width: width * 2,
      }}
      className="text-xs"
    >
      <div>id: {id}</div>
      <div>type: {type}</div>
      <div>selected: {selectionStatus}</div>
      <div>position: {formattedPosition}</div>
      <div>dimensions: {formattedDimensions}</div>
      <div>data: {JSON.stringify(data, null, 2)}</div>
    </div>
  );
};

type Tool = {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  label: string;
  value: string;
};

type DevToolsToggleProps = {
  tools: Tool[];
  position: PanelPosition;
};

const DevToolsToggle = ({ tools, position }: DevToolsToggleProps) => {
  return (
    <Panel position={position} className="bg-card rounded border p-1">
      <ToggleGroup type="multiple">
        {tools.map(({ active, setActive, label, value }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            onClick={() => setActive((prev) => !prev)}
            aria-pressed={active}
            className="bg-card text-card-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Panel>
  );
};

type DevToolsProps = {
  position: PanelPosition;
  labels?: {
    inspector?: string;
    changes?: string;
    viewport?: string;
    selected?: string;
    idle?: string;
    empty?: string;
  };
};

export const DevTools = ({ position, labels }: DevToolsProps) => {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false);
  const [changeLoggerActive, setChangeLoggerActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false);

  const tools = [
    {
      active: nodeInspectorActive,
      setActive: setNodeInspectorActive,
      label: labels?.inspector ?? "Inspect node",
      value: "node-inspector",
    },
    {
      active: changeLoggerActive,
      setActive: setChangeLoggerActive,
      label: labels?.changes ?? "Change log",
      value: "change-logger",
    },
    {
      active: viewportLoggerActive,
      setActive: setViewportLoggerActive,
      label: labels?.viewport ?? "Viewport log",
      value: "viewport-logger",
    },
  ];

  return (
    <>
      <DevToolsToggle tools={tools} position={position} />

      {changeLoggerActive && (
        <Panel
          className="mt-20 max-h-[50%] overflow-y-auto rounded bg-card p-5 text-xs"
          position="bottom-right"
        >
          <ChangeLogger emptyLabel={labels?.empty} />
        </Panel>
      )}

      {nodeInspectorActive && (
        <NodeInspector
          selectedLabel={labels?.selected}
          idleLabel={labels?.idle}
        />
      )}

      {viewportLoggerActive && (
        <Panel position="bottom-left" className="text-secondary-foreground">
          <ViewportLogger />
        </Panel>
      )}
    </>
  );
};
DevTools.displayName = "DevTools";
