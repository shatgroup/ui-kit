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
        <Stack gap={4} className="absolute bottom-32 left-4 z-10 w-4/5 max-w-xl md:bottom-40 md:left-14">
          <Text as="h1" className="text-3xl font-black leading-tight md:text-4xl xl:text-6xl">{movie.title}</Text>
          <Text size="lg" lineClamp={3} className="font-light leading-6">{movie.description}</Text>
          <Inline gap={3}>
            <Button className="h-auto rounded-lg px-6 py-2 text-2xl" onClick={() => onPlay(movie)}>
              <PlayIcon />
              Phát
            </Button>
            <Button
              variant="secondary"
              className="h-auto rounded-lg px-6 py-2 text-2xl"
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
