import { useEffect, useRef, useState } from "react"
import { BellIcon, ChevronDownIcon, MenuIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx"
import { cn } from "@/lib/utils.ts"
import { SearchOverlay } from "./search-overlay.tsx"
import type { Movie } from "./types.ts"

const surface = "transition-colors duration-(--duration-theme) ease-(--ease-standard)"

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
        "sticky top-0 z-50 h-16",
        surface,
        scrolled ? "bg-background" : "bg-gradient-to-b from-background/80 to-transparent",
      )}
    >
      <Inline justify="between" align="center" className="h-full px-4 md:px-16">
        <Inline gap={4} align="center" wrap={false}>
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
              <Stack gap={4} className="p-4">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      go(link.href)
                    }}
                  >
                    <Text as="span" size="lg" weight={current === link.id ? "semibold" : "normal"}>{link.label}</Text>
                  </a>
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
            <Text as="span" size="2xl" weight="bold" tone="primary">Rạp</Text>
          </a>
          <Inline gap={2} className="hidden md:flex">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="px-2"
                onClick={(event) => {
                  event.preventDefault()
                  go(link.href)
                }}
              >
                <Text as="span" size="sm" weight={current === link.id ? "semibold" : "normal"}>{link.label}</Text>
              </a>
            ))}
          </Inline>
        </Inline>
        <Inline gap={1} align="center" wrap={false}>
          <SearchOverlay movies={movies} onSelect={onSelectMovie} />
          <Button variant="ghost" size="icon" aria-label="Thông báo" className="relative">
            <BellIcon />
            <Badge className="absolute -top-1 -right-1 px-1">3</Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Tài khoản">
                <Avatar>
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {links.map((link) => (
                <DropdownMenuItem key={link.id} onClick={() => go(link.href)}>
                  <Text as="span" size="sm">{link.label}</Text>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Inline>
      </Inline>
    </Box>
  )
}
