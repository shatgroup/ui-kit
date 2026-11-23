import { useEffect, useRef, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { PlayIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel.tsx"
import { MoviePoster } from "./movie-card.tsx"
import type { Movie } from "./types.ts"

export function HeroBanner({
  movies,
  onPlay,
  onInfo,
}: {
  movies: Movie[]
  onPlay: (movie: Movie) => void
  onInfo: (movie: Movie) => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const plugins = useRef([
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <Stack gap={3} slot="hero-banner">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={plugins.current}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id}>
              <Box className="relative">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <MoviePoster src={movie.image} title={movie.title} />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-background via-background/60 to-transparent md:block" />
                </AspectRatio>
                <Stack gap={3} className="w-full max-w-2xl px-4 py-4 md:absolute md:bottom-0 md:left-0 md:px-8 md:py-8">
                  <Inline gap={2}>
                    {movie.badge ? <Badge>{movie.badge}</Badge> : null}
                    <Badge variant="outline">{movie.year}</Badge>
                    <Badge variant="outline">{movie.runtime}</Badge>
                  </Inline>
                  <Text as="h2" size="3xl" weight="bold">{movie.title}</Text>
                  <Text tone="muted" lineClamp={3}>{movie.description}</Text>
                  <Inline gap={2} className="w-full flex-col md:flex-row">
                    <Button size="lg" className="w-full md:w-auto" onClick={() => onPlay(movie)}>
                      <PlayIcon />
                      Phát
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full md:w-auto" onClick={() => onInfo(movie)}>
                      Chi tiết
                    </Button>
                  </Inline>
                </Stack>
              </Box>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Inline gap={2} justify="center">
        {movies.map((movie, index) => (
          <Button
            key={movie.id}
            size="icon-xs"
            variant={index === current ? "default" : "outline"}
            className="rounded-full"
            aria-label={`Đến ${movie.title}`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </Inline>
    </Stack>
  )
}
