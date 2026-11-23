import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { ChevronDownIcon, FilmIcon, PlayIcon, PlusIcon, ThumbsUpIcon } from "lucide-react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { cn } from "@/lib/utils.ts"
import type { Movie } from "./types.ts"

const motion = "transition-transform duration-(--duration-normal) ease-(--ease-out)"
const hoverDelay = 400
const screenPad = 8

type CardGrow = "start" | "end" | "center"

type CardMovie = Pick<Movie, "title" | "description" | "image" | "badge"> & Partial<Pick<Movie, "year" | "poster" | "runtime" | "maturity" | "genres">>

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function matchPercent(title: string) {
  let total = 0
  for (const char of title) total += char.charCodeAt(0)
  return 70 + (total % 28)
}

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

function MetaBox({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-foreground/40 px-1">
      <Text as="span" size="xs">{children}</Text>
    </span>
  )
}

function growOf(node: HTMLElement): CardGrow {
  let view: HTMLElement | null = node.parentElement
  while (view && view.dataset.slot !== "carousel-content") view = view.parentElement
  const track = view?.firstElementChild
  if (!view || !track) return "center"
  const items = [...track.children].filter((child): child is HTMLElement => child instanceof HTMLElement)
  const item = items.find((child) => child.contains(node))
  if (!item) return "center"
  const index = items.indexOf(item)
  const box = view.getBoundingClientRect()
  const previous = items[index - 1]?.getBoundingClientRect()
  const next = items[index + 1]?.getBoundingClientRect()
  const atStart = index === 0 || !previous || previous.right - box.left < previous.width * 0.5
  const atEnd = index === items.length - 1 || !next || box.right - next.left < next.width * 0.5
  if (atStart && atEnd) {
    const rect = node.getBoundingClientRect()
    return rect.left - box.left <= box.right - rect.right ? "start" : "end"
  }
  if (atStart) return "start"
  if (atEnd) return "end"
  return "center"
}

function Preview({
  movie,
  anchor,
  grow,
  onPlay,
  onInfo,
  onClose,
}: {
  movie: CardMovie
  anchor: HTMLElement
  grow: CardGrow
  onPlay?: () => void
  onInfo?: () => void
  onClose: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const node = panel.current
    if (!node) return
    const place = () => {
      const rect = anchor.getBoundingClientRect()
      const width = rect.width * 1.5
      let left = rect.left + (rect.width - width) / 2
      if (grow === "start") left = rect.left
      if (grow === "end") left = rect.right - width
      node.style.position = "fixed"
      node.style.width = `${width}px`
      node.style.zIndex = "70"
      const height = node.offsetHeight
      let top = rect.top + rect.height / 2 - height / 2
      const maxLeft = window.innerWidth - screenPad - width
      const maxTop = window.innerHeight - screenPad - height
      if (left < screenPad) left = screenPad
      if (left > maxLeft) left = Math.max(screenPad, maxLeft)
      if (top < screenPad) top = screenPad
      if (top > maxTop) top = Math.max(screenPad, maxTop)
      node.style.left = `${left}px`
      node.style.top = `${top}px`
    }
    place()
    const frame = requestAnimationFrame(() => setShown(true))
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [anchor, grow])

  const genres = movie.genres ?? []
  // check-ui-ignore-next-line: card hover Netflix cần bóng, chỉ streaming
  const shell = "overflow-hidden rounded-lg bg-card shadow-lg"

  return createPortal(
    <div
      ref={panel}
      data-slot="movie-preview"
      onMouseLeave={onClose}
      className={cn("dark origin-center text-foreground", motion, shown ? "scale-100" : "scale-75")}
    >
      <div className={shell}>
        <div className="overflow-hidden rounded-t-lg">
          <AspectRatio ratio={16 / 9}>
            <MoviePoster src={movie.image} title={movie.title} />
          </AspectRatio>
        </div>
        <Stack gap={3} className="rounded-b-lg p-4">
          <Inline justify="between" align="center">
            <Inline gap={2} align="center">
              <Button
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/80"
                aria-label={`Phát ${movie.title}`}
                onClick={onPlay}
              >
                <PlayIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-transparent dark:border-foreground/40 dark:bg-transparent dark:hover:border-foreground dark:hover:bg-transparent"
                aria-pressed={saved}
                aria-label="Thêm vào danh sách"
                onClick={() => setSaved((value) => !value)}
              >
                <PlusIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-transparent dark:border-foreground/40 dark:bg-transparent dark:hover:border-foreground dark:hover:bg-transparent"
                aria-pressed={liked}
                aria-label="Thích"
                onClick={() => setLiked((value) => !value)}
              >
                <ThumbsUpIcon />
              </Button>
            </Inline>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-transparent dark:border-foreground/40 dark:bg-transparent dark:hover:border-foreground dark:hover:bg-transparent"
              aria-label={`Chi tiết ${movie.title}`}
              onClick={onInfo}
            >
              <ChevronDownIcon />
            </Button>
          </Inline>
          <Inline gap={2} align="center" wrap>
            <Text as="span" size="xs" tone="success" weight="semibold">{matchPercent(movie.title)}%</Text>
            {movie.maturity ? <MetaBox>{movie.maturity}</MetaBox> : null}
            {movie.runtime ? <Text as="span" size="xs">{movie.runtime}</Text> : null}
            <MetaBox>HD</MetaBox>
          </Inline>
          <Text as="span" size="sm" weight="medium">{movie.title}</Text>
          <Text size="sm" tone="muted" lineClamp={2}>{movie.description}</Text>
          {genres.length > 0 ? <Text size="xs" tone="muted">{genres.join(" • ")}</Text> : null}
        </Stack>
      </div>
    </div>,
    document.body,
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
  const root = useRef<HTMLDivElement>(null)
  const wait = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [grow, setGrow] = useState<CardGrow>("center")
  const ratio = aspect === "landscape" ? 16 / 9 : 2 / 3
  const src = aspect === "landscape" ? movie.image : movie.poster ?? movie.image
  const showInfo = onInfo ?? onOpen

  function clearWait() {
    if (wait.current !== null) window.clearTimeout(wait.current)
    wait.current = null
  }

  useEffect(() => clearWait, [])

  function enter() {
    if (!finePointer()) return
    clearWait()
    wait.current = window.setTimeout(() => {
      const node = root.current
      if (!node) return
      const next = growOf(node)
      setGrow(next)
      setOpen(true)
    }, hoverDelay)
  }

  function leave() {
    if (open) return
    clearWait()
  }

  function close() {
    clearWait()
    setOpen(false)
  }

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
      ref={root}
      data-slot="movie-card"
      className="relative w-full"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
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
            <MoviePoster src={src} title={movie.title} />
          </AspectRatio>
        </span>
      </Button>
      {open && root.current ? (
        <Preview
          movie={movie}
          anchor={root.current}
          grow={grow}
          onPlay={onOpen}
          onInfo={showInfo}
          onClose={close}
        />
      ) : null}
    </div>
  )
}
