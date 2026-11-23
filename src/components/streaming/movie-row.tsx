import { useState } from "react"
import { Box, Stack, Text } from "@/components/layout/index.ts"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.tsx"
import { MovieCard, type CardGrow, type CardShift } from "./movie-card.tsx"
import { MovieDetail } from "./movie-info.tsx"
import type { Movie } from "./types.ts"

const fade = "transition-opacity duration-(--duration-normal) ease-(--ease-standard)"

function shiftFor(index: number, current: number, grow: CardGrow): CardShift {
  if (current === index) return "none"
  if (grow === "start") return current > index ? "forward-half" : "none"
  if (grow === "end") return current < index ? "back-half" : "none"
  return current < index ? "back" : "forward"
}

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
  const [detail, setDetail] = useState<Movie | null>(null)
  const [preview, setPreview] = useState<{ index: number; grow: CardGrow } | null>(null)

  if (movies.length === 0) return null

  // check-ui-ignore-next-line: mẫu -ml-2/pl-2 của Carousel để N card vừa khít, chỉ hàng streaming
  const track = "-ml-2 pl-14 pr-14"
  const arrow = `top-4 bottom-4 z-10 hidden h-auto w-14 translate-y-0 rounded-none bg-background/50 backdrop-blur opacity-0 md:inline-flex ${fade} pointer-events-none group-hover/row:pointer-events-auto group-hover/row:opacity-100 disabled:opacity-0`

  return (
    <Stack gap={0} slot="movie-row" className="group/row">
      <Text as="h2" size="2xl" weight="medium" className="pl-14 pr-14">{title}</Text>
      <Box className="relative">
        <Carousel opts={{ align: "start", slidesToScroll: "auto", containScroll: "trimSnaps" }} className="w-full">
          <CarouselContent className={track}>
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="basis-1/3 pl-2 md:basis-1/5 lg:basis-1/7">
                <div className="py-4">
                  <MovieCard
                    aspect="poster"
                    movie={movie}
                    shift={preview ? shiftFor(preview.index, index, preview.grow) : "none"}
                    onOpen={() => onOpen(movie)}
                    onInfo={() => setDetail(movie)}
                    onPreview={(open, grow) => setPreview(open ? { index, grow } : null)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={`${arrow} left-0`} aria-label="Cuộn trái" />
          <CarouselNext className={`${arrow} right-0`} aria-label="Cuộn phải" />
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
