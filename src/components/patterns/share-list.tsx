import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"

type SharePerson = { name: string; email: string }

function ShareList({ people }: { people: SharePerson[] }) {
  return (
    <Stack gap={3}>
      {people.map((person) => (
        <Inline key={person.email} gap={3} align="center">
          <Avatar size="sm">
            <AvatarFallback>{person.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <Stack gap={1}>
            <Text size="sm" weight="medium">{person.name}</Text>
            <Text size="xs" tone="muted">{person.email}</Text>
          </Stack>
        </Inline>
      ))}
    </Stack>
  )
}

export { ShareList }
export type { SharePerson }
