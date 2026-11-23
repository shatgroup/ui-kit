import { useState } from "react"
import { FilmIcon, PlayIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

const motion = "transition-transform duration-(--duration-normal) ease-(--ease-out)"
const fade = "transition-opacity duration-(--duration-normal) ease-(--ease-out)"

type CardMovie = Pick<Movie, "title" | "description" | "image" | "badge"> & Partial<Pick<Movie, "year" | "poster" | "runtime" | "maturity" | "kind" | "seasons">>

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function seasonLabel(movie: CardMovie) {
  const count = movie.seasons?.length ?? 0
  if (movie.kind === "film") return "Phim lẻ"
  if (count > 0) return `${count} mùa`
  return movie.runtime ?? ""
}

export function MoviePoster({ src, title, className }: { src: string; title: string; className?: string }) {
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
      className={cn("absolute inset-0 size-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}

export function MovieCard({
  movie,
  aspect = "poster",
  loading = false,
  dimmed = false,
  onOpen,
  onInfo,
  onHover,
}: {
  movie: CardMovie
  aspect?: "poster" | "landscape"
  loading?: boolean
  dimmed?: boolean
  onOpen?: () => void
  onInfo?: () => void
  onHover?: (open: boolean) => void
}) {
  const ratio = aspect === "landscape" ? 16 / 9 : 2 / 3
  const src = aspect === "landscape" ? movie.image : movie.poster ?? movie.image
  const showInfo = onInfo ?? onOpen
  const meta = [movie.year, seasonLabel(movie)].filter(Boolean).join(" • ")

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
    <div
      data-slot="movie-card"
      className={cn("group/card relative z-0 w-full", fade, dimmed && "opacity-40", "pointer-fine:hover:z-20 pointer-fine:hover:opacity-100")}
      onMouseEnter={() => { if (finePointer()) onHover?.(true) }}
      onMouseLeave={() => onHover?.(false)}
    >
      <div className={cn("origin-center", motion, "pointer-fine:group-hover/card:scale-150")}>
        <div className="relative overflow-hidden rounded-lg">
          <Button
            variant="ghost"
            className="h-auto w-full rounded-lg p-0"
            aria-label={movie.title}
            onClick={() => {
              if (finePointer()) return
              showInfo?.()
            }}
          >
            <span className="relative block w-full">
              <AspectRatio ratio={ratio}>
                <MoviePoster src={src} title={movie.title} />
              </AspectRatio>
            </span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn("absolute top-2 left-2 z-10 rounded-full border-foreground/40 bg-background/50 opacity-0", fade, "pointer-fine:group-hover/card:opacity-100")}
            aria-label={`Phát ${movie.title}`}
            onClick={onOpen}
          >
            <PlayIcon />
          </Button>
          <Box className={cn("pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-3 opacity-0", fade, "pointer-fine:group-hover/card:opacity-100")}>
            <Stack gap={1}>
              <Text as="span" size="sm" weight="semibold">{movie.title}</Text>
              <Inline gap={2} align="center">
                <Text as="span" size="xs" tone="muted">{meta}</Text>
                {movie.maturity ? (
                  <span className="inline-flex items-center rounded-sm border border-primary px-1">
                    <Text as="span" size="xs">{movie.maturity}</Text>
                  </span>
                ) : null}
              </Inline>
            </Stack>
          </Box>
        </div>
        <Text size="xs" tone="muted" className="pt-2">{[movie.year, seasonLabel(movie), movie.maturity].filter(Boolean).join(" • ")}</Text>
      </div>
    </div>
  )
}
