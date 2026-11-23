import { useState } from "react"
import { FilmIcon, PlayIcon, PlusIcon, ThumbsUpIcon, InfoIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

const rise = "transition-transform duration-(--duration-slow) ease-(--ease-out)"
const fade = "transition-opacity duration-(--duration-slow) ease-(--ease-out)"

export function MoviePoster({ src, title }: { src: string; title: string; zoomOnHover?: boolean }) {
  const [failed, setFailed] = useState(src.length === 0)

  if (failed) {
    return (
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted px-3 text-muted-foreground">
        <FilmIcon />
        <Text as="span" tone="muted" size="xs" lineClamp={2} className="text-center">{title}</Text>
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 size-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

function matchPercent(title: string) {
  let total = 0
  for (const char of title) total += char.charCodeAt(0)
  return 70 + (total % 28)
}

export function MovieCard({
  movie,
  aspect = "poster",
  loading = false,
  onOpen,
  onInfo,
}: {
  movie: Pick<Movie, "title" | "description" | "image" | "badge"> & Partial<Pick<Movie, "year" | "poster">>
  aspect?: "poster" | "landscape"
  loading?: boolean
  onOpen?: () => void
  onInfo?: () => void
}) {
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const showInfo = onInfo ?? onOpen
  const ratio = aspect === "landscape" ? 16 / 9 : 2 / 3
  const src = aspect === "landscape" ? movie.image : movie.poster ?? movie.image

  if (loading) {
    return (
      <Stack gap={2} slot="movie-card-loading">
        <AspectRatio ratio={ratio}>
          <Skeleton className="size-full rounded-lg" />
        </AspectRatio>
      </Stack>
    )
  }

  return (
    <div className="group/item relative w-full" data-slot="movie-card">
      <div className={cn("relative overflow-hidden rounded-lg", rise, "group-hover/item:z-10 group-hover/item:scale-110")}>
        <AspectRatio ratio={ratio}>
        <MoviePoster src={src} title={movie.title} />
        <Button variant="ghost" className="absolute inset-0 h-full w-full rounded-none" aria-label={movie.title} onClick={showInfo} />
        <span className={cn("pointer-events-none absolute inset-0 bg-background/40 opacity-0", fade, "group-hover/item:opacity-100")} />
        <div className={cn("absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent p-2 translate-y-full", rise, "group-hover/item:translate-y-0")}>
          <Inline gap={1} className="pb-2">
            <Button size="icon-xs" className="rounded-full" aria-label={`Phát ${movie.title}`} onClick={onOpen}>
              <PlayIcon />
            </Button>
            <Button
              size="icon-xs"
              variant={saved ? "secondary" : "outline"}
              className="rounded-full"
              aria-pressed={saved}
              aria-label="Thêm vào danh sách"
              onClick={() => setSaved((value) => !value)}
            >
              <PlusIcon />
            </Button>
            <Button
              size="icon-xs"
              variant={liked ? "secondary" : "outline"}
              className="rounded-full"
              aria-pressed={liked}
              aria-label="Thích"
              onClick={() => setLiked((value) => !value)}
            >
              <ThumbsUpIcon />
            </Button>
            <Button size="icon-xs" variant="outline" className="rounded-full" aria-label={`Chi tiết ${movie.title}`} onClick={showInfo}>
              <InfoIcon />
            </Button>
          </Inline>
          <Inline gap={1} align="center">
            <Text as="span" size="xs" tone="success" weight="semibold">{matchPercent(movie.title)}%</Text>
            <Badge variant="outline">HD</Badge>
            {movie.year ? <Text as="span" size="xs">{movie.year}</Text> : null}
          </Inline>
          <Text as="span" size="sm" weight="semibold" lineClamp={1}>{movie.title}</Text>
        </div>
        </AspectRatio>
      </div>
    </div>
  )
}
