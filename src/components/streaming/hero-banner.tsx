import { useState } from "react"
import { PlayIcon, InfoIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { MoviePoster } from "./movie-card.tsx"
import { MovieDetail } from "./movie-info.tsx"
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
  const movie = movies[0]
  const [open, setOpen] = useState(false)
  if (!movie) return null

  return (
    <Box slot="hero-banner" className="relative w-full">
      <Box className="relative aspect-video max-h-svh min-h-96 w-full overflow-hidden">
        <MoviePoster src={movie.image} title={movie.title} />
        <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <Stack gap={4} className="absolute bottom-16 left-4 z-10 w-4/5 max-w-xl md:bottom-24 md:left-16">
          <Text as="h1" size="3xl" weight="bold">{movie.title}</Text>
          <Text size="lg" lineClamp={3}>{movie.description}</Text>
          <Inline gap={3}>
            <Button size="lg" onClick={() => onPlay(movie)}>
              <PlayIcon />
              Phát
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                setOpen(true)
                onInfo(movie)
              }}
            >
              <InfoIcon />
              Chi tiết
            </Button>
          </Inline>
        </Stack>
      </Box>
      <MovieDetail movie={movie} open={open} onOpenChange={setOpen} onPlay={onPlay} />
    </Box>
  )
}
