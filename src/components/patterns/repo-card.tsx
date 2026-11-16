import { Inline, Text } from "@/components/layout/index.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"

function RepoCard({ name, description, stars }: { name: string; description: string; stars: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Inline gap={2} align="center">
          <span className="size-3 rounded-full bg-chart-2" />
          <Text size="sm" tone="muted">TypeScript</Text>
          <Text size="sm">{stars}</Text>
        </Inline>
      </CardContent>
    </Card>
  )
}

export { RepoCard }
