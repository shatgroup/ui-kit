import { XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Button } from "./button.tsx"

const TONE = {
  info: "border-info bg-badge-info text-badge-info-foreground",
  success: "border-success bg-badge-success text-badge-success-foreground",
  warning: "border-warning bg-badge-warning text-badge-warning-foreground",
  error: "border-destructive bg-badge-destructive text-badge-destructive-foreground",
} as const

type AlertTone = keyof typeof TONE

function Alert({
  tone = "info",
  title,
  children,
  onClose,
}: {
  tone?: AlertTone
  title: string
  children?: ReactNode
  onClose?: () => void
}) {
  return (
    <div data-slot="alert" role="status" className={cn("flex items-start gap-3 rounded-lg border p-3 text-sm", TONE[tone])}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-medium">{title}</span>
        {children ? <span>{children}</span> : null}
      </div>
      {onClose ? (
        <Button variant="ghost" size="sm" className="size-8 p-0" aria-label="Đóng" onClick={onClose}>
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}

export { Alert }
export type { AlertTone }
