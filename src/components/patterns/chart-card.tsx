import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"

function ChartCard({
  title,
  description,
  children,
  footer,
  note,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  note?: string
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer || note ? (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer ? <div className="flex items-center gap-2 font-medium">{footer}</div> : null}
          {note ? <div className="text-muted-foreground">{note}</div> : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { ChartCard }
