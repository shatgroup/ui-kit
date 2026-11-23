import { useState } from "react"
import { InfoIcon, PlayIcon } from "lucide-react"
import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { MoviePoster } from "./movie-card.tsx"
import { MovieDetail } from "./movie-info.tsx"
import type { Movie } from "./types.ts"

const gutter = "pl-4 pr-4 md:pl-14 md:pr-14"

function seasonCount(movie: Movie) {
  return movie.kind === "series" ? `${movie.seasons.length} mùa` : movie.runtime
}

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
  const [seasonId, setSeasonId] = useState(movie?.seasons[0]?.id ?? "")
  if (!movie) return null
  const season = movie.seasons.find((item) => item.id === seasonId) ?? movie.seasons[0]

  return (
    <Box slot="hero-banner" className="relative min-h-svh">
      <Box className="absolute inset-0">
        <MoviePoster src={movie.image} title={movie.title} />
        <Box className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <Box className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </Box>
      <Stack gap={8} className={`relative z-10 py-16 ${gutter}`}>
        <Grid columns={{ base: 1, lg: 3 }} gap={6} className="items-center">
          <Stack gap={4}>
            <Text size="xs" weight="medium">{movie.kind === "series" ? "PHIM BỘ" : "PHIM LẺ"}</Text>
            <Text as="h1" className="text-4xl font-black leading-tight md:text-6xl">{movie.title}</Text>
            <Inline gap={2} align="center">
              <Text size="sm">{movie.year}</Text>
              <Text size="sm" tone="muted">•</Text>
              <span className="inline-flex items-center rounded-sm border border-primary px-1">
                <Text as="span" size="xs">{movie.maturity}</Text>
              </span>
              <Text size="sm" tone="muted">•</Text>
              <Text size="sm">{seasonCount(movie)}</Text>
            </Inline>
            <Text tone="muted" lineClamp={3}>{movie.description}</Text>
            <Inline gap={3}>
              <Button className="rounded-full" onClick={() => onPlay(movie)}>
                <PlayIcon />
                Phát
              </Button>
              <Button
                className="rounded-full bg-foreground text-background hover:bg-foreground/80"
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
          <Inline justify="center">
            <Button
              variant="outline"
              className="size-16 rounded-full border-foreground/40 bg-background/40"
              aria-label={`Phát ${movie.title}`}
              onClick={() => onPlay(movie)}
            >
              <PlayIcon />
            </Button>
          </Inline>
          <Inline gap={3} align="start" className="hidden lg:flex">
            <Stack gap={1}>
              {movie.seasons.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant="ghost"
                  className={item.id === season.id ? "justify-start border-l-2 border-primary" : "justify-start border-l-2 border-transparent"}
                  onClick={() => setSeasonId(item.id)}
                >
                  Mùa {item.number}
                </Button>
              ))}
            </Stack>
            <Box className="max-h-64 min-w-0 flex-1 overflow-y-auto">
              <Stack gap={2}>
                {season.episodes.map((episode) => (
                  <Button
                    key={episode.id}
                    variant="ghost"
                    className="h-auto justify-start px-2 py-1"
                    onClick={() => onPlay(movie)}
                  >
                    <Inline gap={2} align="center" className="w-full">
                      <Box className="w-24 shrink-0 overflow-hidden rounded-md">
                        <AspectRatio ratio={16 / 9}>
                          <MoviePoster src={movie.image} title={episode.title} />
                        </AspectRatio>
                      </Box>
                      <Stack gap={0} className="min-w-0 items-start">
                        <Text as="span" size="xs" tone="muted">Tập {episode.number}</Text>
                        <Text as="span" size="sm" weight="medium" truncate>{episode.title}</Text>
                        <Text as="span" size="xs" tone="muted">{episode.duration}</Text>
                      </Stack>
                    </Inline>
                  </Button>
                ))}
              </Stack>
            </Box>
          </Inline>
        </Grid>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="episodes">Tập phim</TabsTrigger>
            <TabsTrigger value="detail">Chi tiết</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Stack gap={3}>
              <Text tone="muted" lineClamp={3}>{movie.description}</Text>
              <Inline gap={2}>
                {movie.genres.map((genre) => <Badge key={genre} variant="outline">{genre}</Badge>)}
              </Inline>
            </Stack>
          </TabsContent>
          <TabsContent value="episodes">
            <Stack gap={2}>
              {season.episodes.map((episode) => (
                <Inline key={episode.id} justify="between" align="center">
                  <Text size="sm">Tập {episode.number}: {episode.title}</Text>
                  <Text size="xs" tone="muted">{episode.duration}</Text>
                </Inline>
              ))}
            </Stack>
          </TabsContent>
          <TabsContent value="detail">
            <Stack gap={2}>
              <Text size="sm">{movie.year} • {movie.runtime} • {movie.maturity}</Text>
              <Text tone="muted">{movie.description}</Text>
            </Stack>
          </TabsContent>
        </Tabs>
      </Stack>
      <MovieDetail movie={movie} open={open} onOpenChange={setOpen} onPlay={onPlay} />
    </Box>
  )
}
