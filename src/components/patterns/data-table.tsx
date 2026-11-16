import { createContext, useContext, useState, type ReactNode } from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Columns3Icon, GripVerticalIcon, MoreHorizontalIcon, MoreVerticalIcon } from "lucide-react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { EmptyState } from "@/components/ui/empty-state.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"

export type RowAction<T> = {
  id: string
  label: string
  onSelect?: (row: T) => void
  destructive?: boolean
}

export type DataColumn<T> = {
  id: string
  header: string
  accessor: (row: T) => string | number
  cell?: (row: T) => ReactNode
  minWidth?: number
  grow?: boolean
  numeric?: boolean
  sortable?: boolean
  editable?: "number" | "text" | "select"
  options?: string[]
  editLabel?: (row: T) => string
}

type TableLabels = {
  selected?: (count: number, total: number) => string
  rowsPerPage?: string
  page?: (current: number, pages: number) => string
  first?: string
  previous?: string
  next?: string
  last?: string
  selectAll?: string
  selectRow?: (id: string) => string
  columns?: string
  drag?: string
  actions?: string
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
  selectColumn?: boolean
  renderActions?: (row: T) => ReactNode
  rowActions?: (row: T) => RowAction<T>[]
  rowActionIcon?: "vertical" | "horizontal"
  bulkActions?: (ids: string[]) => ReactNode
  reorderable?: boolean
  onReorder?: (ids: string[]) => void
  columnVisibility?: boolean
  onCellChange?: (row: T, columnId: string, value: string) => void
  pageSizes?: string[]
  toolbar?: (controls: { columnsButton: ReactNode }) => ReactNode
  actionLabel?: (row: T) => string
  labels?: TableLabels
}

const DEFAULT_PAGE_SIZES = ["10", "20", "50"]

const DragContext = createContext<Pick<ReturnType<typeof useSortable>, "attributes" | "listeners" | "setActivatorNodeRef"> | null>(null)

