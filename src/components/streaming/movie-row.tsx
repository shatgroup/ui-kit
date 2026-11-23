import { useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Box, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { MovieCard } from "./movie-card.tsx"
import { MovieDetail } from "./movie-info.tsx"
import type { Movie } from "./types.ts"

const fade = "transition-opacity duration-(--duration-normal) ease-(--ease-standard)"

export function MovieRow({
  title,
  movies,
  onOpen,
}: {
  title: string
  movies: Movie[]
  onSeeAll?: () => void
  onOpen: (movie: Movie) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [detail, setDetail] = useState<Movie | null>(null)

  function scrollBy(direction: "left" | "right") {
    const node = scroller.current
    if (!node) return
    const amount = node.clientWidth * 0.75
    node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (movies.length === 0) return null

  return (
    <Stack gap={4} slot="movie-row" className="group/row px-4 md:px-16">
      <Text as="h2" size="xl" weight="bold">{title}</Text>
      <Box className="relative">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Cuộn trái"
          className={`absolute top-0 bottom-0 left-0 z-10 hidden h-full w-10 rounded-none bg-background/50 md:inline-flex md:w-14 ${fade} opacity-0 group-hover/row:opacity-100`}
          onClick={() => scrollBy("left")}
        >
          <ChevronLeftIcon />
        </Button>
        <div ref={scroller} className="flex gap-2 overflow-x-auto scroll-smooth py-8 scrollbar-none">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpen={() => onOpen(movie)}
              onInfo={() => setDetail(movie)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Cuộn phải"
          className={`absolute top-0 right-0 bottom-0 z-10 hidden h-full w-10 rounded-none bg-background/50 md:inline-flex md:w-14 ${fade} opacity-0 group-hover/row:opacity-100`}
          onClick={() => scrollBy("right")}
        >
          <ChevronRightIcon />
        </Button>
      </Box>
      <MovieDetail
        movie={detail}
        open={detail !== null}
        onOpenChange={(open) => { if (!open) setDetail(null) }}
        onPlay={(movie) => onOpen(movie)}
      />
    </Stack>
  )
}
