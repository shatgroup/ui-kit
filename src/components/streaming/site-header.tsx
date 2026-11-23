import { useEffect, useRef, useState } from "react"
import { MenuIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx"
import { cn } from "@/lib/utils.ts"
import { SearchOverlay } from "./search-overlay.tsx"
import type { Movie } from "./types.ts"

const surface = "transition-colors duration-(--duration-normal) ease-(--ease-standard)"

export function SiteHeader({
  current,
  homeHref,
  watchHref,
  movies,
  onNavigate,
  onSelectMovie,
}: {
  current: "home" | "watch"
  homeHref: string
  watchHref: string
  movies: Movie[]
  onNavigate: (href: string) => void
  onSelectMovie: (movie: Movie) => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const links = [
    { id: "home" as const, href: homeHref, label: "Trang chủ" },
    { id: "watch" as const, href: watchHref, label: "Đang xem" },
  ]

  useEffect(() => {
    let parent = bar.current?.parentElement ?? null
    while (parent) {
      const overflow = getComputedStyle(parent).overflowY
      if (overflow === "auto" || overflow === "scroll") break
      parent = parent.parentElement
    }
    const onScroll = () => setScrolled((parent?.scrollTop ?? window.scrollY) > 0)
    onScroll()
    const target: EventTarget = parent ?? window
    target.addEventListener("scroll", onScroll, { passive: true })
    return () => target.removeEventListener("scroll", onScroll)
  }, [])

  function go(href: string) {
    setMenuOpen(false)
    onNavigate(href)
  }

  return (
    <Box
      ref={bar}
      slot="site-header"
      className={cn(
        "sticky top-0 z-50 h-14",
        surface,
        scrolled ? "border-b border-border bg-background" : "border-b border-transparent bg-transparent",
      )}
    >
      <Inline justify="between" align="center" className="h-full px-4 md:px-6">
        <Inline gap={2} align="center" wrap={false}>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Mở menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Chọn trang</SheetDescription>
              </SheetHeader>
              <Stack gap={2} className="p-4">
                {links.map((link) => (
                  <Button
                    key={link.id}
                    variant={current === link.id ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => go(link.href)}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </SheetContent>
          </Sheet>
          <a
            href={homeHref}
            onClick={(event) => {
              event.preventDefault()
              go(homeHref)
            }}
          >
            <Text as="span" size="lg" weight="bold" tone="primary">Rạp</Text>
          </a>
          <Inline gap={1} className="hidden md:flex">
            {links.map((link) => (
              <Button
                key={link.id}
                variant={current === link.id ? "secondary" : "ghost"}
                onClick={() => go(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </Inline>
        </Inline>
        <SearchOverlay movies={movies} onSelect={onSelectMovie} />
      </Inline>
    </Box>
  )
}
