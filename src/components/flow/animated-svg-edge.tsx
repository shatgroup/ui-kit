import type { ReactElement } from "react"
import {
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  type Edge,
  type EdgeProps,
  type Position,
} from "@xyflow/react"
import { isReduced } from "@/components/ui/theme-toggle.tsx"

export type AnimatedSvgEdge = Edge<{
  duration: number
  direction?: "forward" | "reverse" | "alternate" | "alternate-reverse"
  path?: "bezier" | "smoothstep" | "step" | "straight"
  repeat?: number | "indefinite"
  shape: keyof typeof shapes
}>

type AnimateMotionProps = {
  dur: string
  keyTimes: string
  keyPoints: string
  repeatCount: number | "indefinite"
  path: string
  calcMode: "linear"
}

type ShapeProps = { animateMotionProps: AnimateMotionProps | null }

const shapes = {
  circle: ({ animateMotionProps }: ShapeProps) => (
    <circle r="5" className="fill-primary">
      {animateMotionProps ? <animateMotion {...animateMotionProps} /> : null}
    </circle>
  ),
  package: ({ animateMotionProps }: ShapeProps) => (
    <g className="fill-muted stroke-foreground" transform="translate(-10,-10)">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
      <path d="m7.5 4.27 9 5.15" />
      {animateMotionProps ? <animateMotion {...animateMotionProps} /> : null}
    </g>
  ),
}

export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = { duration: 2, direction: "forward", path: "bezier", repeat: "indefinite", shape: "circle" },
  ...delegated
}: EdgeProps<AnimatedSvgEdge>) {
  const Shape = shapes[data.shape]
  const [path] = getPath({
    type: data.path ?? "bezier",
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const animateMotionProps = isReduced()
    ? null
    : getAnimateMotionProps({
      duration: data.duration,
      direction: data.direction ?? "forward",
      repeat: data.repeat ?? "indefinite",
      path,
    })

  return (
    <>
      <BaseEdge id={id} path={path} {...delegated} />
      <Shape animateMotionProps={animateMotionProps} />
    </>
  )
}

function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: {
  type: "bezier" | "smoothstep" | "step" | "straight"
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
}) {
  if (type === "straight") return getStraightPath({ sourceX, sourceY, targetX, targetY })
  if (type === "smoothstep" || type === "step") {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: type === "step" ? 0 : undefined,
    })
  }
  return getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
}

function getAnimateMotionProps({
  duration,
  direction,
  repeat,
  path,
}: {
  duration: number
  direction: "forward" | "reverse" | "alternate" | "alternate-reverse"
  repeat: number | "indefinite"
  path: string
}): AnimateMotionProps {
  const base = { path, repeatCount: repeat, calcMode: "linear" as const }
  if (direction === "reverse") return { ...base, dur: `${duration}s`, keyTimes: "0;1", keyPoints: "1;0" }
  if (direction === "alternate") return { ...base, dur: `${duration * 2}s`, keyTimes: "0;0.5;1", keyPoints: "0;1;0" }
  if (direction === "alternate-reverse") return { ...base, dur: `${duration * 2}s`, keyTimes: "0;0.5;1", keyPoints: "1;0;1" }
  return { ...base, dur: `${duration}s`, keyTimes: "0;1", keyPoints: "0;1" }
}

export type AnimatedSvg = ({ animateMotionProps }: ShapeProps) => ReactElement
