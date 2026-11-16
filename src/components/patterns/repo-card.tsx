import type { ReactNode } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"

function RepoCard({
  name,
  description,
  language = "TypeScript",
  stars,
  updated,
  action,
}: {
  name: string
  description: string
  language?: string
  stars: string
  updated?: string
  action?: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <Inline gap={3} align="start" justify="between" wrap={false}>
          <Stack gap={1}>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </Stack>
          {action}
        </Inline>
      </CardHeader>
      <CardContent>
        <Inline gap={3} align="center">
          <Inline gap={1} align="center">
            <span className="size-3 rounded-full bg-chart-2" />
            <Text size="sm" tone="muted">{language}</Text>
          </Inline>
          <Text size="sm">{stars}</Text>
          {updated ? <Text size="sm" tone="muted">{updated}</Text> : null}
        </Inline>
      </CardContent>
    </Card>
  )
}

export { RepoCard }
