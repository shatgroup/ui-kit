import { useEffect, useRef, useState } from "react"
import { MaximizeIcon, MinimizeIcon } from "lucide-react"
import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

type Status = "loading" | "ready" | "error"

export function VideoPlayer({
  libraryId,
  videoId,
  title,
  caption,
}: {
  libraryId: string
  videoId: string
  title: string
  caption?: string
}) {
  const playable = libraryId.length > 0 && videoId.length > 0
  const [status, setStatus] = useState<Status>(playable ? "loading" : "error")
  const [attempt, setAttempt] = useState(0)
  const [full, setFull] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const src = playable
    ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`
    : ""

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement !== null)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  function toggleFull(node: HTMLElement | null) {
    if (!node) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void node.requestFullscreen()
  }

  return (
    <Stack gap={2} slot="video-player">
      <Box tone="card" radius="lg" border className="relative overflow-hidden">
        <Box ref={frame} className="relative">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          {status !== "error" ? (
            <iframe
              key={attempt}
              title={title}
              src={src}
              className={cn("absolute inset-0 size-full border-0", status === "loading" && "opacity-0")}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => setStatus("ready")}
              onError={() => setStatus("error")}
            />
          ) : null}
          {status === "loading" ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="absolute inset-0 rounded-none" />
              <Spinner className="relative z-10 size-8" />
            </span>
          ) : null}
          {status === "error" ? (
            <span className="absolute inset-0 flex items-center justify-center p-4">
              <Stack gap={3} align="center" className="w-full">
                <Alert variant="destructive">
                  <AlertTitle>Không phát được phim</AlertTitle>
                  <AlertDescription>Kiểm tra mã video hoặc thử lại.</AlertDescription>
                </Alert>
                <Button
                  size="sm"
                  onClick={() => {
                    if (!playable) return
                    setStatus("loading")
                    setAttempt((value) => value + 1)
                  }}
                >
                  Thử lại
                </Button>
              </Stack>
            </span>
          ) : null}
          <Inline justify="end" className="absolute top-2 right-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              aria-label={full ? "Thoát toàn màn hình" : "Toàn màn hình"}
              onClick={() => toggleFull(frame.current)}
            >
              {full ? <MinimizeIcon /> : <MaximizeIcon />}
            </Button>
          </Inline>
        </AspectRatio>
        </Box>
      </Box>
      {caption ? <Text weight="medium">{caption}</Text> : null}
    </Stack>
  )
}

const gutter = "pl-4 pr-4 md:pl-14 md:pr-14"

export function ContinueWatching({ movie, onPlay }: { movie: Movie; onPlay: (movie: Movie) => void }) {
  const seasons = movie.kind === "series" ? `${movie.seasons.length} mùa` : "Phim lẻ"
  return (
    <Stack gap={4} slot="continue-watching" className={gutter}>
      <Text as="h2" size="2xl" weight="medium">Đang xem dở</Text>
      <Grid columns={{ base: 1, lg: 2 }} gap={6} className="items-center">
        <Stack gap={2}>
          <VideoPlayer libraryId={movie.libraryId} videoId={movie.videoId} title={movie.title} />
          <Progress value={movie.progress ?? 0} aria-label="Tiến độ xem" />
        </Stack>
        <Stack gap={3}>
          <Text as="h3" size="2xl" weight="semibold">{movie.title}</Text>
          <Inline gap={2} align="center">
            <Text size="sm">{movie.year}</Text>
            <Text size="sm" tone="muted">•</Text>
            <span className="inline-flex items-center rounded-sm border border-primary px-1">
              <Text as="span" size="xs">{movie.maturity}</Text>
            </span>
            <Text size="sm" tone="muted">•</Text>
            <Text size="sm">{seasons}</Text>
          </Inline>
          <Text tone="muted" lineClamp={3}>{movie.description}</Text>
          <Button className="self-start rounded-full" onClick={() => onPlay(movie)}>Xem tiếp</Button>
        </Stack>
      </Grid>
    </Stack>
  )
}
