import { isValidElement, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

type Size = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
type Weight = "normal" | "medium" | "semibold" | "bold"
type Tone = "default" | "muted" | "primary" | "destructive" | "success" | "warning" | "info"
type Tag = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label" | "strong"

const SIZE: Record<Size, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
}

const WEIGHT: Record<Weight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

const TONE: Record<Tone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary-text",
  destructive: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
}

const CLAMP = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
} as const

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

type TextProps = {
  as?: Tag
  size?: Size
  weight?: Weight
  tone?: Tone
  truncate?: boolean
  lineClamp?: 1 | 2 | 3
  className?: string
  children?: ReactNode
}

export function Text({
  as = "p",
  size = "base",
  weight = "normal",
  tone = "default",
  truncate = false,
  lineClamp,
  className,
  children,
}: TextProps) {
  const Tag = as
  const content = textOf(children)

  return (
    <Tag
      className={cn(
        "min-w-0 max-w-full text-safe",
        SIZE[size],
        WEIGHT[weight],
        TONE[tone],
        lineClamp ? CLAMP[lineClamp] : truncate && "truncate",
        className,
      )}
      title={truncate ? content : undefined}
    >
      {children}
    </Tag>
  )
}
