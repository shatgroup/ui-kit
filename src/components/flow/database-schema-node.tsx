import type { ReactNode } from "react"
import { Text } from "@/components/layout/index.ts"
import { cn } from "@/lib/utils"
import { BaseNode, BaseNodeHeader } from "@/components/flow/base-node.tsx"

export type DatabaseSchemaNodeHeaderProps = { children?: ReactNode }

export function DatabaseSchemaNodeHeader({ children }: DatabaseSchemaNodeHeaderProps) {
  return (
    <BaseNodeHeader className="justify-center border-b border-border bg-muted px-3 py-2">
      <Text as="h3" size="sm" weight="medium" tone="muted">{children}</Text>
    </BaseNodeHeader>
  )
}

export type DatabaseSchemaNodeBodyProps = { children?: ReactNode }

export function DatabaseSchemaNodeBody({ children }: DatabaseSchemaNodeBodyProps) {
  return <div className="w-full">{children}</div>
}

export type DatabaseSchemaTableRowProps = { children: ReactNode; className?: string }

export function DatabaseSchemaTableRow({ children, className }: DatabaseSchemaTableRowProps) {
  return (
    <div data-schema-row className={cn("relative flex w-full items-center border-b border-border last:border-b-0", className)}>
      {children}
    </div>
  )
}

export type DatabaseSchemaTableCellProps = { className?: string; children?: ReactNode; align?: "start" | "end" }

export function DatabaseSchemaTableCell({ className, children, align = "start" }: DatabaseSchemaTableCellProps) {
  return (
    <div className={cn("min-w-0 px-4 py-2", align === "end" ? "shrink-0 text-right" : "flex-1", className)}>
      {children}
    </div>
  )
}

export type DatabaseSchemaNodeProps = { className?: string; children?: ReactNode }

export function DatabaseSchemaNode({ className, children }: DatabaseSchemaNodeProps) {
  return <BaseNode className={cn("w-full overflow-hidden p-0", className)}>{children}</BaseNode>
}
