import type { ReactNode } from "react"
import { Box, Grid } from "@/components/layout/index.ts"

export function WatchLayout({
  player,
  episodes,
  info,
}: {
  player: ReactNode
  episodes: ReactNode
  info: ReactNode
}) {
  return (
    <Grid columns={{ base: 1, lg: 12 }} gap={4}>
      <Box className="lg:col-span-8">{player}</Box>
      <Box className="lg:col-span-4 lg:row-span-2">{episodes}</Box>
      <Box className="lg:col-span-8">{info}</Box>
    </Grid>
  )
}
