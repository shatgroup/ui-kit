import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { ALIGN, GAP } from "./classes.ts"
import type { Align, Space } from "./types.ts"

type StackProps = {
  gap?: Space
  align?: Align
  className?: string
  slot?: string
  children?: ReactNode
}

export function Stack({ gap = 0, align = "stretch", className, slot, children }: StackProps) {
  return (
    <div data-slot={slot} className={cn("flex min-w-0 flex-col", GAP[gap], ALIGN[align], className)}>
      {children}
    </div>
  )
}
