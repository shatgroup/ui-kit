import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx"
import type { Movie } from "./types.ts"

function useMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const onChange = () => setMobile(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return mobile
}

function SearchFields({
  movies,
  query,
  onQuery,
  onSelect,
  fill = false,
}: {
  movies: Movie[]
  query: string
  onQuery: (value: string) => void
  onSelect: (movie: Movie) => void
  fill?: boolean
}) {
  const typed = query.trim().length > 0

  return (
    <>
      <CommandInput
        autoFocus
        placeholder="Tìm phim hoặc thể loại"
        value={query}
        onValueChange={onQuery}
      />
      <CommandList className={fill ? "max-h-none flex-1" : undefined}>
        {typed ? (
          <>
            <CommandEmpty>Không thấy phim phù hợp.</CommandEmpty>
            <CommandGroup heading="Gợi ý">
              {movies.map((movie) => (
                <CommandItem
                  key={movie.id}
                  value={`${movie.title} ${movie.genres.join(" ")}`}
                  onSelect={() => onSelect(movie)}
                >
                  <Stack gap={0}>
                    <Text as="span" weight="medium">{movie.title}</Text>
                    <Text as="span" tone="muted" size="xs">{movie.genres.join(" · ")}</Text>
                  </Stack>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <CommandEmpty>Gõ tên phim hoặc thể loại để xem gợi ý.</CommandEmpty>
        )}
      </CommandList>
    </>
  )
}

export function SearchOverlay({
  movies,
  onSelect,
}: {
  movies: Movie[]
  onSelect: (movie: Movie) => void
}) {
  const mobile = useMobile()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  function choose(movie: Movie) {
    setOpen(false)
    setQuery("")
    onSelect(movie)
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setQuery("")
  }

  if (mobile) {
    return (
      <>
        <Button variant="ghost" size="icon" aria-label="Tìm phim" onClick={() => setOpen(true)}>
          <SearchIcon />
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={onOpenChange}
          title="Tìm phim"
          description="Gõ tên phim hoặc thể loại để xem gợi ý."
          className="top-0 left-0 h-dvh max-w-none translate-x-0 translate-y-0 rounded-none sm:max-w-none"
        >
          <Command className="flex h-full flex-col bg-transparent p-0">
            <SearchFields fill movies={movies} query={query} onQuery={setQuery} onSelect={choose} />
          </Command>
        </CommandDialog>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Tìm phim">
          <SearchIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-none">
        <Command>
          <SearchFields movies={movies} query={query} onQuery={setQuery} onSelect={choose} />
        </Command>
      </PopoverContent>
    </Popover>
  )
}
