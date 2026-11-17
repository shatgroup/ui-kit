import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { COLS, COLS_LG, COLS_MD, COLS_SM, COLS_XL, GAP } from "./classes.ts"
import type { Columns, GridSpan, Space } from "./types.ts"

const SPAN: Record<GridSpan, string> = {
  quarter: "col-span-4 md:col-span-4 lg:col-span-3",
  third: "col-span-4 md:col-span-4 lg:col-span-4",
  half: "col-span-4 md:col-span-8 lg:col-span-6",
  "two-thirds": "col-span-4 md:col-span-8 lg:col-span-8",
  full: "col-span-4 md:col-span-8 lg:col-span-12",
}

type GridProps = {
  span?: GridSpan
  columns?: Columns
  gap?: Space
  className?: string
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">

export function Grid({ span, columns, gap = 0, className, children, ...rest }: GridProps) {
  if (span) {
    return (
      <div data-span={span} className={cn("min-w-0", SPAN[span], className)} {...rest}>
        {children}
      </div>
    )
  }

  if (columns !== undefined) {
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
      <div className={cn("grid min-w-0 *:min-w-0 *:max-w-full", columnClass, GAP[gap], className)} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <div
      data-grid="frame"
      className={cn("grid min-w-0 grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12 *:min-w-0 *:max-w-full", className)}
      {...rest}
    >
      {children}
    </div>
  )
}
