import { useState } from "react"
import { EpisodeList, GenreChips, HeroBanner, MovieCard, MovieGrid, MovieInfo, MovieRow, SearchOverlay, SiteHeader, VideoPlayer, WatchLayout } from "@/components/streaming/index.ts"
import { StreamingFrame } from "@/components/streaming/streaming-frame.tsx"
import { genreNames, heroMovies, movies } from "@/fixtures/movies.ts"

const movie = movies[0]

function EpisodePreview() {
  const [currentId, setCurrentId] = useState(movie.episodes[0].id)
  return (
    <StreamingFrame>
      <EpisodeList episodes={movie.episodes} currentId={currentId} onSelect={(item) => setCurrentId(item.id)} />
    </StreamingFrame>
  )
}

function GenrePreview() {
  const [value, setValue] = useState<string | undefined>()
  return (
    <StreamingFrame>
      <GenreChips genres={genreNames} value={value} onChange={setValue} />
    </StreamingFrame>
  )
}

function HeroPreview() {
  return (
    <StreamingFrame>
      <HeroBanner movies={heroMovies} onPlay={() => undefined} onInfo={() => undefined} />
    </StreamingFrame>
  )
}

function CardPreview() {
  return (
    <StreamingFrame>
      <MovieCard movie={movie} onOpen={() => undefined} />
    </StreamingFrame>
  )
}

function GridPreview() {
  return (
    <StreamingFrame>
      <MovieGrid movies={movies.slice(0, 8)} onOpen={() => undefined} />
    </StreamingFrame>
  )
}

function InfoPreview() {
  return (
    <StreamingFrame>
      <MovieInfo movie={movie} />
    </StreamingFrame>
  )
}

function RowPreview() {
  return (
    <StreamingFrame>
      <MovieRow title="Đang thịnh hành" movies={movies.slice(0, 8)} onOpen={() => undefined} />
    </StreamingFrame>
  )
}

function SearchPreview() {
  return (
    <StreamingFrame>
      <SearchOverlay movies={movies} onSelect={() => undefined} />
    </StreamingFrame>
  )
}

function HeaderPreview() {
  return (
    <StreamingFrame>
      <SiteHeader
        current="home"
        homeHref="/streaming"
        watchHref={`/streaming/xem?phim=${movie.id}`}
        movies={movies}
        onNavigate={(href) => window.location.assign(href)}
        onSelectMovie={(item) => window.location.assign(`/streaming/xem?phim=${item.id}`)}
      />
    </StreamingFrame>
  )
}

function PlayerPreview() {
  return (
    <StreamingFrame>
      <VideoPlayer libraryId={movie.libraryId} videoId={movie.videoId} title={movie.title} caption={movie.title} />
    </StreamingFrame>
  )
}

function WatchPreview() {
  const [currentId, setCurrentId] = useState(movie.episodes[0].id)
  const episode = movie.episodes.find((item) => item.id === currentId) ?? movie.episodes[0]
  return (
    <StreamingFrame>
      <WatchLayout
        player={(
          <VideoPlayer
            key={episode.id}
            libraryId={movie.libraryId}
            videoId={movie.videoId}
            title={movie.title}
            caption={`Tập ${episode.number}: ${episode.title}`}
          />
        )}
        episodes={<EpisodeList episodes={movie.episodes} currentId={episode.id} onSelect={(item) => setCurrentId(item.id)} />}
        info={<MovieInfo movie={movie} />}
      />
    </StreamingFrame>
  )
}

const streamingPages = [
  {
    name: "episode-list",
    title: "Episode List",
    group: "Streaming" as const,
    description: "Episode numbers and titles for the movie being watched.",
    usage: "currentId marks the episode that is playing. onSelect receives the chosen episode.",
    code: `<EpisodeList episodes={episodes} currentId={currentId} onSelect={setEpisode} />`,
    tall: true,
    wide: true,
    Preview: EpisodePreview,
  },
  {
    name: "genre-chips",
    title: "Genre Chips",
    group: "Streaming" as const,
    description: "A single-select row of genres.",
    usage: "value is the selected genre. An empty value means all genres.",
    code: `<GenreChips genres={genres} value={genre} onChange={setGenre} />`,
    wide: true,
    Preview: GenrePreview,
  },
  {
    name: "hero-banner",
    title: "Hero Banner",
    group: "Streaming" as const,
    description: "A full-width carousel of featured movies.",
    usage: "onPlay and onInfo receive the movie in the current slide.",
    code: `<HeroBanner movies={movies} onPlay={play} onInfo={open} />`,
    tall: true,
    wide: true,
    Preview: HeroPreview,
  },
  {
    name: "movie-card",
    title: "Movie Card",
    group: "Streaming" as const,
    description: "Poster, badge, and title. Movie Poster is the image inside the card.",
    usage: "onOpen runs when the card is clicked. loading shows skeletons.",
    code: `<MovieCard movie={movie} onOpen={open} />`,
    Preview: CardPreview,
  },
  {
    name: "movie-grid",
    title: "Movie Grid",
    group: "Streaming" as const,
    description: "A responsive grid of movie cards.",
    usage: "An empty list shows Empty. loading shows placeholder cards.",
    code: `<MovieGrid movies={movies} onOpen={open} />`,
    wide: true,
    Preview: GridPreview,
  },
  {
    name: "movie-info",
    title: "Movie Info",
    group: "Streaming" as const,
    description: "Title, year, runtime, genres, and a collapsible description.",
    usage: "Pass the movie being watched.",
    code: `<MovieInfo movie={movie} />`,
    wide: true,
    Preview: InfoPreview,
  },
  {
    name: "movie-row",
    title: "Movie Row",
    group: "Streaming" as const,
    description: "A horizontal row of movie cards.",
    usage: "onSeeAll is the optional button at the end of the title.",
    code: `<MovieRow title="Trending" movies={movies} onOpen={open} />`,
    wide: true,
    Preview: RowPreview,
  },
  {
    name: "search-overlay",
    title: "Search Overlay",
    group: "Streaming" as const,
    description: "Search movies by title.",
    usage: "onSelect receives the chosen movie. On a narrow screen the search opens as a dialog.",
    code: `<SearchOverlay movies={movies} onSelect={open} />`,
    Preview: SearchPreview,
  },
  {
    name: "site-header",
    title: "Site Header",
    group: "Streaming" as const,
    description: "Home and watch links, plus search.",
    usage: "current is home or watch. onNavigate receives the next href.",
    code: `<SiteHeader current="home" homeHref="/streaming" watchHref="/streaming/xem" movies={movies} onNavigate={go} onSelectMovie={open} />`,
    wide: true,
    Preview: HeaderPreview,
  },
  {
    name: "video-player",
    title: "Video Player",
    group: "Streaming" as const,
    description: "A 16:9 player with a loading state and fullscreen.",
    usage: "libraryId and videoId build the embed. An empty id shows the error state.",
    code: `<VideoPlayer libraryId={libraryId} videoId={videoId} title={title} />`,
    wide: true,
    Preview: PlayerPreview,
  },
  {
    name: "watch-layout",
    title: "Watch Layout",
    group: "Streaming" as const,
    description: "Player, episode list, and movie info.",
    usage: "player, episodes, and info are the three regions.",
    code: `<WatchLayout player={player} episodes={episodes} info={info} />`,
    tall: true,
    wide: true,
    Preview: WatchPreview,
  },
]

export { streamingPages }
