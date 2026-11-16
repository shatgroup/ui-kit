import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { PAD } from "./classes.ts"
import type { Space } from "./types.ts"

type Tone = "background" | "card" | "muted"
type Radius = "none" | "sm" | "md" | "lg" | "xl"

const TONE: Record<Tone, string> = {
  background: "bg-background text-foreground",
  card: "bg-card text-card-foreground",
  muted: "bg-muted text-foreground",
}

const RADIUS: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
}

type BoxProps = {
  padding?: Space
  tone?: Tone
  border?: boolean
  radius?: Radius
  className?: string
  slot?: string
  children?: ReactNode
}

export function Box({
  padding,
  tone = "background",
  border = false,
  radius = "none",
  className,
  slot,
  children,
}: BoxProps) {
  return (
    <div
      data-slot={slot}
      className={cn(
        "min-w-0",
        TONE[tone],
        border && "border border-border",
        RADIUS[radius],
        padding !== undefined && PAD[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
