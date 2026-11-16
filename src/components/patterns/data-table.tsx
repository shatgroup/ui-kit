import { useState, type ReactNode } from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"
import { flexRender } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"

export type DataColumn<T> = {
  id: string
  header: string
  accessor: (row: T) => string | number
  cell?: (row: T) => ReactNode
  minWidth?: number
  grow?: boolean
  numeric?: boolean
  sortable?: boolean
}

type DataTableProps<T> = {
  data: T[]
  columns: DataColumn<T>[]
  getRowId: (row: T) => string
  stickyFirstColumn?: boolean
  mobileMode?: "scroll" | "cards"
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  selectable?: boolean
  renderActions?: (row: T) => ReactNode
  bulkActions?: (ids: string[]) => ReactNode
}

const PAGE_SIZES = ["10", "20", "50"]

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  getRowId,
  stickyFirstColumn = false,
  mobileMode = "scroll",
  loading = false,
  error,
  onRetry,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Đổi bộ lọc hoặc thêm dòng mới.",
  selectable = false,
  renderActions,
  bulkActions,
}: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState("10")
  const defs: LegacyColumnDef<T>[] = columns.map((column) => ({
    id: column.id,
    accessorFn: column.accessor,
    header: column.header,
    enableSorting: column.sortable !== false,
    cell: (info) => (column.cell ? column.cell(info.row.original) : String(info.getValue() ?? "")),
  }))

  const table = useLegacyTable({
    data,
    columns: defs,
    getRowId,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const rows = table.getRowModel().rows
  const selected = table.getSelectedRowModel().rows.map((row) => row.id)
  const total = table.getFilteredRowModel().rows.length
  const pageIndex = table.getState().pagination.pageIndex
  const size = table.getState().pagination.pageSize
  const from = total === 0 ? 0 : pageIndex * size + 1
  const to = Math.min(total, (pageIndex + 1) * size)

  if (loading) {
    return (
      <Stack gap={2}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-control-md w-full" />
        ))}
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack gap={3} align="center" className="py-8">
        <Text tone="destructive">{error}</Text>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Thử lại
          </Button>
        ) : null}
      </Stack>
    )
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <Stack gap={3}>
      {selectable && selected.length > 0 ? (
        <Inline gap={2} align="center" className="rounded-md bg-muted px-3 py-2">
          <Text size="sm" weight="medium">
            Đã chọn {selected.length}
          </Text>
          {bulkActions ? bulkActions(selected) : null}
        </Inline>
      ) : null}
      <Box className={mobileMode === "cards" ? "hidden sm:block" : undefined}>
        <Table stickyFirstColumn={stickyFirstColumn}>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header, index) => {
                  const column = columns[index]
                  return (
                    <TableHead
                      key={header.id}
                      minWidth={column?.minWidth ?? (index === 0 ? 120 : 96)}
                      grow={column?.grow}
                      numeric={column?.numeric}
                    >
                      <SortButton column={header.column} label={flexRender(header.column.columnDef.header, header.getContext())} />
                    </TableHead>
                  )
                })}
                {renderActions ? <TableHead minWidth={64}>Thao tác</TableHead> : null}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, index) => {
                  const column = columns[index]
                  return (
                    <TableCell
                      key={cell.id}
                      minWidth={column?.minWidth ?? (index === 0 ? 120 : 96)}
                      grow={column?.grow}
                      numeric={column?.numeric}
                    >
                      <Inline gap={2} align="center" wrap={false}>
                        {selectable && index === 0 ? (
                          <Checkbox
                            checked={row.getIsSelected()}
                            aria-label={`Chọn ${row.id}`}
                            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                          />
                        ) : null}
                        <Box className="min-w-0 flex-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>
                      </Inline>
                    </TableCell>
                  )
                })}
                  {renderActions ? (
                  <TableCell minWidth={64} wrap>
                    {renderActions(row.original as T)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {mobileMode === "cards" ? (
        <Stack gap={3} className="sm:hidden">
          {rows.map((row) => (
            <Card key={row.id}>
              <CardContent>
                <Stack gap={2}>
                  {selectable ? (
                    <Checkbox
                      checked={row.getIsSelected()}
                      aria-label={`Chọn ${row.id}`}
                      onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                    />
                  ) : null}
                  {columns.map((column) => (
                    <Stack key={column.id} gap={1}>
                      <Text size="xs" tone="muted">
                        {column.header}
                      </Text>
                      <Text size="sm">{column.cell ? column.cell(row.original as T) : String(column.accessor(row.original as T))}</Text>
                    </Stack>
                  ))}
                  {renderActions ? renderActions(row.original) : null}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : null}
      <Inline gap={2} align="center" justify="between">
        <Inline gap={2} align="center">
          <Text size="sm" tone="muted">
            {from}–{to} / {total}
          </Text>
          <Select
            value={pageSize}
            onValueChange={(value) => {
              const next = value ?? "10"
              setPageSize(next)
              table.setPageSize(Number(next))
            }}
          >
            <SelectTrigger size="sm" className="w-24" aria-label="Số dòng mỗi trang">
              <span>{pageSize} dòng</span>
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item} dòng
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Inline>
        <Inline gap={2} align="center">
          <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
            Trang trước
          </Button>
          <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
            Trang sau
          </Button>
        </Inline>
      </Inline>
    </Stack>
  )
}

function SortButton({
  column,
  label,
}: {
  column: {
    getCanSort?: () => boolean
    getIsSorted?: () => false | "asc" | "desc"
    getToggleSortingHandler?: () => ((event: unknown) => void) | undefined
  }
  label: ReactNode
}) {
  if (!column.getCanSort?.()) return label
  const sorted = column.getIsSorted?.()
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon
  return (
    <Button
      variant="ghost"
      size="sm"
      className="justify-start px-1"
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
      onClick={column.getToggleSortingHandler?.()}
    >
      {label}
      <Icon className="size-4 shrink-0" />
    </Button>
  )
}
