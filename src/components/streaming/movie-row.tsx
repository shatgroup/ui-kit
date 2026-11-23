import { ChevronRightIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.tsx"
import { MovieCard } from "./movie-card.tsx"
import type { Movie } from "./types.ts"

export function MovieRow({
  title,
  movies,
  onSeeAll,
  onOpen,
}: {
  title: string
  movies: Movie[]
  onSeeAll?: () => void
  onOpen: (movie: Movie) => void
}) {
  return (
    <Stack gap={3} slot="movie-row">
      <Inline justify="between" align="center">
        <Text as="h2" size="xl" weight="semibold">{title}</Text>
        {onSeeAll ? (
          <Button variant="ghost" size="sm" onClick={onSeeAll}>
            <Text as="span" tone="primary" size="sm" weight="medium">Xem tất cả</Text>
            <ChevronRightIcon />
          </Button>
        ) : null}
      </Inline>
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="basis-5/12 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <MovieCard movie={movie} onOpen={() => onOpen(movie)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 hidden md:inline-flex" />
        <CarouselNext className="right-2 hidden md:inline-flex" />
      </Carousel>
    </Stack>
  )
}
