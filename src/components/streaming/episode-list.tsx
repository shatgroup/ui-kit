import { Box, Grid, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import type { Episode } from "./types.ts"

export function EpisodeList({
  episodes,
  currentId,
  onSelect,
}: {
  episodes: Episode[]
  currentId: string
  onSelect: (episode: Episode) => void
}) {
  return (
    <Box tone="card" radius="lg" border padding={4} slot="episode-list">
    <Stack gap={3}>
      <Text as="h2" size="lg" weight="semibold">Danh sách tập</Text>
      <Grid columns={5} gap={2} className="lg:hidden">
        {episodes.map((episode) => {
          const current = episode.id === currentId
          return (
            <Button
              key={episode.id}
              size="sm"
              variant={current ? "default" : "outline"}
              aria-current={current ? "true" : undefined}
              aria-label={`Tập ${episode.number}: ${episode.title}`}
              onClick={() => onSelect(episode)}
            >
              {episode.number}
            </Button>
          )
        })}
      </Grid>
      <ScrollArea className="hidden h-96 lg:block">
        <Stack gap={2}>
          {episodes.map((episode) => {
            const current = episode.id === currentId
            return (
              <Button
                key={episode.id}
                variant={current ? "secondary" : "ghost"}
                className="h-auto justify-start whitespace-normal px-3 py-2"
                aria-current={current ? "true" : undefined}
                onClick={() => onSelect(episode)}
              >
                <Inline gap={3} align="center" className="w-full">
                  <Text as="span" weight="semibold" tone={current ? "primary" : "default"} className="w-8 shrink-0">
                    {episode.number}
                  </Text>
                  <Stack gap={0} className="min-w-0">
                    <Text as="span" weight="medium" lineClamp={1}>{episode.title}</Text>
                    <Text as="span" tone="muted" size="xs">{episode.duration}</Text>
                  </Stack>
                </Inline>
              </Button>
            )
          })}
        </Stack>
      </ScrollArea>
    </Stack>
    </Box>
  )
}
