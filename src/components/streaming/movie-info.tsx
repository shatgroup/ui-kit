import { useState } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx"
import type { Movie } from "./types.ts"

const limit = 180

export function MovieInfo({ movie }: { movie: Movie }) {
  const [open, setOpen] = useState(false)
  const long = movie.description.length > limit

  return (
    <Stack gap={3} slot="movie-info">
      <Text as="h1" size="3xl" weight="bold">{movie.title}</Text>
      <Inline gap={2}>
        <Badge variant="outline">{movie.year}</Badge>
        <Badge variant="outline">{movie.runtime}</Badge>
        {movie.genres.map((genre) => (
          <Badge key={genre} variant="outline">{genre}</Badge>
        ))}
      </Inline>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Stack gap={2}>
          {open ? null : <Text lineClamp={long ? 3 : undefined}>{movie.description}</Text>}
          <CollapsibleContent>
            <Text>{movie.description}</Text>
          </CollapsibleContent>
          {long ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="self-start px-0">
                <Text as="span" tone="primary" size="sm" weight="medium">{open ? "Thu gọn" : "Xem thêm"}</Text>
              </Button>
            </CollapsibleTrigger>
          ) : null}
        </Stack>
      </Collapsible>
    </Stack>
  )
}
