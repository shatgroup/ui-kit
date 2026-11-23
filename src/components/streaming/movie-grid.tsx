import { Grid } from "@/components/layout/index.ts"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty.tsx"
import { MovieCard } from "./movie-card.tsx"
import type { Movie } from "./types.ts"

const placeholders = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export function MovieGrid({
  movies,
  loading = false,
  onOpen,
}: {
  movies: Movie[]
  loading?: boolean
  onOpen: (movie: Movie) => void
}) {
  if (!loading && movies.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Không có kết quả</EmptyTitle>
          <EmptyDescription>Thử thể loại khác hoặc chọn Tất cả.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Grid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4} slot="movie-grid">
      {loading
        ? placeholders.map((id) => <MovieCard key={id} loading movie={{ title: "", description: "", image: "" }} />)
        : movies.map((movie) => <MovieCard key={movie.id} movie={movie} onOpen={() => onOpen(movie)} />)}
    </Grid>
  )
}
