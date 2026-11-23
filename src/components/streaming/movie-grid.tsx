import { useEffect, useState } from "react"
import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel.tsx"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { GenreChips } from "./genre-chips.tsx"
import { MovieCard, MoviePoster } from "./movie-card.tsx"
import type { Movie } from "./types.ts"

const gutter = "pl-4 pr-4 md:pl-14 md:pr-14"
const shelfTabs = [
  { id: "all", label: "Tất cả" },
  { id: "film", label: "Phim lẻ" },
  { id: "series", label: "Phim bộ" },
  { id: "dubbed", label: "Thuyết minh" },
  { id: "new", label: "Mới" },
]

function inTab(movie: Movie, tab: string) {
  if (tab === "film") return movie.kind === "film"
  if (tab === "series") return movie.kind === "series"
  if (tab === "dubbed") return movie.dubbed
  if (tab === "new") return movie.badge === "Mới" || movie.year >= 2024
  return true
}

const placeholders = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export function MovieGrid({
  movies,
  loading = false,
  onOpen,
}: {
  movies: Movie[]
  loading?: boolean
  onOpen: (movie: Movie) => void
}) {
  if (!loading && movies.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Không có kết quả</EmptyTitle>
          <EmptyDescription>Thử thể loại khác hoặc chọn Tất cả.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Grid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4} slot="movie-grid">
      {loading
        ? placeholders.map((id) => <MovieCard key={id} loading movie={{ title: "", description: "", image: "" }} />)
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} onOpen={() => onOpen(movie)} />)}
    </Grid>
  )
}

export function FeaturedShelf({ movies, onOpen }: { movies: Movie[]; onOpen: (movie: Movie) => void }) {
  const [tab, setTab] = useState("all")
  const [genre, setGenre] = useState<string | undefined>()
  const [query, setQuery] = useState("")
  const [progress, setProgress] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const genres = [...new Set(movies.flatMap((movie) => movie.genres))]
  const shown = movies.filter((movie) => {
    if (!inTab(movie, tab)) return false
    if (genre && !movie.genres.includes(genre)) return false
    if (query && !movie.title.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  useEffect(() => {
    if (!api) return
    const sync = () => setProgress(Math.round((api.scrollProgress() || 0) * 100))
    sync()
    api.on("scroll", sync)
    api.on("reInit", sync)
    return () => {
      api.off("scroll", sync)
      api.off("reInit", sync)
    }
  }, [api])

  // check-ui-ignore-next-line: mẫu -ml-2/pl-2 của Carousel để poster vừa khít, chỉ khu nổi bật streaming
  const track = "-ml-2 pl-4 pr-4 md:pl-14 md:pr-14"

  return (
    <Stack gap={4} slot="featured-shelf">
      <Stack gap={3} className={gutter}>
        <Inline justify="between" align="center" gap={3}>
          <Text as="h2" size="2xl" weight="medium">Nổi bật</Text>
          <Box className="w-full max-w-xs md:w-56">
            <Input aria-label="Tìm phim" placeholder="Tìm phim" value={query} onChange={(event) => setQuery(event.target.value)} />
          </Box>
        </Inline>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {shelfTabs.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <GenreChips genres={genres} value={genre} onChange={setGenre} />
      </Stack>
      {shown.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Không có kết quả</EmptyTitle>
            <EmptyDescription>Thử từ khoá hoặc thể loại khác.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Stack gap={3}>
          <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} setApi={setApi} className="w-full">
            <CarouselContent className={track}>
              {shown.map((movie) => (
                <CarouselItem key={movie.id} className="basis-1/3 pl-2 md:basis-1/5 lg:basis-1/6">
                  <Button variant="ghost" className="h-auto w-full rounded-lg p-0" aria-label={movie.title} onClick={() => onOpen(movie)}>
                    <span className="relative block w-full overflow-hidden rounded-lg">
                      <AspectRatio ratio={2 / 3}>
                        <MoviePoster src={movie.poster} title={movie.title} />
                      </AspectRatio>
                      <span className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      {movie.badge === "Top 10" ? <Badge className="absolute top-2 right-2">TOP 10</Badge> : null}
                      <Text as="span" size="sm" weight="medium" className="absolute inset-x-2 bottom-2 text-left">{movie.title}</Text>
                    </span>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Box className={gutter}>
            <Progress value={progress} aria-label="Tiến độ cuộn" />
          </Box>
        </Stack>
      )}
    </Stack>
  )
}
