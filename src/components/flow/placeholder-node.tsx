"use client";

import { useCallback, type ReactNode } from "react";
import {
  useReactFlow,
  useNodeId,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/flow/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  label?: string;
};

export function PlaceholderNode({
  children,
  label = "Nút",
}: PlaceholderNodeProps) {
  const id = useNodeId();
  const { setNodes, setEdges } = useReactFlow();

  const handleClick = useCallback(() => {
    if (!id) return;

    setEdges((edges) =>
      edges.map((edge) =>
        edge.target === id ? { ...edge, animated: false } : edge,
      ),
    );

    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          // Customize this function to update the node's data as needed.
          // For example, you can change the label or other properties of the node.
          return {
            ...node,
            data: { ...node.data, label },
            type: "default",
          };
        }
        return node;
      });
      return updatedNodes;
    });
  }, [id, label, setEdges, setNodes]);

  return (
    <BaseNode
      className="bg-card w-[150px] border-dashed border-muted-foreground p-2 text-center text-muted-foreground shadow-none"
      onClick={handleClick}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