export function DataTable<T extends object>({
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
  selectColumn = false,
  renderActions,
  rowActions,
  rowActionIcon = "vertical",
  bulkActions,
  reorderable = false,
  onReorder,
  columnVisibility = false,
  onCellChange,
  pageSizes = DEFAULT_PAGE_SIZES,
  toolbar,
  actionLabel,
  labels,
}: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState(pageSizes[0] ?? "10")
  const [hidden, setHidden] = useState<string[]>([])
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const shown = columns.filter((column) => !hidden.includes(column.id))
  const defs: LegacyColumnDef<T>[] = shown.map((column) => ({
    id: column.id,
    accessorFn: column.accessor,
    header: column.header,
    enableSorting: column.sortable !== false && !column.editable,
    cell: (info) => renderCell(column, info.row.original, onCellChange),
  }))

  const table = useLegacyTable({
    data,
    columns: defs,
    getRowId,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: Number(pageSizes[0] ?? "10") } },
  })

  const allSelected = table.getIsAllPageRowsSelected()
  const someSelected = table.getIsSomePageRowsSelected()
  const rows = table.getRowModel().rows
  const selected = table.getSelectedRowModel().rows.map((row) => row.id)
  const total = table.getFilteredRowModel().rows.length
  const pageIndex = table.getState().pagination.pageIndex
  const hasActions = Boolean(renderActions || rowActions)
  const columnsButton = columnVisibility ? (
    <ColumnsButton columns={columns} hidden={hidden} label={labels?.columns ?? "Customize Columns"} onToggle={toggleColumn} />
  ) : null

  function toggleColumn(id: string, visible: boolean) {
    setHidden((current) => (visible ? current.filter((item) => item !== id) : [...current, id]))
  }

  function handleReorder(event: DragEndEvent) {
    if (!onReorder || !event.over || event.active.id === event.over.id) return
    const ids = data.map((row) => getRowId(row))
    const oldIndex = ids.indexOf(String(event.active.id))
    const newIndex = ids.indexOf(String(event.over.id))
    if (oldIndex < 0 || newIndex < 0) return
    onReorder(arrayMove(ids, oldIndex, newIndex))
  }

  if (loading) {
    return (
      <Stack gap={2}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-control-default w-full" />
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
      {toolbar ? toolbar({ columnsButton }) : columnsButton}
      {selectable && selected.length > 0 && bulkActions ? (
        <Inline gap={2} align="center" className="rounded-md bg-muted px-3 py-2">
          <Text size="sm" weight="medium">
            Đã chọn {selected.length}
          </Text>
          {bulkActions(selected)}
        </Inline>
      ) : null}
      <Box className={mobileMode === "cards" ? "hidden sm:block" : undefined}>
        <ReorderFrame enabled={reorderable} ids={rows.map((row) => row.id)} sensors={sensors} onDragEnd={handleReorder}>
          <Table stickyFirstColumn={stickyFirstColumn}>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {reorderable ? <TableHead wrap minWidth={48}> </TableHead> : null}
                  {selectable && selectColumn ? (
                    <TableHead wrap minWidth={48}>
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        aria-label={labels?.selectAll ?? "Select all"}
                        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
                      />
                    </TableHead>
                  ) : null}
                  {group.headers.map((header, index) => {
                    const column = shown[index]
                    return (
                      <TableHead
                        key={header.id}
                        minWidth={column?.minWidth ?? (index === 0 ? 120 : 96)}
                        grow={column?.grow}
                        numeric={column?.numeric}
                      >
                        {index === 0 && selectable && !selectColumn ? (
                          <Inline gap={2} align="center" wrap={false}>
                            <Checkbox
                              checked={allSelected}
                              indeterminate={someSelected && !allSelected}
                              aria-label={labels?.selectAll ?? "Select all"}
                              onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
                            />
                            <SortButton column={header.column} label={flexRender(header.column.columnDef.header, header.getContext())} />
                          </Inline>
                        ) : (
                          <SortButton column={header.column} label={flexRender(header.column.columnDef.header, header.getContext())} />
                        )}
                      </TableHead>
                    )
                  })}
                  {hasActions ? <TableHead wrap minWidth={64}> </TableHead> : null}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <RowShell key={row.id} sortable={reorderable} rowId={row.id}>
                  {reorderable ? (
                    <TableCell wrap minWidth={48}>
                      <DragHandle label={labels?.drag ?? "Drag to reorder"} />
                    </TableCell>
                  ) : null}
                  {selectable && selectColumn ? (
                    <TableCell wrap minWidth={48}>
                      <Checkbox
                        checked={row.getIsSelected()}
                        aria-label={(labels?.selectRow ?? ((id) => `Select ${id}`))(row.id)}
                        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                      />
                    </TableCell>
                  ) : null}
                  {row.getVisibleCells().map((cell, index) => {
                    const column = shown[index]
                    return (
                      <TableCell
                        key={cell.id}
                        minWidth={column?.minWidth ?? (index === 0 ? 120 : 96)}
                        grow={column?.grow}
                        numeric={column?.numeric}
                        wrap={Boolean(column?.editable)}
                      >
                        <Inline gap={2} align="center" wrap={false}>
                          {selectable && !selectColumn && index === 0 ? (
                            <Checkbox
                              checked={row.getIsSelected()}
                              aria-label={(labels?.selectRow ?? ((id) => `Select ${id}`))(row.id)}
                              onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                            />
                          ) : null}
                          <Box className="min-w-0 flex-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>
                        </Inline>
                      </TableCell>
                    )
                  })}
                  {hasActions ? (
                    <TableCell minWidth={64} wrap>
                      {rowActions ? (
                        <RowMenu row={row.original} actions={rowActions(row.original)} icon={rowActionIcon} label={actionLabel?.(row.original) ?? labels?.actions ?? "Actions"} />
                      ) : renderActions ? (
                        renderActions(row.original)
                      ) : null}
                    </TableCell>
                  ) : null}
                </RowShell>
              ))}
            </TableBody>
          </Table>
        </ReorderFrame>
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
                      aria-label={(labels?.selectRow ?? ((id) => `Select ${id}`))(row.id)}
                      onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                    />
                  ) : null}
                  {shown.map((column) => (
                    <Stack key={column.id} gap={1}>
                      <Text size="xs" tone="muted">
                        {column.header}
                      </Text>
                      <Text size="sm">{renderCell(column, row.original, onCellChange)}</Text>
                    </Stack>
                  ))}
                  {rowActions ? (
                    <RowMenu row={row.original} actions={rowActions(row.original)} icon={rowActionIcon} label={actionLabel?.(row.original) ?? labels?.actions ?? "Actions"} />
                  ) : renderActions ? (
                    renderActions(row.original)
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : null}
      <TablePagination
        selected={selected.length}
        total={total}
        pageIndex={pageIndex}
        pageCount={Math.max(1, table.getPageCount())}
        pageSize={pageSize}
        pageSizes={pageSizes}
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        labels={labels}
        onPageSize={(value) => {
          setPageSize(value)
          table.setPageSize(Number(value))
        }}
        onFirst={() => table.setPageIndex(0)}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
        onLast={() => table.setPageIndex(table.getPageCount() - 1)}
      />
    </Stack>
  )
}

function renderCell<T>(column: DataColumn<T>, row: T, onCellChange?: (row: T, columnId: string, value: string) => void) {
  if (column.editable && onCellChange) return <CellEditor column={column} row={row} onCellChange={onCellChange} />
  if (column.cell) return column.cell(row)
  return String(column.accessor(row) ?? "")
}

