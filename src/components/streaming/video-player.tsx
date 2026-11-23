import { useEffect, useRef, useState } from "react"
import { MaximizeIcon, MinimizeIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { cn } from "@/lib/utils.ts"

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
