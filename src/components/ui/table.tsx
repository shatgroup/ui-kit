import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Truncated } from "./truncated.tsx"

function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="w-full min-w-0 overflow-x-auto">
      <table data-slot="table" className={cn("w-full text-sm", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("border-b border-border", className)} {...props} />
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-border", className)} {...props} />
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-b border-border", className)} {...props} />
}

type CellProps = {
  wrap?: boolean
  numeric?: boolean
  children?: ReactNode
}

function TableHead({ className, wrap = false, numeric = false, children, ...props }: ComponentProps<"th"> & CellProps) {
  return (
    <th
      data-slot="table-head"
      className={cn("h-control-sm px-3 text-left font-medium text-muted-foreground", numeric && "text-right tabular-nums", className)}
      {...props}
    >
      <CellText wrap={wrap}>{children}</CellText>
    </th>
  )
}

function TableCell({ className, wrap = false, numeric = false, children, ...props }: ComponentProps<"td"> & CellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn("h-control-md overflow-hidden px-3 align-middle", numeric && "text-right tabular-nums", className)}
      {...props}
    >
      <CellText wrap={wrap}>{children}</CellText>
    </td>
  )
}

function CellText({ wrap, children }: { wrap: boolean; children?: ReactNode }) {
  if (wrap) return <span className="block min-w-0 wrap-anywhere">{children}</span>
  return <Truncated>{children}</Truncated>
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("py-2 text-sm text-muted-foreground", className)} {...props} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
