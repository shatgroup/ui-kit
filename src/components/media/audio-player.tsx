import { useRef, useState, type KeyboardEvent } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Inline, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"

const SPEEDS = [1, 1.25, 1.5]

type AudioPlayerProps = {
  src: string
  label?: string
}

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const total = Math.floor(seconds)
  const minute = Math.floor(total / 60)
  const second = total % 60
  return `${minute}:${String(second).padStart(2, "0")}`
}

export function AudioPlayer({ src, label = "Trình phát" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  function seek(delta: number) {
    const audio = audioRef.current
    if (!audio) return
    const next = Math.min(duration || audio.duration || 0, Math.max(0, audio.currentTime + delta))
    audio.currentTime = next
    setTime(next)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === " " && event.target === event.currentTarget) {
      event.preventDefault()
      toggle()
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      seek(event.key === "ArrowLeft" ? -5 : 5)
    }
  }

  return (
    <div
      className="flex min-w-0 flex-col gap-2 rounded-md border border-border p-3"
      tabIndex={0}
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <Inline gap={2} align="center">
        <Button variant="outline" size="sm" className="w-8 px-0" aria-label={playing ? "Tạm dừng" : "Phát"} onClick={toggle}>
          {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        </Button>
        <Input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          aria-label="Thanh tua"
          onChange={(event) => {
            const next = Number(event.target.value)
            if (audioRef.current) audioRef.current.currentTime = next
            setTime(next)
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault()
              seek(event.key === "ArrowLeft" ? -5 : 5)
            }
          }}
        />
        <Text as="span" size="sm" className="shrink-0 tabular-nums">
          {clock(time)} / {clock(duration)}
        </Text>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Tốc độ phát"
          onClick={() => {
            const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] ?? 1
            setSpeed(next)
            if (audioRef.current) audioRef.current.playbackRate = next
          }}
        >
          {speed}x
        </Button>
      </Inline>
    </div>
  )
}
