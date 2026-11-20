import { useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Box, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty.tsx"

export type MediaRatio = "16/9" | "9/16" | "1/1"

type MediaPreviewProps = {
  ratio?: MediaRatio
  kind?: "image" | "video"
  src?: string
  alt?: string
  status?: "ready" | "empty" | "error"
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  errorLabel?: string
  retryLabel?: string
  playLabel?: string
  pauseLabel?: string
}

export function MediaPreview({
  ratio = "16/9",
  kind = "image",
  src,
  alt = "",
  status = "ready",
  onRetry,
  emptyTitle = "Chưa có tư liệu",
  emptyDescription = "Thả ảnh hoặc video vào để xem trước.",
  errorLabel = "Không tải được tư liệu.",
  retryLabel = "Thử lại",
  playLabel = "Phát",
  pauseLabel = "Tạm dừng",
}: MediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  async function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      await video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div data-ratio={ratio} className="relative w-full overflow-hidden rounded-md bg-muted">
      {status === "empty" || (status !== "error" && !src) ? (
        <Box className="flex h-full items-center justify-center p-4">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              {emptyDescription ? <EmptyDescription>{emptyDescription}</EmptyDescription> : null}
            </EmptyHeader>
          </Empty>
        </Box>
      ) : null}
      {status === "error" ? (
        <Stack gap={3} align="center" className="h-full justify-center p-4">
          <Text tone="destructive">{errorLabel}</Text>
          {onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
        </Stack>
      ) : null}
      {status === "ready" && src && kind === "image" ? (
        <img src={src} alt={alt} className="size-full object-contain" />
      ) : null}
      {status === "ready" && src && kind === "video" ? (
        <>
          <video
            ref={videoRef}
            src={src}
            className="size-full object-contain"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <Box className="absolute inset-0 flex items-center justify-center">
            <Button variant="secondary" aria-label={playing ? pauseLabel : playLabel} onClick={() => void toggle()}>
              {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
              {playing ? pauseLabel : playLabel}
            </Button>
          </Box>
        </>
      ) : null}
    </div>
  )
}
