import { Box, Inline } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"

export function GenreChips({
  genres,
  value,
  onChange,
}: {
  genres: string[]
  value?: string
  onChange: (genre: string | undefined) => void
}) {
  return (
    <Box slot="genre-chips" className="overflow-x-auto scrollbar-none">
      <Inline gap={2} wrap={false} className="w-max">
        <Button size="sm" variant={value ? "outline" : "default"} onClick={() => onChange(undefined)}>
          Tất cả
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre}
            size="sm"
            variant={value === genre ? "default" : "outline"}
            className="shrink-0"
            onClick={() => onChange(genre)}
          >
            {genre}
          </Button>
        ))}
      </Inline>
    </Box>
  )
}
