export type Episode = {
  id: string
  number: number
  title: string
  duration: string
}

export type Movie = {
  id: string
  title: string
  description: string
  image: string
  badge?: string
  genres: string[]
  year: number
  runtime: string
  libraryId: string
  videoId: string
  episodes: Episode[]
}
