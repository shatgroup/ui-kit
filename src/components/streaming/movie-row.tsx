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

  const arrow = `absolute top-4 bottom-4 z-10 hidden h-auto w-14 rounded-none bg-background/50 backdrop-blur md:inline-flex ${fade} opacity-0 group-hover/row:opacity-100`

  return (
    <Stack gap={0} slot="movie-row" className="group/row">
      <Text as="h2" size="2xl" weight="medium" className="pl-4 pr-4 md:pl-14 md:pr-14">{title}</Text>
      <Box className="relative">
        <Button
          variant="ghost"
          aria-label="Cuộn trái"
          className={`${arrow} left-0`}
          onClick={() => scrollBy("left")}
        >
          <ChevronLeftIcon />
        </Button>
        <div ref={scroller} className="flex gap-2 overflow-x-auto scroll-smooth pl-4 pr-4 scrollbar-none md:pl-14 md:pr-14">
          {movies.map((movie) => (
            <div key={movie.id} className="w-1/3 shrink-0 py-4 md:w-1/5 lg:w-1/7">
              <MovieCard
                aspect="poster"
                movie={movie}
                onOpen={() => onOpen(movie)}
                onInfo={() => setDetail(movie)}
              />
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          aria-label="Cuộn phải"
          className={`${arrow} right-0`}
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
