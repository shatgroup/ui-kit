import type { ReactNode } from "react"
import { Stack, Text } from "@/components/layout/index.ts"

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack gap={3} align="center" className="w-full px-4 py-8">
      {icon}
      <Text as="h3" size="lg" weight="semibold" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text tone="muted" className="text-center">
          {description}
        </Text>
      ) : null}
      {action}
    </Stack>
  )
}

export { EmptyState }
