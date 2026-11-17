import { useCallback, useState } from "react"
import { useReactFlow, type BuiltInEdge, type Node, type PanelProps } from "@xyflow/react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export interface NodeSearchProps extends Omit<PanelProps, "children"> {
  onSearch?: (searchString: string) => Node[]
  onSelectNode?: (node: Node) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  emptyLabel?: string
  groupLabel?: string
}

export function NodeSearchInternal({
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
  placeholder = "Tìm node",
  emptyLabel = "Không thấy kết quả",
  groupLabel = "Node",
}: NodeSearchProps) {
  const [searchResults, setSearchResults] = useState<Node[]>([])
  const [searchString, setSearchString] = useState("")
  const { getNodes, fitView, setNodes } = useReactFlow<Node, BuiltInEdge>()

  const defaultOnSearch = useCallback((query: string) => {
    return getNodes().filter((node) => String(node.data.label ?? "").toLowerCase().includes(query.toLowerCase()))
  }, [getNodes])

  const onChange = useCallback((query: string) => {
    setSearchString(query)
    if (query.length > 0) {
      onOpenChange?.(true)
      setSearchResults((onSearch || defaultOnSearch)(query))
    }
  }, [defaultOnSearch, onOpenChange, onSearch])

  const defaultOnSelectNode = useCallback((node: Node) => {
    setNodes((nodes) => nodes.map((item) => (item.id === node.id ? { ...item, selected: true } : item)))
    void fitView({ nodes: [node], duration: 300 })
  }, [fitView, setNodes])

  const onSelect = useCallback((node: Node) => {
    ;(onSelectNode || defaultOnSelectNode)(node)
    setSearchString("")
    onOpenChange?.(false)
  }, [onSelectNode, defaultOnSelectNode, onOpenChange])

  return (
    <>
      <CommandInput placeholder={placeholder} onValueChange={onChange} value={searchString} onFocus={() => onOpenChange?.(true)} />
      {open ? (
        <CommandList>
          {searchResults.length === 0 ? (
            <CommandEmpty>{emptyLabel}</CommandEmpty>
          ) : (
            <CommandGroup heading={groupLabel}>
              {searchResults.map((node) => (
                <CommandItem key={node.id} onSelect={() => onSelect(node)}>
                  <span>{String(node.data.label ?? node.id)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      ) : null}
    </>
  )
}

export function NodeSearch({
  onSearch,
  onSelectNode,
  placeholder,
  emptyLabel,
  groupLabel,
}: NodeSearchProps) {
  const [open, setOpen] = useState(false)
  return (
    <Command shouldFilter={false} className="nodrag nopan w-full rounded-lg border border-border bg-card">
      <NodeSearchInternal
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={setOpen}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        groupLabel={groupLabel}
      />
    </Command>
  )
}

export interface NodeSearchDialogProps extends NodeSearchProps {
  title?: string
}

export function NodeSearchDialog({
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
  placeholder,
  emptyLabel,
  groupLabel,
}: NodeSearchDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <NodeSearchInternal
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={onOpenChange}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        groupLabel={groupLabel}
      />
    </CommandDialog>
  )
}
