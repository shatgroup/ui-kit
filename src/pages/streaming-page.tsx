import { useEffect, useState } from "react"
import { Container, Stack, Text } from "@/components/layout/index.ts"
import { StreamingFrame } from "@/components/streaming/streaming-frame.tsx"
import { EpisodeList, HeroBanner, MovieGrid, MovieInfo, MovieRow, SiteHeader, VideoPlayer, WatchLayout } from "@/components/streaming/index.ts"
import { GenreChips } from "@/components/streaming/genre-chips.tsx"
import { genreNames, heroMovies, movies } from "@/fixtures/movies.ts"
import type { Movie } from "@/components/streaming/types.ts"

function useLocation() {
  const [href, setHref] = useState(() => window.location.pathname + window.location.search)

  useEffect(() => {
    const sync = () => setHref(window.location.pathname + window.location.search)
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])

  function go(url: string) {
    window.history.pushState(null, "", url)
    setHref(window.location.pathname + window.location.search)
    const stack: Element[] = [document.body]
    while (stack.length > 0) {
      const node = stack.pop()
      if (!(node instanceof HTMLElement)) continue
      if ("appScroll" in node.dataset) node.scrollTo(0, 0)
      stack.push(...node.children)
    }
  }

  return { href, go }
}

export function StreamingPage() {
  const { href, go } = useLocation()
  const url = new URL(href, window.location.origin)
  const watching = url.pathname.replace(/\/$/, "") === "/streaming/xem"
  const selected = movies.find((movie) => movie.id === url.searchParams.get("phim")) ?? movies[0]
  const [genre, setGenre] = useState<string | undefined>()
  const [episodeId, setEpisodeId] = useState(selected.episodes[0].id)
  const episode = selected.episodes.find((item) => item.id === episodeId) ?? selected.episodes[0]
  const listed = genre ? movies.filter((movie) => movie.genres.includes(genre)) : movies

  function openMovie(movie: Movie) {
    setEpisodeId(movie.episodes[0].id)
    go(`/streaming/xem?phim=${movie.id}`)
  }

  function showList(next?: string) {
    setGenre(next)
    document.getElementById("danh-sach")?.scrollIntoView({ block: "start" })
  }

  return (
    <StreamingFrame>
      <SiteHeader
        current={watching ? "watch" : "home"}
        homeHref="/streaming"
        watchHref={`/streaming/xem?phim=${selected.id}`}
        movies={movies}
        onNavigate={go}
        onSelectMovie={openMovie}
      />
      {watching ? (
        <Container size="xl">
          <WatchLayout
            player={(
              <VideoPlayer
                key={`${selected.id}-${episode.id}`}
                libraryId={selected.libraryId}
                videoId={selected.videoId}
                title={selected.title}
                caption={`Tập ${episode.number}: ${episode.title}`}
              />
            )}
            episodes={(
              <EpisodeList
                episodes={selected.episodes}
                currentId={episode.id}
                onSelect={(item) => setEpisodeId(item.id)}
              />
            )}
            info={<MovieInfo movie={selected} />}
          />
        </Container>
      ) : (
        <Stack>
          <HeroBanner movies={heroMovies} onPlay={openMovie} onInfo={openMovie} />
          <Container size="xl">
            <Stack gap={8}>
              <GenreChips genres={genreNames} value={genre} onChange={setGenre} />
              <MovieRow title="Đang thịnh hành" movies={movies.slice(0, 8)} onSeeAll={() => showList()} onOpen={openMovie} />
              <MovieRow title="Hành động" movies={movies.filter((movie) => movie.genres.includes("Hành động"))} onSeeAll={() => showList("Hành động")} onOpen={openMovie} />
              <MovieRow title="Tình cảm" movies={movies.filter((movie) => movie.genres.includes("Tình cảm"))} onSeeAll={() => showList("Tình cảm")} onOpen={openMovie} />
              <Stack gap={3}>
                <Text as="h2" id="danh-sach" size="xl" weight="semibold" className="scroll-mt-nav">Danh sách</Text>
                <MovieGrid movies={listed} onOpen={openMovie} />
              </Stack>
            </Stack>
          </Container>
        </Stack>
      )}
    </StreamingFrame>
  )
}
