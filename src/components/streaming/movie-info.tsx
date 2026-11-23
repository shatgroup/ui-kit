import { useState } from "react"
import { PlayIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { MoviePoster } from "./movie-card.tsx"
import type { Movie } from "./types.ts"

const limit = 180

export function MovieInfo({ movie }: { movie: Movie }) {
  const [open, setOpen] = useState(false)
  const long = movie.description.length > limit

  return (
    <Stack gap={3} slot="movie-info">
      <Text as="h1" size="3xl" weight="bold">{movie.title}</Text>
      <Inline gap={2}>
        <Badge variant="outline">{movie.year}</Badge>
        <Badge variant="outline">{movie.runtime}</Badge>
        {movie.genres.map((genre) => (
          <Badge key={genre} variant="outline">{genre}</Badge>
        ))}
      </Inline>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Stack gap={2}>
          {open ? null : <Text lineClamp={long ? 3 : undefined}>{movie.description}</Text>}
          <CollapsibleContent>
            <Text>{movie.description}</Text>
          </CollapsibleContent>
          {long ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="self-start px-0">
                <Text as="span" tone="primary" size="sm" weight="medium">{open ? "Thu gọn" : "Xem thêm"}</Text>
              </Button>
            </CollapsibleTrigger>
          ) : null}
        </Stack>
      </Collapsible>
    </Stack>
  )
}

export function MovieDetail({
  movie,
  open,
  onOpenChange,
  onPlay,
}: {
  movie: Movie | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlay: (movie: Movie) => void
}) {
  if (!movie) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{movie.title}</DialogTitle>
          <DialogDescription>{movie.description}</DialogDescription>
        </DialogHeader>
        <Box className="relative aspect-video">
          <MoviePoster src={movie.image} title={movie.title} />
          <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <Stack gap={4} className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <Text as="h2" size="3xl" weight="bold">{movie.title}</Text>
            <Inline>
              <Button size="lg" onClick={() => onPlay(movie)}>
                <PlayIcon />
                Phát
              </Button>
            </Inline>
          </Stack>
        </Box>
        <Stack gap={4} className="p-6 md:p-8">
          <Inline gap={4} align="center">
            <Text as="span" size="sm" tone="success" weight="semibold">{movie.badge ?? "HD"}</Text>
            <Text as="span" size="sm">{movie.year}</Text>
            <Text as="span" size="sm">{movie.runtime}</Text>
          </Inline>
          <Text>{movie.description}</Text>
          <Inline gap={2}>
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline">{genre}</Badge>
            ))}
          </Inline>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
