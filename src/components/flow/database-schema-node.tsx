import type { ReactNode } from "react"
import { Text } from "@/components/layout/index.ts"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { BaseNode, BaseNodeContent, BaseNodeHeader } from "@/components/flow/base-node.tsx"

export type DatabaseSchemaNodeHeaderProps = { children?: ReactNode }

export function DatabaseSchemaNodeHeader({ children }: DatabaseSchemaNodeHeaderProps) {
  return (
    <BaseNodeHeader className="justify-center rounded-t-lg bg-muted px-2 py-2">
      <Text as="h3" size="sm" weight="medium" tone="muted">{children}</Text>
    </BaseNodeHeader>
  )
}

export type DatabaseSchemaNodeBodyProps = { children?: ReactNode }

export function DatabaseSchemaNodeBody({ children }: DatabaseSchemaNodeBodyProps) {
  return (
    <BaseNodeContent className="p-0">
      <table className="w-full">
        <TableBody>{children}</TableBody>
      </table>
    </BaseNodeContent>
  )
}

export type DatabaseSchemaTableRowProps = { children: ReactNode; className?: string }

export function DatabaseSchemaTableRow({ children, className }: DatabaseSchemaTableRowProps) {
  return <TableRow className={cn("relative text-xs", className)}>{children}</TableRow>
}

export type DatabaseSchemaTableCellProps = { className?: string; children?: ReactNode }

export function DatabaseSchemaTableCell({ className, children }: DatabaseSchemaTableCellProps) {
  return <TableCell className={className}>{children}</TableCell>
}

export type DatabaseSchemaNodeProps = { className?: string; children?: ReactNode }

export function DatabaseSchemaNode({ className, children }: DatabaseSchemaNodeProps) {
  return <BaseNode className={className}>{children}</BaseNode>
}
