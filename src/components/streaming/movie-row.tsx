import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel.tsx"
import { MovieCard } from "./movie-card.tsx"
import { MovieDetail } from "./movie-info.tsx"
import type { Movie } from "./types.ts"

const gutter = "pl-4 pr-4 md:pl-14 md:pr-14"

export function MovieRow({
  title,
  movies,
  onOpen,
  onSeeAll,
}: {
  title: string
  movies: Movie[]
  onSeeAll?: () => void
  onOpen: (movie: Movie) => void
}) {
  const [detail, setDetail] = useState<Movie | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [active, setActive] = useState<number | null>(null)

  if (movies.length === 0) return null

  // check-ui-ignore-next-line: mẫu -ml-2/pl-2 của Carousel để N card vừa khít, chỉ hàng streaming
  const track = `-ml-2 ${gutter}`

  return (
    <Stack gap={2} slot="movie-row">
      <Inline justify="between" align="center" className={gutter}>
        <Inline gap={2} align="center">
          <span className="h-6 w-1 rounded-full bg-primary" />
          <Text as="h2" size="2xl" weight="medium">{title}</Text>
        </Inline>
        <Inline gap={2} align="center">
          <Button size="icon-sm" variant="outline" className="rounded-full" aria-label="Cuộn trái" onClick={() => api?.scrollPrev()}>
            <ChevronLeftIcon />
          </Button>
          <Button size="icon-sm" variant="outline" className="rounded-full" aria-label="Cuộn phải" onClick={() => api?.scrollNext()}>
            <ChevronRightIcon />
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => onSeeAll?.()}>Xem tất cả</Button>
        </Inline>
      </Inline>
      <Box className="relative">
        <Carousel opts={{ align: "start", slidesToScroll: "auto", containScroll: "trimSnaps" }} setApi={setApi} className="w-full">
          <CarouselContent className={track}>
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="basis-1/2 pl-2 md:basis-1/3 lg:basis-1/5">
                <div className="py-16">
                  <MovieCard
                    aspect="landscape"
                    movie={movie}
                    dimmed={active !== null && active !== index}
                    onOpen={() => onOpen(movie)}
                    onInfo={() => setDetail(movie)}
                    onHover={(open) => setActive(open ? index : null)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