function CellEditor<T>({
  column,
  row,
  onCellChange,
}: {
  column: DataColumn<T>
  row: T
  onCellChange: (row: T, columnId: string, value: string) => void
}) {
  const value = String(column.accessor(row) ?? "")
  const label = column.editLabel?.(row) ?? column.header
  if (column.editable === "select") {
    return (
      <Select value={value} onValueChange={(next) => onCellChange(row, column.id, next ?? value)}>
        <SelectTrigger size="sm" className="w-40" aria-label={label}>
          <span>{value}</span>
        </SelectTrigger>
        <SelectContent>
          {(column.options ?? []).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  return (
    <Input
      size="sm"
      aria-label={label}
      value={value}
      inputMode={column.editable === "number" ? "numeric" : undefined}
      className={column.numeric ? "w-16 text-right" : undefined}
      onChange={(event) => onCellChange(row, column.id, event.target.value)}
    />
  )
}

function ColumnsButton({
  columns,
  hidden,
  label,
  onToggle,
}: {
  columns: { id: string; header: string }[]
  hidden: string[]
  label: string
  onToggle: (id: string, visible: boolean) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <Columns3Icon />
        {label}
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={!hidden.includes(column.id)}
            onCheckedChange={(checked) => onToggle(column.id, checked === true)}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RowMenu<T>({
  row,
  actions,
  icon,
  label,
}: {
  row: T
  actions: RowAction<T>[]
  icon: "vertical" | "horizontal"
  label: string
}) {
  const Icon = icon === "horizontal" ? MoreHorizontalIcon : MoreVerticalIcon
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="w-8 px-0" aria-label={label} />}>
        <Icon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action) => (
          <DropdownMenuItem key={action.id} variant={action.destructive ? "destructive" : "default"} onClick={() => action.onSelect?.(row)}>
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TablePagination({
  selected,
  total,
  pageIndex,
  pageCount,
  pageSize,
  pageSizes,
  canPrevious,
  canNext,
  labels,
  onPageSize,
  onFirst,
  onPrevious,
  onNext,
  onLast,
}: {
  selected: number
  total: number
  pageIndex: number
  pageCount: number
  pageSize: string
  pageSizes: string[]
  canPrevious: boolean
  canNext: boolean
  labels?: TableLabels
  onPageSize: (value: string) => void
  onFirst: () => void
  onPrevious: () => void
  onNext: () => void
  onLast: () => void
}) {
  return (
    <div data-slot="table-pagination">
    <Inline gap={2} align="center" justify="between">
      <Text size="sm" tone="muted">
        {(labels?.selected ?? ((count, all) => `${count} of ${all} row(s) selected`))(selected, total)}
      </Text>
      <Inline gap={2} align="center">
        <Text size="sm">{labels?.rowsPerPage ?? "Rows per page"}</Text>
        <Select value={pageSize} onValueChange={(value) => onPageSize(value ?? pageSize)}>
          <SelectTrigger size="sm" className="w-20" aria-label={labels?.rowsPerPage ?? "Rows per page"}>
            <span>{pageSize}</span>
          </SelectTrigger>
          <SelectContent>
            {pageSizes.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Text size="sm">
          {(labels?.page ?? ((current, pages) => `Page ${current} of ${pages}`))(total === 0 ? 0 : pageIndex + 1, pageCount)}
        </Text>
        <Button variant="outline" size="sm" className="size-8 p-0" aria-label={labels?.first ?? "Go to first page"} disabled={!canPrevious} onClick={onFirst}>
          <ChevronsLeftIcon />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0" aria-label={labels?.previous ?? "Go to previous page"} disabled={!canPrevious} onClick={onPrevious}>
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0" aria-label={labels?.next ?? "Go to next page"} disabled={!canNext} onClick={onNext}>
          <ChevronRightIcon />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0" aria-label={labels?.last ?? "Go to last page"} disabled={!canNext} onClick={onLast}>
          <ChevronsRightIcon />
        </Button>
      </Inline>
    </Inline>
    </div>
  )
}

function ReorderFrame({
  enabled,
  ids,
  sensors,
  onDragEnd,
  children,
}: {
  enabled: boolean
  ids: string[]
  sensors: ReturnType<typeof useSensors>
  onDragEnd: (event: DragEndEvent) => void
  children: ReactNode
}) {
  if (!enabled) return children
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

function RowShell({ sortable, rowId, children }: { sortable: boolean; rowId: string; children: ReactNode }) {
  if (!sortable) return <TableRow>{children}</TableRow>
  return <SortableDataRow rowId={rowId}>{children}</SortableDataRow>
}

function SortableDataRow({ rowId, children }: { rowId: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id: rowId })
  return (
    <DragContext.Provider value={{ attributes, listeners, setActivatorNodeRef }}>
      <TableRow
        ref={setNodeRef}
        // check-ui-ignore-next-line: dnd-kit đặt transform theo pixel lúc kéo, không có class tĩnh
        style={{ transform: CSS.Transform.toString(transform), transition }}
      >
        {children}
      </TableRow>
    </DragContext.Provider>
  )
}

function DragHandle({ label }: { label: string }) {
  const bind = useContext(DragContext)
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-8 px-0"
      aria-label={label}
      ref={bind?.setActivatorNodeRef}
      {...bind?.attributes}
      {...bind?.listeners}
    >
      <GripVerticalIcon />
    </Button>
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
