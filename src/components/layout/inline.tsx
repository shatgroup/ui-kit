import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { ALIGN, GAP, JUSTIFY } from "./classes.ts"
import type { Align, Justify, Space } from "./types.ts"

type InlineProps = {
  gap?: Space
  align?: Align
  justify?: Justify
  wrap?: boolean
  className?: string
  children?: ReactNode
}

export function Inline({
  gap = 0,
  align = "center",
  justify = "start",
  wrap = true,
  className,
  children,
}: InlineProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 *:min-w-0 *:max-w-full",
        wrap ? "flex-wrap" : "flex-nowrap",
        GAP[gap],
        ALIGN[align],
        JUSTIFY[justify],
        className,
      )}
    >
      {children}
    </div>
  )
}
