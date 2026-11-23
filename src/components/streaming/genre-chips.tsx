import { Box, Inline } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"

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
        <Button
          size="sm"
          variant="outline"
          className={cn("shrink-0 rounded-full", !value && "border-primary text-primary-text")}
          onClick={() => onChange(undefined)}
        >
          Tất cả
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre}
            size="sm"
            variant="outline"
            className={cn("shrink-0 rounded-full", value === genre && "border-primary text-primary-text")}
            onClick={() => onChange(genre)}
          >
            {genre}
          </Button>
        ))}
      </Inline>
    </Box>
  )
}
