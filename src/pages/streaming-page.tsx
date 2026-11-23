import { useEffect, useState } from "react"
import { Stack } from "@/components/layout/index.ts"
import { StreamingFrame } from "@/components/streaming/streaming-frame.tsx"
import { ContinueWatching, EpisodeList, FeaturedShelf, HeroBanner, MovieInfo, MovieRow, SiteHeader, VideoPlayer, WatchLayout } from "@/components/streaming/index.ts"
import { Container } from "@/components/layout/index.ts"
import { heroMovies, movies } from "@/fixtures/movies.ts"
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

function StreamingRows({ movies, onOpen }: { movies: Movie[]; onOpen: (movie: Movie) => void }) {
  const watching = movies.find((movie) => movie.progress !== undefined) ?? movies[0]
  return (
    <Stack gap={8} className="pb-16">
      <FeaturedShelf movies={movies} onOpen={onOpen} />
      <MovieRow title="Đang thịnh hành" movies={movies.slice(0, 8)} onOpen={onOpen} />
      <MovieRow title="Đánh giá cao" movies={movies.slice(2, 10)} onOpen={onOpen} />
      <MovieRow title="Hành động" movies={movies.filter((movie) => movie.genres.includes("Hành động"))} onOpen={onOpen} />
      <MovieRow title="Tình cảm" movies={movies.filter((movie) => movie.genres.includes("Tình cảm"))} onOpen={onOpen} />
      <ContinueWatching movie={watching} onPlay={onOpen} />
    </Stack>
  )
}

export function StreamingPage() {
  const { href, go } = useLocation()
  const url = new URL(href, window.location.origin)
  const watching = url.pathname.replace(/\/$/, "") === "/streaming/xem"
  const selected = movies.find((movie) => movie.id === url.searchParams.get("phim")) ?? movies[0]
  const [episodeId, setEpisodeId] = useState(selected.episodes[0].id)
  const episode = selected.episodes.find((item) => item.id === episodeId) ?? selected.episodes[0]

  function openMovie(movie: Movie) {
    setEpisodeId(movie.episodes[0].id)
    go(`/streaming/xem?phim=${movie.id}`)
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
        <Stack gap={0}>
          <HeroBanner movies={heroMovies} onPlay={openMovie} onInfo={() => undefined} />
          <StreamingRows movies={movies} onOpen={openMovie} />
        </Stack>
      )}
    </StreamingFrame>
  )
}
