export type Episode = {
  id: string
  number: number
  title: string
  duration: string
}

export type Season = {
  id: string
  number: number
  episodes: Episode[]
}

export type Movie = {
  id: string
  title: string
  description: string
  image: string
  poster: string
  badge?: string
  genres: string[]
  year: number
  runtime: string
  maturity: string
  kind: "series" | "film"
  dubbed: boolean
  progress?: number
  libraryId: string
  videoId: string
  seasons: Season[]
  episodes: Episode[]
}
