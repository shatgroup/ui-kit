import { useState } from "react"
import { FilmIcon, PlayIcon } from "lucide-react"
import { Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

const zoom = "transition-transform duration-(--duration-normal) ease-(--ease-out)"
const fade = "transition-opacity duration-(--duration-fast) ease-(--ease-out)"

export function MoviePoster({ src, title, zoomOnHover = false }: { src: string; title: string; zoomOnHover?: boolean }) {
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
      className={cn("absolute inset-0 size-full object-cover", zoom, zoomOnHover && "md:group-hover:scale-105")}
      onError={() => setFailed(true)}
    />
  )
}

export function MovieCard({
  movie,
  loading = false,
  onOpen,
}: {
  movie: Pick<Movie, "title" | "description" | "image" | "badge">
  loading?: boolean
  onOpen?: () => void
}) {
  if (loading) {
    return (
      <Stack gap={2} slot="movie-card-loading">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Stack>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={onOpen}
      className="group h-auto w-full flex-col items-stretch justify-start gap-2 whitespace-normal p-0 text-left hover:bg-transparent dark:hover:bg-transparent"
    >
      <span className="relative block overflow-hidden rounded-lg border border-border">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <MoviePoster src={movie.image} title={movie.title} zoomOnHover />
          <span className={cn("pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-background via-background/70 to-transparent opacity-0 md:block", fade, "group-hover:opacity-100 group-focus-visible:opacity-100")}>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <PlayIcon />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-3">
              <Text as="span" size="xs" lineClamp={2}>{movie.description}</Text>
            </span>
          </span>
        </AspectRatio>
        {movie.badge ? <Badge className="absolute top-2 left-2">{movie.badge}</Badge> : null}
      </span>
      <Text as="span" weight="medium" lineClamp={2}>{movie.title}</Text>
    </Button>
  )
}
