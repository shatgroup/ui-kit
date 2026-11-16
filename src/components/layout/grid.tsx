import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { COLS, COLS_LG, COLS_MD, COLS_SM, COLS_XL, GAP } from "./classes.ts"
import type { Columns, Space } from "./types.ts"

type GridProps = {
  columns?: Columns
  gap?: Space
  className?: string
  children?: ReactNode
}

export function Grid({ columns = 1, gap = 0, className, children }: GridProps) {
  const columnClass =
    typeof columns === "number"
      ? COLS[columns]
      : cn(
          COLS[columns.base ?? 1],
          columns.sm && COLS_SM[columns.sm],
          columns.md && COLS_MD[columns.md],
          columns.lg && COLS_LG[columns.lg],
          columns.xl && COLS_XL[columns.xl],
        )

  return (
    <div className={cn("grid min-w-0 *:min-w-0 *:max-w-full", columnClass, GAP[gap], className)}>
      {children}
    </div>
  )
}
