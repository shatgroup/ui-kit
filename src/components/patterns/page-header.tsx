import { Fragment, type ReactNode } from "react"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx"
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
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <Fragment key={crumb.label}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {crumb.onClick ? (
                    <BreadcrumbLink asChild>
                      <Button variant="link" size="sm" onClick={crumb.onClick}>{crumb.label}</Button>
                    </BreadcrumbLink>
                  ) : index === crumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <Text as="span" size="sm" tone="muted">
                      {crumb.label}
                    </Text>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
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
