import type { ReactNode } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"

type SharePerson = { name: string; email: string; avatar?: string; role?: string }

function ShareList({ people, trailing }: { people: SharePerson[]; trailing?: (person: SharePerson) => ReactNode }) {
  return (
    <Stack gap={3}>
      {people.map((person) => (
        <Inline key={person.email} gap={3} align="center" justify="between" wrap={false}>
          <Inline gap={3} align="center" wrap={false}>
            <Avatar size="sm">
              {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
              <AvatarFallback>{person.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Stack gap={1}>
              <Text size="sm" weight="medium">{person.name}</Text>
              <Text size="xs" tone="muted">{person.email}</Text>
            </Stack>
          </Inline>
          {trailing ? trailing(person) : person.role ? <Text size="sm" tone="muted">{person.role}</Text> : null}
        </Inline>
      ))}
    </Stack>
  )
}

export { ShareList }
export type { SharePerson }
