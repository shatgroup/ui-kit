import type { ReactNode } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"

export type Crumb = {
  label: string
  onClick?: () => void
}

type PageHeaderProps = {
  title: string
  description?: string
  crumbs?: Crumb[]
  actions?: ReactNode
}

export function PageHeader({ title, description, crumbs, actions }: PageHeaderProps) {
  return (
    <Stack gap={3}>
      {crumbs && crumbs.length > 0 ? (
        <Inline gap={2} align="center">
          {crumbs.map((crumb, index) => (
            <Inline key={crumb.label} gap={2} align="center">
              {index > 0 ? (
                <Text as="span" size="sm" tone="muted">
                  /
                </Text>
              ) : null}
              {crumb.onClick ? (
                <Button variant="link" size="sm" onClick={crumb.onClick}>
                  {crumb.label}
                </Button>
              ) : (
                <Text as="span" size="sm" tone="muted">
                  {crumb.label}
                </Text>
              )}
            </Inline>
          ))}
        </Inline>
      ) : null}
      <Stack gap={3} className="sm:flex-row sm:items-start sm:justify-between">
        <Stack gap={1} className="min-w-0">
          <Text as="h1" size="2xl" weight="semibold" lineClamp={2}>
            {title}
          </Text>
          {description ? <Text tone="muted">{description}</Text> : null}
        </Stack>
        {actions ? (
          <Inline gap={2} align="center">
            {actions}
          </Inline>
        ) : null}
      </Stack>
    </Stack>
  )
}
