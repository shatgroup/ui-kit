import { SearchIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx"

export type FilterOption = {
  value: string
  label: string
}

export type FilterItem = {
  id: string
  label: string
  value: string
  options: FilterOption[]
  allValue?: string
  onChange: (value: string) => void
}

type FilterBarProps = {
  query: string
  onQueryChange: (value: string) => void
  filters: FilterItem[]
  onClear: () => void
  resultCount: number
}

export function FilterBar({ query, onQueryChange, filters, onClear, resultCount }: FilterBarProps) {
  const active = filters.filter((filter) => filter.value !== (filter.allValue ?? "all")).length

  return (
    <Stack gap={2}>
      <Inline gap={2} align="center">
        <Box className="relative w-60">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            placeholder="Tìm kiếm"
            aria-label="Tìm kiếm"
            className="pl-8"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </Box>
        {filters.map((filter) => {
          const current = filter.options.find((option) => option.value === filter.value)
          return (
            <Select key={filter.id} value={filter.value} onValueChange={(value) => filter.onChange(value ?? filter.allValue ?? "all")}>
              <SelectTrigger size="default" className="w-48" aria-label={filter.label}>
                <span className="block min-w-0 truncate">
                  {filter.label}: {current?.label ?? filter.value}
                </span>
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}
        <Button variant="outline" size="default" onClick={onClear}>
          Xoá lọc
        </Button>
      </Inline>
      <Inline gap={3} align="center">
        <Text size="sm" tone="muted">
          {resultCount} kết quả
        </Text>
        {active > 0 ? (
          <Text size="sm" weight="medium">
            {active} bộ lọc đang bật
          </Text>
        ) : null}
      </Inline>
    </Stack>
  )
}
