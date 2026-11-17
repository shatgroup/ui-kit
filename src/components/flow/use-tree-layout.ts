import { useMemo } from "react"
import dagre from "@dagrejs/dagre"
import type { Edge, Node } from "@xyflow/react"

export type TreeDirection = "LR" | "TB"

function tokenPx(name: string, fallback: number) {
  if (typeof document === "undefined") return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

export function layoutTree<T extends Node>(nodes: T[], edges: Edge[], direction: TreeDirection = "LR"): T[] {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: direction,
    nodesep: tokenPx("--space-8", 32),
    ranksep: tokenPx("--space-16", 64),
  })
  for (const node of nodes) {
    graph.setNode(node.id, {
      width: node.measured?.width ?? node.width ?? node.initialWidth ?? 160,
      height: node.measured?.height ?? node.height ?? node.initialHeight ?? 40,
    })
  }
  for (const edge of edges) graph.setEdge(edge.source, edge.target)
  dagre.layout(graph)
  return nodes.map((node) => {
    const laid = graph.node(node.id)
    return {
      ...node,
      position: {
        x: laid.x - laid.width / 2,
        y: laid.y - laid.height / 2,
      },
    }
  })
}

export function useTreeLayout<T extends Node>(nodes: T[], edges: Edge[], direction: TreeDirection = "LR") {
  return useMemo(() => layoutTree(nodes, edges, direction), [nodes, edges, direction])
}
