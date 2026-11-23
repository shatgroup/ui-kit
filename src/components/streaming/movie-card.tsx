import { useState, type ReactNode } from "react"
import { FilmIcon, InfoIcon, PlayIcon, PlusIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

const motion = "transition-transform duration-(--duration-normal) ease-(--ease-out)"
const fade = "transition-opacity duration-(--duration-normal) ease-(--ease-out)"
const appear = `opacity-0 ${fade} pointer-fine:group-hover/card:opacity-100`
const round =
  "rounded-full border-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-transparent dark:border-foreground/40 dark:bg-transparent dark:hover:border-foreground dark:hover:bg-transparent"

type CardMovie = Pick<Movie, "title" | "description" | "image" | "badge"> & Partial<Pick<Movie, "year" | "poster" | "runtime" | "maturity" | "genres">>

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function matchPercent(title: string) {
  let total = 0
  for (const char of title) total += char.charCodeAt(0)
  return 70 + (total % 28)
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

function MetaBox({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-foreground/40 px-1">
      <Text as="span" size="xs">{children}</Text>
    </span>
  )
}

export function MovieCard({
  movie,
  aspect = "poster",
  loading = false,
  onOpen,
  onInfo,
}: {
  movie: CardMovie
  aspect?: "poster" | "landscape"
  loading?: boolean
  onOpen?: () => void
  onInfo?: () => void
}) {
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const ratio = aspect === "landscape" ? 16 / 9 : 2 / 3
  const src = aspect === "landscape" ? movie.image : movie.poster ?? movie.image
  const showInfo = onInfo ?? onOpen

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
    <div data-slot="movie-card" className="group/card relative z-0 w-full pointer-fine:hover:z-20">
      <div className={cn("relative origin-center overflow-hidden rounded-lg", motion, "pointer-fine:group-hover/card:scale-110")}>
        <Button
          variant="ghost"
          className="h-auto w-full rounded-lg p-0"
          aria-label={movie.title}
          onClick={() => {
            if (finePointer()) return
            showInfo?.()
          }}
        >
          <span className="relative block w-full overflow-hidden rounded-lg">
            <AspectRatio ratio={ratio}>
              <MoviePoster
                src={src}
                title={movie.title}
                className={cn(motion, "pointer-fine:group-hover/card:scale-105")}
              />
            </AspectRatio>
            <span className={cn("pointer-events-none absolute inset-0 bg-background/40 opacity-0", fade, "pointer-fine:group-hover/card:opacity-100")} />
          </span>
        </Button>
        <Box
          padding={4}
          className={cn(
            "pointer-events-none absolute inset-0 flex translate-y-full flex-col justify-end bg-gradient-to-t from-background via-background/80 to-transparent",
            motion,
            "pointer-fine:group-hover/card:pointer-events-auto pointer-fine:group-hover/card:translate-y-0",
          )}
        >
          <Stack gap={2}>
            <Inline gap={2} align="center" className={cn(appear, "delay-100")}>
              <Button
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/80"
                aria-label={`Phát ${movie.title}`}
                onClick={onOpen}
              >
                <PlayIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={round}
                aria-pressed={saved}
                aria-label="Thêm vào danh sách"
                onClick={() => setSaved((value) => !value)}
              >
                <PlusIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={round}
                aria-pressed={liked}
                aria-label="Thích"
                onClick={() => {
                  setLiked((value) => !value)
                  setDisliked(false)
                }}
              >
                <ThumbsUpIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className={round}
                aria-pressed={disliked}
                aria-label="Không thích"
                onClick={() => {
                  setDisliked((value) => !value)
                  setLiked(false)
                }}
              >
                <ThumbsDownIcon />
              </Button>
            </Inline>
            <Inline gap={2} align="center" wrap className={cn(appear, "delay-150")}>
              <Text as="span" size="xs" tone="success" weight="semibold">{matchPercent(movie.title)}%</Text>
              <MetaBox>HD</MetaBox>
              {movie.year ? <Text as="span" size="xs">{movie.year}</Text> : null}
            </Inline>
            <Stack gap={1} className={cn(appear, "delay-200")}>
              <Text as="span" size="sm" weight="semibold">{movie.title}</Text>
              <Text size="xs" tone="muted" lineClamp={2}>{movie.description}</Text>
              <Inline justify="end">
                <Button
                  size="icon"
                  className="rounded-full bg-muted/60 text-foreground hover:bg-muted"
                  aria-label={`Chi tiết ${movie.title}`}
                  onClick={showInfo}
                >
                  <InfoIcon />
                </Button>
              </Inline>
            </Stack>
          </Stack>
        </Box>
      </div>
    </div>
  )
}
